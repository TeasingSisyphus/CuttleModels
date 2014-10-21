/**
 * DisplayGameController
 *
 * @description :: Server-side logic for managing Displaygames
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	//Subscribes Client to class room for DisplayGames
	//ALL clients are subscribed on connection (see homepage.js)
	//This allows for realtime uptdates to the list of games seen on the homepage
	//subscribes sockets will thus gain access to DisplayGame model events with
	//create and destroy verbs
	subscribe: function(req, res) {
		console.log('subscribing socket: ' + req.socket.id + ' to DisplayGame class room');

		DisplayGame.watch(req);

	},
	//An action that creates a new player, with foreign key to a chosen game,
	//then subscribes the requesting socket to that game
	//ToDo: Subscription is supposed to happen by default CHECK THIS
	joinGame: function(req, res) {
		var params = req.body;

		//console.log('Recieved Parameters:');
		//console.log(params);

		//Fetch id of game from request parameters
		var req_id = params.displayId;
		//Find the game specified by req_id
		Game.findOne({
			displayId: req_id
		}).populate('players').exec(
			function(err, model) {
				//Send error if findOne returns passes an error or no model is found
				if (err || !model) {
					return res.BadRequest('Model Not Found!');
					console.log('No model found!');
				} else {

					//Create new Player:
					//Fetch whether this new player will be player 1
					var isP1 = (model.players.length === 0);
					Player.create({
						isPlayerOne: isP1,
						socketId: req.socket.id,
						currentGame: model
					}).exec(function(err, res) {
						console.log("New Player Added:\n");
						console.log(res);
					});
					Game.subscribe(req.socket, model);
				}
			}
		);

	},

	//Action that brings user to the gameview when they choose a game to join. 
	//Currently bound to /gameview route
	//Called when #displaygame div is clicked (see homepage.js)
	gotoGame: function(req, res) {
		params = req.allParams();
		console.log('gotoGame method firing');
		console.log(params);
		/*

		//Fetch socketId of user joining game
		console.log('New Player Socket: ');
		console.log(params.socketId);
		//Fetch the displayId of the request
		var req_id = params.displayId;

		//ToDo: Learn to use findOne to get ahold of one Game by it's req_id 
		//to pass to the subscribe method to subscribe the socket to updates to the game that 
		//the player is being sent to

		//Find the game being requested
		Game.findOne({
			displayId: req_id
		}, function(err, model) {
			if (err || !model) {
				return res.BadRequest('Model Not Found!');
			}

			console.log('Found Game: \n');
			//console.log(model);

			console.log("Player socket: ");
			console.log(params.socketId);

			var isP1 = (model.players.length === 0);
			console.log('New player is p1? ' + isP1);

			//Create new player representing client
			Player.create({
				isPlayerOne: isP1,
				socketId: params.socketId,
				currentGame: model
			}).exec(function(err, res) {
				console.log("New Player added: ")
				console.log(res);
				console.log("Number of players: ");
				console.log(model.players.length);

			}); 

			//model.populate('players').exec(function(err, res) {
			//console.log('Populated game with new player:\m');
			//console.log(res);
			//});



		}); */



		//Returns html string with gameview.ejs. Params are used to render certain tags in gameview.ejs
		//Currently, one tag renders the displayId param that is passed by the on click function for 'display'
		return res.view('gameview', params);

	},

	//Test action that renders a view using the res.view method within an action controller. In routes.js,
	//this method is bound to the /actiontest route
	RenderTest: function(req, res) {
		console.log('testing');
		res.view('test');
	},

	create: function(req, res) {
		console.log('creating DisplayGame');
		var req_name = req.param('name');

		DisplayGame.create({
			name: req_name
		}).exec(function created(err, newguy) {
			//After DisplayGame is created, make corresponding Game
			Game.create({
				name: newguy.name,
				displayId: newguy.id,

			}).exec(function createdGame(err, newGame) {
				console.log('Created Game: ' + newGame.name + ', with displayId: ' + newGame.displayId + '\n');
				//console.log(newGame);
			});
			//publishCreate will emit an event with name DisplayGame with an object paremeter
			//obj consists of verb (from request), data (object representing created DisplayGame) and id of DisplayGame
			//data consists of id, name and status of created DisplayGame
			DisplayGame.publishCreate({
				id: newguy.id,
				name: newguy.name,
				status: newguy.status
			});
			console.log('Created new DisplayGame: ' + newguy.name + ' with id: ' + newguy.id);


		});
	},
};