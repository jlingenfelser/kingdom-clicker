var Monster = {
  enemies : [],
  nextTile : 1,
  
  Create : function() {
    //Finds a Good spot to place the Monsters in (If Nothings is there It is good)
    //TODO: More complex grouping (Maybe more around the Stairs / Items / ETC)
    var XY = Renderer.FindSpot();
    
    //Create the Enemy Unit
    var enemy = {};
    enemy.type = "RED";
    enemy.color = "#990000";
    enemy.hitColor = "#ff3333";
    enemy.wasHit = false;
    enemy.enemyX = XY[0];
    enemy.enemyY = XY[1];
    enemy.width = 15;
    enemy.height = 15;
    enemy.dropChance = getRandomInt(3, 10);
    enemy.maxHealth = getRandomInt(2, 5);
    enemy.health = enemy.maxHealth;
    enemy.level = 1;
    enemy.attackDamage = getRandomInt(1, 3);
    enemy.armor = 1;
    enemy.sightRange = getRandomInt(2, 5);
    enemy.weapon = null;
        
    //Push Details about the Enemy onto the Array of Enemies
    this.enemies.push(enemy);
  },
  
  Draw : function() {
    //Go through the List of Enemies and Draw them Onto the Screen
    for (var i = 0; i < this.enemies.length; i++) {
      //Set the Current Location of the Monster to Be A 3 and Draws them
      Dungeon.map[this.enemies[i].enemyX][this.enemies[i].enemyY] = 3;
      Renderer.Fill(this.enemies[i].color, this.enemies[i].enemyX * Renderer.scale, this.enemies[i].enemyY * Renderer.scale, this.enemies[i].width, this.enemies[i].height);
      
      if (this.enemies[i].wasHit === true){
        var color = this.enemies[i].color;
        var thisX = this.enemies[i].enemyX * Renderer.scale;
        var thisY = this.enemies[i].enemyY * Renderer.scale;
        var thisW = this.enemies[i].width;
        var thisH = this.enemies[i].height;
        
        Renderer.Fill(this.enemies[i].hitColor, this.enemies[i].enemyX * Renderer.scale, this.enemies[i].enemyY * Renderer.scale, this.enemies[i].width, this.enemies[i].height);
        
        setTimeout(function(){
          Renderer.Fill(color, thisX, thisY, thisW, thisH);
        }, 100);
        
        this.enemies[i].wasHit = false;
      }
    }
  },
  
  Update : function() {
    //TODO: Make the enemies return position
    //Cycle through all of the Enemies
    for (var i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].health <= 0) {
        var tile = 1;
          if(getRandomInt(1, this.enemies[i].dropChance) === 1) {
            var tile = 5;
          }
        
        Renderer.Color(tile, this.enemies[i].enemyX * Renderer.scale, this.enemies[i].enemyY * Renderer.scale, this.enemies[i].width, this.enemies[i].height);
        this.enemies.splice(i, 1);
      }
      else {
        //Get the X and Y Coords of Enemy Currently
        var realX = this.enemies[i].enemyX;
        var realY = this.enemies[i].enemyY;
        
        //Get the Value of the Tile Player is Standing On (Before he moved to it)
        Renderer.Color(Monster.nextTile, realX * Renderer.scale, realY * Renderer.scale, this.enemies[i].width, this.enemies[i].height);
    
        var seesPlayer = false;
        
        //Go through all X and Y values within the Sight Range around this enemy and see if the player is there
        for (var x = realX - this.enemies[i].sightRange; x < realX + this.enemies[i].sightRange; x++) {
          for (var y = realY - this.enemies[i].sightRange; y < realY + this.enemies[i].sightRange; y++) {
            if (x == Player.playerX || y == Player.playerY) {
              seesPlayer = true;
            }
          }
        }
        
        //If this enemy sees the player then move towards them, otherwise move at random
        if (seesPlayer === true) {
          Monster.MoveAI(i);
        }
        else {
          Monster.MoveRandom(i);
        }
        
        //Change Current Tile to Be An Enemy Tile
        Dungeon.map[this.enemies[i].enemyX][this.enemies[i].enemyY] = 3;
      }
    }
  },
  
  Clear : function() {
    this.enemies = [];
    Renderer.ctxDungeon.clearRect(Dungeon.mapWidth * Renderer.scale + 10, 210, Renderer.width, 330);
  },
  
  MoveRandom : function(i) {
    //Makes the Enemy Location a number 1 - Width or Height
    var realX = this.enemies[i].enemyX;
    var realY = this.enemies[i].enemyY;
    var randomMove = getRandomInt(1, 4);
    
      //Left
      if(randomMove === 1) {
        if (Dungeon.map[realX - 1][realY] == 1) {
          Monster.nextTile = Dungeon.map[realX - 1][realY];
          this.enemies[i].enemyX -= 1;
        }
      }
      //Up
      if(randomMove === 2) {
        if (Dungeon.map[realX][realY - 1] == 1) {
          Monster.nextTile = Dungeon.map[realX][realY - 1];
          this.enemies[i].enemyY -= 1;
        }
      }
      //Right
      if(randomMove === 3) {
        if (Dungeon.map[realX + 1][realY] == 1) {
          Monster.nextTile = Dungeon.map[realX + 1][realY];
          this.enemies[i].enemyX += 1;
        }
      }
      //Down
      if(randomMove === 4) {
        if (Dungeon.map[realX][realY + 1] == 1) {
          Monster.nextTile = Dungeon.map[realX][realY + 1];
          this.enemies[i].enemyY += 1;
        }
      }
  },
  
  //Basic Algorithm that Moves the Monster towards a player
  //First decides to go either Up/down or left/right. Goes Diagonal if Choice == 1 and the Y values
  //are the same or vice versa with the X's. (Can patch this out by making if(choice === 2) into an else if
  //Could also be considered a good way of forcing attacks but will see.
  //TODO: Enemies will still Move on top of each other sometimes
  MoveAI : function(i) {
    //Get the X and Y Coords of the Monster and Player
    var realX = this.enemies[i].enemyX;
    var realY = this.enemies[i].enemyY;
    var playerX = Player.playerX;
    var playerY = Player.playerY;
    //Choose a Direction to move towards the player
    var choice = getRandomInt(1, 2);

    //Move Up or Down Towards Player
    if(choice === 1 || playerX == realX) {
      if (playerY < realY) {
        if (Dungeon.map[realX][realY - 1] == 1) {
          if (Dungeon.map[realX][realY - 1] != 2) {
            Monster.nextTile = Dungeon.map[realX][realY - 1];
            this.enemies[i].enemyY -= 1;
          }
        }
      }
      else if (playerY >= realY) {
        if (Dungeon.map[realX][realY + 1] == 1) {
          if (Dungeon.map[realX][realY + 1] != 2) {
            Monster.nextTile = Dungeon.map[realX][realY + 1];
            this.enemies[i].enemyY += 1;
          }
        }
      }
    }
    //Move Right or Left towards Player
    else if(choice === 2 || playerY == realY) {
      if (playerX > realX) {
        if (Dungeon.map[realX + 1][realY] == 1) {
          if (Dungeon.map[realX + 1][realY] != 2) {
            Monster.nextTile = Dungeon.map[realX + 1][realY];
            this.enemies[i].enemyX += 1;
          }
        }
      }
      else if (playerX <= realX) {
        if (Dungeon.map[realX - 1][realY] == 1) {
          if (Dungeon.map[realX - 1][realY] != 2) {
            Monster.nextTile = Dungeon.map[realX - 1][realY];
            this.enemies[i].enemyX -= 1;
          }
        }
      }
    }
    
    //The Attack Sequence. Basically if the Player moves and Ends their turn next to where a
    //Monster moves the monster will attack in all directions
    //TODO: Make this better
    if (Dungeon.map[realX + 1][realY] == 2 ||
        Dungeon.map[realX + 1][realY - 1] == 2 ||
        Dungeon.map[realX + 1][realY + 1] == 2 ||
        Dungeon.map[realX - 1][realY] == 2 ||
        Dungeon.map[realX - 1][realY - 1] == 2 ||
        Dungeon.map[realX - 1][realY + 1] == 2 ||
        Dungeon.map[realX][realY + 1] == 2 ||
        Dungeon.map[realX][realY - 1] == 2) {
            this.Attack(i);
        }
  },
  
  Attack : function(i) {
    Player.health -= this.enemies[i].attackDamage;
    setTimeout(function(){
      Renderer.Fill(Player.hitColor, Player.playerX * Renderer.scale, Player.playerY * Renderer.scale, Player.width, Player.height);
      setTimeout(function(){
        Renderer.Fill(Player.color, Player.playerX * Renderer.scale, Player.playerY * Renderer.scale, Player.width, Player.height);
    }, 100);}, 100);
  },
  
  WasHit : function(i) {
    //This Function is a Bit Weird: So Since everything is done and calculated after a player Moves it means that any redrawing is
    //Done after the Player attacks. What this means is that if the Player had a similar function to Monster.Attack(i) it would
    //Cause the monster to flash to its new color only to be redrawn mid process by the following Monster.Update() and Monster.Draw()
    //To counter this I made a variable that is set to true when the player hits a monster. Draw() now goes through and finds any
    //Mob that was hit and flashes its colors then.
    var currentHealth = this.enemies[i].health;
    Player.Attack(i);
    if (currentHealth != this.enemies[i].health) {
      this.enemies[i].wasHit = true;
    }
  },
  
  UpdateHealth : function(i, number) {
    var minLeft = Dungeon.mapWidth * Renderer.scale + 10;
    var minTop = 30;
    
    if (Monster.enemies[i].health < 0) {
      Monster.enemies[i].health = 0;
    }
    Renderer.ctxDungeon.clearRect(minLeft, 180 + number, 140, 55);
    Renderer.ctxDungeon.fillStyle = "#ff0000";
    Renderer.ctxDungeon.fillRect(minLeft, 210 + number, (Monster.enemies[i].health / Monster.enemies[i].maxHealth) * 140, 25);
    
    if (Monster.enemies[i].health > 0) {
      Renderer.ctxDungeon.fillStyle = "#fff";
      Renderer.ctxDungeon.fillText(Monster.enemies[i].type, minLeft, 200 + number);
     }
  }
};