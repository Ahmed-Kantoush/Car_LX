
var mybutton = document.getElementById("myBtn");

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 350 || document.documentElement.scrollTop > 350) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function gotoTop() {
  document.documentElement.scrollTop = 0;
} 

function hamada(){
    document.getElementById("quickTip").hidden = true;
}