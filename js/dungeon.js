var screenWidth = screen.width;
var screenHeight = screen.height;


var Dungeon = {
    map: null,
    mapHeight: 36,
    mapWidth: 50,
    rooms: [],
    Generate: function () {
        this.map = [];
        for (var x = 0; x < this.mapWidth; x++) {
            this.map[x] = [];
            for (var y = 0; y < this.mapHeight; y++) {
                this.map[x][y] = 0;
            }
        }
        
        //Clear the Rooms Array
        this.rooms = [];
        
        var roomTryCount = getRandomInt(50, 100);
        var minSize = 5;
        var maxSize = 8;
        
        //Build the beginning Room
        for (var i = 20; i < 30; i++) {
           for (var j = 15; j < 20; j++) {
             this.map[i][j] = 1;
          }
        }
          
        //Create the Array that will store details about a room
        var room = {};
        //Load in the Initial Room
        room.x = 20;
        room.y = 15;
        room.w = 10;
        room.h = 5;
        this.rooms.push(room);
        //console.log(this.rooms);
        var tryNumber = 0;
        
        for (var k = 0; k < roomTryCount; k++) {
            room = {};

            room.x = getRandomInt(1, this.mapWidth - maxSize - 1);
            room.y = getRandomInt(1, this.mapHeight - maxSize - 1);
            room.w = getRandomInt(minSize, maxSize);
            room.h = getRandomInt(minSize, maxSize);

             while (tryNumber < this.rooms.length) {
              if (
                !(room.x           > (this.rooms[tryNumber].x + this.rooms[tryNumber].w) ||
                 (room.x + room.w) <  this.rooms[tryNumber].x                    ||
                  room.y           > (this.rooms[tryNumber].y + this.rooms[tryNumber].h) ||
                 (room.y + room.h) <  this.rooms[tryNumber].y)) {
                  //console.log("failure");
              } else {
                  //console.log("success");
                this.rooms.push(room);
              }
              tryNumber++;
            }
            tryNumber--;
        }

        //Goes through and Changes the area inside anyroom to be a tile Value of 1
        for (i = 0; i < this.rooms.length; i++) {
          var roomStartX = this.rooms[i].x;
          var roomEndX = this.rooms[i].x + this.rooms[i].w;
          
          var roomStartY = this.rooms[i].y;
          var roomEndY = this.rooms[i].y + this.rooms[i].h;
          
          for (var x = roomStartX; x < roomEndX; x++) {
            for (var y = roomStartY; y < roomEndY; y++) {
                this.map[x][y] = 1;
            }
          }
        }
        
        /*
        for (var i = 0; i < roomCount; i++) {
            var room = {};

            room.x = getRandomPointInCircle(10, this.mapWidth/2);
            room.y = getRandomInt(Math.floor(this.mapHeight/8), Math.floor(this.mapHeight/1.2) - maxSize - 1);
            room.w = getRandomInt(minSize, maxSize);
            room.h = getRandomInt(minSize, maxSize);

            this.rooms.push(room);
        }

        for (i = 0; i < this.rooms.length; i++) {
          var roomStartX = this.rooms[i].x;
          var roomEndX = this.rooms[i].x + this.rooms[i].w;
          
          var roomStartY = this.rooms[i].y;
          var roomEndY = this.rooms[i].y + this.rooms[i].h;
          
          console.log(this.rooms[i]);
          for (x = roomStartX; x < roomEndX; x++) {
            for (y = roomStartY; y < roomEndY; y++) {
              this.map[x][y] = 1;
            }
          }
        }
        */
    }
};

