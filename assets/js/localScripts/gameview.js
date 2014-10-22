//Acknowledge that script has loaded
console.log('Loading Gameview.js\n');
//Get displayId of game from dom element rendered with displayId param or response in DisplayGameController.gotoGame
var displayId = $('#displayId').html();

console.log('displayId taken from pageload: ' + displayId + '\n');

//////////////////////
//Object Definitions//
//////////////////////
//ToDo: Create a selector and selector div
//Selector will be used to pick a card that will be moved somewhere

//ToDo: Create a destination object
//destination will be used to determine where the selected card will be moved

//ToDo: Create move_card() function that takes a selector and a destination and makes a post request
//to the relevant game with information required to move the card, then publishUpdate

////////////////////////
//Function Definitions//
////////////////////////

//Function that clears the dom of all card elements
//Will be called at the beginning of render()
var clear = function() {
	console.log("Clearing");
	//Clear Opponent's hand of all card divs
	$('#op_hand').html("<p>Oponent's Hand</p>");

	//Clear Opponent's field
	$('#op_field').html("<p>Oponent's Field</p>");

	//Clear the deck
	$('#deck').html('');

	//Clear the Scrap pile
	$('#scrap').html('');

	//Clear your field
	$('#your_field').html("<p>Your Field</p>");

	//Clear your hand
	$('#your_hand').html("<p>Your Hand</p>");

}

//The dom will make a get request for the desired game and use this
//to render divs representing the cards in the game
var render = function(display_id) {
	clear();
	//console.log('rendering');
	//console.log(display_id);
	var path = '/game/' + display_id;
	//console.log(path);
	//Make request for game object which will be used to render game
	socket.get(path, function(res) {
		console.log('Got game response: \n');
		console.log(res);

		//First: check if we are player 1:

		//console.log("Logging p1's socketId: ");
		//console.log(res.players[0].socketId);
		//console.log("Logging our socket: ");
		//console.log(socket.socket);
		//console.log(socket.socket.sessionid);
		console.log(res.players[0].socketId === socket.socket.sessionid);
		if (res.players[0].socketId === socket.socket.sessionid) {
			var player_index = 0;
			//use local reference to player_index capture player_number outside of render() function
			player_number = player_index;
			//console.log("We are player: " + player_index);
			var op_index = 1;
			console.log("They are player: " + op_index);
		}
		//console.log(res.players[1].socketId === socket.socket.sessionid);
		//FIX:
		//This conditional should be an else if, but it was giving me trouble
		if (res.players[1].socketId === socket.socket.sessionid) {
			var player_index = 1;
			console.log("We are Player: " + player_index)
			var op_index = 0;
			console.log("They are player: " + op_index);
		}

		//	else{
		//		console.log("We aren't p1 or p2?!");
		//	}

		//Render Opponent's hand
		for (var i = 0; i < res.players[op_index].hand.length; i++) {
			//Select card to be rendered
			var card = res.players[op_index].hand[i];
			//Append a div into #op_hand representing the card.
			//It will have an id of #op_hand_INDEX, where INDEX = i
			//and a class of .card
			$('#op_hand').append("<div class='card' id='op_hand_" + i + "'>" + card + "</div>");
		}

		//Render our hand
		for (var i = 0; i < res.players[player_index].hand.length; i++) {
			//Select card to be rendered
			var card = res.players[player_index].hand[i];
			//Append a div into #op_hand representing the card.
			//It will have an id of #op_hand_INDEX, where INDEX = i
			//and a class of .card
			$('#your_hand').append("<div class='card' id='your_hand_" + i + "'>" + card + "</div>");
		}

		//Render Opponent's field
		for (var i = 0; i < res.players[op_index].field.length; i++) {
			//Select card to be rendered
			var card = res.players[op_index].field[i];
			//Append a div into #op_hand representing the card.
			//It will have an id of #op_hand_INDEX, where INDEX = i
			//and a class of .card
			$('#op_hand').append("<div class='card' id='op_field_" + i + "'>" + card + "</div>");
		}

		//Render Your field
		for (var i = 0; i < res.players[player_index].field.length; i++) {
			//Select card to be rendered
			var card = res.players[player_index].field[i];
			//Append a div into #op_hand representing the card.
			//It will have an id of #op_hand_INDEX, where INDEX = i
			//and a class of .card
			$('#your_hand').append("<div class='card' id='your_field_" + i + "'>" + card + "</div>");
		}


	});
}

////////////////////////
//Variable Definitions//
////////////////////////
var player_number = 0;

/////////////////
//Socket Events//
/////////////////

//The following code handles model events on Games
//The type of change made to a Game model will be found
//under obj.verb 
socket.on('game', function(obj) {
	console.log('Game event fired. Logging verb: ');
	console.log(obj.verb);

	//If the event was an update, log the changes
	//ToDo: Create render function and call it when
	//game is updated
	if (obj.verb == 'updated') {
		console.log('Game was updated. Logging data: ');
		console.log(obj.data);
		render(displayId);
	}
});

//////////////////////
//On Click Callbacks//
//////////////////////
$('#displayId').on('click', function() {
	console.log('clicked displayId\n');
});

$('#clear').on('click', function() {
	clear();
});

$('#deal').on('click', function() {
	socket.get('/deal', {
		displayId: displayId
	}, function(res) {
		console.log(res);
	});
});

$('#render').on('click', function() {
	//console.log('rendering:\n');
	console.log(displayId);
	render(displayId);
});