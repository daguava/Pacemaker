var time = 0;

function draw_game() {
	time+=.1;
	ctx.save();
	ctx.translate(10,-10);
	ctx.rotate(Math.sin(time)/45);

	ctx.drawImage(background, Math.round(platform_x_movement*(0.5)%background.width-background.width), 0);
	ctx.drawImage(background, Math.round(platform_x_movement*(0.5)%background.width), 0);
	ctx.drawImage(background, Math.round(platform_x_movement*(0.5)%background.width+background.width), 0);

	ctx.drawImage(background2, Math.round(platform_x_movement*(0.8)%background.width-background.width), 0);
	ctx.drawImage(background2, Math.round(platform_x_movement*(0.8)%background.width), 0);
	ctx.drawImage(background2, Math.round(platform_x_movement*(0.8)%background.width+background.width), 0);

		////////////////////////////////////////////////////////////////////////////////////////// DRAW EACH INDIVIDUAL TILE WHERE IT GOES
		for(var i = 0; i < map.length; i++){
			for(var k = 0; k<map[i].length; k++){
				if(imageMap[i][k] != null) ctx.drawImage(imageMap[i][k], k*blocksize+Math.floor(platform_x_movement), Math.floor(i*blocksize), blocksize, blocksize);
			}
		}

		////////////////////////////////////////////////////////////////////////////////////////// DRAW EACH COLLECTABLE
		for(var i = 0; i < collectable.length; i++){
			// handle collectables
			if(!collectable[i].hidden){
				ctx.drawImage(Cell.image, collectable[i].x+Math.floor(platform_x_movement), Math.floor(collectable[i].y));
			}
		}

		for(var i = 0; i < punchwall.length; i++){
			// handle collectables
			if(!punchwall[i].hidden){
				ctx.drawImage(Smash.image, punchwall[i].x+Math.floor(platform_x_movement), Math.floor(punchwall[i].y));
			}
		}
	
//DRAW DAT BUCKY
	drawObject(CurrPlayer, ctx);

// DRAW UI
	drawUI(ctx);


//DRAW SEXY GRID

	if(grid){
		blocksWidth = map[0].length;
		blocksHeight = map.length;
		for(var i = 0; i * blocksize <= blocksWidth*blocksize; i++){
			ctx.stokeStyle = "rgb(0,0,0)";
			ctx.beginPath();
			ctx.moveTo(0,i * blocksize);
			ctx.lineTo(blocksWidth*blocksize,i*blocksize);
			ctx.stroke();

			ctx.stokeStyle = "rgb(0,0,0)";
			ctx.beginPath();
			ctx.moveTo(i * blocksize + platform_x_movement % blocksize,0);
			ctx.lineTo(i * blocksize + platform_x_movement % blocksize,blocksHeight * blocksize);
			ctx.stroke();

			ctx.stokeStyle = "rgb(0,0,0)";
		}
	}
	ctx.restore();
}

function screenClear(currentGame){ 
	ctx.fillStyle = currentGame.clearColor;
	ctx.fillRect(0, 0, currentGame.x_boundary, currentGame.y_boundary);
	return true;
}

//AVOID THIS SHIT
function drawObject(drawableObject, ctx){
	ctx.save();
	ctx.translate(drawableObject.x + drawableObject.width/2 ,drawableObject.y + drawableObject.height/2);
	//ctx.translate(drawableObject.width/2,drawableObject.height/2)
	ctx.rotate(drawableObject.rotation);
	ctx.drawImage(drawableObject.image, -drawableObject.width/2, -drawableObject.height/2, drawableObject.width, drawableObject.height);
	ctx.restore();	
	return true;
}



//UP DRAWN TO SCREEN
function drawUI(context){


	var canvas = document.getElementById("draw_canvas");
	if(debug) {
		// draw debugging UI
		context.font = '15px Calibri';
		context.fillStyle = "rgb(240,240,240)";
		context.fillText("FPS-Avg: " 			+ fps.toFixed(0), 											120, 	20);
		context.fillText("FPS-Imm: " 			+ thisFrameFPS.toFixed(2), 									120, 	35);
		context.fillText("Collided: " 			+ CurrPlayer.grounded || CurrPlayer.grounded_last_frame, 	600, 	35);
		context.fillText("Dist-Since-Change: " 	+ CurrPlayer.distance_since_sprite_change.toFixed(2), 		600, 	20);
	} else {
		// draw normal UI
		context.drawImage(Cell.image, 15, 12);
		context.font = '25px Calibri';
		context.fillStyle = "rgb(240,240,240)";
		context.fillText(" x ", 57, 42);
		context.fillText("   " + collectable_count, 60, 43);
	}

	if(CurrPlayer.dead){
		context.font = '30px Calibri';
		context.fillText("You dead bro?",																230,	35);
	}
	if(document.activeElement.id != "draw_canvas" || !windowActive || Controller.p){ //Known Bug - can pause while jumped
				context.fillStyle = "rgba(50,50,50,0.5)";
				context.fillRect(527, 247, 145, 50);
				context.fillStyle = "rgb(240,240,240)";
				context.font = '30px Calibri';
				context.fillText("Paused",																		550,	280);
	}
}

