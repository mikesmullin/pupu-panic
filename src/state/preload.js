var Preload = {
  preload: function() {
    game.background = game.add.sprite(game.width / 2 - 50, game.height / 2 - 40, "Loading");
    var preloadBar = game.add.sprite(0, game.height / 2 - 10, "PreloadBar");
    game.load.setPreloadSprite(preloadBar, 0);

    // Load atlas
    game.load.atlas("Sprites", "assets/Pupu_Assets.png", "assets/Pupu_Assets.json", null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.atlas("ExtraSprites", "assets/Title_Screen.png", "assets/Title_Screen.json", null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

    game.load.image('mess', 'assets/mess.png');

    game.load.audio("TitleMusic", ["assets/Title_Music_mix.mp3", "assets/Title_Music_mix.ogg"]);
    game.load.audio("LevelMusicIntro", ["assets/lvl_Intro_1.mp3", "assets/lvl_Intro_1.ogg"]);
    game.load.audio("LevelMusicLoop", ["assets/lvl_Loop_1.mp3", "assets/lvl_Loop_1.ogg"]);

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
    game.load.audio("YouLose", ["assets/Lose_1.mp3", "assets/Lose_1.ogg"]);

    game.load.audio("Gummibar", ["assets/gummibar_funny_dj.mp3", "assets/gummibar_funny_dj.ogg"]);
  },
  create: function() {
    /*
    game.globals.playTitleMusic();
    // this will be the first page displayed on load
    game.state.start("Title");
    */

    // uncomment below for faster dev iteration
    game.state.cashGoal = 99;
    game.state.timer = 99;
    game.state.numCustomerPositions = 3;
    game.state.numFoodItems = 8;
    game.state.customerTypes = [0, 1, 2, 3, 4];
    game.state.foodTypes = [0, 1, 2, 3, 4];
    game.state.numPotties = 2;
    game.state.makeFood = function() {
      return {
        type: Math.floor(Math.random() * game.state.foodTypes.length),
        rotten: Math.random() * 2 < 1
      }
    }
    game.state.spawnCustomer = function() {
      return true;
    }
    game.state.pottyTime = function(customer) {
      return 1000;
    }
    game.state.foodValue = function(foodType) {
      return Math.random() * 1 + 1;
    }
    game.state.janitorCost = 5;
    game.state.start("Play");
    /*
    */
  },
  update: function() {
  },
  render: function() {
  }
};
