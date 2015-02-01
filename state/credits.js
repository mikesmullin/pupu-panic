var backButton,
 credits;

var Credits = {
  preload: function() {
  },
  create: function() {
    var _this = this;
    game.stage.backgroundColor = '#558934'
    credits = this.game.add.sprite(game.world.centerX, game.world.centerY - 90, 'Credits');
    credits.anchor.setTo(.5,.5);

    backButton = this.game.add.sprite(game.world.centerX, game.height - 100, "Sprites", "Food_CarrotBun_Good_1.png");
    backButton.anchor.setTo(.5, .5);
    backButton.inputEnabled = true;
    backButton.events.onInputDown.add(function() {
      game.state.start("Title");
    });

  },
  update: function() {
  },
  render: function() {
    game.debug.text('back', backButton.x-30, backButton.y+30, '#000000', '80px Bangers');
  },
  shutdown: function() {
  }
};
