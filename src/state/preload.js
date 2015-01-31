var Preload = {
  preload: function() {
    game.background = game.add.sprite(game.width / 2 - 50, game.height / 2 - 40, "Loading");
    var preloadBar = game.add.sprite(0, game.height / 2 - 10, "PreloadBar");
    game.load.setPreloadSprite(preloadBar, 0);

    // Load atlas
    game.load.atlas("Sprites", "assets/Pupu_Assets.png", "assets/Pupu_Assets.json", null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    game.load.atlas("ExtraSprites", "assets/Title_Screen.png", "assets/Title_Screen.json", null, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

    game.load.image('mess', 'assets/mess.png');
    game.load.image('CashPlus', 'assets/cash_plus.png');
    game.load.image('CashMinus', 'assets/cash_minus.png');

    game.load.audio("TitleMusic", ["assets/Title_Music_mix.ogg", "assets/Title_Music_mix.m4a"]);
    game.load.audio("LevelMusicIntro", ["assets/lvl_Intro_1.ogg", "assets/lvl_Intro_1.m4a"]);
    game.load.audio("LevelMusicLoop", ["assets/lvl_Loop_1.ogg", "assets/lvl_Loop_1.m4a"]);
    game.load.audio("ButtonClick", ["assets/Button_Click_1.ogg", "assets/Button_Click_1.m4a"]);
    game.load.audio("EatingFood", ["assets/Eating_Food_1.ogg", "assets/Eating_Food_1.m4a"]);
    game.load.audio("FindingPotty", ["assets/Finding_Potty.ogg", "assets/Finding_Potty.m4a"]);
    game.load.audio("Janitor", ["assets/Janitor.ogg", "assets/Janitor.m4a"]);
    game.load.audio("MessSound", ["assets/Mess_Sound.ogg", "assets/Mess_Sound.m4a"]);
    game.load.audio("MoneyGained", ["assets/Money_Gained_1.ogg", "assets/Money_Gained_1.m4a"]);
    game.load.audio("MoneyLost", ["assets/MoneyLost_1.ogg", "assets/MoneyLost_1.m4a"]);
    game.load.audio("PickingUpFood", ["assets/Picking_up_food_1.ogg", "assets/Picking_up_food_1.m4a"]);
    game.load.audio("PortaPottyOpen", ["assets/Porta_Potty_Open_1.ogg", "assets/Porta_Potty_Open_1.m4a"]);
    game.load.audio("ScrollBarClick", ["assets/Scroll_bar_Click_1.ogg", "assets/Scroll_bar_Click_1.m4a"]);
    game.load.audio("UhOh", ["assets/uh_oh_1.ogg", "assets/uh_oh_1.m4a"]);
    game.load.audio("YouWin", ["assets/You_Win_1.ogg", "assets/You_Win_1.m4a"]);
    game.load.audio("YouLose", ["assets/Lose_1.ogg", "assets/Lose_1.m4a"]);
  },
  create: function() {
    game.globals.playTitleMusic();
    // this will be the first page displayed on load
    game.state.start("Title");
    /*
    */

    /*
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
    */
  },
  update: function() {
  },
  render: function() {
  }
};