//DRAW EVERYTHING
function draw_world() {  

	if (PlayerGame.state == GAMESTATE_GAMEPLAY){

		soundLevel1.unmute(); //////////////////////Start making sound in the gameplay, added here because fuggit

		draw_game();
	

	if(Button_Gameplay_Reset.update()){
		//screenClear();
		//PlayerGame.state = GAMESTATE_RESETTING;
		loadGame();
		//resetGame();
	}

	if(Button_Gameplay_Options.update()){
		//loadGame();
		PlayerGame.state = GAMESTATE_OPTIONS;
		//PlayerGame.changeState(GAMESTATE_GAMEPLAY,GAMESTATE_OPTIONS);
	}
	}

	else if(PlayerGame.state == GAMESTATE_OPTIONS){
		ctx.drawImage(optionsScreen, 0, 0);
		//Button_Options_Start.draw();

		if(Button_Options_Start.update()){
			PlayerGame.state = GAMESTATE_START;
		}
	}

	else if(PlayerGame.state == GAMESTATE_START){
		ctx.drawImage(startScreen, 0, 0);

		//Button_Start_Options.draw();
		//Button_Start_Credits.draw();
		//Button_Start_Play.draw();
		
	soundLevel1.mute();
	soundLevel2.mute();
	soundLevel3.mute();
	soundLevel4.mute();
	soundLevelSanic.mute();




		if(Button_Start_Play.update() || Controller.space){
			//PlayerGame.state = GAMESTATE_GAMEPLAY;
			PlayerGame.state = GAMESTATE_LEVEL_SELECT;
			//loadGame();
		}	
		
		if(Button_Start_Credits.update()){
			PlayerGame.state = GAMESTATE_CREDITS;
		}
		
		if(Button_Start_Options.update()){
			PlayerGame.state = GAMESTATE_OPTIONS;			
		}	


	}else if(PlayerGame.state == GAMESTATE_CREDITS){

		ctx.drawImage(creditScreen1, 0, 0);

		LoadMitchell();
		LoadJason();
		LoadNick();
		LoadAlex();
		LoadJesse();
	
		//Permanently display text to the screen
	    ctx.font           = 'bold 40px Calibri';
		ctx.fillStyle      = "rgb(0, 0, 0)";
		ctx.strokeStyle    = 'black';
		ctx.lineWidth      = 10;
		//Draw permanent names to Credit's canvas
	    ctx.fillText(sMitchellL, 210, 300);
		ctx.fillText(sAlexS,     600, 350);
		ctx.fillText(sNickH,     210, 400);
		ctx.fillText(sJasonA,    600, 450);
		ctx.fillText(sJesseK,    210, 500);

		if(Button_Credits_MainMenu.update()){
			PlayerGame.state = GAMESTATE_START;
		}
	}
	else if(PlayerGame.state == GAMESTATE_LEVEL_SELECT){
			ctx.drawImage(levelSelectBgImg,0,0);
			if(	Button_Level_Select_One.update()){
				PlayerGame.state = GAMESTATE_GAMEPLAY;
				currentLevel = 0;
				loadGame();
			}




								if(Button_Start_Play.update() || Controller.space){////////////Have this here because I want use ecksbawks
									
									PlayerGame.state = GAMESTATE_GAMEPLAY;
									currentLevel = 1;
										
								}	


			if(	Button_Level_Select_Two.update()){
				PlayerGame.state = GAMESTATE_GAMEPLAY;
				currentLevel = 1;
				loadGame();
			}

			if(Button_Level_Select_Three.update()){
				PlayerGame.state = GAMESTATE_GAMEPLAY;
				currentLevel = 2;
				loadGame();
			}

			if(Button_Level_Select_Four.update()){
				PlayerGame.state = GAMESTATE_GAMEPLAY;
				currentLevel = 3;
				loadGame();
			}

			
	}
	else if(PlayerGame.state == GAMESTATE_RESETTING){
		//console.log("RESETTING");
		PlayerGame.state = GAMESTATE_GAMEPLAY;
		loadGame();
	}
}

