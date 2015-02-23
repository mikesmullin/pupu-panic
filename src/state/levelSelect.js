var level_buttons = [];
var LEVELS = 9;
var PADDING = 40;
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
    //this.game.add.sprite(0, 0, "ExtraSprites", "Background_Gameplay_1.png");
    game.stage.backgroundColor = '#a1dff2'
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
        var select = function(a) {
          return a[Math.floor(Math.random() * a.length)];
        }
        var chance = function(n, _in) {
          return (Math.random() * _in) <= n;
        }
        var rand = function(min, max) {
          return (Math.random() * (max-min)) + min;
        }
        var cashGoal, timeGoal, numCust, custTypes,
          tableSize, foodTypes, foodTypeFn, pottyCount,
          pottyTimeFn, custSpawnFn, foodValueFn, janitorCost,
          hints;
        game.state.level = i + 1;

        var spawnCustomer = false;
        var newCustomerTimer = null;
        var customerDelayMin = 0;
        var customerDelayMax = 0;
        var nextCustomer = function() {
          if (newCustomerTimer === null) {
            newCustomerTimer = setTimeout(function() {
              clearTimeout(newCustomerTimer);
              newCustomerTimer = null;
              spawnCustomer = true;
            }, rand(customerDelayMin, customerDelayMax)*1000);
          }
          if (spawnCustomer) {
            spawnCustomer = false;
            return true;
          }
        };

        switch (i+1) {
          case 1:
            hints = [
              "Rabbits are hungry.",
              "The fair closes soon."];
            cashGoal    = 3; timeGoal    = 10;
            numCust     = 1; custTypes   = [0];
            tableSize   = 1; foodTypes   = [0];
            foodTypeFn  = function() { return {
              type:   select(foodTypes),
              rotten: false }}
            pottyCount  = 0;
            customerDelayMin = 0; customerDelayMax = 0;
            custSpawnFn = function() { return true; }
            pottyTimeFn = function() { return 1000; }
            foodValueFn = function(foodType) { return 1; }
            janitorCost = 1;
            break;

          case 2:
            hints = [
              "Do not feed rabbits meat."];
            cashGoal    = 10; timeGoal    = 30;
            numCust     = 2;  custTypes   = [0];
            tableSize   = 3;  foodTypes   = [0,2];
            foodTypeFn  = function() { return {
              type:   chance(2,5) ? 2 : 0,
              rotten: false }}
            pottyCount  = 1;
            customerDelayMin = 0; customerDelayMax = 0;
            custSpawnFn = function() { return true; }
            pottyTimeFn = function() { return 5000; }
            foodValueFn = function(foodType) { return 1; }
            janitorCost = 1;
            break;

          case 3:
            hints = [
              "Not everyone likes veggies."];
            cashGoal    = 20; timeGoal    = 30;
            numCust     = 3;  custTypes   = [0,2];
            tableSize   = 4;  foodTypes   = [0,2];
            foodTypeFn  = function() { return {
              type:   select(foodTypes),
              rotten: false }}
            pottyCount  = 1;
            customerDelayMin = 0; customerDelayMax = 0;
            custSpawnFn = function() { return true; }
            pottyTimeFn = function() { return rand(6,9)*1000; }
            foodValueFn = function(foodType) { return 1; }
            janitorCost = 2;
            break;

          case 4:
            var pottyFlag = 0;
            hints = [
              "Janitors cost money."]
            cashGoal    = 10; timeGoal    = 60;
            numCust     = 4;  custTypes   = [0];
            tableSize   = 3;  foodTypes   = [0,2];
            foodTypeFn  = function() {
              r = {
                type:   pottyFlag ? 0 : 2,
                rotten: false
              };
              pottyFlag = 0;
              return r; }
            pottyCount  = 2;
            customerDelayMin = 0; customerDelayMax = 0;
            custSpawnFn = function() { return true; }
            pottyTimeFn = function() {
              pottyFlag = 1;
              return rand(6,9)*1000;
            }
            foodValueFn = function(foodType) { return 1; }
            janitorCost = 2;
            break;

          case 5:
            hints = [
              "Something smells.",
              "Its not the customers."];
            cashGoal    = 20;  timeGoal   = 40;
            numCust     = 3;  custTypes   = [0,2];
            tableSize   = 6;  foodTypes   = [0,2];
            foodTypeFn  = function() { return {
              type:   select(foodTypes),
              rotten: chance(1,2) }}
            pottyCount  = 1;
            customerDelayMin = 1; customerDelayMax = 1;
            custSpawnFn = function() { return nextCustomer(); }
            pottyTimeFn = function() { return rand(6,9)*1000; }
            foodValueFn = function(foodType) { return 1; }
            janitorCost = 3;
            break;

          case 6:
            hints = [
              "Frogs will try anything."];
            cashGoal    = 20;  timeGoal   = 35;
            numCust     = 4;  custTypes   = [1,4];
            tableSize   = 6;  foodTypes   = [1,4];
            foodTypeFn  = function() { return {
              type:   select(foodTypes),
              rotten: chance(1,2) }}
            pottyCount  = 2;
            customerDelayMin = 1; customerDelayMax = 1;
            custSpawnFn = function() { return nextCustomer(); }
            pottyTimeFn = function() { return rand(7,12)*1000; }
            foodValueFn = function(foodType) { return 1; }
            janitorCost = 5;
            break;

          case 7:
            hints = [
              "New manager.",
              "She's terrible at inventory."];
            cashGoal    = 16; timeGoal   = 50;
            numCust     = 3;  custTypes   = [2,3];
            tableSize   = 6;  foodTypes   = [2,3,1];
            foodTypeFn  = function() { return {
              type:   select(foodTypes),
              rotten: chance(1,5) }}
            pottyCount  = 4;
            customerDelayMin = 1; customerDelayMax = 1;
            custSpawnFn = function() { return nextCustomer(); }
            pottyTimeFn = function() { return rand(7,12)*1000; }
            foodValueFn = function(foodType) { return 1; }
            janitorCost = 5;
            break;

          case 8:
            hints = [
              "Memorize food placement.",
              "Timing is everything."];
            cashGoal    = 20;  timeGoal   = 60;
            numCust     = 4;  custTypes   = [3,0];
            tableSize   = 16; foodTypes   = [3,0,2];
            foodTypeFn  = function() { return {
              type:   select(foodTypes),
              rotten: chance(1,5) }}
            pottyCount  = 4;
            customerDelayMin = 3; customerDelayMax = 5;
            custSpawnFn = function() { return nextCustomer(); }
            pottyTimeFn = function() { return rand(10,15)*1000; }
            foodValueFn = function(foodType) { return 1; }
            janitorCost = 5;
            break;

          case 9:
            hints = [
              "Last level!",
              "Keep it together."];
            cashGoal    = 50;  timeGoal  = 140;
            numCust     = 4;  custTypes  = [0,1,2,3,4];
            tableSize   = 16; foodTypes  = [0,1,2,3,4];
            foodTypeFn  = function() { return {
              type:   select(foodTypes),
              rotten: chance(1,5) }}
            pottyCount  = 4;
            customerDelayMin = 3; customerDelayMax = 5;
            custSpawnFn = function() { return nextCustomer(); }
            pottyTimeFn = function() { return rand(10,15)*1000; }
            foodValueFn = function(foodType) { return 1; }
            janitorCost = 5;
            break;

          default:
            return;
        }

        // we used aliases above
        game.state.goals = hints;
        game.state.cashGoal = cashGoal;
        game.state.timer = timeGoal;
        game.state.numCustomerPositions = numCust;
        game.state.customerTypes = custTypes;
        game.state.numFoodItems = tableSize;
        game.state.foodTypes = foodTypes;
        game.state.makeFood = foodTypeFn;
        game.state.numPotties = pottyCount;
        game.state.spawnCustomer = custSpawnFn;
        game.state.pottyTime = pottyTimeFn;
        game.state.foodValue = foodValueFn;
        game.state.janitorCost = janitorCost;

        _this.sfxButtonClick.play();
        game.state.start("Goal");
      }; }(i)));
    }

    var w = 200, h = 80;
    page_prev = this.game.add.sprite(
      PADDING,
      game.height - PADDING - h,
      "Sprites", "Food_CarrotBun_Good_1.png");
    page_prev.inputEnabled = true;
    page_prev.events.onInputDown.add(function() {
      _this.sfxButtonClick.play();
      game.state.start("Title");
    });
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
        '80px Bangers');
    }

    game.debug.text('back', page_prev.x, page_prev.y+60, '#000000', '80px Bangers');
    // game.debug.text('next', page_next.x, page_next.y+60, '#000000', '80px Bangers');
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
