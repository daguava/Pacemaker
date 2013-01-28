
/////////////////////////////////////////////////////////////////////////////////GODDAMN AWESOME AS SHIT BUTTONS (not really)
function Button(x_pos, y_pos, b_width, b_height, b_text, b_ctx, b_hasBg,textColor) {
	this.x = x_pos;
	this.y = y_pos;
	this.width = b_width;
	this.height = b_height;
	this.text = b_text;
	this.ctx = b_ctx;
	this.trueFill = textColor;
	this.trueStroke = textColor;
	this.currentFill = textColor;
	this.currentStroke = textColor;

	this.bgColor = "rgba(255,255,255,.5)";
	this.bgColor_Hovered = "rgba(0,0,0,.5)";

	this.b_hasBg = b_hasBg;
	this.alpha = 100;
	this.hovered = false;

	this.draw = function(){
		if (!this.isTrans) { // Used to make actual buttons invisible because text is an image
		this.ctx.fillStyle = this.currentFill / 10;

		//var textX = this.x ;//+ this.width/2 - textWidth/2;
		
		if(this.b_hasBg){
			if(this.hovered){
		this.ctx.fillStyle = this.bgColor;
		}
		else{
		this.ctx.fillStyle = this.bgColor_Hovered;
	}
    	this.ctx.fillRect(this.x, this.y, this.width, this.height);
    	}
    	//this.ctx.strokeRect(this.x, this.y, this.width, this.height);

    	this.ctx.strokeStyle = this.currentStroke;
    	this.ctx.font = '40px Calibri';
    	this.ctx.fillStyle = this.currentFill;
    	this.ctx.fillText(this.text, this.x + 25, this.y + this.height/2 + 10);
   		}
	}

	this.update = function(){
		//update coloring
		if(this.mouseOvered()){
			this.currentFill = "#0000CC";
			this.currentStroke = "#0000CC";
			this.hovered = true;
		}
		else{
			this.currentFill = this.trueFill;
			this.currentStroke = this.trueStroke;
			this.hovered = false;
		}

		this.draw();
		return this.clicked();
	}

	this.mouseOvered = function(){
		return Controller.mouse_y <= this.y+this.height && Controller.mouse_y >= this.y
		&& Controller.mouse_x <= this.x+this.width && Controller.mouse_x >=this.x;
	}

	this.clicked = function(){
		return Controller.click_mouse_y <= this.y+this.height && Controller.click_mouse_y >= this.y
		&& Controller.click_mouse_x <= this.x+this.width && Controller.click_mouse_x >=this.x;
	}
}

