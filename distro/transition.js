
/*
TweenLite.to(element, 1, {width:"50%", onComplete:myFunction, onCompleteParams:["param1", "param2"], onCompleteScope:this});
function myFunction(p1, p2) {
    console.log("tween completed. Received parameters: " + p1 + " and " + p2 + ". The scope is: " + this);
}
*/

function Transition(){
this.alpha = 0;
this.state = "resting";

function fadedIn(){
	console.log(this.scope)
}

this.fadeIn = function(){
	TweenLite.to(this,1,{alpha:1.0,onComplete:fadedIn, onCompleteScope: this});
}

this.draw = function(){
	ctx.fillStyle = "rgba(255,255,255," + this.alpha+")";
	ctx.fillRect(0,0,canvas.width,canvas.height);
}

this.update = function(){
	this.draw();
}

}