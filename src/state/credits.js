var Credits = {
  preload: function() {
  },
  create: function() {
    game.globals.playTitleMusic();
    var _this = this;
    this.game.add.sprite(0, 0, "Sprites", "Background_Gameplay_1.png");
        
    var playButton = this.game.add.sprite(game.width / 2, game.height / 2 + 120, "Sprites", "Food_CarrotBun_Good_1.png");
    playButton.anchor.setTo(0.5, 0.5);
    playButton.inputEnabled = true;
    playButton.events.onInputDown.add(function() {
      game.state.start("Title");
    });
  },
  update: function() {
  },
  render: function() {
  }
};
