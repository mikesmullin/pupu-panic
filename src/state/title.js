var Title = {
  preload: function() {
  },
  create: function() {
    var _this = this;
    this.game.add.sprite(0, 0, "Sprites", "Background_1.png");

    var titleText = this.game.add.sprite(0, 0, "Sprites", "Food_FishBurger_Sick_1.png");
    titleText.anchor.setTo(0.5, 0.5);
    titleText.position.x = game.width / 2;
    titleText.position.y = game.height / 2 - 70;

    function startGame(event) {
      // game.scale.startFullScreen();
      game.state.start("LevelSelect");
    }
    game.input.keyboard.onDownCallback = startGame;
    game.input.onDown.add(startGame);

    //if (highScore) {
    //  var scoreText = game.add.text(0, 250, "HIGH SCORE " + highScore, {fill: "#FFB6C1", font: 30 + "px Impact"});
    //  scoreText.position.x = game.width / 2 - scoreText.width / 2;
    //}
  },
  update: function() {
  },
  render: function() {
  }
};
