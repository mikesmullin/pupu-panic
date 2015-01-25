var backButton,
 credits;

var Credits = {
  preload: function() {
    //game.load.spritesheet('balls', 'assets/sprites/balls.png', 17, 17);
    game.load.image('credits', 'assets/credits.png');
  },
  create: function() {
    this.music = game.add.audio("Gummibar", 1, false);
    this.music.play();

    //game.globals.playTitleMusic();
    var _this = this;
    game.stage.backgroundColor = '#222222'

    backButton = this.game.add.sprite(game.width / 2, game.height - 120, "Sprites", "Food_CarrotBun_Good_1.png");
    backButton.anchor.setTo(0.5, 0.5);
    backButton.inputEnabled = true;
    backButton.events.onInputDown.add(function() {
      game.state.start("Title");
    });

    credits = this.game.add.sprite(50, 50, 'credits');
    credits.scale.setTo(3,3);

    var emitter = game.add.emitter(game.world.centerX, game.world.centerY, 250);
    emitter.makeParticles('Sprites', [0, 1, 2, 3, 4, 5]);
    emitter.minParticleSpeed.setTo(-400, -400);
    emitter.maxParticleSpeed.setTo(400, 400);
    emitter.gravity = 0;
    emitter.start(false, 4000, 15);


    var colors = ['#000000', '#ff0000', '#00ff00', '#0000ff'];
    setInterval(function() {
      game.stage.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
    }, 250);
  },
  update: function() {
  },
  render: function() {
    credits.bringToTop();
    backButton.bringToTop();
    game.debug.text('back', backButton.x-30, backButton.y+30, '#000000', '80px arial');
  },
  shutdown: function() {
    this.music.stop();
  }

};
