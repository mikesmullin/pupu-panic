var Title = {
  preload: function() {
  },
  create: function() {
    game.globals.playTitleMusic();
    var _this = this;
    this.game.add.sprite(0, 0, "ExtraSprites", "Background_Gameplay_1.png");

    var titleCircle = game.add.sprite(game.width / 2, -400, "ExtraSprites", "Title_Circle_1.png");
    titleCircle.anchor.setTo(.5, .5);
    game.add.tween(titleCircle)
    .to({y: 350}, 1500, Phaser.Easing.Bounce.Out)
    .start();

    var titlePotty = this.game.add.sprite(game.width / 2 + 300, -400, "ExtraSprites", "Title_Potty_1.png");
    titlePotty.anchor.setTo(0.5, 0.5);
    game.add.tween(titlePotty)
    .to({y: 400}, 1500, Phaser.Easing.Bounce.Out)
    .delay(1000)
    .start();

    var titleText = this.game.add.sprite(game.width / 2, -400, "ExtraSprites", "Title_PupuPanic_1.png");
    titleText.anchor.setTo(0.5, 0.5);
    game.add.tween(titleText)
    .to({y: 350}, 1500, Phaser.Easing.Bounce.Out)
    .delay(500)
    .start();

    var titleJanitor = this.game.add.sprite(game.width / 2 - 260, -400, "ExtraSprites", "Title_Janitor_1.png");
    titleJanitor.anchor.setTo(0.5, 0.5);
    game.add.tween(titleJanitor)
    .to({y: 470}, 1500, Phaser.Easing.Bounce.Out)
    .delay(1500)
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
