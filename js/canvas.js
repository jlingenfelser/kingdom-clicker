    //Gets the Canvas as well as the Context Sets the Height and Width
    //If the Height is abnormally Small  then set a Min
    var canvas = document.getElementById("canvas"),
        ctx = canvas.getContext("2d"),
        width = screen.width,
        height = screen.height - 150;

    if (height < 568) {
        height = 568;
    }

    //Sets Canvas Width and Height
    canvas.width = width;
    canvas.height = height;

    //Sets the Background Color to Match the Night Sky
    canvas.style.backgroundColor = ("#84AF9C"); //("#110E19");

    //Builds Terrain from a Mathamatical Theorm
    //@width:     The Number of Lines to Draw based on Canvas Width
    //@height:    The Height of Each Point to be Connected
    //@displace:  The Displacement of Following Lines
    //@maxDepth:  The Bottom of the Lowest Hill
    //@cutOff:    The Top of the Highest Mountain
    //@roughness: The Degree of Randomness
    function terrain(width, height, displace, maxDepth, cutOff, roughness) {
        //Array of Points concerning the heights of each x coordinate
        var points = [];
        //Gives Power of Two Based on Width
        var power = Math.pow(2, Math.ceil(Math.log(width) / (Math.log(2))));

        //Initial Left Point
        points[0] = 500 // 2 + (Math.random() * displace * 2) - displace;
        //Initial Right Point
        points[power] = points[0] //height / 2 + (Math.random() * displace * 2) - displace;
        displace *= roughness;

        //Increase the number of segments
        for (var i = 1; i < power; i *= 2) {
            //Iterate through each segment calculating the center point
            for (var j = (power / i) / 2; j < power; j += power / i) {
                points[j] = ((points[j - (power / i) / 2] + points[j + (power / i) / 2]) / 2);
                points[j] += (Math.random() * displace * 2) - displace;
                while (points[j] > maxDepth) {
                    points[j] -= (Math.random() * displace * 2);
                }
                while (points[j] < cutOff) {
                    points[j] += (Math.random() * displace / 2);
                }
            }
            //Reduce Random Number Range
            displace *= roughness;
        }
        //Return the Array of Points
        return points;
    }

    //Build and Place Stars in the Background
    for (var k = 0; k < 60; k += 1) {
        ctx.fillStyle = "#fff";
        ctx.arc(Math.random() * 100 + k * 35, Math.random() * 500, 1, 0, Math.PI * 2, true); // Left eye
        ctx.fill();
        ctx.moveTo(Math.random() * 100 + k * 35, Math.random() * 120);
    }

    //Gets the Width and Height
    var width = canvas.width;
    var height = canvas.height;

    // Retrieve Points for each of the Three Mountain Ranges
    var terPoints3 = terrain(width, height, height * 1.2, height / 1.2, 200, 0.52);
    var terPoints2 = terrain(width, height, height * 1.2, height / 1.1, 300, 0.52);
    var terPoints = terrain(width, height, height * 1.1, height, 550, 0.51);

    // Draw Points for the Furthest Mountain Range
    ctx.beginPath();
    ctx.moveTo(0, terPoints3[0]);
    for (var t = 1; t < terPoints3.length; t++) {
        ctx.lineTo(t, terPoints3[t]);
    }
    // Finish and Build
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fillStyle = "#191D4C";
    ctx.fill();

    // Draw Points for the 2nd Mountain Range
    ctx.beginPath();
    ctx.moveTo(0, terPoints2[0]);
    for (var t = 1; t < terPoints2.length; t++) {
        ctx.lineTo(t, terPoints2[t]);
    }
    // Finish and Build
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fillStyle = "#111428";
    ctx.fill();
    
    // Draw Entry Mountain Range
    ctx.beginPath();
    ctx.moveTo(0, terPoints[0]);
    for (var t = 1; t < terPoints.length; t++) {
        ctx.lineTo(t, terPoints[t]);
    }
    // Finish and Build
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fillStyle = "#0A0A05";
    ctx.fill();

    //Start Placing things in the world
    //           # #### ####
    //        ### \/#|### |/####
    //       ##\/#/ \||/##/_/##/_#
    //     ###  \/###|/ \/ # ###
    //   ##_\_#\_\## | #/###_/_####
    //  ## #### # \ #| /  #### ##/##
    //   __#_--###`  |{,###---###-~
    //             \ }{
    //             }}{
    //              }}{
    //             {{}
    //        , -=-~{ .-^- _
    //              `}

    //Places Trees down at Random Points along the Top of the Ridge. i is the number of trees
    for (var i = 0; i < 16; i++) {
        var treeCanvas = document.createElement('canvas'); // creates new canvas element
        treeCanvas.id = 'treeLayer'; // gives canvas id
        treeCanvas.height = 100; //get original canvas height
        treeCanvas.width = 100; // get original canvas width
        document.getElementById('container').appendChild(treeCanvas); // adds the canvas to the body element
                      
        var canvas1 = document.getElementById('treeLayer'); //find new canvas we created
        var ctxTree = canvas1.getContext('2d'); //create the new canvases context
        
        //Depending on where the trees are already placed, place them in new segment
        if (i < 3) {
          var rand = getRandomInt((width - 50), width);
        } else if (i > 2 && i < 12) {
          rand =  getRandomInt((width - 300), width-20);
        } else {
          rand = getRandomInt((width - 350), (width-250));
        }

        //draws the tree
        tree.draw(ctxTree, 50, 100, 0.6, true, tree.SMALL_LEAVES);
        //Draw the image to the main canvas
        ctx.drawImage(canvas1, rand-50, terPoints[rand]-100);
        
        //Delete the new canvas to recreate it later
        document.getElementById('container').removeChild(treeCanvas);
    }

    //            _
    //          _|=|__________
    //         /              \
    //        /                \
    //       /__________________\
    //        ||  || /--\ ||  ||
    //        ||[]|| | .| ||[]||
    //      ()||__||_|__|_||__||()
    //     ( )|-|-|-|====|-|-|-|( )
    //    ^^^^^^^^^^====^^^^^^^^^^^
    //Places down the beggining Hut
    function startHut() {
      var  rando = getRandomInt(width-250, width-200);
      var sizeWidthS = getRandomInt(15, 20);
      var sizeHeightS = getRandomInt(15, 18);
      var favoriteColor = "#beeeef";
      var groundDepthS = terPoints[rando];
      
      //if the right corner of the buildings Y-equivalent, is greater than the Y-equivalent of the left corner
      //Meaning that if the new area is lower than the left point, drop the building down a bit
      if (terPoints[rando + sizeWidthS] > terPoints[rando]) {
          groundDepthS = terPoints[rando + sizeWidthS];
        }
        drawRectangle(ctx, rando, groundDepthS, sizeWidthS, sizeHeightS, favoriteColor, 1, "0A0A05", "white", "center", "bold 32px Arial", "", rectangles);
        
        ctx.beginPath();
        ctx.moveTo(0, terPoints[0]);
        for (var t = 1; t < terPoints.length; t++) {
            ctx.lineTo(t, terPoints[t]);
        }
        // Finish and Build
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = "#0A0A05";
        ctx.fill();
    }

    //Saves EVERYTHING that has been Rendered and Puts it as a background image for use
    //When being rendered.
    var base64 = canvas.toDataURL();
    canvas.style.backgroundImage = "url(" + base64 + ")";

    //This traces the top of the Mountain Range
    //for (var t = 1; t < terPoints.length; t++) {
    //    ctx.fillStyle = "#000";
    //    ctx.fillRect (t*2, terPoints[t*2], 1, 1);
    //}

    //When any button is clicked redraw the Mountain range after waiting 10 milliseconds
    $(":button").click(function() {
      setTimeout(function(){
        // Draw Entry Mountain Range
        ctx.beginPath();
        ctx.moveTo(0, terPoints[0]);
        for (var t = 1; t < terPoints.length; t++) {
            ctx.lineTo(t, terPoints[t]);
        }
        // Finish and Build
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = "#0A0A05";
        ctx.fill();
        
        //If we have built both walls go ahead and redraw them on top of anything that may accidentally be built on top
        //TODO: won't need this if I can get that algorithm working
        if (finishedWalls == true) {
            
          var groundDepth = terPoints[width-490];
          if (terPoints[width-490+15] > terPoints[width-490]) {
               groundDepth = terPoints[width-490 + 15];
            }
          drawRectangle(ctx, width - 490, groundDepth + 10, 15, 55, "#0A0A05", 1, "#0A0A05", "white", "center", "bold 12px Arial", "", rectangles);
          
          groundDepth = terPoints[430];
          if (terPoints[430 + 15] > terPoints[430]) {
                groundDepth = terPoints[430 + 15];
            }
          drawRectangle(ctx, 430, groundDepth + 15, 15, 55, "#0A0A05", 1, "#0A0A05", "white", "center", "bold 12px Arial", "", rectangles);
        }
        
      }, 10);
    });