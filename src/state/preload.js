var Preload = {
  preload: function() {
    var preloadBar = game.add.sprite(0, game.height / 2 - 10, "PreloadBar");
    game.load.setPreloadSprite(preloadBar, 0);

    // Load atlas
    game.load.atlas("Sprites", "assets/Pupu_Assets.png", "assets/Pupu_Assets.json", null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.audio("Music", ["assets/MegaBlaster.mp3", "assets/MegaBlaster.ogg"]);

    game.load.audio("Music", ["assets/MegaBlaster.mp3", "assets/MegaBlaster.ogg"]);
    
    game.load.audio("ButtonClick", ["assets/Button_Click_1.mp3", "assets/Button_Click_1.ogg"]);
    game.load.audio("EatingFood", ["assets/Eating_Food_1.mp3", "assets/Eating_Food_1.ogg"]);
    game.load.audio("FindingPotty", ["assets/Finding_Potty.mp3", "assets/Finding_Potty.ogg"]);
    game.load.audio("Janitor", ["assets/Janitor.mp3", "assets/Janitor.ogg"]);
    game.load.audio("MessSound", ["assets/Mess_Sound.mp3", "assets/Mess_Sound.ogg"]);
    game.load.audio("MoneyGained", ["assets/Money_Gained_1.mp3", "assets/Money_Gained_1.ogg"]);
    game.load.audio("MoneyLost", ["assets/MoneyLost_1.mp3", "assets/MoneyLost_1.ogg"]);
    game.load.audio("PickingUpFood", ["assets/Picking_up_food_1.mp3", "assets/Picking_up_food_1.ogg"]);
    game.load.audio("PortaPottyOpen", ["assets/Porta_Potty_Open_1.mp3", "assets/Porta_Potty_Open_1.ogg"]);
    game.load.audio("ScrollBarClick", ["assets/Scroll_bar_Click_1.mp3", "assets/Scroll_bar_Click_1.ogg"]);
    game.load.audio("UhOh", ["assets/uh_oh_1.mp3", "assets/uh_oh_1.ogg"]);
    game.load.audio("YouWin", ["assets/You_Win_1.mp3", "assets/You_Win_1.ogg"]);
  },
  create: function() {
    this.game.state.start("Title");
    var music = game.add.audio("Music", 0.7, true);
    // so sick of this music
    music.play();
  },
  update: function() {
  },
  render: function() {
  }
};
