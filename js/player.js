
var Player = {
  //Player Screen Info
  color : "#33c9cc",
  hitColor : "#beeeef",
  menuWidth : 11,
  menuHeight : 36,
  playerX : 0,
  playerY : 0,
  width : 15,
  height : 15,
  nextTile : 1,
  
  //Player Stats
  health : 100,
  food : 0,
  level : 0,
  armor : 0,
  numItems : 0,
  inventory : [Item.Fist(),Item.Fist(),Item.Fist(),Item.Fist(),Item.Fist(),Item.Fist(),Item.Fist(),Item.Fist(),Item.Fist(),Item.Fist(),Item.Fist(),Item.Fist(),Item.Fist(),Item.Fist(),Item.Fist()],
  weapon : Item.Fist(),
  attackDamage : 1,
  
  Place: function() {
    //If there Is Just floor Here then place the Player
    //TODO: Make sure to Place player a certain distance from Floor Leading down
    var XY = Renderer.FindSpot();
    Player.playerX = XY[0];
    Player.playerY = XY[1];
    
    //Sets the damage equal to weapon Damage
    Player.attackDamage = Player.weapon.damage;
    
    //Set the Location of the Player to Be at the Good Spot
    //Dungeon.map[Player.playerX][Player.playerY] = 2;
    //Fill the Location of Starting Player Here with the Appropriate Color
    Renderer.Fill(this.color, Player.playerX * Renderer.scale, Player.playerY * Renderer.scale, Player.width, Player.height);
  },
  
  Draw: function() {
    //Sets the New Tile to Be the Player Tile and Redraws the Player
    Dungeon.map[Player.playerX][Player.playerY] = 2;
    Renderer.Fill(this.color, Player.playerX * Renderer.scale, Player.playerY * Renderer.scale, Player.width, Player.height);
  },
  
  Move: function(e) {
    //Color in the Tile the Player is leaving
    Renderer.Color(Player.nextTile, Player.playerX * Renderer.scale, Player.playerY * Renderer.scale, Player.width, Player.height);
    
    //Left
    if(e.keyCode == "37") {
      if (Dungeon.map[Player.playerX - 1][Player.playerY] == 1 ||
          Dungeon.map[Player.playerX - 1][Player.playerY] == 4 ||
          Dungeon.map[Player.playerX - 1][Player.playerY] == 5) {
            Player.nextTile = Dungeon.map[Player.playerX - 1][Player.playerY];
            Player.playerX -= 1;
      }
      else if (Dungeon.map[Player.playerX - 1][Player.playerY] == 3) {
        for (var i = 0; i < Monster.enemies.length; i++) {
          if (Monster.enemies[i].enemyX == Player.playerX - 1 && Monster.enemies[i].enemyY == Player.playerY) {
            Monster.WasHit(i);
          }
        }
      }
    }
    //Up
    if(e.keyCode == "38") {
      if (Dungeon.map[Player.playerX][Player.playerY - 1] == 1 ||
          Dungeon.map[Player.playerX][Player.playerY - 1] == 4 ||
          Dungeon.map[Player.playerX][Player.playerY - 1] == 5) {
            Player.nextTile = Dungeon.map[Player.playerX][Player.playerY - 1]
            Player.playerY -= 1;
      }
      else if (Dungeon.map[Player.playerX][Player.playerY - 1] == 3) {
        for (var i = 0; i < Monster.enemies.length; i++) {
          if (Monster.enemies[i].enemyY == Player.playerY - 1 && Monster.enemies[i].enemyX == Player.playerX) {
            Monster.WasHit(i);
          }
        }
      }
    }
    //Right
    if(e.keyCode == "39") {
      if (Dungeon.map[Player.playerX + 1][Player.playerY] == 1 ||
          Dungeon.map[Player.playerX + 1][Player.playerY] == 4 ||
          Dungeon.map[Player.playerX + 1][Player.playerY] == 5) {
            Player.nextTile = Dungeon.map[Player.playerX + 1][Player.playerY]
            Player.playerX += 1;
      }
      else if (Dungeon.map[Player.playerX + 1][Player.playerY] == 3) {
        for (var i = 0; i < Monster.enemies.length; i++) {
          if (Monster.enemies[i].enemyX == Player.playerX + 1 && Monster.enemies[i].enemyY == Player.playerY) {
            Monster.WasHit(i);
          }
        }
      }
    }
    //Down
    if(e.keyCode == "40") {
      if (Dungeon.map[Player.playerX][Player.playerY + 1] == 1 ||
          Dungeon.map[Player.playerX][Player.playerY + 1] == 4 ||
          Dungeon.map[Player.playerX][Player.playerY + 1] == 5) {
            Player.nextTile = Dungeon.map[Player.playerX][Player.playerY + 1]
            Player.playerY += 1;
      }
      else if (Dungeon.map[Player.playerX][Player.playerY + 1] == 3) {
        for (var i = 0; i < Monster.enemies.length; i++) {
          if (Monster.enemies[i].enemyY == Player.playerY + 1 && Monster.enemies[i].enemyX == Player.playerX) {
            Monster.WasHit(i);
          }
        }
      }
    }
    //F key Pressed (Pick UP)
    if(e.keyCode == "70") {
      if (Dungeon.map[Player.playerX][Player.playerY] == 5) {
        Player.PickUp(Player.playerX, Player.playerY);
      }
    }

    //Runs Update (Redraws the Player)
    Renderer.Update();
   
  },
  
  Attack : function(i) {
    Monster.enemies[i].health -= Player.attackDamage;
    Monster.UpdateHealth(i, 150);
  },
  
  UpdatePlayerInfo : function() {
    var minLeft = Dungeon.mapWidth * Renderer.scale + 60;
    var minTop = 30;
    
    //Type up the Variables
    Menu.ctxMenu.font = "20px Arial";
    Menu.ctxMenu.fillText("Health: " + Player.health,minLeft,minTop);
    Menu.ctxMenu.fillText("Food: " + Player.food,minLeft,minTop+30);
    Menu.ctxMenu.fillText("Level: " + Player.level,minLeft,minTop+60);
    Menu.ctxMenu.fillText("Armor: " + Player.armor,minLeft,minTop+90);
    
  },
  
  UpdateHealth : function() {
    //Get the Menu Coords
    var minLeft = Dungeon.mapWidth * Renderer.scale + 10;
    var minTop = 30;
    
    if (Player.health > 0) {
      Menu.ctxMenu.fillStyle = "ff0000";
      Menu.ctxMenu.fillRect(minLeft, 150, (Player.health / 100) * 140, 25);
    }
  },
  
  PickUp : function(x, y) {
    if (Player.numItems < 10) {
      //Want to Change it to Push whatever the X and Y equals on the treasure
      Player.inventory[Player.numItems] = Item.CreateWeapon();
      
      //TODO: Make the CSS for LI under the UL smaller
      /*var item = document.createElement("LI");
      var desc = document.createTextNode(Player.inventory[Player.inventory.length - 1].name + " " + Player.inventory[Player.inventory.length - 1].desc);
      item.appendChild(desc);
      document.getElementById("inventory").appendChild(item);
      */
      
      Player.numItems++;
      Player.nextTile = 1;
      
      Dungeon.map[x][y] = 1;
      Renderer.ctxDungeon.fillRect(x * Renderer.scale, y * Renderer.scale, Renderer.scale, Renderer.scale);
    } else {
      console.log("Inventory Full.");
    }
  },
  
  EquipWeapon : function(item) {
    //Equip the Weapon
    
    Player.weapon = item;
    //Sets the damage equal to weapon Damage
    Player.attackDamage = Player.weapon.damage;
    
    Player.inventory[10] = item;
  },
  
  UnequipWeapon : function(item) {
    Player.weapon = Item.Fist();
    Player.attackDamage = Player.weapon.damage;
    return item;
  },
  
  //TODO complete both of these functions to be for armor
  Equip : function(item, type) {
    
  },
  
  Unequip : function() {
    
  }
};
