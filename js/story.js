var start = 'cInvestigateNoise';
var debug = false;

var story = {
        'cStart': ['Waking up...', 'Where.. Where am I? You pause a minute. Who am I?, You could [cLookLeft:look left] or [cLookRight:look right]'],
        'cLookLeft' : ['Looking Left...', 'To your left you see a curious black pillar. As you cast your head back you notice that it seems to stretch up into the infinite skyline. You do not see the top. [cLookRight:look right] [cMoveCloser:move closer]'],
        'cMoveCloser' : ['A Closer Look', 'As you move closer to the wall you find yourself excited to see a thin trickle of water pouring out a crack in the massive pillar. At least you won’t get dehydrated. You pause a moment, your stomach grumbling. You need to find food. Soon. [cDrink:drink] [cLookRight:look right].'],
        'cDrink' : ['A Drink', 'You bend down and gather some water in your hands. Drinking deeply you perform this action a few more times before your thirst is fully sated. Back to [cLookRight:looking right].'],
        'cLookRight' : ['Looking Right...', 'Set before you is a scene unllike any that you have come to know before this point. A barren landscape greats your eyes, unbroken only by a few trees growing out of the ragged, scarred ground. In the distance you see an unbreaking view of similair terrain. [cLookLeft:look left] or [cExamineTrees:examine trees].'],
        'cExamineTrees' : ['A Closer Look...', 'As you approach the trees that seemed so far away only a moment ago you notice several things. Firstly the trees vary in almost all aspects. While one tree may reach far above your head and into the sky, another may barely extend out of arm’s reach. Furthermore you notice that each tree bears a unique color scheme and a few even have fruit hanging from their limbs. [cHarvestFruit: harvest fruit] [cContinueRight:continue walking right].'],
        'cHarvestFruit' : ['Some Fruit...', 'You reach out for the lowest hanging branches of a nearby tree and pull yourself up. Quickly you go about gathering a few and throwing them to the base of the tree. You climb down and arrange them in a pile Taking a bite from strange fruit doesn’t seem particularly wise to you but you are very hungry. [cEatRawFruit:take a bite] [cContinueRight:continue walking right].'],
        'cEatRawFruit' : ['Hungry for Fruit...', 'Well, you decide, I cannot do anything here if i’m starved to death. And without further ado you take a bite. Your hunger seems sated for now but you wonder if you will come to regret this decision.[cContinueRight: continue right].', 'eatFruit'],
        'cContinueRight' : ['Further Right...', 'time stretches on as you continue your mission. You come to an abandoned hut in an area covered thickest by the strange trees. [cKnock:knock] [cEnterHut:enter hut].'],
        'cKnock' : ['Knock...', 'You knock. After pausing a moment you hear nothing. [cKnockAgain:knock again] [cEnterHut:enter hut].'],
        'cKnockAgain' : ['Knock, Knock...', 'Knocking again. Louder this time, you hear a muffled sound from behind the shack. [cInvestigateNoise, investigate] [cEnter:enterHut] [cContinueFurtherRight:continue further right].'],
        'cEnterHut' : ['Enter', 'Carefully easing open the door you wait a moment to allow your eyest to adjust to the dim lighting of the interior. [cLookAroundHut:look around] [cLeaveHut:leave].', 'buildHut', '1'],
        'cLookAroundHut' : ['A Closer look', 'Shortly after your eyes adjust you begin to notice shapes standing out at you. The hut is quite old you can tell, noticing light streaming in through several cracks in the walls. Before you stands a table, it is bare except for a small knife, stuck deep into the center. The ground is littered with old bits of paper and leaves in some spots. Clearly whoever was living here did not care much for cleaning. [cTakeItemKnife:take knife] or [cExamineFloorHut: examine the ground] [cLeaveHut: leave the hut].'],
        'cTakeItemKnife' : ['A Knife', 'You run your hand along the handle once before firmly grasping it and pulling it out of the table. It does not come easy, but you are victorious. You examine the knife and see that it is worn old with age. Upon peering closely you find that you can make out faint runes along the blade. [cExamineFloorHut: examine the ground] [cLeaveHut: leave the hut].', 'takeItem', 'knife'],
        'cExamineFloorHut' : ['A Mess', 'You bend down to look closer at the papers and other general garbage covering the floor and are suprised to see a glint under mounds of dust. Pulling the item free you are excited to find an old pickaxe. [cTakeItemPickaxe: take pickaxe] or [clLeaveHut: leave]'],
        'cTakeItemPickaxe' : ['A Pickaxe', 'Lifting up the worn pickaxe you notice that is much heavier than you thought at first. It must have been a great and powerful man that wielded this mighty tool you think to yourself. Looking around one last time, you assure yourself that there is nothing left to find in this sad old dwelling. [cLeaveHut:leave]'],
        'cLeaveHut' : ['Turning back', 'As you turn to leave the hut you hear a faint noise coming from behind the hut. [cInvestigateNoise:investigate] or [cContinueFurtherRight:continue further right].'],
        'cInvestigateNoise' : ['Further Investigation', 'On your gaurd now, you check behind the hut. You don\'t know what to expect but surely not this. Before you stands an old man wizened beyond reckoning. The strange part is that he seems to be almost translucent in the morning light. He beckons you over. [cMeetOldMan: walk over] or [cContinueFurtherRight: continue walkin right]'],
        'cMeetOldMan' : ['An Old Friend', 'He gesters at you.', 'enterDungeon', '1']
        
};

//Format the text so that anything in brackets in the correct format is replaced with links to the next section of story
function format(text) {
	text = text.replace(/\n/g, '<br />').replace(/\[(.*?):(.*?)\]/g, '<a href="#" ' + (debug ? 'title="$1" ' : '') + 'onclick="return navigate(\'$1\');">$2</a>').replace(/\|DEAD$/, '<br /><br /><a href="#" class="dead" onclick="return navigate(start);">Click here to start over and try again!</a>').replace(/\|END$/, '<br /><br /><i>Unfortunately you\'ve reached one of the current ends of this story.</i><br /><br /><a href="#" class="end" onclick="return navigate(start);">Click here to start over and try again!</a>');
	return text;
}

//Navigate to the correct story element based on the link
function navigate(location) {
	var local = document.getElementById('location');
	var text = document.getElementById('text');
	
	local.innerHTML = story[location][0];
	text.innerHTML = format(story[location][1]);
	
	if (story[location][2] != null) {
	  var stringRun = story[location][2];
    var windowedString = window[stringRun];
    if (story[location][3] != null) {
        var nParams = [];
        nParams.push(story[location][3])
        windowedString.apply(null, nParams);
    } else {
        if (typeof windowedString === "function") {
          windowedString();
        }
    }
	}
}

//Start the story
navigate(start);

function eatFruit() {
  alert("I ATE THE FRUIT");
}

function buildHut(value) {
  if (value == 1) {
    startHut();
  }
  else if (value == 2) {
    houseHut();
  }
}

function enterDungeon(numRoom) {
  Renderer.Initialize();
  Level.IncreaseLevel();
}