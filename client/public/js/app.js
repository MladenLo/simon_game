$(document).ready(function(){
  
    /* Simon game app */
    var Simon = (function(){
      // Cashing the DOM elements
      var greenField = $('#_1');
      var yellowField = $('#_2');
      var redField = $('#_3');
      var blueField = $('#_4');
      var gameStatus = $('#gameStatus');
      var counterStartButton = $('#counterStartButton');
      var strictModeButton = $('#strictModeButton');
      var strictModeText = $('#strictModeText');
      //Private attributes
      var sounds = {
        // 1 = green, 2 = yellow, 3 = blue, 4 = red
        1: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
        2: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
        3: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
        4: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
      } 
      var gameStarted = false;
      var level = 1;
      var maxLevel = 20;
      var simonMoves = [];
      var userMoves = [];
      var userRounds = 0;
      var simonPlay = false;
      var userPlay = false;
      var strictMode = false;
      //Private methods
      var _playSound = function(field) {
        sounds[field].play();
      }
      var _getRandomField = function(){
        return Math.floor(Math.random() * (5 - 1)) + 1;
      }
        var _repeatMove = function(){
        gameStatus.text(level);
        simonPlay = true;
        userPlay = false;
        var i;
        for(i = 0; i < simonMoves.length; i++){
          (function(simonMoves, sounds, i){
            setTimeout(function(){
              (function(simonMoves, sounds, i){
                sounds[simonMoves[i]].play();
                $('#_' + simonMoves[i]).addClass("_" + simonMoves[i]);
                //-------------------------------------------------------------------------
                (function(field){
                  setTimeout(function(){
                    (function(){
                      $('#_' + field).removeClass("_" + field);
                      if(simonMoves.length === i + 1){
                        simonPlay = false;
                        userPlay = true;
                      }
                    })();
                  }, 300);
                })(simonMoves[i]);
                //-------------------------------------------------------------------------
              })(simonMoves, sounds, i);
            }, i * 1000);
          })(simonMoves, sounds, i);
        }
      };
      var _start = function(){
          gameStarted = true;
            if(level === maxLevel + 1) {
            gameStatus.text("Won!");
            counterStartButton.removeClass('game-on')
            level = 1;
            simonMoves = [];
            userRounds = 0;
            simonPlay = false;
            userPlay = false;
            return;
          }
          counterStartButton.addClass('game-on');
          gameStatus.text(level);
          simonPlay = true;
          userPlay = false;
          simonMoves.push(_getRandomField());
          var i;
          for(i = 0; i < simonMoves.length; i++){
            (function(simonMoves, sounds, i){
              setTimeout(function(){
                (function(simonMoves, sounds, i){
                  sounds[simonMoves[i]].play();
                  $('#_' + simonMoves[i]).addClass("_" + simonMoves[i]);
                  //-------------------------------------------------------------------------
                  (function(field){
                    setTimeout(function(){
                      (function(){
                        $('#_' + field).removeClass("_" + field);
                        if(simonMoves.length === i + 1){
                          simonPlay = false;
                          userPlay = true;
                        }
                      })();
                    }, 300);
                  })(simonMoves[i]);
                  //-------------------------------------------------------------------------
                })(simonMoves, sounds, i);
              }, i * 1000);
            })(simonMoves, sounds, i);
          }
      };
      var _userAction = function( field ){
        if(simonPlay) {
          //If true, computer is making move
          return;
        } else {
          // Now you can make move
          if(userPlay){
            userRounds++;
            _playSound(field);
            if(simonMoves[userRounds - 1] === field){
              if(userRounds === simonMoves.length) {
                level++;
                userPlay = false;
                userRounds = 0;
                setTimeout(function(){
                  _start();
                }, 1500);
              }
            } else {
              if(strictMode){
                gameStatus.text("!!!");
                userRounds = 0;
                level = 1;
                simonMoves = [];
                simonPlay = false;
                userPlay = false;
                setTimeout(function(){
                  _start();
                }, 1500);
              } else {
                gameStatus.text("!!!");
                simonPlay = false;
                userPlay = false;
                userRounds = 0;
                setTimeout(function(){
                  _repeatMove();
                }, 1500);
              }
            }
          }// ----- if userPlay is true
        }
      };
      var _strictMode = function(){
        if(strictMode){
          strictMode = false;
          strictModeButton.css("background-color", "red");
          strictModeText.text("Strict: OFF");
        } else {
          strictMode = true;
          strictModeButton.css("background-color", "green");
          strictModeText.text("Strict: ON");
        }
      };
      var _gameStart = function(){
        if(!gameStarted){
          // If start button is not clicked already, start the game
          _start();
        } else {
          //Reset the game
          level = 1;
          gameStarted = false;
          simonMoves = [];
          userRounds = 0;
          simonPlay = false;
          userPlay = false;
          strictMode = false;
          _start();
        }
      };
      //Public API
      return {
        start: _gameStart,
        userAction: _userAction,
        strictMode: _strictMode
      };
    })();
    /* End of app declaration */
    
    $('#strictModeButton').on('click', function(e){
      e.stopPropagation();
      Simon.strictMode();
    });
    $('#counterStartButton').on('click', function(){
      Simon.start();
    });
    $(".game-button").on('click', function(){
      Simon.userAction( $(this).data('field') );
    });
  });