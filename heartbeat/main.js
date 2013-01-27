//things to change: canvas name

var glove_leftimg;
var glove_rightimg;
var spotlightimg;
var healthmeterimg;

var enemyheartlogoimg;
var enemyhealthmeterimg;

var heartmanimg; 
var heartman_hurtimg;
var heartman_deadimg;


function HeartMan(){
	this.health = 100;
	this.hurt = false;
	this.maxhealth = 100;
}

var worldOffset = 0;

var model = {
	playerX : 0,
	mouseX: 0,
	mouseY: 0,
	canvas: 0,
	ctx: 0,
	gloves: { left:null,right:null, defaultspacing:200, breathingspacing:10, defaultSize: 150},
	time: 0,
	worldOffset:0,
	punchingLeft : false,
	punchingRight: false,
	heartman : null,
	punchdamage:5
};


//xpos is an offset from center of world.
function Glove(xpos,ypos){
	this.xpos = xpos;
	this.ypos = ypos;
	this.width = model.gloves.defaultSize;
	this.height = model.gloves.defaultSize;
}

// disable right click menu
(function () {
	  var blockContextMenu, myElement;

	    blockContextMenu = function (evt) {
			    evt.preventDefault();
				  };

	window.addEventListener('contextmenu', blockContextMenu);
})();

function update(){
	model.time+=.1;
	model.worldOffset = (model.canvas.width/2 - model.mouseX)/10;
	model.gloves.spacing = model.gloves.defaultspacing + Math.sin(model.time) * model.gloves.breathingspacing
	if(!model.punchingLeft){
	model.gloves.left.xpos  =  model.mouseX - model.gloves.spacing
	}
	if(!model.punchingRight){
	model.gloves.right.xpos =  model.mouseX + model.gloves.spacing
	}

	draw(model.ctx);
}

function draw(ctx){
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,model.canvas.width,model.canvas.height)

	
	ctx.drawImage(spotlightimg,model.worldOffset,0);

	if(model.heartman.health<=0){
	ctx.drawImage(heartman_deadimg,270 + model.worldOffset ,40)
	}
	else{
	if(!model.heartman.hurt){
	ctx.drawImage(heartmanimg,270 + model.worldOffset ,40)
	}
	else{
	ctx.drawImage(heartman_hurtimg, 270 + model.worldOffset, 40)
	}
	}



	var l = model.gloves.left;
	ctx.drawImage(glove_leftimg, l.xpos - l.width/2,l.ypos,l.width,l.height)

	var r = model.gloves.right;
	ctx.drawImage(glove_rightimg, r.xpos - r.width/2,r.ypos,r.width,r.height)

	ctx.drawImage(enemyhealthmeterimg,150,25);

	//HEALTH BAR
	ctx.fillStyle = 'rgba(255,0,0,.8)';
	ctx.fillRect(180,55,model.heartman.health/model.heartman.maxhealth * 550,35);
	
	ctx.drawImage(enemyheartlogoimg, 120,10,150,100);


}

var resting = function(){
	model.punchingRight = false;
	model.punchingLeft = false;
	model.heartman.hurt = false;
}

var resetFist = function(){
	model.heartman.hurt = true;
	model.heartman.health -= model.punchdamage;
	TweenLite.to(model.gloves.left, .1, {width:model.gloves.defaultSize,height:model.gloves.defaultSize, xpos: model.mouseX - model.gloves.spacing, onComplete : resting});
	TweenLite.to(model.gloves.right, .1, {width:model.gloves.defaultSize,height:model.gloves.defaultSize, xpos : model.mouseX + model.gloves.spacing});
}

//65 - left
//68 - right

function punch_left(){
	TweenLite.to(model.gloves.left, .15, {width:75,height:75, xpos:model.canvas.width/2,  onComplete: resetFist});
	model.punchingLeft = true;
}

function punch_right(){
	TweenLite.to(model.gloves.right, .15, {width:75,height:75, xpos:model.canvas.width/2, onComplete : resetFist});
	model.punchingRight = true;
}

function key_down(e){
	var target
	console.log(e.keyCode);
	if(!model.punchingLeft){
	if(e.keyCode == 65){
		punch_left();
	}}
	if(!model.punchingRight){
	if(e.keyCode == 68){
		punch_right();
	}}
}

function mouse_move(e){
	model.mouseX = e.clientX - model.canvas.offsetLeft;
	model.mouseY = e.clientY - model.canvas.offsetTop;
	
}

function mouse_down(e){
	switch (e.which) {
        case 1:
			punch_left();
            break;
        case 2:
            break;
        case 3:
			punch_right();
            //alert('Right mouse button pressed');
            break;
        default:
            //alert('You have a strange mouse');
    }
}

function init(){
	setInterval(update,10);
	glove_leftimg = new Image();
	glove_leftimg.src = "glove_left.png"

	glove_rightimg = new Image();
	glove_rightimg.src = "glove_right.png"

	spotlightimg = new Image();
	spotlightimg.src = "spotlight.png";


	heartmanimg = new Image();
	heartmanimg.src = "heartman.png"

	enemyheartlogoimg = new Image();
	enemyheartlogoimg.src = "enemyheartlogo.png";

	enemyhealthmeterimg = new Image();
	enemyhealthmeterimg.src = "enemymeterbackground.png"

	heartman_hurtimg = new Image();
	heartman_hurtimg.src = "heartman_hurt.png";

	heartman_deadimg = new Image();
	heartman_deadimg.src = "heartman_dead.png";



	document.addEventListener("mousemove", mouse_move);
	document.addEventListener("mousedown", mouse_down);
	document.addEventListener("keydown",key_down);
	model.canvas = document.getElementById("canv");
	model.ctx = model.canvas.getContext("2d");

	var left = new Glove(-40,400);
	var right = new Glove(40,400);
	model.gloves.left = left;
	model.gloves.right = right;
	model.heartman = new HeartMan();
}
