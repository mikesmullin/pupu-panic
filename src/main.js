var game = new Phaser.Game(720, 1100, Phaser.AUTO, "");
game.state.add("Boot", Boot);
game.state.add("Preload", Preload);
game.state.add("Title", Title);
game.state.add("LevelSelect", LevelSelect);
game.state.add("Play", Play);
game.state.start("Boot");

var highScore = 0;
