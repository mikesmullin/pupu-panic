var Goal = {
  preload: function() {
  },
  create: function() {
    var _this = this;
    this.sfxButtonClick = game.add.audio("ButtonClick", 1.0);
    game.stage.backgroundColor = '#865a32'

    var text = ''
      +"Level "+game.state.level+"\n\n\n"
      +"Hints:\n"
      +"\n"
      +"- "+game.state.goals.join("\n\n- ")+"\n";
    var t = game.add.text(game.world.centerX, 50, text, {
      font: "65px Bangers",
      fill: "#fff",
      align: "left"
    });
    t.anchor.setTo(.5,0);

    // tap to proceed
    //this.btn_ok = this.game.add.sprite(game.world.centerX-100, game.height - 200,
    //  "Sprites", "Food_CarrotBun_Good_1.png");
    //var label = game.add.text(this.btn_ok.x+(this.btn_ok.width/2), this.btn_ok.y+(this.btn_ok.height/2), 'ok', {
    //  font: '80px Bangers',
    //  fill: '#000'
    //});
    //label.anchor.setTo(.5,.5);
    //this.btn_ok.inputEnabled = true;
    //this.btn_ok.events.onInputDown.add(function() {
    this.game.input.onDown.add(function() {
      _this.sfxButtonClick.play();
      game.state.start("Play");
    });
  },
  update: function() {
  },
  render: function() {
  },
  shutdown: function() {
  }
};
