var clicks = 0; //increment this by one every click
var auto_clicks = 0; //automatically click once per second
var cost = 1; //the cost of this should increase exponentially

//Number of || Cost of each type of building stored here
var numHouse = 0;
var costHouse = 100;
var numFarm = 0;
var costFarm = 100;
var numWindmill = 0;
var costWindmill = 100;
var numBarn = 0;
var costBarn = 100;
var numFountain = 0;
var costFountain = 100;
var numArmory = 0;
var costArmory = 100;
var numSmithy = 0;
var costSmithy = 100;
var numChurch = 0;
var costChurch = 100;
var numBakery = 0;
var costBakery = 100;
var numLumbermill = 0;
var costLumbermill = 100;
var numHuntersLodge = 0;
var costHuntersLodge = 100;
var numHospital = 0;
var costHospital = 100;
var numWarehouse = 0;
var costWarehouse = 100;
var numWall = 0;
var costWall = 100;
var numWatchtower = 0;
var costWatchtower = 100;
var wallCount = 0;
var watchtowerCount = 0;

var width = screen.width;
var height = screen.height;
var finishedWalls = false;

//this function updates the number of clicks displayed
function update_total_clicks() {
    var e = document.getElementById("total_clicks");
    e.innerHTML = 'Clicks: ' + clicks;
}

//Update the number of buildings and adjust the div to match
function update_total(building, numBuilding) {


    var buildingName = building + ": ";
    if (building == "HuntersLodge") {
        buildingName = "Hunter's Lodges: "
    }
    var name = 'total_' + building;
    var e = document.getElementById(name);
    e.innerHTML = buildingName + numBuilding;
}

//Click the Button, Update Number
document.getElementById("click").onclick = function() {
    clicks++;
    update_total_clicks(); //updates the text
};

//Buy Autoclickers, Subtract cost
document.getElementById("buy_click").onclick = function() {
    if (clicks < cost) {
        return alert('need more clicks.');
    }
    auto_clicks++;
    clicks -= cost;
    cost = Math.pow(2, auto_clicks);
    var e = document.getElementById("clicks_per_second");
    e.innerHTML = 'Clicks per second: ' + auto_clicks;
    var e2 = document.getElementById("buy_click");
    e2.innerHTML = 'Buy an autoclick for ' + cost;
    update_total_clicks();
};

