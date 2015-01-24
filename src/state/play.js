var FOOD_ITEM_SIZE = 160;
var CUSTOMER_SIZE = 240;

var Play = {
  preload: function() {
  },
  create: function() {
    var _this = this;

    // state vars
    this.numCustomerPositions = 0;
    this.customerPositions = {};
    this.customers = [];
    this.cash = 0;
    this.displayCash = 0;
    this.cashGoal = 0;
    this.timer = 0;
    this.foodTypes = [];
    this.maxFoodDepth = 1;
    
    // ui components
    this.game.add.sprite(0, 0, "Sprites", "Background_1.png");
    this.pottyGroup = game.add.group();
    this.customerGroup = game.add.group();
    this.game.add.sprite(0, game.height - 160, "Sprites", "Table_1.png");
    this.foodItems = game.add.group();
    this.scoreText = game.add.text(this.game.width - 150, 15, "Cash: " + this.displayCash, {fill: "#CCCCCC", font: "30px Impact"});
    this.timerText = game.add.text(10, 15, "Time: " + this.displayCash, {fill: "#CCCCCC", font: "30px Impact"});
    
    this.loadLevel();

    // hacky sweet move tracking
    var lastX = -1;
    var lastY = -1;
    var moveAmountX = -1;
    var moveAmountY = -1;
    game.input.addMoveCallback(function(pointer, x, y) {
      if (pointer.isDown && y > game.height - 150) {
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

    this.timer -= .01;
    this.timerText.text = "Time: " + this.timer.toFixed(2);
    if (this.timer <= 0) {
      console.log("YOU LOSE");
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
          var destX = -30 + (game.width + 40) / this.numCustomerPositions * i;
          var distance = destX - customer.position.x;
          this.customerPositions[i] = customer;
          game.add.tween(customer)
          .to({x: destX}, distance * 2.1)
          .start();
          game.add.tween(customer.state.thoughtBubble)
          .to({alpha: 1}, 500)
          .delay(1000)
          .start();
          break;
        }
      }
    }

    this.customers.forEach(function(customer) {
      if (customer.state.sick) {
        customer.scale.x = customer.scale.y = customer.y / customer.state.scaleStartY * .75 + .25;
        if (customer.scale.x > 1) {
          customer.scale.x = customer.scale.y = 1;
        }
        if (customer.scale.x < .5) {
          customer.scale.x = customer.scale.y = .5;
        }
      }
    });
  },
  render: function() {
  },
  loadLevel: function() {
    this.cashGoal = 50;
    this.timer = 100;
    this.numCustomerPositions = 3;
    // add items to scrollable list
    var numFoodItems = 8;
    this.foodTypes = [0, 1, 2];
    for (var i = 0; i < numFoodItems; i ++) {
      var food = this.makeFood();
      food.position.x = game.width / 2 - FOOD_ITEM_SIZE * numFoodItems / 2 + i * FOOD_ITEM_SIZE;
    }

    this.numPotties = 4;
    for (i = 0; i < this.numPotties; i ++) {
      this.pottyGroup.add(this.makePotty(15 + game.width / this.numPotties * i, 150));
    }

    // var food = this.foodItems.getFirstExists(false);
    // if (food) {
    //   food.reset(x + i * 63, game.height - height - 64 - hopHeight);
    // }
  },
  makeFood: function() {
    var _this = this;
    var foodType = this.foodTypes[Math.floor(Math.random() * this.foodTypes.length)];
    var food = this.makeFoodSprite(foodType, 0, game.height - FOOD_ITEM_SIZE);

    // set state
    food.state = {originalX: -1, originalY: -1, foodType: foodType};

    // drag and drop
    food.inputEnabled = true;
    food.input.enableDrag(false);
    food.events.onDragStart.add(function() {
      food.state.originalX = food.position.x;
      food.state.originalY = food.position.y;
    }, this);
    food.events.onDragStop.add(function() {
      // see if food landed on animal head. If it didn't, put it back
      var eaten = false;
      var sick = true;
      for (var i = 0; i < this.customers.length; i ++) {
        var customer = this.customers[i];
        game.physics.arcade.overlap(food, customer, function() {
          if (customer.state.sick) {
            return;
          }
          eaten = true;
          for (var j = customer.state.foodTypes.length - 1; j >= 0; j --) {
            var foodType = customer.state.foodTypes[j];
            if (foodType === food.state.foodType) {
              sick = false;
              break;
            }
          }
          if (sick) {
            customer.state.foodTypes = [];
            customer.state.sick = true;
            customer.state.jumpTween.stop();
            customer.state.scaleStartY = customer.y;
            customer.inputEnabled = true;
            customer.input.enableDrag(false);
          }
          else {
            customer.state.foodTypes.splice(j, 1);
          }
        });
        if (eaten) {
          break;
        }
      }

      if (eaten) {
        // fade out food that was eaten and thought bubble if last piece
        if (sick || !customer.state.foodTypes.length) {
          game.add.tween(customer.state.thoughtBubble)
          .to({alpha: 0}, 500)
          .start();
        }
        if (sick) {
          // TODO: play sick face
        }

        if (customer.state.foodTypes.length === 0 && !sick) {
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

          // TODO: make a cash particle
          var cashWon = Math.random() * 1 + 1;
          this.cash += cashWon;
          if (this.cash >= this.cashGoal) {
            // YOU WIN
            console.log("YOU WIN");
          }
          game.add.tween(this)
          .to({displayCash: this.cash}, 1000)
          .start();
        }

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
  makeFoodSprite: function(foodType, x, y) {
    var food = game.add.sprite(x, y, "Sprites");
    
    // set animation
    switch (foodType) {
      case 0: food.animations.add("chill", ["Food_CarrotBun_1.png"], 30, true); break;
      case 1: food.animations.add("chill", ["Food_CarrotBun_Sick_1.png"], 30, true); break;
      case 2: food.animations.add("chill", ["Food_FishBurger_Sick_1.png"], 30, true); break;
    }
    food.play("chill");

    return food;
  },
  makeCustomer: function() {
    var customer = game.add.sprite(-CUSTOMER_SIZE * 1.5, game.height - CUSTOMER_SIZE * 2.15);

    // state
    customer.state = {foodTypes: [], thoughtBubble: null, foodThoughts: [], sick: false, jumpTween: null, scaleStartY: -1};
    var foodDepth = Math.ceil(Math.random() * this.maxFoodDepth);
    for (var i = 0; i < foodDepth; i ++) {
      var foodType = this.foodTypes[Math.floor(Math.random() * this.foodTypes.length)];
      customer.state.foodTypes.push(foodType);
    }
    // graphics
    var body = game.add.sprite(0, 0, "Sprites");
    body.animations.add("walk", ["Customer_Bunny_Walk_1.png"], 15, true);
    body.play("walk");
    var thoughtBubble = game.add.sprite(60, -130, "Sprites", "Though_Bubble_1.png");
    thoughtBubble.alpha = 0;
    customer.state.thoughtBubble = thoughtBubble;
    for (i = 0; i < customer.state.foodTypes.length; i ++) {
      var foodThought = this.makeFoodSprite(customer.state.foodTypes[i]);
      foodThought.state = {foodType: customer.state.foodTypes[i]};
      thoughtBubble.addChild(foodThought);
      customer.state.foodThoughts.push(foodThought);
      // TODO: spread'em out
    }
    customer.addChild(body);
    customer.addChild(thoughtBubble);

    // animation
    var toY = customer.y - 30;
    customer.state.jumpTween = game.add.tween(customer).to({y: toY}, Math.random() * 100 + 100, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);

    // physics
    game.physics.enable(customer, Phaser.Physics.ARCADE);
    customer.body.width = 240;
    customer.body.height = 200;

    this.customerGroup.add(customer);

    return customer;
  },
  makePotty: function(x, y) {
    var potty = game.add.sprite(x, y);
    potty.state = {occupied: false, door: null};
    var pottyDoor = game.add.sprite(0, 0, "Sprites");
    potty.state.door = pottyDoor;
    pottyDoor.animations.add("unoccupied", ["Potty_Free_1.png"], 15, true);
    pottyDoor.animations.add("occupied", ["Potty_Taken_1.png"], 15, true);
    pottyDoor.play("unoccupied");
    potty.addChild(pottyDoor);

    return potty;
  }
};
