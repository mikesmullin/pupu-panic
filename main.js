var game = new Phaser.Game(750, 1100, Phaser.AUTO, "");

game.globals = {
  playTitleMusic: function() {
    if (!game.globals.titleMusic) {
      if (game.globals.levelIntroMusic) {
        game.globals.levelIntroMusic.fadeOut(500);
        game.globals.levelIntroMusic = null;
      }
      if (game.globals.levelLoopMusic) {
        game.globals.levelLoopMusic.fadeOut(500);
        game.globals.levelLoopMusic = null;
      }

      game.globals.titleMusic = game.add.audio("TitleMusic", 0.33, true);
      game.globals.titleMusic.play();
    }
  },
  playLevelMusic: function() {
    if (!game.globals.levelIntroMusic && !game.globals.levelLoopMusic) {
      if (game.globals.titleMusic) {
        game.globals.titleMusic.fadeOut(500);
        game.globals.titleMusic = null;
      }

      game.globals.levelIntroMusic = game.add.audio("LevelMusicIntro", 0.33, false);
      game.globals.levelIntroMusic.onStop.add(function() {
        if (game.globals.levelLoopMusic) {
          game.globals.levelLoopMusic.play();
        }
      });
      game.globals.levelLoopMusic = game.add.audio("LevelMusicLoop", 0.33, true);
      game.globals.levelIntroMusic.play();
    }
  }
};

game.state.add("Boot", Boot);
game.state.add("Preload", Preload);
game.state.add("Title", Title);
game.state.add("Credits", Credits);
game.state.add("LevelSelect", LevelSelect);
game.state.add("Goal", Goal);
game.state.add("Play", Play);
game.state.start("Boot");

var highScore = 0;

var highestLevelBeat = parseInt(localStorage.getItem("highestLevelBeat"));
highestLevelBeat = highestLevelBeat || 0;
