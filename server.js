const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const Car = require('./models/car');
var multer = require('multer');
const app = express();
const fs = require('fs');
const session = require('express-session');
var nodemailer = require('nodemailer');

const dbURI = 'mongodb+srv://proj-user:user12340@cluster0.se9hx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => {console.log('Connected'); app.listen(3000);})
.catch((err) => console.log(err));

app.use(session({secret: 'ssshhhhh'}));

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'web.carlx@gmail.com',
    pass: 'webweb12'
  }
});
 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}));

function verify(email, sess){
    if (!sess.code){
        var code = Math.floor(Math.random()*90000) + 10000;
        sess.code = code;
        
        var mailOptions = {
            from: 'web.carlx@gmail.com',
            to: email,
            subject: 'Verification code',
            text: 'Your verification code is ' + code.toString()
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });
    }
}

app.get('/' , (req, res)=>{
    var lang = req.session.lang;
    if (!lang)
        req.session.lang = 'en';
    var user = req.session.user;
    if (!user){
        user = new User();
    }

    Car.find({}
        ,(err, cars) => {
              cars.sort(function(a, b){return b.cnt-a.cnt});
              cars.splice(6);
            if (req.session.lang == 'en')
                res.render('index', {cars, user});
            else
                res.render('index_ar', {cars, user});
        });
})

app.post('/en', (req, res) => {
    req.session.lang = 'en';
    res.json('hi');
})

app.post('/ar', (req, res) => {
    req.session.lang = 'ar';
    res.json('hi');
})

app.post('/login', (req, res) => {
    User.find({_id: req.body.name}
        ,(err, user) => {
            if (!user[0]){
                res.json({msg: '1'}); 
            }
            else{
                if (user[0].password != req.body.pwd){
                    res.json({msg: '2'});
                }
                else if (user[0].verified == "0"){
                    req.session.vuser = user[0];
                    verify(user[0]._id, req.session);
                    res.json({msg: '3'});
                }
                else{
                    req.session.user = user[0];
                    res.json({msg: '0'});
                }
            }
        }
    );
})

app.post('/reg', (req, res) => {
    User.find({_id: req.body._id}
        ,(err, user) => {
            if (user[0]){
                res.json({msg: '1'}); 
            }
            else{
                let user = new User(req.body);
                user.img.data = "";
                user.img.contentType = "";
                user.save()
                .then(results =>{
                    if (req.session.vuser && req.session.vuser != user[0])
                        req.session.code = undefined;
                    req.session.vuser = user;
                    verify(req.body._id, req.session);
                    res.json({msg: '0'});
                })
                .catch(err=>{
                    console.log(err);
                })
            }
        }
    );
})

app.post('/ver', (req, res) => {
    User.find({_id: req.session.vuser._id}
        ,(err, user) => {
            if (req.session.code == req.body.code){
                user[0].verified = "1";
                user[0].save();
                req.session.user = user[0];
                res.json({msg: '0'});
            }
            else{
                res.json({msg: '1'});
            }
        }
    );
})

app.get('/cars' , (req, res)=>{
    let user = req.session.user;
    if (user == undefined){
        res.redirect('/');
        return;
    }
    Car.find({}
        ,(err, cars) => {  
            if (req.session.lang == 'en')
                res.render('cars_page', {cars, user});
            else
                res.render('cars_page_ar', {cars, user});
        });
})

app.get('/logout' , (req, res)=>{
    req.session.user = undefined;
    res.redirect('/');
})

app.get('/cars/:id', (req, res) => {
    let user = req.session.user;
    if (user == undefined){
        res.redirect('/');
        return;
    }
    let id = req.params.id.toLowerCase();
    Car.find({},
        (err, car) => {
        var cars = [];
        car.forEach( caar => {
            if (caar.brand.toLowerCase().search(id) != -1 || caar.name.toLowerCase().search(id) != -1)
                cars.push(caar);
        })
        let user = req.session.user;
        if (req.session.lang == 'en')
            res.render('cars_page', {cars, user});
        else
            res.render('cars_page_ar', {cars, user});
    });
})

app.post('/filter', (req, res) => {
    var brand = [];
    var town = [];
    for (x in req.body){
        if (x == 'dstart')
            break;
        brand.push(x);
    }

    req.body.pstart = (req.body.pstart == '')? 0:req.body.pstart;
    req.body.pend = (req.body.pend == '')? 1000000:req.body.pend;
    req.body.dstart = (req.body.dstart == '')? 0:req.body.dstart;
    req.body.dend = (req.body.dend == '')? 1000000:req.body.dend;

    var f = false;
    for (x in req.body){
        if (f)
            town.push(x);
        if (x == 'pend')
            f = true;
    }
    Car.find({},
        (err, car) => {
        var cars = [];
        car.forEach( caar => {
            if (parseInt(caar.price) >= parseInt(req.body.pstart) && parseInt(caar.price) <= parseInt(req.body.pend))
                if (parseInt(caar.distance) >= parseInt(req.body.dstart) && parseInt(caar.distance) <= parseInt(req.body.dend))
                    if (brand.length == 0 || brand.includes(caar.brand))
                        if (town.length == 0 || town.includes(caar.city))
                            cars.push(caar);
        })
        user = req.session.user;
        if (req.session.lang == 'en')
            res.render('cars_page', {cars, user});
        else
            res.render('cars_page_ar', {cars, user});
    });
})

