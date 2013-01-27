<<<<<<< HEAD

	////////////////////////////////////////////////////////////////////////////////////////// COLLECTABLES CLASS
function Item(x, y) {
	this.x = x;
	this.y = y;
	this.image = new Image();
	this.image.src = "./Images/redbloodcell.gif";
	this.width = blocksize;
	this.height = blocksize;
	this.hidden = false;
}

function Platform(x, y, type) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.image = new Image();
	this.image.src = "./Images/grass_tile.png";
	this.width = blocksize;
	this.height = blocksize;
}

function Player(x_pos, y_pos) {

	this.x = x_pos;
	this.last_x = 0;
	this.y = y_pos;
	this.distance_since_sprite_change = 0;
	this.x_speed = 0;		// speed in which bucky moves in the x direction initially (always 0 to start)
	this.y_speed = 0;		// speed in which bucky moves in the y direction initially (always 0 to start)
	this.state = 0;     	// types of actions, can be set up with constants
	this.x_dir = 0;			// direction (1:right, -1:left, 0:no movement)
	this.y_dir = 0;			// direction (1:up, -1:down, 0:no movement)
	this.speed = 5;			// speed (in pixels per frame)
	this.airtime = 0;		// time bucky has been in the air (used for falling)
	this.image = new Image();
	this.width = 100;		// collision width of bucky (so he overlaps things a bit)
	this.height = 100;		// collision height of bucky (so he overlaps things a bit)
	this.grounded = false;
	this.grounded_last_frame = false;
	this.jump_hold_toggle = false;
	this.dead = false;
	this.walk_switch = false;
	this.rotation  = 0;

	this.update = update;	// when this.update is called, perform the update() function
	this.detect_collision_platform = detect_collision_platform;


	////////////////////////////////////////////////////////////////////////////////////////// Player's update function
	function update(){

		this.last_x = this.x;
		this.y_dir = 0;
		this.x_dir = 0;

		

		// Perform death animation
		if(this.dead && !this.deathAnimToggle){
			this.deathAnimToggle = true
			//this.x_speed = 0;
			//platform_update = 0;
			// death animation
			this.y_speed = 7;
			this.y_dir = -1;
			this.airtime = 0;
		}

		// If below the game, you should be dead
		if(this.y > gameHeight){
			this.dead = true;
		}


		if(!this.dead && !Controller.p){

			// lets the player switch gravities as long as they're on the ground
			if(( (Controller.up && grav_const == 1 ) && this.grounded ) || ((Controller.down && grav_const == -1) && this.grounded)){
			grav_const *= -1;
			}

			// jump toggle used to prevent double jumps
			if(!Controller.space){
				this.jump_hold_toggle = false;
			}
			
			// set x dir
			if(Controller.left){
				this.x_dir = -1;	
			}
			if(Controller.right){
				this.x_dir = 1;
			}

			// if space is pressed, and we're grounded, and the jump toggle is fine, jump
			if(Controller.space && (this.grounded || this.grounded_last_frame) && !this.jump_hold_toggle){
				if(grav_const == 1){
					this.y_dir = -1;
					this.y_speed = 18;
				} else {
					this.y_dir = -1;
					this.y_speed = -18;
				}
				this.rotation = -.5;
				this.jump_hold_toggle = true;	// set jump toggle to disable double jumping
			}

			// if shift is pressed, go SANIC SPEED
			if(Controller.shift){
				this.x_speed = 10;
			} else {
				this.x_speed = 3;
			}

			// if neither left nor right is pressed, set direction and speed to zero to prevent movement
			if(!Controller.left && !Controller.right){
				this.x_dir = 0;
				this.x_speed = 0;
			}

			// This overrides the code for controlling x speed with keys, as the new game autoscales
			// WE CAN REMOVE THE CODE ABOE INCREMENTALLY AS WE WANT TO CLEAN STUFF UP
			
			if(!debug){
				this.x_speed = 10;
				this.x_dir = 1;
			}
			
		
		}
		
		// calc new y speed based on gravity and possible jump
		new_y_speed = -1 * Math.floor(this.y_speed) + Math.pow(this.airtime, 2) * grav_const;

		// set y_dir based on y speed, you can ignore this
		if(new_y_speed > 0){
			this.y_dir = 1;
		} else {
			this.y_dir = -1;
		}

		// set new y position, make sure that
		if ( Math.abs(new_y_speed * fpsControl) > blocksize / 2 - 1){
			this.y += this.y_dir * blocksize / 2 - 1;
		}
		else{
			this.y += new_y_speed * fpsControl;
		}


		// if we've moved too far from the left edge, scroll screen instead of character
		if(this.x >= 350 && this.x_dir == 1){
			// move platforms
			platform_x_movement -= this.x_dir * this.x_speed*fpsControl;
			platform_update = -1 * this.x_dir * this.x_speed*fpsControl;
			update_platforms(platform_update);

			if(this.airtime < 0.2){
				this.distance_since_sprite_change += Math.floor(this.x_speed*fpsControl);
			}

		} else if(this.x<= 200 && this.x_dir == -1){
			// move platforms
			platform_x_movement -= this.x_dir * this.x_speed*fpsControl;
			platform_update = -1 * this.x_dir * this.x_speed*fpsControl;
			update_platforms(platform_update);

			if(this.airtime < 0.2){
				this.distance_since_sprite_change += this.x_speed*fpsControl;
			}

		// if we didn't have to scroll all the platforms, move bucky
		} else {
			platform_update = 0;
			this.x += this.x_dir * this.x_speed*fpsControl;

			if(this.airtime < 0.2){
				this.distance_since_sprite_change += this.x_speed*fpsControl;
			}
		}

		// if you fall quite a bit off the screen, stop infinite falling to prevent integer wrap around
		if(this.y>gameHeight-this.height + 500){
			this.y=gameHeight-this.height + 500;
		}

		// if you haven't collided increase counter that tracks "air time" by arbitrary .24 amount
		if(!this.grounded){
			console.log(this.grounded)
		
			this.airtime += 0.24*fpsControl;
			if(this.airtime > 1.5){
					this.rotation+=.1
			}
		} 
		else{
			this.rotation = 0;
		}

		// after position has been updated, detect platform collision issues and resolve them
		if(!this.dead){
			this.detect_collision_platform();
		}
		

		// loop through each collectable item. If the dist between it and character is small, collect it
		for(var i = 0; i<collectable.length; i++){
			if(distanceBetween(this, collectable[i]) < this.height/2){
				collectable[i].hidden = true;
				collectable_count++;
				collectable.splice(i, 1);
			}
		}

			/////////////////////////////////////////////////////////////////////////// DETERMINE IF TO TOGGLE SPRITE (FOR WALKING ANIMATION)
		if(this.distance_since_sprite_change >= 20){
			this.walk_switch = !this.walk_switch;
			this.distance_since_sprite_change = 0;
		}


		// change to facing right image if moving right, or not moving
		if(this.x_dir == 1 || this.x_dir == 0){
			if(this.walk_switch && this.airtime < 0.5){
				this.rotation = 0;
				this.image = char_right_second;
			} else if (this.airtime < 0.5){
				this.image = char_right;
				this.rotation = 0;
			} else {
				this.image = char_right_jump;
			}
		} else {
			// change to facing left image if moving left
			if(this.walk_switch && this.airtime < 0.5){
				this.image = char_left_second;
				this.rotation = 0;
			} else if(this.airtime < 0.5) {
				this.rotation = 0;
				this.image = char_left;
			} else {
				this.image = char_left_jump;
			}
		}
	}

		////////////////////////////////////////////////////////////////////////////////////////// COLLISION WITH PLATFORMS
	function detect_collision_platform(){
		this.grounded_last_frame = this.grounded;
		this.grounded = false;

		var centerPlayerX = 0;
		var centerPlayerY = 0;
		var centerRectX = 0;
		var centerRectY = 0;
		var distanceX = 0;
		var distanceY = 0;
		var minDistanceX = 0;
		var minDistanceY = 0;
		var depthX = 0;
		var depthY = 0;

		for(var i = 0; i<platforms.length; i++){

			centerPlayerX = this.x + this.width/2 + 6;
			centerPlayerY = this.y + this.height/2;
			centerRectX = platforms[i].x + platforms[i].width/2;
			centerRectY = platforms[i].y + platforms[i].height/2;

			distanceX = centerPlayerX - centerRectX;
			distanceY = centerPlayerY - centerRectY;
			minDistanceX = this.width/2 + platforms[i].width/2;
			minDistanceY = this.height/2 + platforms[i].height/2;

			if(Math.abs(distanceX) >= minDistanceX || Math.abs(distanceY) >= minDistanceY){
				depthX = 0;
				depthY = 0;
			} else {
				depthX = distanceX > 0 ? minDistanceX - distanceX : -minDistanceX - distanceX;
				depthY = distanceY > 0 ? minDistanceY - distanceY : -minDistanceY - distanceY;
			}

			if(Math.abs(depthY) < Math.abs(depthX)){ // resolve y first if true
				this.y += depthY;
				if(depthY<0){
					this.airtime = 0;
					this.y_speed = 0;
					this.grounded = true;
				} else {
					if(grav_const == 1){
						this.airtime = 4.5;
					} else {
						this.airtime = 0;
						this.y_speed = 0;
						this.grounded = true;
					}
				}
			} else { // resolve x first if the first statement was false
				this.x += depthX;
				this.x_speed = 0;
			}
		}
	}
}
=======
	////////////////////////////////////////////////////////////////////////////////////////// COLLECTABLES CLASS
