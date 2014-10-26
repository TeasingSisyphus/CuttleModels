//Acknowledge that script has loaded
console.log('Loading Gameview.js\n');

//Get displayId of game from dom element rendered with displayId param or response in DisplayGameController.gotoGame
//ToDo: move this to variable definitions
var displayId = $('#displayId').html();

console.log('displayId taken from pageload: ' + displayId + '\n');

///////////////////////////////
//Object & Method Definitions//
///////////////////////////////

//ToDo: Create a selector and selector div
//Selector will be used to pick a card that will be moved somewhere
var Selector = function() {
	//Represents which player's card is selected (in game.players[])
	//this.player = 0;
	//Represents where the player's card is ('hand' or 'field')
	this.place = '';
	//Represents the index of the selected card within a hand or field
	this.index = 0;
	//Represents the str content of the selected card (ie: c5)
	this.card = ''
}
//Method on Selector that clears it
Selector.prototype.clear = function(){
	//Clear the object attributes
	//console.log("Clearing Selector");
	this.place = '';
	this.index = 0;
	this.card = '';
	//Clear the dom element representing the selector
	$('#selector').html('');
}

var Destination = function() {
	//Represents whether the card is moving to a hand, field, scrap or scuttle
	this.place = '';
	this.scuttle = false;
	//If the card is scuttling, represents where the card to be scuttled is found
	this.scuttle_index = 0;
}

//Method on Destination that clears it
Destination.prototype.clear = function(){
	//console.log("Clearing Destination");
	this.place = '';
	this.scuttle_index = 0;
	this.scuttle = false;
}


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
		console.log('Got game response:');
		console.log(res);

		if(res.players.length === 0) {
			console.log("No Players!");
		}

		//First: check if we are player 1:

		//console.log("Logging p1's socketId: ");
		//console.log(res.players[0].socketId);
		//console.log("Logging our socket: ");
		//console.log(socket.socket);
		//console.log(socket.socket.sessionid);
		//console.log(res.players[0].socketId === socket.socket.sessionid);
		else {
			if (res.players[0].socketId === socket.socket.sessionid) {
			var player_index = 0;
			//use local reference to player_index capture player_number outside of render() function
			player_number = player_index;
			console.log("We are player: " + player_index);
			var op_index = 1;
			console.log("They are player: " + op_index +'\n');
			}
			//console.log(res.players[1].socketId === socket.socket.sessionid);
			//FIX:
			//This conditional should be an else if, but it was giving me trouble
			else if (res.players[1].socketId === socket.socket.sessionid) {
				var player_index = 1;
				//use local reference to player_index to capture player_number
				player_number = player_index
				console.log("We are Player: " + player_index)
				var op_index = 0;
				console.log("They are player: " + op_index);
			}

			//Render cards in scrap pile
			$('#scrap').html("Cards in Scrap: " + res.scrap.length);

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
				$('#op_hand').append("<div class='op_card card' id='op_hand_" + i + "'>" + " Card " + "</div>");
			}

			//Render our hand
			for (var i = 0; i < res.players[player_index].hand.length; i++) {
				//Select card to be rendered
				var card = res.players[player_index].hand[i];
				//Append a div into #op_hand representing the card.
				//It will have an id of #op_hand_INDEX, where INDEX = i
				//and a class of .card
				$('#your_hand').append("<div class='your_card card' id='your_hand_" + i + "'>" + card + "</div>");
			}

			//Render Opponent's field
			for (var i = 0; i < res.players[op_index].field.length; i++) {
				//Select card to be rendered
				var card = res.players[op_index].field[i];
				//Append a div into #op_hand representing the card.
				//It will have an id of #op_hand_INDEX, where INDEX = i
				//and a class of .card
				$('#op_field').append("<div class='card op_card op_field' id='op_field_" + i + "'>" + card + "</div>");
			}

			//Render Your field
			for (var i = 0; i < res.players[player_index].field.length; i++) {
				//Select card to be rendered
				var card = res.players[player_index].field[i];
				console.log("Logging card in our field: " + card);
				//Append a div into #op_hand representing the card.
				//It will have an id of #op_hand_INDEX, where INDEX = i
				//and a class of .card
				$('#your_field').append("<div class='your_card card' id='your_field_" + i + "'>" + card + "</div>");
			}

			//Clear all onclick event listeners to your_cards
			$('.your_card').off('click');
			//Clear all onclick event listeners to op_field
			$('.op_field').off('click');

			//When one of your cards is clicked, select it
			$('.your_card').on('click', function(){
				if($(this).html() === sel.card) {
					console.log("Card was already selected: deselecting");
					sel.clear();
				} else {
					//ToDo: update sel.place using regular expression
					console.log($(this).prop('id'));
					temp_index = $(this).prop('id');
					//Temp place will be used to find the place (hand/field) of the selected card
					//match uses the regex.exec(str) method to create an array of the matching info
					//The first element of match is the place surrounded by underscores (the info that matched it)
					//The second element (what we want) is the place, itself
					var match = /\_([^()]*)\_/.exec(temp_index);
					var place = match[1];
					sel.place = place;
					temp_index = temp_index.replace(/[^\d]/g, '');
					sel.index = temp_index;
					//console.log("Selector index: " + sel.index);
					sel.card = $(this).html();
					//console.log("Selector card: " + sel.card);
					$('#selector').html(sel.card);
				}
			});

			//When you click a card on your opponent's field, if a in your hand is selected,
			//ask server to scuttle the card
			//Note that this is an event listener when individual cards are clicked, not
			//the opponent's field, overall
			$('.op_field').on('click', function() {
				console.log('clicked ops field');
				//Only continue if a card is selected
				if (sel.card != '') {
					console.log('card selected: ' + sel.card);
					if(sel.place === 'hand') {
						var scuttle = confirm('Do you wish to scuttle?');
						if (scuttle) {
							dest.scuttle = true;
							//Set the destination to opponent's field
							dest.place = 'op_field';
							//Get the index of the card to be scuttled on opponent's field:
							//First pull id from div
							var str = $(this).prop('id');
							console.log("got str id: " + str);
							//Then use regex to pull number from id and assign it to dest.scuttle_index
							str = /\d/.exec(str);
							str = str[0];
							//Convert string value of index to an integer
							//Assign dest.scuttle_index to this value
							dest.scuttle_index = parseInt(str);
							console.log(dest.scuttle_index);

							socket.get('/move_card', {displayId: displayId, player: player_number, sel: sel, dest: dest}, function(res){
								console.log(res);
							});
						}
					}
				}
			});			
		} 
	});
}

