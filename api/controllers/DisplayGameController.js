/**
 * DisplayGameController
 *
 * @description :: Server-side logic for managing Displaygames
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	subscribe: function(req, res) {
		console.log('subscribing socket: ' + req.socket.id + ' to DisplayGame class room');
		DisplayGame.watch(req);
	},

	//Action that brings user to the gameview when they choose a game to join. 
	//Currently bound to /gameview route

	//ToDo: accept id of chosen game as param and use that to render page differently 
	//and subscribe client socket to the appropriate game
	gotoGame: function(req, res) {
		params = req.allParams();
		console.log('gotoGame method firing');
		console.log(params);

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
			//publishCreate will emit an event with name DisplayGame with an object paremeter
			//obj consists of verb (from request), data (object representing created DisplayGame) and id of DisplayGame
			//data consists of id, name and status of created DisplayGame
			DisplayGame.publishCreate({
				id: newguy.id,
				name: newguy.name,
				status: newguy.status
			});
			console.log('new DisplayGame: ' + newguy.name + ' created');
		});
	},
};