function Item(x, y) {
	this.x = x;
	this.y = y;
	this.image = new Image();
	this.image.src = "./Images/redbloodcell.gif";
	this.width = blocksize;
	this.height = blocksize;
	this.hidden = false;
}

function Platform(x, y, type) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.image = new Image();
	this.image.src = "./Images/grass_tile.png";
	this.width = blocksize;
	this.height = blocksize;
}

function Player(x_pos, y_pos) {

	this.x = x_pos;
	this.last_x = 0;
	this.y = y_pos;
	this.distance_since_sprite_change = 0;
	this.x_speed = 0;		// speed in which bucky moves in the x direction initially (always 0 to start)
	this.y_speed = 0;		// speed in which bucky moves in the y direction initially (always 0 to start)
	this.state = 0;     	// types of actions, can be set up with constants
	this.x_dir = 0;			// direction (1:right, -1:left, 0:no movement)
	this.y_dir = 0;			// direction (1:up, -1:down, 0:no movement)
	this.speed = 5;			// speed (in pixels per frame)
	this.airtime = 0;		// time bucky has been in the air (used for falling)
	this.image = new Image();
	this.width = 100;		// collision width of bucky (so he overlaps things a bit)
	this.height = 100;		// collision height of bucky (so he overlaps things a bit)
	this.grounded = false;
	this.grounded_last_frame = false;
	this.jump_hold_toggle = false;
	this.dead = false;
	this.walk_switch = false;
	this.rotation  = 0;

	this.update = update;	// when this.update is called, perform the update() function
	this.detect_collision_platform = detect_collision_platform;


	////////////////////////////////////////////////////////////////////////////////////////// Player's update function
	function update(){

		this.last_x = this.x;
		this.y_dir = 0;
		this.x_dir = 0;

		

		// Perform death animation
		if(this.dead && !this.deathAnimToggle){
			this.deathAnimToggle = true
			//this.x_speed = 0;
			//platform_update = 0;
			// death animation
			this.y_speed = 7;
			this.y_dir = -1;
			this.airtime = 0;
		}

		// If below the game, you should be dead
		if(this.y > gameHeight){
			this.dead = true;
		}


		if(!this.dead && !Controller.p){

			// lets the player switch gravities as long as they're on the ground
			if(( (Controller.up && grav_const == 1 ) && this.grounded ) || ((Controller.down && grav_const == -1) && this.grounded)){
			grav_const *= -1;
			}

			// jump toggle used to prevent double jumps
			if(!Controller.space){
				this.jump_hold_toggle = false;
			}
			
			// set x dir
			if(Controller.left){
				this.x_dir = -1;	
			}
			if(Controller.right){
				this.x_dir = 1;
			}

			// if space is pressed, and we're grounded, and the jump toggle is fine, jump
			if(Controller.space && (this.grounded || this.grounded_last_frame) && !this.jump_hold_toggle){
				if(grav_const == 1){
					this.y_dir = -1;
					this.y_speed = 18;
				} else {
					this.y_dir = -1;
					this.y_speed = -18;
				}
				this.rotation = -.5;
				this.jump_hold_toggle = true;	// set jump toggle to disable double jumping
			}

			// if shift is pressed, go SANIC SPEED
			if(Controller.shift){
				this.x_speed = 10;
			} else {
				this.x_speed = 3;
			}

			// if neither left nor right is pressed, set direction and speed to zero to prevent movement
			if(!Controller.left && !Controller.right){
				this.x_dir = 0;
				this.x_speed = 0;
			}

			// This overrides the code for controlling x speed with keys, as the new game autoscales
			// WE CAN REMOVE THE CODE ABOE INCREMENTALLY AS WE WANT TO CLEAN STUFF UP
			
			if(!debug){
				this.x_speed = 10;
				this.x_dir = 1;
			}
			
		
		}
		
		// calc new y speed based on gravity and possible jump
		new_y_speed = -1 * Math.floor(this.y_speed) + Math.pow(this.airtime, 2) * grav_const;

		// set y_dir based on y speed, you can ignore this
		if(new_y_speed > 0){
			this.y_dir = 1;
		} else {
			this.y_dir = -1;
		}

		// set new y position, make sure that
		if ( Math.abs(new_y_speed * fpsControl) > blocksize / 2 - 1){
			this.y += this.y_dir * blocksize / 2 - 1;
		}
		else{
			this.y += new_y_speed * fpsControl;
		}


		// if we've moved too far from the left edge, scroll screen instead of character
		if(this.x >= 350 && this.x_dir == 1){
			// move platforms
			platform_x_movement -= this.x_dir * this.x_speed*fpsControl;
			platform_update = -1 * this.x_dir * this.x_speed*fpsControl;
			update_platforms(platform_update);

			if(this.airtime < 0.2){
				this.distance_since_sprite_change += Math.floor(this.x_speed*fpsControl);
			}

		} else if(this.x<= 200 && this.x_dir == -1){
			// move platforms
			platform_x_movement -= this.x_dir * this.x_speed*fpsControl;
			platform_update = -1 * this.x_dir * this.x_speed*fpsControl;
			update_platforms(platform_update);

			if(this.airtime < 0.2){
				this.distance_since_sprite_change += this.x_speed*fpsControl;
			}

		// if we didn't have to scroll all the platforms, move bucky
		} else {
			platform_update = 0;
			this.x += this.x_dir * this.x_speed*fpsControl;

			if(this.airtime < 0.2){
				this.distance_since_sprite_change += this.x_speed*fpsControl;
			}
		}

		// if you fall quite a bit off the screen, stop infinite falling to prevent integer wrap around
		if(this.y>gameHeight-this.height + 500){
			this.y=gameHeight-this.height + 500;
		}

		// if you haven't collided increase counter that tracks "air time" by arbitrary .24 amount
		if(!this.grounded){
			console.log(this.grounded)
		
			this.airtime += 0.24*fpsControl;
			if(this.airtime > 1.1){
					this.rotation+=.1
			}
		} 
		else{
			this.rotation = 0;
		}

		// after position has been updated, detect platform collision issues and resolve them
		if(!this.dead){
			this.detect_collision_platform();
		}
		

		// loop through each collectable item. If the dist between it and character is small, collect it
		for(var i = 0; i<collectable.length; i++){
			if(distanceBetween(this, collectable[i]) < this.height/2){
				collectable[i].hidden = true;
				collectable_count++;
				collectable.splice(i, 1);
			}
		}

			/////////////////////////////////////////////////////////////////////////// DETERMINE IF TO TOGGLE SPRITE (FOR WALKING ANIMATION)
		if(this.distance_since_sprite_change >= 20){
			this.walk_switch = !this.walk_switch;
			this.distance_since_sprite_change = 0;
		}


		// change to facing right image if moving right, or not moving
		if(this.x_dir == 1 || this.x_dir == 0){
			if(this.walk_switch && this.airtime < 0.5){
				this.rotation = 0;
				this.image = char_right_second;
			} else if (this.airtime < 0.5){
				this.image = char_right;
				this.rotation = 0;
			} else {
				this.image = char_right_jump;
			}
		} else {
			// change to facing left image if moving left
			if(this.walk_switch && this.airtime < 0.5){
				this.image = char_left_second;
				this.rotation = 0;
			} else if(this.airtime < 0.5) {
				this.rotation = 0;
				this.image = char_left;
			} else {
				this.image = char_left_jump;
			}
		}
	}

		////////////////////////////////////////////////////////////////////////////////////////// COLLISION WITH PLATFORMS
	function detect_collision_platform(){
		this.grounded_last_frame = this.grounded;
		this.grounded = false;

		var centerPlayerX = 0;
		var centerPlayerY = 0;
		var centerRectX = 0;
		var centerRectY = 0;
		var distanceX = 0;
		var distanceY = 0;
		var minDistanceX = 0;
		var minDistanceY = 0;
		var depthX = 0;
		var depthY = 0;

		for(var i = 0; i<platforms.length; i++){

			centerPlayerX = this.x + this.width/2 + 6;
			centerPlayerY = this.y + this.height/2;
			centerRectX = platforms[i].x + platforms[i].width/2;
			centerRectY = platforms[i].y + platforms[i].height/2;

			distanceX = centerPlayerX - centerRectX;
			distanceY = centerPlayerY - centerRectY;
			minDistanceX = this.width/2 + platforms[i].width/2;
			minDistanceY = this.height/2 + platforms[i].height/2;

			if(Math.abs(distanceX) >= minDistanceX || Math.abs(distanceY) >= minDistanceY){
				depthX = 0;
				depthY = 0;
			} else {
				depthX = distanceX > 0 ? minDistanceX - distanceX : -minDistanceX - distanceX;
				depthY = distanceY > 0 ? minDistanceY - distanceY : -minDistanceY - distanceY;
			}

			if(Math.abs(depthY) < Math.abs(depthX)){ // resolve y first if true
				this.y += depthY;
				if(depthY<0){
					this.airtime = 0;
					this.y_speed = 0;
					this.grounded = true;
				} else {
					if(grav_const == 1){
						this.airtime = 4.5;
					} else {
						this.airtime = 0;
						this.y_speed = 0;
						this.grounded = true;
					}
				}
			} else { // resolve x first if the first statement was false
				this.x += depthX;
				this.x_speed = 0;
			}
		}
	}
}
>>>>>>> parent of ae23f3d... fixed jitter with images switching, due to bad jumping status detection.
