var FOOD_ITEM_SIZE = 64;
var CUSTOMER_SIZE = 200;

var Play = {
  preload: function() {
  },
  create: function() {
    var _this = this;
    this.foodItems = game.add.group();
    this.numCustomerPositions = 0;
    this.customerPositions = {};
    this.customers = [];
    this.cash = 0;
    this.displayCash = 0;
    this.cashGoal = 0;

    this.scoreText = game.add.text(this.game.width - 150, 15, "Cash: " + this.displayCash, {fill: "#CCCCCC", font: "30px Impact"});

    this.loadLevel();

    // hacky sweet move tracking
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
            foodItem.state.originalX += moveAmountX;
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

    // update cash text
    if (this.displayCash !== this.cash) {
      this.scoreText.text = "Cash: " + this.displayCash.toFixed(2);
    }

    
    // scroll the food items with pointer
    // console.log(game.input.activePointer.movementX);

    // make customer and move him to position
    if (this.customers.length < this.numCustomerPositions && Math.random() > .99) {
      var customer = this.makeCustomer();
      this.customers.push(customer);
      for (var i = this.numCustomerPositions - 1; i >= 0; i --) {
        if (!this.customerPositions[i]) {
          var padding = 20;
          var destX = (game.width - CUSTOMER_SIZE - padding) / this.numCustomerPositions * i + padding / 2;
          var distance = destX - customer.position.x;
          this.customerPositions[i] = customer;
          game.add.tween(customer)
          .to({x: destX}, distance * 3.3)
          .start();
          break;
        }
      }
    }
  },
  render: function() {
  },
  loadLevel: function() {
    this.cashGoal = 50;
    this.numCustomerPositions = 3;
    // add items to scrollable list
    var numFoodItems = 15;
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
    var _this = this;
    var catNum = Math.floor(Math.random() * 3) + 1;
    var food = game.add.sprite(0, game.height - FOOD_ITEM_SIZE, "Sprites");
    food.state = {originalX: -1, originalY: -1};
    food.animations.add("hop", ["Cat" + catNum + "_1.png", "Cat" + catNum + "_2.png"], 10, true);
    food.play("hop");
    food.inputEnabled = true;
    food.input.enableDrag(false);
    food.events.onDragStart.add(function() {
      food.state.originalX = food.position.x;
      food.state.originalY = food.position.y;
    }, this);
    food.events.onDragStop.add(function() {
      // see if food landed on animal head. If it didn't, put it back
      var eaten = false;
      for (var i = 0; i < this.customers.length; i ++) {
        var customer = this.customers[i];
        game.physics.arcade.overlap(food, customer, function() {
          eaten = true;
        });
        if (eaten) {
          break;
        }
      }

      if (eaten) {
        // remove customer from position and array
        for (i = this.customers.length; i >= 0; i --) {
          if (this.customers[i] === customer) {
            this.customers.splice(i, 1);
          }
        }
        for (i = 0; i < this.numCustomerPositions; i ++) {
          if (this.customerPositions[i] === customer) {
            this.customerPositions[i] = null;
          }
        }

        // send customer off screen
        var distance = game.width - customer.position.x;
        game.add.tween(customer)
        .to({x: game.width}, distance * 3.3)
        .start();

        var cashWon = Math.random() * 1 + 1;
        this.cash += cashWon;
        if (this.cash >= this.cashGoal) {
          // YOU WIN
          console.log("YOU WIN");
        }
        game.add.tween(this)
        .to({displayCash: this.cash}, 1000)
        .start();

        // TODO: make a cash particle

        // add new piece of food
        var replacementFood = this.makeFood();
        replacementFood.x = food.state.originalX;
        replacementFood.y = game.height;
        game.add.tween(replacementFood)
        .to({x: food.state.originalX, y:food.state.originalY}, 100)
        .start();        
        
        food.kill();
        this.foodItems.remove(food);
      }
      else {
        game.add.tween(food)
        .to({x: food.state.originalX, y: food.state.originalY}, 100)
        .start();
      }
    }, this);
    game.physics.enable(food, Phaser.Physics.ARCADE);
    // food.body.drag.x = 5;
    // food.body.drag.y = 5;
    this.foodItems.add(food);

    return food; 
  },
  makeCustomer: function() {
    var customer = game.add.sprite(-100, game.height - CUSTOMER_SIZE);
    game.physics.enable(customer, Phaser.Physics.ARCADE);
    customer.body.width = 124;
    customer.body.height = 96;
    var motoBody = this.game.add.sprite(0, 0, "Sprites");
    motoBody.animations.add("drive", ["MotorcycleBody_1.png", "MotorcycleBody_2.png", "MotorcycleBody_3.png", "MotorcycleBody_2.png"], 15, true);
    motoBody.play("drive");
    var motoRider = this.game.add.sprite(0, 0, "Sprites");
    motoRider.animations.add("drive", ["MotorcycleRider_1.png", "MotorcycleRider_2.png", "MotorcycleRider_3.png", "MotorcycleRider_2.png"], 25, true);
    motoRider.play("drive");
    var motoFront = this.game.add.sprite(0, 0, "Sprites", "MotorcycleDash_1.png");
    customer.addChild(motoBody);
    customer.addChild(motoRider);
    customer.addChild(motoFront);

    return customer;
  }
};
