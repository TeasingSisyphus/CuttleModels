//var socket = io.connect('http://localhost:1337');

//Acknowledge that script has loaded
console.log('Loading Gameview.js\n');

//Get displayId of game from dom element rendered with displayId param or response in DisplayGameController.gotoGame
var displayId = $('#displayId').html();

console.log('displayId taken from pageload: ' + displayId + '\n');

var clear = function() {
	//Clear Opponent's hand of all card divs
	$('#op_hand').html('');

	//Clear Opponent's field
	$('#op_field').html('');

	//Clear the deck
	$('#deck').html('');

	//Clear the Scrap pile
	$('#scrap').html('');

	//Clear your field
	$('#your_field').html('');

	//Clear your hand
	$('#your_hand').html('');

}

//The dom will make a get request for the desired game and use this
//to render divs representing the cards in the game
var render = function(display_id) {
	console.log(display_id);
	var path = '/game/' + display_id;
	console.log(path);
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
		if(res.players[0].socketId === socket.socket.sessionid) {
			var player_index = 0;
			console.log("We are player: " + player_index);
			var op_index = 1;
			console.log("They are player: " + op_index);
		}
		console.log(res.players[1].socketId === socket.socket.sessionid);
		//FIX:
		//This conditional should be an else if, but it was giving me trouble
		if(res.players[1].socketId === socket.socket.sessionid){
			var player_index = 1;
			console.log("We are Player: " + player_index)
			var op_index = 0;
			console.log("They are player: " + op_index);
		}

	//	else{
	//		console.log("We aren't p1 or p2?!");
	//	}
		//Render Opponent's hand
		for(var i = 0; i < res.players[op_index].hand.length; i++) {
			//Select card to be rendered
			var card = res.players[op_index].hand[i];
			//Append a div into #op_hand representing the card.
			//It will have an id of #op_hand_INDEX, where INDEX = i
			//and a class of .card
			$('#op_hand').append("<div class='card' id='op_hand_" + i + "'>" + card + "</div>");
		}

		//Render our hand
		for(var i = 0; i < res.players[player_index].hand.length; i++) {
			//Select card to be rendered
			var card = res.players[player_index].hand[i];
			//Append a div into #op_hand representing the card.
			//It will have an id of #op_hand_INDEX, where INDEX = i
			//and a class of .card
			$('#your_hand').append("<div class='card' id='your_hand_" + i + "'>" + card + "</div>");
		}		
		

	});
}

/////////////////
//Socket Events//
/////////////////

//The following code handles model events on Games
//The type of change made to a Game model will be found
//under obj.verb 
socket.on('game', function(obj){
	console.log('Game event fired. Logging verb: ');
	console.log(obj.verb);

	//If the event was an update, log the changes
	//ToDo: Create render function and call it when
	//game is updated
	if(obj.verb == 'updated'){
		console.log('Game was updated. Logging data: ');
		console.log(obj.data);
	}
});

//////////////////////
//On Click Callbacks//
//////////////////////
$('#displayId').on('click', function() {
	console.log('clicked displayId\n');
});

$('#deal').on('click', function(){
	socket.get('/deal', {displayId: displayId}, function(res){
		console.log(res);
	});
});
$('#render').on('click', function() {
	console.log('rendering:\n');
	console.log(displayId);
	render(displayId);
});