////////////////////////
//Variable Definitions//
////////////////////////

//Represents whether this user is p1 or p2 in their game
var player_number = 0;
//Selector used to determine which card will be moved
var sel = new Selector();
//Destination used to determine where a card will be moved
var dest = new Destination();

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
	//ToDo: Change render function to take a game object param
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

//When the 'Deal Hands' button is clicked, deal to both players and render the game
$('#deal').on('click', function() {
	socket.get('/deal', {
		displayId: displayId
	}, function(res) {
		console.log(res);
	});
});

//When the 'Draw a Card' button is clicked, deal one card to that player
$('#draw').on('click', function(){
	socket.get('/draw', {displayId: displayId}, function(res){
		console.log(res);
	});
});

//When the render button is clicked, render the game
//ToDo: make a get request here for game and pass that to
//reworked render function (which takes a game as a param)
$('#render').on('click', function() {
	//console.log('rendering:\n');
	console.log(displayId);
	render(displayId);
});

//When you click your field, if you've selected a card
// ask server to move the selected card to your field
$('#your_field').on('click', function(){
	//Only continue if a card is selected
	if (sel.card != '') {
		if (sel.place === 'hand') {
		//ToDo: deal with case where selected card was on field and re-clicked
		dest.place = 'your_field';
		console.log('Making request to move_card');
		socket.get('/move_card', {displayId: displayId, player: player_number, sel: sel, dest: dest}, function(res){
			//console.log("Got response from request to move_card:");
			console.log(res);
		});
		sel.clear();
		dest.clear();
		}
	}
});

