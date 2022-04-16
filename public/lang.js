function ar(){
    event.preventDefault();
    
    var req = new XMLHttpRequest();

    req.open('POST', 'http://localhost:3000/ar', true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send('hi');
    req.onreadystatechange = function() {//Call a function when the state changes.
        if(req.readyState == 4 && req.status == 200) {
            location.reload();
        }
    }
}

function en(){
    event.preventDefault();
    
    var req = new XMLHttpRequest();

    req.open('POST', 'http://localhost:3000/en', true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send('hi');
    req.onreadystatechange = function() {//Call a function when the state changes.
        if(req.readyState == 4 && req.status == 200) {
            location.reload();
        }
    }
}