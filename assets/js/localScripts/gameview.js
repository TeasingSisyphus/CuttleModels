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

		//Render Opponent's hand


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