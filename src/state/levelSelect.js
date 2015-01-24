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
    this.game.add.sprite(0, 0, "Sprites", "Background_1.png");

    for (var i=0; i<LEVELS; i++) {
      var unit = PADDING + BUTTON_SIZE;
      var row = Math.floor(i / COLS);
      level_buttons[i] =
        new Phaser.Rectangle(
          PADDING + ((i % COLS) * unit),
          PADDING + (row * unit),
          BUTTON_SIZE,
          BUTTON_SIZE);
    }

    var w = 200, h = 80;
    page_prev = new Phaser.Rectangle(
      PADDING,
      game.height - PADDING - h,
      w,
      h);

    page_next = new Phaser.Rectangle(
      game.width - PADDING - w,
      game.height - PADDING - h,
      w,
      h);


    function startGame(event) {
      // game.scale.startFullScreen();
      game.state.start("Play");
    }
    game.input.keyboard.onDownCallback = startGame;
    this.game.input.onDown.add(startGame);
  },
  update: function() {
  },
  render: function() {
    for (var i=0; i<LEVELS; i++) {
      var rect = level_buttons[i];
      game.debug.rectangle(level_buttons[i], '#ffffff');
      game.debug.text(i+1, rect.centerX-(25), rect.y+125, '#000000', '80px arial');
    }
    game.debug.rectangle(page_prev, '#ffffff');
    game.debug.text('prev', page_prev.centerX-80, page_prev.y+60, '#000000', '80px arial');
    game.debug.rectangle(page_next, '#ffffff');
    game.debug.text('next', page_next.centerX-80, page_next.y+60, '#000000', '80px arial');
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
