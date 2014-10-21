# cuttle_models

a [Sails](http://sailsjs.org) application

NEXT:
Create render() function in gameview.js that makes get request to the appropriate game and renders the board
THEN: Finish gotoGame (ensure that attributes of player can be changed through game)
Split goToGame into joinGame and gotoGame:
DisplayGameController.joinGame:
	-Expected params: displayId (of game to be joined)
	-Called via socket request

	-Finds chosen game
		-CAN'T PASS PARAMS WITH SOCKET.GET AT THE MOMENT. FIXXXXXX
			-Fixed: params are found under req.body, not req.params?!
		-Creates new player with socketId and currentGame (foreign key to Game)
		-Subscribe socket to changes to their Game (Supposed to be done automatically, not sure)
DisplayGameController.gotoGame:
	-Expected params: displayId (of game to be joined)
	-Called with jquery
	-Serves view



Figure out where js/localScripts directory is being put and why gameview.js is accessible

Add CSS to allow for dynamic creation of new card divs that are properly aligned and colored

