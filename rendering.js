
function draw_game() {
	ctx = canvas.getContext("2d");
	ctx.drawImage(background, Math.round(platform_x_movement*(0.5)%background.width-background.width), 0);
	ctx.drawImage(background, Math.round(platform_x_movement*(0.5)%background.width), 0);
	ctx.drawImage(background, Math.round(platform_x_movement*(0.5)%background.width+background.width), 0);

	ctx.drawImage(background2, Math.round(platform_x_movement*(0.8)%background.width-background.width), 0);
	ctx.drawImage(background2, Math.round(platform_x_movement*(0.8)%background.width), 0);
	ctx.drawImage(background2, Math.round(platform_x_movement*(0.8)%background.width+background.width), 0);

		////////////////////////////////////////////////////////////////////////////////////////// DRAW EACH INDIVIDUAL TILE WHERE IT GOES
		for(var i = 0; i<map.length; i++){
			for(var k = 0; k<map[i].length; k++){
				if(imageMap[i][k] != null) ctx.drawImage(imageMap[i][k], k*blocksize+Math.floor(platform_x_movement), Math.floor(i*blocksize), blocksize, blocksize);
			}
		}

		////////////////////////////////////////////////////////////////////////////////////////// DRAW EACH COLLECTABLE
		for(var i = 0; i<collectable.length; i++){
			// handle collectables
			if(!collectable[i].hidden){
				ctx.drawImage(Cell.image, collectable[i].x+Math.floor(platform_x_movement), Math.floor(collectable[i].y));
			}
		}

		for(var i = 0; i<punchwall.length; i++){
			// handle collectables
			if(!punchwall[i].hidden){
				ctx.drawImage(Smash.image, punchwall[i].x+Math.floor(platform_x_movement), Math.floor(punchwall[i].y));
			}
		}
	
		////////////////////////////////////////////////////////////////////////////////////////// DRAW DAT BUCKY
	drawObject(CurrPlayer, ctx);

		////////////////////////////////////////////////////////////////////////////////////////// DRAW UI
	drawUI(ctx);

		////////////////////////////////////////////////////////////////////////////////////////// DRAW BUTTON
	Button_Gameplay_Reset.draw();
	Button_Gameplay_Options.draw();

	//**************************************************************************************************** Buttons
	if(Button_Gameplay_Reset.update()){
		PlayerGame.resetGame();
	}

	if(Button_Gameplay_Options.update()){
		PlayerGame.state = GAMESTATE_OPTIONS;
	}
		////////////////////////////////////////////////////////////////////////////////////////// DRAW SEXY GRID
	if(grid){
		blocksWidth = map[0].length;
		blocksHeight = map.length;
		for(var i = 0; i*blocksize<=blocksWidth*blocksize; i++){
			ctx.stokeStyle = "rgb(0,0,0)";
			ctx.beginPath();
			ctx.moveTo(0,i*blocksize);
			ctx.lineTo(blocksWidth*blocksize,i*blocksize);
			ctx.stroke();

			ctx.stokeStyle = "rgb(0,0,0)";
			ctx.beginPath();
			ctx.moveTo(i*blocksize+platform_x_movement%blocksize,0);
			ctx.lineTo(i*blocksize+platform_x_movement%blocksize,blocksHeight*blocksize);
			ctx.stroke();

			ctx.stokeStyle = "rgb(0,0,0)";
		}
	}
}

function screenClear(currentGame){ 
	ctx.fillStyle = currentGame.clearColor;
	ctx.fillRect(0, 0, currentGame.x_boundary, currentGame.y_boundary);
	return true;
}

		////////////////////////////////////////////////////////////////////////////////////////// AVOID THIS SHIT
function drawObject(drawableObject, ctx){
	ctx.save();
	ctx.translate(drawableObject.x + drawableObject.width/2 ,drawableObject.y + drawableObject.height/2);
	//ctx.translate(drawableObject.width/2,drawableObject.height/2)
	ctx.rotate(drawableObject.rotation) ;
	ctx.drawImage(drawableObject.image, -drawableObject.width/2, -drawableObject.height/2, drawableObject.width, drawableObject.height);
	ctx.restore();	
	return true;
}


	////////////////////////////////////////////////////////////////////////////////////////// DRAW EVERYTHING
function draw_world() {  

	var canvas = document.getElementById("draw_canvas");

	if (PlayerGame.state == GAMESTATE_GAMEPLAY){
		draw_game();
	}else if(PlayerGame.state == GAMESTATE_OPTIONS){
		ctx.drawImage(optionsScreen, 0, 0);
		//Button_Options_Start.draw();

		if(Button_Options_Start.update()){
			PlayerGame.resetGame();              //reset the game so that you don't start a game at your previous progress/death
			PlayerGame.state = GAMESTATE_START;
		}
	}else if(PlayerGame.state == GAMESTATE_START){
		ctx.drawImage(startScreen, 0, 0);
		//Button_Start_Options.draw();
		//Button_Start_Credits.draw();
		//Button_Start_Play.draw();

		if(Button_Start_Play.update() || Controller.space){
			PlayerGame.state = GAMESTATE_GAMEPLAY;			
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

		
		
		
		
		Button_Credits_MainMenu.draw();




		if(Button_Credits_MainMenu.clicked()){
			PlayerGame.state = GAMESTATE_START;
		}
		
		
	}
//end function draw_world()
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


