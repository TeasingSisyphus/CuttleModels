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

	render: function(req, res) {
		//toDO: Use displayId in req to query for game, then respond with that game as a json object
		//Finally, use data on client side to render game
	},
};