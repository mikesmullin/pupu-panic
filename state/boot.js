var Boot = {
  preload: function() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignVertically = true;
    game.scale.pageAlignHorizontally = true;

    game.load.image("PreloadBar", "assets/PreloadBar.png");
    game.load.image('Loading', 'assets/loading.png');
  },
  create: function() {
    game.input.maxPointers = 1;

    game.state.start("Preload");
  },
  update: function() {
  },
  render: function() {
  }
};