//Check is the variable that counts along with the buildings to identify them. Start at two
var check = 2;
//Log the current building locations
var buildingLocations = [];
//Creates the Building Object using a system of rules dictating where the building
//Should go as well as its general length and width. Also dictates the color, fill,
//etc. And is in charge of checking the click bank to see if anything can be bought
function buildBuilding(typeBuilding, typeBuildingPlural, numTypeBuilding, costBuilding, maxShow, minShow, left, right, minWidth, maxWidth, minHeight, maxHeight, ctx, color, lineThickness, lineColor, textColor, textArea, textType, Name, rectangles) {
    //If we don't have enough clicks then don't build the building
    if (clicks < window[costBuilding]) {
        return alert('need more clicks.');
    }
    //Subtract the cost of the building from the number of clicks at our disposal
    clicks -= window[costBuilding];
    
    //Update the cost of the building based on this algorithm (NEEDS WORK)
    window[costBuilding] = Math.pow(2, window[numTypeBuilding] + 1);
    
    //Increase the number of that type of building by one
    window[numTypeBuilding] += 1;
    
    //Get the element to update and update it
    var buyID = 'buy_' + typeBuilding;
    var e2 = document.getElementById(buyID);
    e2.innerHTML = 'Buy a ' + typeBuilding + ' for: ' + window[costBuilding];
    update_total(typeBuildingPlural, window[numTypeBuilding]);

    //If we have enough buildings built to draw a new building to the canvas do it
    if (window[numTypeBuilding] <= maxShow) {
        if (window[numTypeBuilding] % minShow === 0) {
            var rand = getRandomInt(left, right);
            var sizeWidth = getRandomInt(minWidth, maxWidth);
            var sizeHeight = getRandomInt(minHeight, maxHeight);
            
            //Initial Look At building a Collision Detection System for Building Placement
            //Errors Include: Object is only moved once, so if it's moved onto another object.. oh well i guess
            //Object also doesn't get counted some times.
            var x1 = rand;
            var x2 = rand + sizeWidth;
            
            if (buildingLocations.length > 0) {
              for (var i = 1; i < buildingLocations.length; i += 2) {
                if (x1 > buildingLocations[i-1] && x1 < buildingLocations[i]) {
                  //console.log(check);
                  //console.log(x1);
                  rand += (buildingLocations[i]-x1)+10;
                  x1 = rand;
                  //console.log(x1);
                }
                else if (x2 > buildingLocations[i-1] && x2 < buildingLocations[i]) {
                  //console.log(check);
                  //console.log(x1);
                  rand -= (x2-buildingLocations[i-1])+10;
                  x1 = rand;
                  //console.log(x1);
                }
                
                else if (x2 > width-490 && x2 < width+25-490) {
                  rand = rand + ((width+25-490-x2)+10);
                  x1 = rand;
                }
                else if (x1 > width-490 && x1 < width+25-490) {
                  rand = rand - ((width+25-490-x2)+10);
                  x1 = rand;
                }
                else if (x2 > 430 && x2 < 430+25) {
                  rand = rand + ((430+25-x2)+10);
                  x1 = rand;
                }
                else if (x1 > 430 && x1 < 430+25) {
                  rand = rand - ((430+25-x2)+10);
                  x1 = rand;
                }
                
              }
              buildingLocations.push(x1);
              buildingLocations.push(x2);
            } else {
              buildingLocations.push(x1);
              buildingLocations.push(x2);
            }
            
            //If the building is a wall or watchtower then place it at specific points
             if (typeBuilding == "Wall") {
                if (wallCount === 0) {
                    rand = 430;
                    wallCount += 1;
                } else {
                    rand = width-490;
                    finishedWalls = true;
                }
             }
            else if (typeBuilding == "Watchtower") {
                if (watchtowerCount === 0) {
                    rand = getRandomInt(460, 480);
                    watchtowerCount += 1;
                } else {
                    rand = getRandomInt(width - 540, width - 520)
                }
            }
            
            //Sets how far down to place the building (want it at ground level so no hovering occurs)
            var groundDepth = terPoints[rand];
            if (terPoints[rand + sizeWidth] > terPoints[rand]) {
                groundDepth = terPoints[rand + sizeWidth];
            }
            drawRectangle(ctx, rand, groundDepth + 10, sizeWidth, sizeHeight, color, lineThickness, lineColor, textColor, textArea, textType, Name, rectangles);
            check++;
        }
    }
};

/*
*  INSIDE THE WALLS
*/

//Buy House, subtract cost
document.getElementById("buy_House").onclick = function() {
    buildBuilding('House', 'Houses', 'numHouse', 'costHouse', 100, 10, 450, width - 530, 15, 20, 25, 35, ctx, "", 1, "purple", "white", "center", "bold 12px Arial", "", rectangles);
};

//Buy Fountain, subtract cost
document.getElementById("buy_Fountain").onclick = function() {
    buildBuilding('Fountain', 'Fountains', 'numFountain', 'costFountain', 10, 10, (width - 50) / 2, (width - 400 + 550) / 2, 15, 20, 55, 65, ctx, "", 1, "blue", "white", "center", "bold 12px Arial", "", rectangles);
};

//Buy Armory, subtract cost
document.getElementById("buy_Armory").onclick = function() {
    buildBuilding('Armory', 'Armories', 'numArmory', 'costArmory', 40, 10, 470, width - 550, 15, 20, 35, 35, ctx, "", 1, "beige", "white", "center", "bold 12px Arial", "", rectangles);
};

//Buy Smithy, subtract cost
document.getElementById("buy_Smithy").onclick = function() {
    buildBuilding('Smithy', 'Smithies', 'numSmithy', 'costSmithy', 40, 10, 460, width - 540, 15, 20, 20, 30, ctx, "", 1, "green", "white", "center", "bold 12px Arial", "", rectangles);
};

//Buy Church, subtract cost
document.getElementById("buy_Church").onclick = function() {
    buildBuilding('Church', 'Churches', 'numChurch', 'costChurch', 30, 10, 480, width - 570, 15, 20, 35, 40, ctx, "", 1, "yellow", "white", "center", "bold 12px Arial", "", rectangles);
};

//Buy Bakery, subtract cost
document.getElementById("buy_Bakery").onclick = function() {
    buildBuilding('Bakery', 'Bakeries', 'numBakery', 'costBakery', 40, 10, 450, width - 560, 15, 20, 22, 28, ctx, "", 1, "grey", "white", "center", "bold 12px Arial", "", rectangles);
};

