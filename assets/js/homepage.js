var socket = io.connect('http://localhost:1337');

////////////////////////
//Function Definitions//
////////////////////////

//Clears all listed games
var clear = function() {
	$('#games').html('');
}



//Renders homepage by making request for all DisplayGames and appending 
//divs representing them into the #games div
var render = function() {
	//Clear #games before rendering
	clear();
	//Make request to server for DisplayGames
	socket.get('/displaygame', function(res) {
		//Checks if there are any DisplayGames
		if (res.length > 0) {
			//If there are DisplayGames, render them
			$.each(res, function(index, val) {
				//Each new div has the class .div and an id taken from the corresponding 
				//DisplayGame on the server. New divs will display the name the game
				//and whether the game can be joined
				$('#games').append("<div class='game' id='" + val.id + "'>" + 'Name: ' + val.name + '          Open: ' + val.status + '</div>');

			});
			$('.game').off('click');
			$('.game').on('click', function() {
				var req_id = $(this).prop('id');
				console.log('You clicked game with display id: ' + req_id + '\n');


				//Make request to join game (create player and subscribe to Game instance), passing displayId of game
				//The sent params can be found on server side as req.body
				socket.get('/joingame', {
						displayId: req_id,
					},
					function(res) {
						console.log('Got Response from /joingame request\n');
						console.log(res);
					});

				//Make get request to server for the gameview, passing the displayId of the game to be rendered.
				$.get('/gameview', {
						displayId: req_id,
						//Trying to get access to socket.socket.sessionid
						//socketId: socket,

						//test param to see why I don't have access to socketId in DisplayGameController.gotoGame
						//feathers: 'So many'
					},
					function(data) {
						//Renders the page, using the html served by the server in response to the get request
						return $('body').html(data);
					});
			});

		} //else {
			//console.log('No Games!');
		//}
	});
}



//////////////////////////////////////
//Button Clicks and Form Submissions//
//////////////////////////////////////

//When form is submited, create new game with name taken from form
$('#create_game').submit(function(form) {
	console.log($('#name_field').val());
	form.preventDefault();

	socket.post('/displaygame', {
		name: $('#name_field').val()
	}, function(resData, jwres) {
		//log response
		console.log(resData);
	});

	//clear form
	$('#name_field').val('');
});

//Render new games when #render button is clicked
$('#render').on('click', function() {
	render();
});

////////////////
//Socket Stuff//
////////////////

//When a socket connects to the server, make a request to subscribe to class room for DisplayGame
//This will allow real-time updates to render all DisplayGames on the homepage
socket.on('connect', function() {
	socket.get('/displaygame/subscribe');
});

//This code handles model events for DisplayGame objects
socket.on('displaygame', function(obj) {
	//When a DisplayGame is created, re-render the page
	if (obj.verb == 'created') {
		var data = obj.data;
		console.log(data);
		render();
	}
});