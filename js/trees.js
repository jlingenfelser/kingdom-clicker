//Create the Tree Object. The tree is drawn by splitting branches at a random shortening length to a certain depth
var tree = {
    canvas:      '',
    ctx:         '',
    height:      0,
    width:       0,
    spread:      0,
    drawLeaves:  true,
    leavesColor: '',
    leavesType: this.MEDIUM_LEAVES,
       
    MAX_BRANCH_WIDTH:   1,
    SMALL_LEAVES:       10,
    MEDIUM_LEAVES:      200,
    BIG_LEAVES:         500,
    THIN_LEAVES:        900,
    
    //Draws the Tree
    //@ctx : The Canvas Context
    //@X : The X-coordinate
    //@y : The Y-coordinate
    //@spread : The Width between Branches
    //@leaves : Boolean Value on Drawing Leaves or Not
    //@LeafType : Specifies the thick or thinness of leaves as well as length
    draw : function(ctx, x, y, spread, leaves, leafType) {
        //Set the Spread if It is not a realistic length
        if (spread >= 0.3 && spread <= 1) {
            this.spread = spread;
        }    else {
            this.spread = 0.6;
        }
        
        //Decide to Draw Leaves or Not
        if (leaves === true || leaves === false) {
            this.drawLeaves = leaves;
        } else {
            this.leaves = true;
        }
        
        //Set Leaf Type
        if (leafType == this.SMALL_LEAVES ||
            leafType == this.MEDIUM_LEAVES ||
            leafType == this.BIG_LEAVES ||
            leafType == this.THIN_LEAVES) {
                this.leafType = leafType;
            } else {
                this.leafType = this.MEDIUM_LEAVES;
            }
            
            //Set the Location and Variables
            this.ctx = ctx;
            this.height = y;
            this.width = x;
            this.ctx.clearRect(0,0,this.width,this.height);
            //Place Tree at the X;
            this.ctx.translate(x, y+5);
            //Random Leaf Color
            this.leavesColor = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
            //Set thickness
            this.ctx.lineWidth = 0.4 + (0.34 * this.MAX_BRANCH_WIDTH);
            this.ctx.lineJoin = 'round';
            
            //Run Branch Function
            this.branch(0);
    },
    
    //Controls the Branching of the Paths
    branch : function(depth) {
        //If Less than a Certain Level of Convulusion
        if (depth < 8) {
            
            //Draw It
            this.ctx.beginPath();
            this.ctx.moveTo(0,0);
            this.ctx.lineTo(0, -(this.height)/10);
            
            this.ctx.strokeStyle = "#0A0A05";
            this.ctx.stroke();
            
            this.ctx.translate(0, -this.height/10);
            var randomINT = -(Math.random() * 0.1) +0.1;
            
            this.ctx.rotate(randomINT);
            
            //Draw Branches
            if ((Math.random() * 1) < this.spread) {
                //Draw Left Branches
                this.ctx.rotate(-0.35);
                this.ctx.scale(0.7, 0.7);
                this.ctx.save();
                this.branch(depth + 1);
                //Draw Right Branches
                this.ctx.restore();
                this.ctx.rotate(0.6);
                this.ctx.save();
                this.branch(depth + 1);
                this.ctx.restore();
            } else {
                this.branch(depth);
            }
        }
        else {
            //Draw Leaves
            if (this.drawLeaves) {
                var lengthFactor = 30;
                if (this.leafType === this.THIN_LEAVES) {
                    lengthFactor = 10;
                }
                this.ctx.fillStyle = this.leavesColor;
                this.ctx.fillRect(0,0,this.leafType,lengthFactor);
                this.ctx.closePath();
                this.ctx.stroke();
            }
        }
    }
};