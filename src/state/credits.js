var backButton,
 credits;

var Credits = {
  preload: function() {
    game.load.image('credits', 'assets/credits.png');
  },
  create: function() {
    var _this = this;
    game.stage.backgroundColor = '#0aa'

    backButton = this.game.add.sprite(game.width / 2, game.height - 120, "Sprites", "Food_CarrotBun_Good_1.png");
    backButton.anchor.setTo(0.5, 0.5);
    backButton.inputEnabled = true;
    backButton.events.onInputDown.add(function() {
      game.state.start("Title");
    });

    credits = this.game.add.sprite(50, 50, 'credits');
    credits.scale.setTo(3,3);
  },
  update: function() {
  },
  render: function() {
    game.debug.text('back', backButton.x-30, backButton.y+30, '#000000', '80px arial');
  },
  shutdown: function() {
  }
};