app.get('/view/:id', (req, res) => {
    let user = req.session.user;
    if (user == undefined){
        res.redirect('/');
        return;
    }

    Car.find({_id: req.params.id},
        (err, car) => {
        if (!car){
            res.status(404).sendFile('./views/404.html', {root:__dirname});
            return;
        }

        let det = {};
        User.find({_id: req.session.user._id}, (err, users)=> {
            var interested = users[0].interested.split('%%*')
            interested = interested.filter(function (x) {
                return x != '';
            });
            var owned = users[0].cars.split('%%*')
            owned = owned.filter(function (x) {
                return x != '';
            });
            var favs = users[0].favs.split('%%*')
            favs = favs.filter(function (x) {
                return x != '';
            });
            car[0].cnt += 1;
            det.btn = 0;
            det.fav = 0;
            if (owned.includes(car[0]._id.toString()))
                det.btn = 1;
            else if (interested.includes(car[0]._id.toString()))
                det.btn = 2;
            if (favs.includes(car[0]._id.toString()))
                det.fav = 1;
            let user = req.session.user;
            if (req.session.lang == 'en')
                res.render('cars_det', {car, user, det});
            else
                res.render('cars_det_ar', {car, user, det});
            car[0].save()
        })
    });
})

app.get('/addsale', (req, res) => {
    let user = req.session.user;
    if (user == undefined){
        res.redirect('/');
        return;
    }

    if (req.session.lang == 'en')
        res.render('placeOffer', {user});
    else
        res.render('placeOffer_ar', {user});
})

app.post('/addsale', upload.array("images", 3), (req, res)=>{
    car = new Car(req.body);
    car.seller_name = req.session.user.name;
    car.sid = req.session.user._id;
    car.cnt = 0;
    var files = req.files.sort(function(a, b) {
        return a.filename.localeCompare(b.filename);
      })
    car.img1 = {
        data: fs.readFileSync(__dirname + '\\uploads\\' + files[0].filename),
        contentType: files[0].mimetype
    }
    car.img2 = {
        data: fs.readFileSync(__dirname + '\\uploads\\' + files[1].filename),
        contentType: files[1].mimetype
    }
    car.img3 = {
        data: fs.readFileSync(__dirname + '\\uploads\\' + files[2].filename),
        contentType: files[2].mimetype
    }
    car.save().then(() => {
        User.find({_id: req.session.user._id},
            (err, user) => {
                user[0].cars += car._id + "%%*";
                user[0].save();
            })
        res.redirect('/cars');
    })
})

app.post('/pic', upload.array("images", 1), (req, res)=>{
    User.find({_id : req.session.user._id}, (err, user) => {
        user[0].img = {
            data: fs.readFileSync(__dirname + '\\uploads\\' + req.files[0].filename),
            contentType: req.files[0].mimetype
        }
        user[0].save().then(() => {
            res.redirect('/profile');
        })
    })
})

app.post('/buy/:id', (req, res) => {
    User.find({_id : req.session.user._id}, (err, user) => {
        user[0].interested += req.params.id + "%%*";
        user[0].save();
    }).then(() => {
        res.redirect('/cars');
    })
    Car.find({_id:req.params.id}, (err, car) => {
        User.find({_id : car[0].sid}, (err, user) => {
            user[0].reqs += req.session.user._id + ' ' + car[0].brand + ' ' + car[0].name + "%%*";
            user[0].save();
            var mailOptions = {
                from: 'web.carlx@gmail.com',
                to: car[0].sid,
                subject: 'Probable car buyer',
                text: req.session.user.name + ' is looking to buy your ' + car[0].brand + ' ' + car[0].name + ', you can check his contact on the website.'
            };
    
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent: ' + info.response);
                }
            });
        })
    })
})

app.get('/profile', (req, res) => {
    let user = req.session.user;
    if (user == undefined){
        res.redirect('/');
        return;
    }

    User.find({_id: user._id}, (err, userr) => {
        let arr = userr[0].cars.split('%%*')
        arr = arr.filter(function (x) {
            return x !== '';
        });

        let arr2 = userr[0].reqs.split('%%*')
        arr2 = arr2.filter(function (x) {
            return x !== '';
        });

        let arr3 = userr[0].favs.split('%%*')
        arr3 = arr3.filter(function (x) {
            return x !== '';
        });

        let names = [];
        for (let i = 0; i < arr2.length; i++){
            let x = arr2[i].split(' ');
            arr2[i] = x[0];
            names.push(x[1] + ' ' + x[2]);
        }

        Car.find({_id: {$in: arr}}, (err, cars) => {
            User.find({_id: {$in: arr2}}, (err, users) => {
                Car.find({_id: {$in: arr3}}, (err, carss) => {
                    let user = userr[0];
                    if (req.session.lang == 'en')
                        res.render('myacc', {cars, user, users, names, carss});
                    else
                        res.render('myacc_ar', {cars, user, users, names, carss});
                });
            });
        });
    })
})

app.post('/fav', (req, res) => {
    var id = req.body.link;
    var fav = req.body.fav;
    User.find({_id: req.session.user._id}, (err, user) => {
        if (fav == '1')
            user[0].favs += id + '%%*';
        else{
            let arr = user[0].favs.split('%%*')
            arr = arr.filter(function (x) {
                return x !== '';
            })
            user[0].favs = '%%*';
            arr.forEach((x) => {
                if (x != id)
                    user[0].favs += x + '%%*';
            })
        }
        user[0].save();
    });
});

app.use((req, res)=>{
    res.status(404).sendFile('./views/404.html', {root:__dirname});
});