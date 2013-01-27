/////////////////////////////////////////////////////////////////////////////////GODDAMN AWESOME AS SHIT BUTTONS (not really)
function Button(x_pos, y_pos, b_width, b_height, b_text, b_ctx, b_isTrans) {
	this.x = x_pos;
	this.y = y_pos;
	this.width = b_width;
	this.height = b_height;
	this.text = b_text;
	this.ctx = b_ctx;
	this.draw = draw;
	this.fill = "#E7D9C1";
	this.stroke = "#000000";
	this.clicked = clicked;
	this.isTrans = b_isTrans;

	function draw(){
		if (!this.isTrans) { // Used to make actual buttons invisible because text is an image
		this.ctx.fillStyle = this.fill;
		this.ctx.strokeStyle = this.stroke;
		this.ctx.lineWidth   = 1;
		this.ctx.font = '20px Calibri';
		//wut
		//wot

		var textWidth = this.ctx.measureText(this.text).width;
		var textHeight = this.ctx.measureText(this.text).height;

		var textX = this.x + this.width/2 - textWidth/2;


    	this.ctx.fillRect(this.x, this.y, this.width, this.height);
    	this.ctx.strokeRect(this.x, this.y, this.width, this.height);

    	this.ctx.fillStyle = this.stroke;
    	this.ctx.fillText(this.text, textX, this.y + this.height/2 + 7);
    };
	}

	function clicked(){
		return Controller.click_mouse_y <= this.y+this.height && Controller.click_mouse_y >= this.y
		&& Controller.click_mouse_x <= this.x+this.width && Controller.click_mouse_x >=this.x;
	}
}

