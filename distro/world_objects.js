var playerData;
var jumping_threshold = 1.2;

function Item(x, y) {
	this.x = x;
	this.y = y;
	this.image = new Image();
	this.width = blocksize;
	this.height = blocksize;
	this.hidden = false;
}

function PunchWall(x, y) {
	this.x = x;
	this.y = y;
	this.image = new Image();
	this.width = blocksize;
	this.height = blocksize;
	this.hidden = false;
	this.broken = false;
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

function LevelData(){
	this.completed = false;
	this.unlocked = true;
	this.best = 0;
	this.max = 10;
}

function PlayerData(){
	this.levels = new Array();

	var lvl1 = new LevelData();
	lvl1.max = 42;

	var lvl2 = new LevelData();


	var lvl3 = new LevelData();
	lvl3.max = 51;

	var lvl4 = new LevelData();

	this.levels.push(lvl1);

	this.levels.push(lvl2);

	this.levels.push(lvl3);

	this.levels.push(lvl4);

}

function Player(x_pos, y_pos) {
	playerData = new PlayerData();
	this.init = function(){
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
	this.hit_height = 100;
	this.hit_width = 80;
	this.grounded = false;
	this.grounded_last_frame = false;
	this.jump_hold_toggle = false;
	this.dead = false;
	this.walk_switch = false;
	this.rotation  = 0;
	this.attacking = false;
	this.x_correct_this_frame = false;
	this.x_correct_count = 0;

	this.update = update;	// when this.update is called, perform the update() function
	this.detect_collision_platform = detect_collision_platform;
	}

	this.init();

	///Player's update function

	function update(){
		if(this.x-platform_x_movement >= EndOfMap){
			levelcomplete = true;
		}

		if(this.x-platform_x_movement >= EndOfMap + 1000){
			this.x =  EndOfMap + 1000 + platform_x_movement;
		}

		this.last_x = this.x;
		this.y_dir = 0;
		this.x_dir = 0;

		// Perform death animation
		if(this.dead && !this.deathAnimToggle){
			this.deathAnimToggle = true
			//this.x_speed = 0;
			//platform_update = 0;
			//death animation
			grav_const = 1;
			this.y_speed = 7;
			this.y_dir = -1;
			this.airtime = 0;
		}

		// If below the game, you should be dead
		if(this.y > gameHeight){
			this.dead = true;
		}

		// if r is pressed, reset
		if(Controller.r){
		soundLevel1.loop().play().mute();
		soundLevel2.loop().play().mute();
		soundLevel3.loop().play().mute();
		soundLevel4.loop().play().mute();
		soundLevelSanic.loop().play().mute();
		PlayerGame.resetGame();
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
			if(Controller.space && (this.grounded || this.grounded_last_frame) && !this.jump_hold_toggle && !this.attacking){
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

			// if grounded and attack button is pressed
			if(Controller.attack && (this.grounded || this.grounded_last_frame) && !attack_occurring){
				this.attacking = true;
				attack_occurring = true;
			}

			if(attack_occurring){
				attack_timer += 3 *  fpsControl;
			}

			if(attack_timer > 60){
				this.attacking = false;
				attack_occurring = false;
				attack_timer = 0;
			}

			// if shift is pressed, go SANIC SPEED
			if(Controller.shift){
				this.x_speed = 10;
			} else {
				this.x_speed = 3;
			}

			if(Controller.space && PlayerGame.state == GAMESTATE_START){
				PlayerGame.state = GAMESTATE_GAMEPLAY;
			}

			// if neither left nor right is pressed, set direction and speed to zero to prevent movement
			if(!Controller.left && !Controller.right){
				this.x_dir = 0;
				this.x_speed = 0;
			}

			// This overrides the code for controlling x speed with keys, as the new game autoscales
			// WE CAN REMOVE THE CODE ABOE INCREMENTALLY AS WE WANT TO CLEAN STUFF UP
			
			if(!debug){
				this.x_speed = 13;
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
		if(this.x >= 250 && this.x_dir == 1 && !levelcomplete){
			// move platforms
			platform_x_movement -= this.x_dir * this.x_speed*fpsControl;
			platform_update = -1 * this.x_dir * this.x_speed*fpsControl;
			update_platforms(platform_update);

			if(this.airtime < 0.2){
				this.distance_since_sprite_change += Math.floor(this.x_speed*fpsControl);
			}

		} else if(this.x<= 200 && this.x_dir == -1 && !levelcomplete){
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
			//console.log(this.grounded)
		
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
			if(distanceBetween(this, collectable[i]) < this.hit_width/2){
				collectable[i].hidden = true;
				collectable_count++;

				collectable.splice(i, 1);
			}
		}

		if(collectable_count == 0){
			soundLevel1.setVolume(20)
		}
		if(collectable_count == 2){
				soundLevel1.setVolume(40)
		}
		if(collectable_count == 4){
				soundLevel1.setVolume(60)
		}
		if(collectable_count == 6){
		soundLevel1.setVolume(80)
		}

		if(collectable_count == 8){ ////// Hard code to 8 because it should matter (FR goes fast enough) and #YOLOSWAG
				soundLevel2.unmute();
				soundLevel2.setVolume(20)
		}
		if(collectable_count == 10){
				soundLevel2.setVolume(40)
		}
		if(collectable_count == 12){
				soundLevel2.setVolume(60)
		}
		if(collectable_count == 14){
		soundLevel2.setVolume(80)
		}

		if(collectable_count == 16){ ////// Hard code to 16 because it should matter (FR goes fast enough) and #YOLOSWAG
				soundLevel3.unmute();
				soundLevel3.setVolume(20)
		}
		if(collectable_count == 18){
				soundLevel3.setVolume(40)
		}
		if(collectable_count == 20){
				soundLevel3.setVolume(60)
		}
		if(collectable_count == 22){
		soundLevel3.setVolume(80)
		}

		if(collectable_count == 24){ ////// Hard code to 24 because it should matter (FR goes fast enough) and #YOLOSWAG
				soundLevel4.unmute();
				soundLevel4.setVolume(20)
		}
		if(collectable_count == 26){
				soundLevel4.setVolume(40)
		}
		if(collectable_count == 28){
				soundLevel4.setVolume(60)
		}
		if(collectable_count == 30){
		soundLevel4.setVolume(80)
		}

		if(collectable_count == 32){ ////// Hard code to 32 because it should matter (FR goes fast enough) and #YOLOSWAG
				soundLevelSanic.unmute();
				soundLevelSanic.setVolume(20)
		}
		if(collectable_count == 34){
				soundLevelSanic.setVolume(40)
		}
		if(collectable_count == 36){
				soundLevelSanic.setVolume(60)
		}
		if(collectable_count == 38){
		soundLevelSanic.setVolume(80)
		}

		for(var i = 0; i<punchwall.length; i++){
			if(distanceBetween(this, punchwall[i]) < this.hit_width/2){
				if(this.attacking){
					punchwall[i].hidden = true;
					punchwall.splice(i, 1);
				} else {
					this.dead = true;
				}
				
			}
		}

		//DETERMINE IF TO TOGGLE SPRITE (FOR WALKING ANIMATION)
		if(this.distance_since_sprite_change >= 20){
			this.walk_switch = !this.walk_switch;
			this.distance_since_sprite_change = 0;
		}

		// change to facing right image if moving right, or not moving
		if(this.x_dir == 1 || this.x_dir == 0){

			if(this.walk_switch && this.airtime < jumping_threshold){
				if(grav_const == 1){
					this.rotation = 0;
					this.image = char_right_second;
				} else {
					this.rotation = 0;
					this.image = char_right_top2;	
				}
				
			} else if (this.airtime < jumping_threshold){
				if(grav_const == 1){
					this.image = char_right;
					this.rotation = 0;
				} else {
					this.image = char_right_top;
					this.rotation = 0;
				}

			} else {
				this.image = char_right_jump;
			}
		} else {
			// change to facing left image if moving left
			if(this.walk_switch && this.airtime < jumping_threshold){
				this.image = char_left_second;
				this.rotation = 0;
			} else if(this.airtime < jumping_threshold) {
				this.rotation = 0;
				this.image = char_left;
			} else {
				this.image = char_left_jump;
			}
		}
		if(this.attacking){
			if(grav_const == 1){
				this.image = char_attack;
			} else {
				this.image = char_attack_top;
			}
		}
	}

	//COLLISION WITH PLATFORMS
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

		this.x_correct_this_frame = false;

		for(var i = 0; i<platforms.length; i++){

			centerPlayerX = this.x + this.hit_width/2+10;
			if(grav_const == 1){
				centerPlayerY = this.y + this.hit_height/2;
			} else {
				centerPlayerY = this.y + this.hit_height/2;
			}
			
			centerRectX = platforms[i].x + platforms[i].width/2;
			centerRectY = platforms[i].y + platforms[i].height/2;

			distanceX = centerPlayerX - centerRectX;
			distanceY = centerPlayerY - centerRectY;
			minDistanceX = this.hit_width/2 + platforms[i].width/2;
			minDistanceY = this.hit_height/2 + platforms[i].height/2;

			if(Math.abs(distanceX) >= minDistanceX || Math.abs(distanceY) >= minDistanceY){
				depthX = 0;
				depthY = 0;
			} else {
				depthX = distanceX > 0 ? minDistanceX - distanceX : -minDistanceX - distanceX;
				depthY = distanceY > 0 ? minDistanceY - distanceY : -minDistanceY - distanceY;
				if(platforms[i].type == 2){
					this.dead = true;
				}
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
				if(depthX < 0){
					this.x_correct_this_frame = true;
				}
				if(!this.x_correct_this_frame && this.x_correct_count > 1){
					this.x_correct_count = 0;
				}
			}
		}

		if(this.x_correct_this_frame){
			this.x_correct_count++;
		}
		if(this.x_correct_count > 1){
			this.dead = true;
		}
	}
}
