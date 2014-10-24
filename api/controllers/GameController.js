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
				console.log(foundGame);
				//Log changes on server
				//console.log(foundGame.players[0]);
				//console.log(foundGame.players[1]);

				//Respond with updated game
				//ToDo: Change res.send to a publishUpdate
				//return res.send({game: foundGame});
				Game.publishUpdate(req.body.displayId, {game: foundGame});
			}
			//If there are fewer than 2 players, return a badrequest response
			else {
				//BadRequest may not work here...not sure why
				return res.send('Not Enough Players to Deal!');
			}		
		});
	},
	//Moves a card in a particular game
	//Expected params: displayId, player, sel (selector) and dest (destination)
	move_card: function(req, res){
		//Find game with displayId and populate it with it's players
		Game.findOne({displayId: req.body.displayId}).populate('players').exec(function(err, foundGame){
			console.log(req.body);
			console.log("Player Number " + req.body.player + " Wants to move. It is turn: " + foundGame.turn);

			if (err || !foundGame) {
				//return res.BadRequest('Game Not Found!');
				console.log("Can't find game!");
				res.send("Can't find your game. WHAT DID YOU DO?!");
			}

			//Only allow move if it is your turn
			else if(req.body.player === (foundGame.turn % 2) ) {
				console.log("Correct player wants to move");

				//Fetch the selector and destination from the request
				var sel = req.body.sel;
				console.log(sel);
				var dest = req.body.dest;
				console.log(dest);

				//Check if the selected card is in the player's hand
				if (req.body.sel.place === 'hand') {
					//Check if the destination is the player's field
					if(req.body.dest.place === 'your_field') {
						//Store the card to be moved
						var temp = foundGame.players[req.body.player].hand[sel.index];
						//Switch the desired card with the first card in the hand
						foundGame.players[req.body.player].hand[sel.index] = foundGame.players[req.body.player].hand[0];
						foundGame.players[req.body.player].hand[0] = temp;

						//Shift desired card off top of player's hand into their field
						foundGame.players[req.body.player].field[foundGame.players[req.body.player].field.length] = foundGame.players[req.body.player].hand.shift();

					//Check if user wishes to play card from hand to opponent's field
					} else if (dest.place === 'op_field') {
						//Check if user is scuttling
						if (dest.scuttle === true) {
							//Fetch card to be played from hand
							var card = foundGame.players[req.body.player].hand[sel.index];
							//Fetch target card to be scuttled
							var target = foundGame.players[(req.body.player + 1) % 2].field[dest.scuttle_index];


							//Compare card with target to see if scuttle if valid
							var card_rank = card[1];
							//Rank of T stands for 10
							if (card_rank === 'T') {
								card_rank = 10;
							}
							//Check that scuttling card is not a face card
							if (!(card_rank === 'J' || card_rank === 'Q' || card_rank === 'K')) {
								//Convert rank from str to int
								card_rank = parseInt(card_rank);
								//Fetch rank of target card (to be scuttled)
								var target_rank = target[1];

								//Rank of T stands for 10
								if (target_rank === 'T') {
									target_rank = 10;
								}

								//Check that target card (to be scuttled) is not a face card
								if ( !(target_rank === 'J' || target_rank === 'Q' || target_rank === 'K') ) {
									target_rank = parseInt(target_rank);

									//Compare rank of card to target
									if (card_rank > target_rank) {
										//If the scuttle was valid, move both cards into the scrap pile

										//Move card at top of the field to the position of the target (to switch them)
										foundGame.players[(req.body.player + 1) % 2].field[dest.scuttle_index] = foundGame.players[(req.body.player + 1) % 2].field[0];
										//Place target card at top of field
										foundGame.players[(req.body.player + 1) % 2].field[0] = target;

										//Scrap target card (shift it off top of field)
										foundGame.scrap[foundGame.scrap.length] = foundGame.players[(req.body.player + 1) % 2].field.shift();

										//Scrap scuttling card from player's hand
										foundGame.players[req.body.player].hand[sel.index] = foundGame.players[req.body.player].hand[0];
										foundGame.players[req.body.player].hand[0] = card;
										foundGame.scrap[foundGame.scrap.length] = foundGame.players[req.body.player].hand.shift();
									}	
								} 

							}
						}
					}
				}

				//Incriment the turn
				foundGame.turn++;

				//After your card has been moved, save changes to the model
				foundGame.save();
				//Then publishUpdate to users
				Game.publishUpdate(req.body.displayId, {game: foundGame});

			}
			else{
				res.send("Not your turn!");
			}
		});
	},

	render: function(req, res) {
		//toDO: Use displayId in req to query for game, then respond with that game as a json object
		//Finally, use data on client side to render game
	},
};