function fav(){
    event.preventDefault();
    
    var req = new XMLHttpRequest();

    req.open('POST', 'http://localhost:3000/fav', true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    let send = window.location.href;
    send = send.split('/');
    send=  send[send.length - 1];
    
    var params = new Object();
    params.link = send;
    params.fav = 1;
  
    let urlEncodedDataPairs = [], name;
    for( name in params ) {
    urlEncodedDataPairs.push(encodeURI(name + '=' + params[name]));
    }
  
    var sendd = urlEncodedDataPairs.join('&');
    req.send(sendd);
    location.reload();
}

function unfav(){
    event.preventDefault();
    
    var req = new XMLHttpRequest();

    req.open('POST', 'http://localhost:3000/fav', true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    let send = window.location.href;
    send = send.split('/');
    send=  send[send.length - 1];
    
    var params = new Object();
    params.link = send;
    params.fav = 0;
  
    let urlEncodedDataPairs = [], name;
    for( name in params ) {
    urlEncodedDataPairs.push(encodeURI(name + '=' + params[name]));
    }
  
    var sendd = urlEncodedDataPairs.join('&');
    req.send(sendd);
    location.reload();
}