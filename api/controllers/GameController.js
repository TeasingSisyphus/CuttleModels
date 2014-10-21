/**
 * GameController
 *
 * @description :: Server-side logic for managing Games
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	/*create: function(req, res) {
		console.log('Creating Game\n');
		Game.create({
			displayId: req.param('displayId')
		}).exec(function createGame(err, newguy) {
			console.log(newguy);
		});
	}, */
	//Deals cards to both players in game
	//Expected params: displayId of game
	deal: function(req, res) {
		console.log("Dealing");
		console.log(req.body);
		//Finds relevant game and populates it with its players
		Game.findOne({displayId: req.body.displayId}).populate('players').exec(function(err, foundGame){
			if (err || !foundGame) {
				//return res.BadRequest('Game Not Found!');
				console.log("Can't find game!");
			//Check if there are 2 players before dealing
			} else if(foundGame.players.length == 2) {

				//Deal one extra card to player 1
				foundGame.players[0].hand[0] = foundGame.deck.shift();
				//Then Deal 5 cards to the hands of each player, starting with p2
				for (var i = 0; i < 5; i++) {
					foundGame.players[1].hand[i] = foundGame.deck.shift();
					foundGame.players[0].hand[i+1] = foundGame.deck.shift();
				}
				//Save changes to the game
				foundGame.save();

				//Log changes on server
				console.log(foundGame.players[0]);
				console.log(foundGame.players[1]);

				//Respond with updated game
				//ToDo: Change res.send to a publishUpdate
				//return res.send({game: foundGame});
				Game.publishUpdate(req.body.displayId, {game: foundGame});
			}
			//If there are fewer than 2 players, return a badrequest response
			else {
				//BadRequest may not work here...not sure why
				return res.BadRequest('Not Enough Players to Deal!');
			}		
		});
	},
	render: function(req, res) {
		//toDO: Use displayId in req to query for game, then respond with that game as a json object
		//Finally, use data on client side to render game
	},
};