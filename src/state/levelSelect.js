var LevelSelect = {
  preload: function() {
  },
  create: function() {
    var _this = this;
    this.game.add.sprite(0, 0, "Sprites", "Background_1.png");
    
    function startGame(event) {
      // game.scale.startFullScreen();
      game.state.start("Play");
    }
    game.input.keyboard.onDownCallback = startGame;
    game.input.onDown.add(startGame);
  },
  update: function() {
  },
  render: function() {
  }
};