//Buy Hospital, subtract cost
document.getElementById("buy_Hospital").onclick = function() {
    buildBuilding("Hospital", 'Hospitals', 'numHospital', 'costHospital', 50, 10, 480, width - 550, 15, 30, 40, 65, ctx, "", 1, "red", "white", "center", "bold 12px Arial", "", rectangles);
};

//Buy Warehouse, subtract cost
document.getElementById("buy_Warehouse").onclick = function() {
    buildBuilding("Warehouse", 'Warehouses', 'numWarehouse', 'costWarehouse', 10, 10, width - 650, width - 500, 25, 35, 35, 35, ctx, "", 1, "grey", "white", "center", "bold 12px Arial", "", rectangles);
};

//Buy Wall, subtract cost
document.getElementById("buy_Wall").onclick = function() {
    buildBuilding("Wall", 'Walls', 'numWall', 'costWall', 20, 10, width - 500, width - 450, 15, 15, 55, 55, ctx, "#0A0A05", 1, "#0A0A05", "white", "center", "bold 12px Arial", "", rectangles);
};

//Buy Watch Tower, subtract cost
document.getElementById("buy_Watchtower").onclick = function() {
    buildBuilding("Watchtower", 'Watchtowers', 'numWatchtower', 'costWatchtower', 20, 10, 450, width - 500, 15, 20, 55, 65, ctx, "", 1, "pink", "white", "center", "bold 12px Arial", "", rectangles);
};

/*
*  OUTSIDE THE WALLS
*/

//Buy Farm, subtract cost
document.getElementById("buy_Farm").onclick = function() {
    buildBuilding('Farm', 'Farms', 'numFarm', 'costFarm', 20, 10, width - 480, width - 365, 15, 20, 25, 35, ctx, "", 1, "green", "white", "center", "bold 12px Arial", "", rectangles);
};

//Buy Windmill, subtract cost
document.getElementById("buy_Windmill").onclick = function() {
    buildBuilding('Windmill', 'Windmills', 'numWindmill', 'costWindmill', 20, 10, width - 480, width - 365, 15, 20, 55, 65, ctx, "", 1, "white", "white", "center", "bold 12px Arial", "", rectangles);
};

//Buy Barn, subtract cost
document.getElementById("buy_Barn").onclick = function() {
    buildBuilding('Barn', 'Barns', 'numBarn', 'costBarn', 20, 10, width - 480, width - 375, 15, 20, 35, 45, ctx, "", 1, "red", "white", "center", "bold 12px Arial", "", rectangles);
};

//Buy Lumbermill, subtract cost
document.getElementById("buy_Lumbermill").onclick = function() {
    buildBuilding('Lumbermill', 'Lumbermills', 'numLumbermill', 'costLumbermill', 20, 10, width - 240, width - 50, 15, 20, 20, 22, ctx, "", 1, "brown", "white", "center", "bold 12px Arial", "", rectangles);
};

//Buy Hunters Lodge, subtract cost
document.getElementById("buy_Hunter's Lodge").onclick = function() {
    buildBuilding("Hunter's Lodge", 'HuntersLodge', 'numHuntersLodge', 'costHuntersLodge', 10, 10, width - 200, width - 150, 15, 20, 20, 35, ctx, "", 1, "gold", "white", "center", "bold 12px Arial", "", rectangles);
};

//Cheaty button to build 10 of each building
document.getElementById("populate").onclick = function() {
    clicks += 1000000000000000000000000000000;
    update_total_clicks();
    for (var i = 0; i < 10; i++) {
        document.getElementById("buy_House").click();
        document.getElementById("buy_Farm").click();
        document.getElementById("buy_Windmill").click();
        document.getElementById("buy_Barn").click();
        document.getElementById("buy_Fountain").click();
        document.getElementById("buy_Armory").click();
        document.getElementById("buy_Smithy").click();
        document.getElementById("buy_Church").click();
        document.getElementById("buy_Lumbermill").click();
        document.getElementById("buy_Bakery").click();
        document.getElementById("buy_Hospital").click();
        document.getElementById("buy_Hunter's Lodge").click();
        document.getElementById("buy_Warehouse").click();
        document.getElementById("buy_Wall").click();
        document.getElementById("buy_Watchtower").click();
    }
};


//Cheaty button to give myself tons of clicks.
document.getElementById("cheaty").onclick = function() {
    clicks += 1000000000000000000000000000000;
    update_total_clicks();
};

//Update the number of Clicks every second
setInterval(function() {
    clicks += auto_clicks;
    update_total_clicks();
}, 1000); //once per second use the auto clickers