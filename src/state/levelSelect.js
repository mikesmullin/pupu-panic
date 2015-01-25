var level_buttons = [];
var LEVELS = 9;
var PADDING = 38;
var BUTTON_SIZE = 200;
var COLS = 3;
var page_prev, page_next;

var LevelSelect = {
  preload: function() {
  },
  create: function() {
    game.globals.playTitleMusic();
    var _this = this;
    this.game.add.sprite(0, 0, "Sprites", "Background_Gameplay_1.png");
    this.sfxButtonClick = game.add.audio("ButtonClick", 1.0);

    for (var i=0; i<LEVELS; i++) {
      var unit = PADDING + BUTTON_SIZE;
      var row = Math.floor(i / COLS);
      level_buttons[i] = this.game.add.sprite(
        PADDING + ((i % COLS) * unit),
        PADDING + (row * unit),
        "Sprites", "Food_CarrotBun_Good_1.png");
      level_buttons[i].inputEnabled = true;
      level_buttons[i].events.onInputDown.add(
        (function (i) { return function() {
        switch (i+1) {
          case 1:
            game.state.cashGoal = 10;
            game.state.timer = 20;
            game.state.numCustomerPositions = 2;
            game.state.numFoodItems = 8;
            game.state.customerTypes = [0];
            game.state.foodTypes = [0];
            game.state.numPotties = 0;
            break;

          case 2:
            game.state.cashGoal = 50;
            game.state.timer = 20;
            game.state.numCustomerPositions = 3;
            game.state.numFoodItems = 8;
            game.state.customerTypes = [0];
            game.state.foodTypes = [0, 1, 2, 3, 4];
            game.state.numPotties = 4;
            break;

          default:
            return;
        }
        _this.sfxButtonClick.play();
        game.state.start("Play");
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
    page_next = this.game.add.sprite(
      game.width - PADDING - w,
      game.height - PADDING - h,
      "Sprites", "Food_CarrotBun_Good_1.png");
    page_next.inputEnabled = true;
    page_next.events.onInputDown.add(function() {
      // tween
      _this.sfxButtonClick.play();
      alert('coming soon; more pages of levels');
    });
  },
  update: function() {
  },
  render: function() {
    for (var i=0; i<LEVELS; i++) {
      var rect = level_buttons[i];
      game.debug.text(i+1,
        rect.x+25,
        rect.y+125,
        '#000000',
        '80px arial');
    }

    game.debug.text('prev', page_prev.x, page_prev.y+60, '#000000', '80px arial');
    game.debug.text('next', page_next.x, page_next.y+60, '#000000', '80px arial');
  },
  onSwipe: function() {
    if (Phaser.Point.distance(game.input.activePointer.position, game.input.activePointer.positionDown) > 150 && game.input.activePointer.duration > 100 && game.input.activePointer.duration < 250) {
      firstPointX = game.input.activePointer.positionDown.x;
      firstPointY = game.input.activePointer.positionDown.y;

      lastPointX = game.input.activePointer.position.x;
      lastPointY = game.input.activePointer.position.y;

      swiping = true;
      console.log("SWIPING!");
    }
  }
};
