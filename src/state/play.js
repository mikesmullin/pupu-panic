var FOOD_ITEM_SIZE = 64;

var Play = {
  preload: function() {
  },
  create: function() {
    var _this = this;
    this.foodItems = game.add.group();
    this.loadLevel();

    // hacky move tracking
    var lastX = -1;
    var lastY = -1;
    var moveAmountX = -1;
    var moveAmountY = -1;
    game.input.addMoveCallback(function(pointer, x, y) {
      if (pointer.isDown && y > game.height - 100) {
        moveAmountX = x - lastX;
        moveAmountY = y - lastY;
        if (lastX != -1) {
          this.foodItems.children.forEach(function(foodItem) {
            // foodItem.body.velocity.x = moveAmountX;
            foodItem.position.x += moveAmountX;
            foodItem.originalX += moveAmountX;
            if (foodItem.position.x < game.width / 2 - _this.foodItems.children.length * FOOD_ITEM_SIZE / 2) {
              foodItem.position.x += _this.foodItems.children.length * FOOD_ITEM_SIZE;
            }
            if (foodItem.position.x > game.width / 2 + _this.foodItems.children.length * FOOD_ITEM_SIZE / 2) {
              foodItem.position.x -= _this.foodItems.children.length * FOOD_ITEM_SIZE;
            }
          });
        }
        lastX = x;
      }
      else {
        // deccelerate after dragging
        // if (lastX !== -1 || lastY !== -1) {
        //   this.foodItems.children.forEach(function(foodItem) {
        //     foodItem.body.velocity.x = moveAmountX * 10;
        //   });          
        // }
        lastX = -1;
        lastY = -1;
      }
    }, this);
  },
  update: function() {
    var _this = this;
    
    // scroll the food items with pointer
    // console.log(game.input.activePointer.movementX);
  },
  render: function() {
  },
  loadLevel: function() {
    // add items to scrollable list
    var numFoodItems = 11;
    for (var i = 0; i < numFoodItems; i ++) {
      var food = this.makeFood();
      food.position.x = game.width / 2 - FOOD_ITEM_SIZE * numFoodItems / 2 + i * FOOD_ITEM_SIZE;
    }

    // var food = this.foodItems.getFirstExists(false);
    // if (food) {
    //   food.reset(x + i * 63, game.height - height - 64 - hopHeight);
    // }
  },
  makeFood: function() {
    var catNum = Math.floor(Math.random() * 3) + 1;
    var food = game.add.sprite(0, game.height - FOOD_ITEM_SIZE, "Sprites");
    food.originalX = -1;
    food.originalY = -1;
    food.animations.add("hop", ["Cat" + catNum + "_1.png", "Cat" + catNum + "_2.png"], 10, true);
    food.play("hop");
    food.inputEnabled = true;
    food.input.enableDrag(false);
    food.events.onDragStart.add(function() {
      food.originalX = food.position.x;
      food.originalY = food.position.y;
    }, this);
    food.events.onDragStop.add(function() {
      // see if food landed on animal head. If it didn't, put it back
      // game.physics.arcade.overlap(food, animal, function() {
      //   // ... do something here
      // });

      game.add.tween(food)
      .to({x: food.originalX, y: food.originalY}, 100)
      .start();
    }, this);
    game.physics.enable(food, Phaser.Physics.ARCADE);
    // food.body.drag.x = 5;
    // food.body.drag.y = 5;
    this.foodItems.add(food);

    return food; 
  }
  // onSwipe: function() {
  //   if (Phaser.Point.distance(game.input.activePointer.position, game.input.activePointer.positionDown) > 150 && game.input.activePointer.duration > 100 && game.input.activePointer.duration < 250) {
  //     firstPointX = game.input.activePointer.positionDown.x;
  //     firstPointY = game.input.activePointer.positionDown.y;
      
  //     lastPointX = game.input.activePointer.position.x;
  //     lastPointY = game.input.activePointer.position.y;
      
  //     swiping = true;
  //     console.log("SWIPING!");
  //   }
  // },
};
