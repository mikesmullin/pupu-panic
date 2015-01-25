var level_buttons = [];
var LEVELS = 9;
var PADDING = 38;
var BUTTON_SIZE = 200;
var COLS = 3;
var page_prev, page_next;

var rand = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var LevelSelect = {
  preload: function() {
  },
  create: function() {
    highestLevelBeat = parseInt(localStorage.getItem("highestLevelBeat"));
    highestLevelBeat = highestLevelBeat || 0;

    game.globals.playTitleMusic();
    var _this = this;
    this.game.add.sprite(0, 0, "ExtraSprites", "Background_Gameplay_1.png");
    this.sfxButtonClick = game.add.audio("ButtonClick", 1.0);

    if (highestLevelBeat + 1 < LEVELS) {
      max = highestLevelBeat + 1;
    }
    for (var i=0; i < LEVELS; i++) {
      var unit = PADDING + BUTTON_SIZE;
      var row = Math.floor(i / COLS);
      level_buttons[i] = this.game.add.sprite(
        PADDING + ((i % COLS) * unit),
        PADDING + (row * unit),
        "Sprites", "Food_CarrotBun_Good_1.png");
      if (i < highestLevelBeat + 1) {
        level_buttons[i].inputEnabled = true;
      }
      else {
        level_buttons[i].alpha = .5;
      }
      level_buttons[i].events.onInputDown.add(
        (function (i) { return function() {
        game.state.level = i + 1;
        switch (i+1) {
          case 1:
            game.state.cashGoal = 10;
            game.state.timer = 30;
            game.state.numCustomerPositions = 2;
            game.state.numFoodItems = 8;
            game.state.customerTypes = [0,2];
            game.state.foodTypes = [0,2];
            game.state.numPotties = 1;
            game.state.makeFood = function() {
              return {
                type: Math.floor(Math.random() * game.state.foodTypes.length),
                rotten: false
              }
            }
            game.state.spawnCustomer = function() {
              return Math.random() > .99;
            }
            game.state.pottyTime = function() {
              return 10*1000;
            }
            game.state.foodValue = function(foodType) {
              return 1;
            }
            game.state.janitorCost = 5;
            break;

          case 2:
            // a little tricky; you wont have all carrots; some will have to go potty
            game.state.cashGoal = 10;
            game.state.timer = 25;
            game.state.numCustomerPositions = 3; // not more than 3
            game.state.numFoodItems = 8; // requires minimum of 8
            // 0 - bunny
            // 1 - cat
            // 2 - dog
            // 3 - bird
            // 4 - frog
            game.state.customerTypes = [2,1,0];
            // 0 = bunny food
            // 1 = cat food
            // 2 = dog food
            // 3 = bird food
            // 4 = frog food
            game.state.foodTypes = [2,1,0];
            game.state.numPotties = 1; // not more than 4
            game.state.makeFood = function() {
              return {
                type: Math.floor(Math.random() * game.state.foodTypes.length),
                rotten: false
              }
            }
            game.state.spawnCustomer = function() {
              return true;
            }
            game.state.pottyTime = function(customer) {
              return 1000 * (9 * Math.random() + 1); // 1 - 9 sec
            }
            game.state.foodValue = function(foodType) {
              //return Math.random() * 1 + 1; // 1 - 2 cash
              return 1;
            }
            game.state.janitorCost = 5; // -5 cash
            break;

          case 3:
            game.state.cashGoal = 10;
            game.state.timer = 25;
            game.state.numCustomerPositions = 3;
            game.state.numFoodItems = 8;
            game.state.customerTypes = [2,1,0]
            game.state.foodTypes = [2,1,0]
            game.state.numPotties = 2;
            game.state.makeFood = function() {
              return {
                type: Math.floor(Math.random() * game.state.foodTypes.length),
                rotten: Math.floor(Math.random() * 2) > 0
              }
            }
            game.state.spawnCustomer = function() {
              return true;
            }
            game.state.pottyTime = function(customer) {
              //return 1000 * (9 * Math.random() + 5); // 5 - 14 sec
              return 1000 * (5 * Math.random() + 1); // 1 - 5 sec
            }
            game.state.foodValue = function(foodType) {
              return Math.random() * 1 + 1;
            }
            game.state.janitorCost = 5;
            break;

          case 4:
            game.state.cashGoal = 10;
            game.state.timer = 25;
            game.state.numCustomerPositions = 3;
            game.state.numFoodItems = 8;
            game.state.customerTypes = [2,1,0,4]
            game.state.foodTypes = [2,1,0,4]
            game.state.numPotties = 3;
            game.state.makeFood = function() {
              return {
                type: Math.floor(Math.random() * game.state.foodTypes.length),
                rotten: Math.floor(Math.random() * 2) > 0
              }
            }
            game.state.spawnCustomer = function() {
              return true;
            }
            game.state.pottyTime = function(customer) {
              return 1000 * (5 * Math.random() + 1); // 1 - 5 sec
            }
            game.state.foodValue = function(foodType) {
              return Math.random() * 1 + 1;
            }
            game.state.janitorCost = 5;
            break;

          case 5:
            game.state.cashGoal = 20;
            game.state.timer = 33;
            game.state.numCustomerPositions = 3;
            game.state.numFoodItems = 8;
            game.state.customerTypes = [3,1,0,4]
            game.state.foodTypes = [3,1,0]
            game.state.numPotties = 3;
            game.state.makeFood = function() {
              return {
                type: Math.floor(Math.random() * game.state.foodTypes.length),
                rotten: rand(1, 3) == 1
              }
            }
            game.state.spawnCustomer = function() {
              return true;
            }
            game.state.pottyTime = function(customer) {
              return 1000 * (6 * Math.random() + 3); // 3 - 9 sec
            }
            game.state.foodValue = function(foodType) {
              return Math.random() * 1 + 1;
            }
            game.state.janitorCost = 5;
            break;

          default:
            return;
        }
        _this.sfxButtonClick.play();
        game.state.start("Play");
      }; }(i)));
    }

    var w = 200, h = 80;
    // page_prev = this.game.add.sprite(
    //   PADDING,
    //   game.height - PADDING - h,
    //   "Sprites", "Food_CarrotBun_Good_1.png");
    // page_prev.inputEnabled = true;
    // page_prev.events.onInputDown.add(function() {
    //   _this.sfxButtonClick.play();
    //   game.state.start("Title");
    // });
    // page_next = this.game.add.sprite(
    //   game.width - PADDING - w,
    //   game.height - PADDING - h,
    //   "Sprites", "Food_CarrotBun_Good_1.png");
    // page_next.inputEnabled = true;
    // page_next.events.onInputDown.add(function() {
    //   // tween
    //   _this.sfxButtonClick.play();
    //   alert('coming soon; more pages of levels');
    // });
  },
  update: function() {
  },
  render: function() {
    for (var i=0; i < highestLevelBeat + 1; i++) {
      var rect = level_buttons[i];
      game.debug.text(i+1,
        rect.x+25,
        rect.y+125,
        '#000000',
        '80px arial');
    }

    // game.debug.text('prev', page_prev.x, page_prev.y+60, '#000000', '80px arial');
    // game.debug.text('next', page_next.x, page_next.y+60, '#000000', '80px arial');
  },
  // onSwipe: function() {
  //   if (Phaser.Point.distance(game.input.activePointer.position, game.input.activePointer.positionDown) > 150 && game.input.activePointer.duration > 100 && game.input.activePointer.duration < 250) {
  //     firstPointX = game.input.activePointer.positionDown.x;
  //     firstPointY = game.input.activePointer.positionDown.y;

  //     lastPointX = game.input.activePointer.position.x;
  //     lastPointY = game.input.activePointer.position.y;

  //     swiping = true;
  //     console.log("SWIPING!");
  //   }
  // }
};