var Renderer = {
    canvasDungeon: null,
    ctxDungeon: null,
    width: 915,
    height: 540,
    scale: 0,
    Initialize: function () {
        var dungeonCanvas = document.createElement('canvas'); // creates new canvas element
        dungeonCanvas.id = 'dungeonLayer'; // gives canvas id
        document.getElementById('container').appendChild(dungeonCanvas); // adds the canvas to the body element

        this.canvasDungeon = document.getElementById('dungeonLayer'); //find new canvas we created
        this.canvasDungeon.width = 915;
        this.canvasDungeon.height = 540;
        this.ctxDungeon = this.canvasDungeon.getContext('2d');
        this.scale = 15;
  
        //Styles the Dungeon (Puts it in the right Spot)
        this.canvasDungeon.style.marginLeft = (screenWidth-dungeonCanvas.width)/2 + "px";
        this.canvasDungeon.style.marginTop = (screenHeight-dungeonCanvas.height)/4 + "px";
        this.canvasDungeon.style.position = "absolute";
        this.canvasDungeon.style.backgroundColor = "black";
        this.canvasDungeon.style.border = '4px solid #000';

    },
    
    Update : function() {
      //If Player Lands on a Level Increaser Increase Dungeon Difficulty
      if (Dungeon.map[Player.playerX][Player.playerY] == 4) {
        Level.IncreaseLevel();
      }
      //Otherwise Move the Player in their Direction + Draw Him there / Update Info and Redraw Monsters
      else {
        //Clear + Move + redraw Player
        Player.Draw();
        
        //Clear + Move + redraw Monster
        Monster.Update();
        Monster.Draw();
        
        //Update Player Info
        Menu.Update();
      }
    },
    
    Color : function(tile, x, y, w, h) {
      //Get the Value of the Tile Player is Standing On (Before he moved to it)
      //Don't want to build another stair down
      if (tile === 4 && Player.playerX * this.scale == x) {
        tile = 1;
      }
      //Set the Value Back to what it was
      Dungeon.map[x / this.scale][y / this.scale] = tile;
      //Fill in Dark Color for Walls
      if (tile == 0) {this.ctxDungeon.fillStyle = '#351330';}
      //Fill in Lighter Color for Floors
      else if (tile == 1) {this.ctxDungeon.fillStyle = '#64908A';}
      //Fill in Player Location (This shouldn't ever need to be called here)
      else if (tile == 2) {this.ctxDungeon.fillStyle = Player.color;}
      //Fill in the Monster Location (Again shouldn't be called since you shouldn't be standing on monster)
      else if (tile == 3) {this.ctxDungeon.fillStyle = Monster.color;}
      //Fill in the Stairs leading down
      else if (tile == 4) {this.ctxDungeon.fillStyle = 'blue';}
      //Fill in the Treasure
      else if (tile == 5) {this.ctxDungeon.fillStyle = 'gold';}
      //Fill in any Weird Leftovers with a color
      else {this.ctxDungeon.fillStyle = '#351330';}
      //Take the color from these options and fill in the place where the player was standing
      this.ctxDungeon.fillRect(x, y, w, h);
    },
    
    FindSpot : function() {
      var goodSpot = false;
        while (goodSpot === false) {
          var x = getRandomInt(2, Dungeon.mapWidth - 2);
          var y = getRandomInt(2, Dungeon.mapHeight - 2);
          
          if (Dungeon.map[x][y] == 1) {
            goodSpot = true;
            return [x, y];
          }
        }
    },
    
    Fill : function(color, x, y, w, h) {
      Renderer.ctxDungeon.fillStyle = color;
      Renderer.ctxDungeon.fillRect(x, y, w, h);
    },
    
    Render : function() {
       //Identify and Draw Tiles
       for (var y = 0; y < Dungeon.mapHeight; y++) {
            for (var x = 0; x < Dungeon.mapWidth; x++) {
                var tile = Dungeon.map[x][y];
                //Fill in Dark Color for Walls
                if (tile == 0) {this.ctxDungeon.fillStyle = '#212638';}
                //Fill in Lighter Color for Floors
                else if (tile == 1) {this.ctxDungeon.fillStyle = '#64908A';}
                //Fill in Player Location (This shouldn't ever need to be called here)
                else if (tile == 2) {this.ctxDungeon.fillStyle = Player.color;}
                //Fill in the Monster Location (Again shouldn't be called since you shouldn't be standing on monster)
                else if (tile == 3) {this.ctxDungeon.fillStyle = Monster.color;}
                //Fill in the Stairs leading down
                else if (tile == 4) {this.ctxDungeon.fillStyle = 'blue';}
                //Fill in any Weird Leftovers with a color
                else {this.ctxDungeon.fillStyle = '#351330';}
                
                this.ctxDungeon.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
            }
        }
    }
};

