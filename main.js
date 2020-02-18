//======================================================================================================================
// Process Flow:
// start game - shuffle cards, show all cards on back side
// rule: when a match is made, the matched cards stay face up, further clicking will have no actions
// each new attempt starts a new game set: *** every card that gets clicked, can be either first card or second card
//   when a card is clicked, check if this is the first card of a new game set,
//   first card clicked: show front of card, track the card_id, FLIP CARD BACK, at any point, there can be ONLY ONE first card
//   for each card clicked: check if there was a first card already clicked, if yes, set this to be second card,
//     compare first and second card, if same - SHOW FACE of cards, set card status to revealed, no more action for cards
//   track game set match counts (max is 9) - if all sets are done, flash 'DONE' message and reset game
// Update Game Scores for the current game
// Game Reset - shuffle cards and place them in random order, reset game scores
//======================================================================================================================
const total_possible_matches = 9;
var matches = 0;
var attempts = 0;
var accuracy = 0;
var games_played = 0;
var lastAttemptFailed = false;
var firstCard = null;
var secondCard = null;
var ok2click = true;
//var images = ['water.jpg','water.jpg','water.jpg','water.jpg','water.jpg','water.jpg','water.jpg','water.jpg','water.jpg',
//'water.jpg','water.jpg','water.jpg','water.jpg','water.jpg','water.jpg','water.jpg','water.jpg','water.jpg'];
var images = ['gas.jpg','gaspipe.jpg','pole.jpg','water.jpg','wind.jpg','nuclear.png','solar.png','transformer.png','transmission.png'
,'pole.jpg','transmission.png','transformer.png','solar.png','nuclear.png','wind.jpg','water.jpg','gaspipe.jpg','gas.jpg'];
//var winnerScreen = $('<div>', {class: 'winner'}).append($('<div>', {class: 'winner-img'}));
var winnerScreen = $('<div>').addClass('winner');

$(document).ready(startApp);

function startApp() {
    gameSetup();
    //$('.card').click(cardClickHandler);
    //handleWin();
    //$('#reset-button').click(resetGame());
    
}

function gameSetup(){    
    // setup a new game and display all cards
    $('.game-area').empty();
    var temp, newIndex;
    // shuffle card images first
    for (var i=0; i<images.length; i++) {
        temp = images[i];  //save current image in temp
        newIndex = Math.floor(Math.random() * i);
        images[i] = images[newIndex]; //swap current image in array with a new image
        images[newIndex] = temp;  
    }
    // add front and back images to each card
    for (var i=0; i < images.length; i++) {
        var container = $('<div>').addClass('container');
		var card = $('<div>').addClass('card');
		var front = $('<div>').addClass('front').css("background-image", `url(images/${images[i]}`);
		var back = $('<div>').addClass('back').css("background-image", "url(images/lightbulb.png)");
        //card.append(back, front);
        card.append(front, back);
		container.append(card);
		$('.game-area').append(container);
    }
    $('.game-area').fadeIn('fast','linear');
    //console.log("inside gameSetup... finished adding images");
    $('div .card').removeClass('revealed');
    $('.card').click(cardClickHandler);
    //displayStats();
}

function cardClickHandler(){    
	// if this card has been revealed - do nothing, else handle the click
	if (!ok2click || $(this).hasClass('revealed')) { return; }
    //console.log("inside cardClickHandler - ok2click and revealed:" + ok2click + "-" + $(this).hasClass('revealed'));
    $(this).addClass('revealed');
    if (firstCard === null) { firstCard= this; } 
       else { secondCard = this;
		        var firstCardImg = $(firstCard).find('.front').css('background-image');
		        var secondCardImg = $(secondCard).find('.front').css('background-image');
		        if (firstCardImg === secondCardImg) 
                        { matches++; attempts++; firstCard = null; secondCard = null;
                          if(matches === total_possible_matches) { 
                            handleWin();}
                        } 
			    else { attempts++; ok2click = false;                        
                        setTimeout(startNewAttempt, 1000); }
                }    
    displayStats();              
}

function startNewAttempt(){
    //console.log("inside startNewAttempt");
    $(firstCard).removeClass('revealed');
    $(secondCard).removeClass('revealed');
    firstCard = null;
    secondCard = null;
    ok2click = true;
}

function displayStats(){
    $('#games-played').text(games_played);
    $('#attempts').text(attempts);
    if (attempts > 0) {
        accuracy = matches / attempts * 100;
        var formatAccuracy = accuracy.toFixed(0) + "%";
        $('#accuracy').text(formatAccuracy);    
    } else {accuracy = 0;
        $('#accuracy').text(accuracy);    
    }
}

function resetGame(){
    	//console.log("reset button was clicked...");
        $(firstCard).removeClass('revealed');
	    $(secondCard).removeClass('revealed');
        $('div .card').removeClass('revealed');
        firstCard = null;
	    secondCard = null;
	    ok2click = true;
        accuracy = 0;
	    matches = 0;
        attempts = 0;
        games_played++;
	    //if (games_played > 1) games_played++;
        displayStats();         
//        //if($('.game-area').css('display') === 'none'){
//            winnerScreen.remove(); } 
//        else {$('.game-area').fadeOut('fast', 'swing'); };
        
//        $('.game-area').empty();        
        gameSetup();
}

function handleWin(){
    $('.game-area').append(winnerScreen.fadeIn('slow','swing'));
    //alert('!!! Winner !!!');
    //$('#reset-button').click(resetGame());
}