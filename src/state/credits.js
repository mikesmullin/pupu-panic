var Credits = {
  preload: function() {
  },
  create: function() {
    var _this = this;
    this.game.add.sprite(0, 0, "Sprites", "Background_Gameplay_1.png");
    
    var titleText = this.game.add.sprite(0, 0, "Sprites", "Food_FishBurger_Sick_1.png");
    titleText.anchor.setTo(0.5, 0.5);
    titleText.position.x = game.width / 2;
    titleText.position.y = game.height / 2 - 70;
    
    function startGame(event) {
      game.state.start("Title");
    }
    game.input.keyboard.onDownCallback = startGame;
    game.input.onDown.add(startGame);
  },
  update: function() {
  },
  render: function() {
  }
};
