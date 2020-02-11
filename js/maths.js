//Get a random Integer between the Min and Max value
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPointInCircle(radius, xOffset) {
  var t = 2*Math.PI*Math.random();
  var u = Math.random()+Math.random();
  var r = 0;
  
  if (u > 1) {
    r = 2-u;
  } else {
    r = u;
  }
  return Math.floor(radius*r*Math.cos(t), radius*r*Math.sin(t))+xOffset;
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  var words = text.split(' ');
  var line = '';

  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    }
    else {
     line = testLine;
    }
  }
  context.fillText(line, x, y);
}