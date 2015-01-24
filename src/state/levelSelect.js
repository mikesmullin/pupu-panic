var level_buttons = [];
var levels = 9;
var PADDING = 20;
var BUTTON_SIZE = 100;
var LevelSelect = {
  preload: function() {
  },
  create: function() {

    this.game.stage.backgroundColor = '#333333';

    for (var i=0; i<levels; i++) {
      var row = Math.floor( (i * (PADDING + BUTTON_SIZE + PADDING)) / game.width);
      level_buttons[i] =
        new Phaser.Rectangle(
          PADDING + i * (PADDING + BUTTON_SIZE) - (row * game.width),
          PADDING + row * (PADDING + BUTTON_SIZE),
          BUTTON_SIZE,
          BUTTON_SIZE);
    }

    //function startGame(event) {
    //  // game.scale.startFullScreen();
    //  game.state.start("Play");
    //}
    //game.input.keyboard.onDownCallback = startGame;
    //this.game.input.onDown.add(startGame);
  },
  update: function() {
  },
  render: function() {
    for (var i=0; i<levels; i++) {
      var rect = level_buttons[i];
      game.debug.rectangle(level_buttons[i], '#ffffff');
      game.debug.text(i+1, rect.centerX-(25), rect.y+75, '#000000', '80px arial');
    }
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
