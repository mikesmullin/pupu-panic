var Title = {
  preload: function() {
  },
  create: function() {
    var _this = this;
    this.game.add.sprite(0, 0, "Sprites", "Background_Gameplay_1.png");

    var titleText = this.game.add.sprite(game.width / 2, -150, "Sprites", "Food_BoneBun_Good_1.png");
    titleText.anchor.setTo(0.5, 0.5);
    game.add.tween(titleText)
    .to({y: game.height / 2 - 70}, 1800, Phaser.Easing.Bounce.Out)
    .start();

    var playButton = this.game.add.sprite(game.width / 2, game.height / 2 + 120, "Sprites", "Food_CarrotBun_Good_1.png");
    playButton.alpha = 0;
    playButton.anchor.setTo(0.5, 0.5);
    playButton.inputEnabled = true;
    playButton.events.onInputDown.add(function() {
      game.state.start("LevelSelect");
    });
    game.add.tween(playButton)
    .to({alpha: 1}, 500, Phaser.Easing.Quadratic.InOut)
    .delay(2000)
    .start();
    
    var creditsButton = this.game.add.sprite(game.width / 2, game.height / 2 + 240, "Sprites", "Food_CornBurger_Good_1.png");
    creditsButton.alpha = 0;
    creditsButton.anchor.setTo(0.5, 0.5);
    creditsButton.inputEnabled = true;
    creditsButton.events.onInputDown.add(function() {
      game.state.start("Credits");
    });
    game.add.tween(creditsButton)
    .to({alpha: 1}, 500, Phaser.Easing.Quadratic.InOut)
    .delay(2250)
    .start();
  },
  update: function() {
  },
  render: function() {
  }
};
