function insertJS() {
  var body = document.body;
  var jsScriptNode = document.createElement('script');
  jsScriptNode.setAttribute('type', 'text/javascript');
  jsScriptNode.setAttribute('src', 'https://connect.podium.com/static/js/main.79377a6b.js');
  body.appendChild(jsScriptNode);
}

var start = Date.now();
var interval = 9;

function main() {
  var body = document.body;
  if (body) {
    insertJS();
  } else if (Date.now() - start > 10000) {
    return null;
  } else {
    setTimeout(function() {
      main();
    }, interval);
    interval *= 2;
  }
}

main();