var Menu = {
  
  menuCanvas: null,
  subMenuCanvas : null,
  ctxSubMenu : null,
  ctxMenu: null,
  exists : false,
  subExists : false,
  width: 915,
  height: 540,
  itemNumber : 0,
  
  Create : function() {
    var menu = document.createElement('canvas'); // creates new canvas element
        menu.id = 'menuCanvas'; // gives canvas id
        document.getElementById('container').appendChild(menu); // adds the canvas to the body element

        this.menuCanvas = document.getElementById('menuCanvas'); //find new canvas we created
        this.menuCanvas.width = 915;
        this.menuCanvas.height = 540;
        this.ctxMenu = this.menuCanvas.getContext('2d');
  
        //Styles the Dungeon (Puts it in the right Spot)
        this.menuCanvas.style.marginLeft = (screenWidth-menu.width)/2 + "px";
        this.menuCanvas.style.marginTop = (screenHeight-menu.height)/4 + "px";
        this.menuCanvas.style.position = "absolute";
        this.menuCanvas.style.display= "inline";
        
        //TODO Redundant but for some reason keeping this draws the player update info as
        for (var x = 0; x < 5; x++) {
          for (var y = 0; y < 2; y++) {
            drawInventory(this.ctxMenu, x*30, 30 + y*30, 30, 30, "red", 1, "grey", "white", "center", "bold 12px Arial", "", rectangles);
          }
        }
        
        //Don't create a second menu
        Menu.exists = true;
  },
  
  CreateSubMenu : function(number) {
    if (Menu.subExists === false) {
      var subMenu = document.createElement('canvas'); // creates new canvas element
          subMenu.id = 'subMenuCanvas'; // gives canvas id
          document.getElementById('container').appendChild(subMenu); // adds the canvas to the body element
  
          this.subMenuCanvas = document.getElementById('subMenuCanvas'); //find new canvas we created
          this.subMenuCanvas.width = 915;
          this.subMenuCanvas.height = 540;
          this.ctxSubMenu = this.subMenuCanvas.getContext('2d');
    
          //Styles the Dungeon (Puts it in the right Spot)
          //TODO: fix this
          this.subMenuCanvas.style.marginLeft = (screenWidth-subMenu.width)/2 + "px";
          this.subMenuCanvas.style.marginTop = (screenHeight-subMenu.height)/4 + "px";
          this.subMenuCanvas.style.position = "absolute";
          this.subMenuCanvas.style.display= "inline";
          
          Menu.itemNumber = number - 10;
          var minLeft = Dungeon.mapWidth * Renderer.scale + 10;
          var minTop = 210;
          
          drawMenu(this.ctxSubMenu, minLeft, minTop + 1*20, 90, 20, "white", 1, "black", "black", "center", "bold 12px Arial", "Inspect", rectangles);
          drawMenu(this.ctxSubMenu, minLeft, minTop + 2*20, 90, 20, "white", 1, "black", "black", "center", "bold 12px Arial", "Equip/Use", rectangles);
          drawMenu(this.ctxSubMenu, minLeft, minTop + 3*20, 90, 20, "white", 1, "black", "black", "center", "bold 12px Arial", "Destroy", rectangles);
          Menu.subExists = true;
    }
  },
  
  DeleteSubMenu : function() {
    document.getElementById('container').removeChild(this.subMenuCanvas);
    options = [];
    Menu.subExists = false;
  },
  
  Update : function() {
    Menu.Check();
    
    Menu.Clear();
    
    Player.UpdatePlayerInfo();
    Player.UpdateHealth();
    
    Menu.UpdateInventory();
  },
  
  UpdateInventory : function(){
    var minLeft = Dungeon.mapWidth * Renderer.scale + 10;
    var minTop = 210;
    
    for (var x = 0; x < 5; x++) {
      drawInventory(this.ctxMenu, minLeft + x*30, minTop + 30, 30, 30, Player.inventory[x].color, 1, "grey", "white", "center", "bold 12px Arial", x+1, rectangles);
    }
    for (var i = 5; i < 10; i++) {
      drawInventory(this.ctxMenu, minLeft + (i-5)*30, minTop + 60, 30, 30, Player.inventory[i].color, 1, "grey", "white", "center", "bold 12px Arial", i+1, rectangles);
    }
    
    for (var j = 10; j < 15; j++) {
      drawInventory(this.ctxMenu, minLeft + (j-10)*30, minTop + 100, 30, 30, Player.inventory[j].color, 1, "grey", "white", "center", "bold 12px Arial", "E", rectangles);
    }
  },

  Inspect : function() {
    var x = subMenuCanvas.width - 120;
    var y = subMenuCanvas.height - 180;
    wrapText(Menu.ctxMenu, Player.inventory[Menu.itemNumber].desc, x, y, 90, 15);
  },
  
  EquipWeapon : function() {
    var oldWeapon = Player.UnequipWeapon(Player.weapon);
    
    if (oldWeapon.name == "Fists" && Player.inventory[Menu.itemNumber].name != "Fists") {
      Player.numItems--;
    }
    else if (oldWeapon.name != "Fists" && Player.inventory[Menu.itemNumber].name == "Fists") {
      Player.numItems++;
    }
    
    Player.EquipWeapon(Player.inventory[Menu.itemNumber]);
    Player.inventory[Menu.itemNumber] = oldWeapon;
    
    Menu.Update();
  },
  
  Destroy : function() {
    Player.inventory[Menu.itemNumber] = Item.Fist();
    Menu.Update();
    Player.numItems--;
  },
  
  Choose : function(keyCode) {
    if (keyCode == '81') {
      Menu.Use();
    }
    else if (keyCode == '87') {
      Menu.Equip();
    }
    else if (keyCode == '69') {
      Menu.Destroy();
    }
  },
  
  Check : function() {
    if (Menu.exists === false) {
         Menu.Create();
      }
  },
  
  Clear : function() {
    Menu.ctxMenu.clearRect(0, 0, Menu.width, Menu.height);
  }
};

document.onkeydown = Player.Move;