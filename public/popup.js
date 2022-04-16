//clear(0): sign-in
//clear(1): sign-up
//clear(2): verification

function ValidateEmail(mail) 
{
 if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))
  {
    return (true)
  }
    return (false)
}

function logopenForm() {
    clear(0);
    document.getElementById("signin").style.display = "block";
  }
  
  function logcloseForm() {
    document.getElementById("signin").style.display = "none";
  }
  function regopenForm() {
    document.getElementById("signup").style.display = "block";
  }
  
  function regcloseForm() {
    clear(1);
    document.getElementById("signup").style.display = "none";
  }

  function veropenForm() {
    clear(2);
    document.getElementById("ver").style.display = "block";
  }
  
  function vercloseForm() {
    document.getElementById("ver").style.display = "none";
  }

  function clear(id){
    if (id == 0){
      document.getElementById("emailin").style.border = "1px solid #e5e5e5";
      document.getElementById("passin").style.border = "1px solid #e5e5e5";
      document.getElementById('emailverifout').innerHTML = '';
      document.getElementById('passverifin').innerHTML = '';
    }
    else if (id == 1){
      document.getElementById("emailout").style.border = "1px solid #e5e5e5";
      document.getElementById("passout").style.border = "1px solid #e5e5e5";
      document.getElementById('passverifout').innerHTML = '';
      document.getElementById('passverifin').innerHTML = '';
    }
    else{
      document.getElementById("verifcode").style.border = "1px solid #e5e5e5";
      document.getElementById('verin').innerHTML = '';
    }
  }

  function login(){
    clear(0);
    event.preventDefault();
    
    var req = new XMLHttpRequest();

    var params = new Object();
    params.name = document.getElementById('emailin').value;
    params.pwd = document.getElementById('passin').value;

    let urlEncodedDataPairs = [], name;
    for( name in params ) {
    urlEncodedDataPairs.push(encodeURI(name + '=' + params[name]));
    }

    var send = urlEncodedDataPairs.join('&');

    req.open('POST', 'http://localhost:3000/login', true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    req.onreadystatechange = function() {//Call a function when the state changes.
        if(req.readyState == 4 && req.status == 200) {
            var data = JSON.parse(req.responseText);
            if (data.msg == '0')
              location.reload();
            else if (data.msg == '1'){
              document.getElementById('emailverifin').innerHTML = 'Enter a valid email';
              document.getElementById("emailin").style.border = "1px solid red";
            }
            else if (data.msg == '2'){
              document.getElementById('passverifin').innerHTML = 'Enter a valid password';
              document.getElementById("passin").style.border = "1px solid red";
            }
            else{
              logcloseForm();
              veropenForm();
            }
        }
    }
    req.send(send);
}

function reg(){
  clear(1);
  event.preventDefault();
  
  var req = new XMLHttpRequest();

  var params = new Object();
  params._id = document.getElementById('emailout').value;
  params.password = document.getElementById('passout').value;
  params.name = document.getElementById('first').value + ' ' + document.getElementById('second').value;
  params.city = document.getElementById('city').value;
  params.phone = document.getElementById('phone').value;
  params.verified = "0";
  params.interested = "%%*";
  params.cars = "%%*";
  params.reqs = "%%*";
  params.favs = "%%*";

  if (!ValidateEmail(params._id)){
    document.getElementById('emailverifout').innerHTML = 'Please enter a valid email';
    document.getElementById("emailout").style.border = "1px solid red";
    return;
  }

  if (params.password.length < 5){
    document.getElementById('passverifout').innerHTML = 'Password must be more than 5 characters';
    document.getElementById("passout").style.border = "1px solid red";
    return;
  }

  let urlEncodedDataPairs = [], name;
  for( name in params ) {
  urlEncodedDataPairs.push(encodeURI(name + '=' + params[name]));
  }

  var send = urlEncodedDataPairs.join('&');

  req.open('POST', 'http://localhost:3000/reg', true);
  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
  req.onreadystatechange = function() {//Call a function when the state changes.
      if(req.readyState == 4 && req.status == 200) {
          var data = JSON.parse(req.responseText);
          if (data.msg == '0'){
            regcloseForm();
            veropenForm();
          }
          else{
            document.getElementById('emailverifout').innerHTML = 'Email already linked to an account';
            document.getElementById("emailout").style.border = "1px solid red";
          }
      }
  }
  req.send(send);
}

function ver(){
  clear(2);
  event.preventDefault();
  
  var req = new XMLHttpRequest();

  var params = new Object();
  params.code = document.getElementById('verin').value;

  let urlEncodedDataPairs = [], name;
  for( name in params ) {
  urlEncodedDataPairs.push(encodeURI(name + '=' + params[name]));
  }

  var send = urlEncodedDataPairs.join('&');

  req.open('POST', 'http://localhost:3000/ver', true);
  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
  req.onreadystatechange = function() {//Call a function when the state changes.
      if(req.readyState == 4 && req.status == 200) {
          var data = JSON.parse(req.responseText);
          if (data.msg == '0'){
            location.reload();
          }
          else{
            document.getElementById('verifcode').innerHTML = 'Wrong verification code';
            document.getElementById("verin").style.border = "1px solid red";
          }
      }
  }
  req.send(send);
}
