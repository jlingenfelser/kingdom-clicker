var Item = {
  items : [],
  
  Fist : function() {
    var fist = {
      name : "Fists",
        desc : "Your bare hands.",
        type : "strike",
        color : "black",
        damage : function() {this.damage = 2 + 0; return this;},
      }.damage();
      
      return fist;
  },
  
  CreateWeapon : function() {
    //First Tier Weapon found on Levels 1-10
    var tierOne = {
      stoneSword : {
        name : function() {
          this.name = this.modifier[0] + "Stone Sword"; return this;
        },
        desc : function() {this.desc = "A sword made of stone. It is chipped and flaked in places." + this.modifier[2]; return this;
        },
        type : "strike",
        color : "green",
        modifier : this.Modify(),
        damage : function() {this.damage = 2 + this.modifier[1]; return this;},
      }.name().desc().damage(),
      stoneKnife : {
        name : function() {
          this.name = this.modifier[0] + "Stone Knife"; return this;
        },
        desc : function() {this.desc = "A curiously sharp knife carved completely out of stone. It feels heavy in your hand." + this.modifier[2]; return this;
        },
        type : "strike",
        color : "green",
        modifier : this.Modify(),
        damage : function() {this.damage = 1.5 + this.modifier[1]; return this;},
      }.name().desc().damage(),
      fishingKnife : {
        name : function() {
          this.name = this.modifier[0] + "Fishing Knife"; return this;
        },
        desc : function() {this.desc = "Originally used for scaling fish. It has clearly been repurposed." + this.modifier[2]; return this;
        },
        type : "strike",
        color : "green",
        modifier : this.Modify(),
        damage : function() {this.damage = 1 + this.modifier[1]; return this;},
      }.name().desc().damage(),
      key: function(n) {
          return this[Object.keys(this)[n]];
      }
    };
    
    //console.log(tierOne.key(getRandomInt(0, Object.keys(tierOne).length - 1)).name);
    var number = getRandomInt(0, Object.keys(tierOne).length - 2);
    var item = tierOne.key(number);
    return item;
  },
  
  Modify : function() {
    //Modify the Item to Make It Better
    var tierOne = {
      worn : {
        id : "Worn ",
        modifier : -1,
        desc : " It is worn beyond repair."
      },
      
      ancient : {
        id : "Ancient ",
        modifier : 2,
        desc : " It appears to have passed through many hands. A strange power radiates from it."
      },
      
      clumsy : {
        id : "Clumsy ",
        modifier : -1,
        desc : " Its weighting feels... Off."
      },
        
      common : {
        id : "Common ",
        modifier : 0,
        desc : " Hmmm.. Made in China %C2%AE"
      },
        
      controversial : {
        id : "Controversial ",
        modifier : -1,
        desc : " Wait, what did it just say?"
      },
      
      crude : {
        id : "Crude ",
        modifier : -1,
        desc : " It appears to have been crafted early in someones career"
      },
      
      key: function(n) {
        return this[Object.keys(this)[n]];
      }
    };
    
    var number = getRandomInt(0, Object.keys(tierOne).length - 2);
    var name = tierOne.key(number).id;
    var modifier = tierOne.key(number).modifier;
    var desc = tierOne.key(number).desc;
    return [name, modifier, desc];
  },
  
  Place : function(x, y) {
    Dungeon.map[x][y] = 5;
    Renderer.Fill('gold', x * Renderer.scale, y * Renderer.scale, Renderer.scale, Renderer.scale);
  },
  
  List : function() {
    for (var i = 0; i < this.items.length; i++) {
      console.log(this.items[i]);
    }
  },
  
  PlaceTreasure : function() {
    var XY = Renderer.FindSpot();
    var x = XY[0];
    var y = XY[1];
    
    Dungeon.map[x][y] = 5;
    Renderer.Fill('gold', x * Renderer.scale, y * Renderer.scale, Renderer.scale, Renderer.scale);
  }
};