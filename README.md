# cuttle_models

a [Sails](http://sailsjs.org) application

PREVIOUS
-Create render() function in gameview.js that makes get request to the appropriate game and renders the board
	-Implement clear function as first line of render function
-Fixed Clear function to reflect that various elements of the gameview now have <p> elements that are not to be erased
-Created method to deal hands.

NEXT:
-Create action for moving a card
	-update selector.place using regular expressions when a card is clicked (gameview.js)
THEN:

-Figure out where js/localScripts directory is being put and why gameview.js is accessible

-Add CSS to allow for dynamic creation of new card divs that are properly aligned and colored

QUALITY OF LIFE:
-Set migrate status to drop
-Locally install jquery
-HANDLE ERROS!!!!
	-Dealing from player1's client, does not automatically render player2's dom
		-Player2 recieves game object with no players
	-Send badrequest when player attempts to deal before 2 players join
	-Conditional in render() function (gameview.js) should have an else, but this was causing syntax error