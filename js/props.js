//An array containing the rectangles points
var rectangles = [];
var options = [];
var inventory = [];

//Controls the drawing of the actual rectangle
var drawR = function (ctx, x, y, width, height, fillcolor, linewidth, strokestyle, fontcolor, textalign, fonttype, filltext) {
    ctx.beginPath();
    
    //Fill In Pattern Unless Want a Specific Color
    if (fillcolor == "") {
      var fillImg = new Image();
      fillImg.src = 'pattern2.jpg';
      fillImg.style.width = '50%';
      fillImg.style.height = 'auto';
      fillImg.onload = function(){
        var fillPattern = ctx.createPattern(fillImg,'repeat');
        ctx.fillStyle = fillPattern;
        ctx.fillRect(x, y-height, width, height);
        ctx.lineWidth = linewidth;
        ctx.strokeStyle = strokestyle;
        ctx.strokeStyle = "#000";
        ctx.strokeRect(x, y-height, width, height);
      
        ctx.fillStyle = fontcolor;
        ctx.textAlign = textalign;
        ctx.font = fonttype;
        ctx.fillText(filltext, x+width/2, y-height/4);
        };
    } else {
      ctx.beginPath();
      ctx.fillStyle = fillcolor;
      ctx.fillRect(x, y-height, width, height);
      ctx.lineWidth = linewidth;
      ctx.strokeStyle = strokestyle;
      ctx.strokeRect(x, y-height, width, height);
    
      ctx.fillStyle = fontcolor;
      ctx.textAlign = textalign;
      ctx.font = fonttype;
      ctx.fillText(filltext, x+width/1.5, y-height/6);
    }
    
};

//Rectangle objects corners
var Rectangle = function(x, y, width, height) {
    this.left = x;
    this.top = y - height;
    this.right = x + width;
    this.bottom = y;
};

//Draws the rectangle to the canvas taking in the correct parameters
var drawRectangle = function (ctx, x, y, width, height, fillcolor, linewidth, strokestyle, fontcolor, textalign, fonttype, filltext, rectangles) {
    drawR(ctx, x, y, width, height, fillcolor, linewidth, strokestyle, fontcolor, textalign, fonttype, filltext);
    var rectangle = new Rectangle(x, y, width, height);
    rectangles.push(rectangle);
};


//Menu Option
var Optionaire = function(x, y, width, height, filltext) {
    this.left = x;
    this.top = y - height;
    this.right = x + width;
    this.bottom = y;
    this.filltext = filltext;
};

//Draws the rectangle to the canvas taking in the correct parameters
var drawMenu = function (ctx, x, y, width, height, fillcolor, linewidth, strokestyle, fontcolor, textalign, fonttype, filltext, rectangles) {
    drawR(ctx, x, y, width, height, fillcolor, linewidth, strokestyle, fontcolor, textalign, fonttype, filltext);
    var menuOption = new Optionaire(x, y, width, height, filltext);
    options.push(menuOption);
};

//Draws the rectangle to the canvas taking in the correct parameters
var drawInventory = function (ctx, x, y, width, height, fillcolor, linewidth, strokestyle, fontcolor, textalign, fonttype, filltext, rectangles) {
    drawR(ctx, x, y, width, height, fillcolor, linewidth, strokestyle, fontcolor, textalign, fonttype, filltext);
    var rectangle = new Rectangle(x, y, width, height, filltext);
    inventory.push(rectangle);
};

//Check where User is clicking and (if lines up with a building) do something


$(document).on('click', '#menuCanvas', function(e) {
    var clickedX = e.pageX - this.offsetLeft;
    var clickedY = e.pageY - this.offsetTop;
    
    for (var i = 0; i < inventory.length; i++) {
        if (clickedX < inventory[i].right && clickedX > inventory[i].left && clickedY > inventory[i].top && clickedY < inventory[i].bottom) {
          Menu.CreateSubMenu(i);
          //alert ('clicked number ' + (i - 9) + Player.inventory[i-10].name);
        }
    }
});

$(document).on('click', '#subMenuCanvas', function(e) {
    var clickedX = e.pageX - this.offsetLeft;
    var clickedY = e.pageY - this.offsetTop;
    if (clickedX < options[0].right && clickedX > options[0].left && clickedY > options[0].top && clickedY < options[0].bottom) {
      Menu.Inspect();
      Menu.DeleteSubMenu();
    }
    else if (clickedX < options[1].right && clickedX > options[1].left && clickedY > options[1].top && clickedY < options[1].bottom) {
      Menu.EquipWeapon();
      Menu.DeleteSubMenu();
    }
    else if (clickedX < options[2].right && clickedX > options[2].left && clickedY > options[2].top && clickedY < options[2].bottom) {
      Menu.Destroy();
      Menu.DeleteSubMenu();
    }
    else {
      Menu.DeleteSubMenu();
    }
});

