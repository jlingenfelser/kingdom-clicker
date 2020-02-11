var Level = {
  level : 1,
  numMonsters : 0,
  type : "dungeon",
  
  PlaceExit : function() {
    var goodSpot = false;
    while (goodSpot === false) {
      var x = getRandomInt(2, Dungeon.mapWidth - 2);
      var y = getRandomInt(2, Dungeon.mapHeight - 2);
      
      if (Dungeon.map[x][y] == 1) {
        Dungeon.map[x][y] = 4;
        goodSpot = true;
      }
    }
    
    Renderer.ctxDungeon.fillStyle = "blue";
    Renderer.ctxDungeon.fillRect(x * Renderer.scale, y * Renderer.scale, Renderer.scale, Renderer.scale);
  },
  
  SpawnMonsters : function(l) {
    for (var i = 0; i < l; i++) {
        Monster.Create();
    }
  },

  IncreaseLevel : function(){
    
    //Clear the Canvas if we are Past the First Level
    if (Level.level > 1) {
      Renderer.ctxDungeon.clearRect(0, 0, Dungeon.mapWidth, Dungeon.mapHeight);
    }
    
    //Generate + Initialize + Render the new map
    Dungeon.Generate();
    Renderer.Render(Dungeon.map);
    
    //Place the Exit
    Level.PlaceExit();
    
    //Place a Treasure
    if (getRandomInt(1, 2) === 1) {
      Item.PlaceTreasure();
    }
    
    //Clear out any Undefeated Old Monsters
    Monster.Clear();
    //Spawn Monsters according to the Level
    Level.SpawnMonsters(this.level);
    //Place the Player
    Player.Place();
    //Draw the Monsters
    Renderer.Update();
    
    //Set Next Level Value
    this.level++;
  }
  
}