function LoadMitchell(){
	
		var x = String.fromCharCode(iCounter);
		//ctx.drawImage(creditNameNick,     50, 250, 200, 100);
		if(bMitchellL == 0){
		    //iStringPosition = sMitchellL.length;
		    
			if(iStringPositionMitchell < sMitchellL.length){
				if(x == sMitchellL.charAt(iStringPositionMitchell)){
					
					
					ctx.font = 'bold 40px Calibri';
					ctx.fillStyle = "rgb(0, 0, 0)";
				    ctx.strokeStyle = 'black';
		            ctx.lineWidth   = 10;
	                ctx.fillText(x, iXTextPositionMitchell, iYTextPositionMitchell);
	                	               
	                aMitchellL[iStringPositionMitchell] = x;         

	                sBuildMitchell += x;
	                
	                iXTextPositionMitchell += 40;
	                iCounter = 32;
	                iStringPositionMitchell++;
	                
	                
				}
				//x is a literal character, 
				else if(x != sMitchellL.charAt(iStringPositionMitchell)){
					iCounter++;
				}
				

			}
			
		}
}

function LoadJason(){
	
		if(bJasonA == 0){
			
		var x = String.fromCharCode(iCounter);

			if(iStringPositionJason < sJasonA.length){
				if(x == sJasonA.charAt(iStringPositionJason)){
					
					ctx.font = 'bold 40px Calibri';
					ctx.fillStyle = "rgb(0, 0, 0)";
				    ctx.strokeStyle = 'black';
		            ctx.lineWidth   = 10;
					ctx.fillText(x, iXTextPositionJason, iYTextPositionJason);
					
					aJasonA[iStringPositionJason] = x;
					
					sBuildJason += x;
					
					iXTextPositionJason +=40;
					iCounter = 32;
					iStringPositionJason++;	
				}
				else if(x != sJasonA.charAt(iStringPositionJason)){
					iCounter++;
				}
			}
		}
}

function LoadAlex(){		
		if(bAlexS == 0){
		    var x = String.fromCharCode(iCounter);

			if(iStringPositionAlex < sAlexS.length){
				if(x == sAlexS.charAt(iStringPositionAlex)){
					
					ctx.font = 'bold 40px Calibri';
					ctx.fillStyle = "rgb(0, 0, 0)";
				    ctx.strokeStyle = 'black';
		            ctx.lineWidth   = 10;
		            
		            
					ctx.fillText(x, iXTextPositionAlex, iYTextPositionAlex);
					
					aAlexS[iStringPositionAlex] = x;
					
					sBuildAlex += x;
					
					iXTextPositionAlex +=40;
					iCounter = 32;
					iStringPositionAlex++;	
				}
				else if(x != sAlexS.charAt(iStringPositionAlex)){
					iCounter++;
				}
			}
		}
}


function LoadNick(){		
		if(bNickH == 0){
			var x = String.fromCharCode(iCounter);
			if(iStringPositionNick < sNickH.length){
				//document.getElementById("debug_info").innerHTML += (iStringPositionNick + "fuck me<br/>");
				if(x == sNickH.charAt(iStringPositionNick)){
					
					ctx.font        = 'bold 40px Calibri';
					ctx.fillStyle   = "rgb(0, 0, 0)";
				    ctx.strokeStyle = 'black';
		            ctx.lineWidth   = 10;
					
					ctx.fillText(x, iXTextPositionNick, iYTextPositionNick);
					
					aNickH[iStringPositionNick] = x;
					
					sBuildNick += x;
					
					iXTextPositionNick +=40;
					iCounter = 32;
					iStringPositionNick++;	
				}
				else if(x != sNickH.charAt(iStringPositionNick)){
					iCounter++;
				}
			}
		}
}

function LoadJesse(){
		if(bJesseK == 0){
			var x = String.fromCharCode(iCounter);
			if(iStringPositionJesse < sJesseK.length){
				if(x == sJesseK.charAt(iStringPositionJesse)){
					
					ctx.font        = 'bold 40px Calibri';
					ctx.fillStyle   = "rgb(0, 0, 0)";
				    ctx.strokeStyle = 'black';
		            ctx.lineWidth   = 10;
					ctx.fillText(x, iXTextPositionJesse, iYTextPositionJesse);
					
					aJesseK[iStringPositionJesse] = x;
					
					sBuildJesse += x;
					
					iXTextPositionJesse +=40;
					iCounter = 32;
					iStringPositionJesse++;	
				}
				else if(x != sJesseK.charAt(iStringPositionJesse)){
					iCounter++;
				}
			}
		}				
}	


