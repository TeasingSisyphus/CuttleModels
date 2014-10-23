# cuttle_models

a [Sails](http://sailsjs.org) application

PREVIOUS
-Update selector.place using regular expressions when a card is clicked (gameview.js)


NEXT:
-Create action for moving a card
	-Allow you scuttle


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

	-Game does not always render after deal is called on one client (seems to be client that calls for deal)