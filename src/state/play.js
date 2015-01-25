var FOOD_ITEM_SIZE = 160;
var CUSTOMER_SIZE = 240;

var Play = {
  preload: function() {
    game.load.image('mess', 'assets/mess.jpg');
  },
  create: function() {
    game.globals.playLevelMusic();
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
    this.cleaningUpPoop = false; // is the janitor currently cleaning up poop?
    
    // ui components
    this.game.add.sprite(0, 0, "ExtraSprites", "Background_Gameplay_1.png");
    this.pottyGroup = game.add.group();
    this.poopGroup = game.add.group();
    
    this.janitor = game.add.sprite(game.width + 200, 140, "Sprites");
    this.janitor.animations.add("walk", ["Janitor_Walk_1.png", "Janitor_Walk_2.png"], 2.5, true);
    this.janitor.animations.add("mop", ["Janitor_Mop_1.png", "Janitor_Mop_2.png"], 1.5, true);
    this.janitor.anchor.set(.5, .5);
    this.janitor.play("walk");
    
    this.customerGroup = game.add.group();
    this.game.add.sprite(0, game.height - 160, "ExtraSprites", "Table_1.png");
    this.foodItems = game.add.group();
    this.scoreText = game.add.text(this.game.width - 150, 15, "Cash: " + this.displayCash, {fill: "#cc0000", font: "30px Impact"});
    this.timerText = game.add.text(10, 15, "Time: " + this.displayCash, {fill: "#cc0000", font: "30px Impact"});
    
    // audio
    this.eatSound = game.add.audio("EatingFood", 1.0);
    this.moneyGainedSound = game.add.audio("MoneyGained", 1.0);
    this.pickUpFoodSound = game.add.audio("PickingUpFood", 1.0);
    this.sickSound = game.add.audio("UhOh", 1.0);
    this.winSound = game.add.audio("YouWin", 1.0);
    this.messSound = game.add.audio("MessSound", 1.0);
    this.janitorSound = game.add.audio("Janitor", 2.0);
    this.pottyDoorSound = game.add.audio("PortaPottyOpen", 1.0);
    this.moneyLostSound = game.add.audio("MoneyLost", 1.0);

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

    if (!game.state.ended) {
      this.timer -= .01;
      this.timerText.text = "Time: " + this.timer.toFixed(2);
      if (this.timer <= 0) {
        this.playerLost();
      }
    }
    
    // scroll the food items with pointer
    // console.log(game.input.activePointer.movementX);

    // make customer and move him to position
    if (!game.state.ended && this.customers.length < this.numCustomerPositions && (game.state.spawnCustomer())) {
      var customer = this.makeCustomer(this.customerTypes[Math.floor(Math.random() * this.customerTypes)]);
      this.customers.push(customer);
      for (var i = this.numCustomerPositions - 1; i >= 0; i --) {
        if (!this.customerPositions[i]) {
          var padding = 20;
          var destX = -30 + (game.width + 40) / this.numCustomerPositions * i;
          var distance = Math.abs(destX - customer.position.x);
          this.customerPositions[i] = customer;
          game.add.tween(customer)
          .to({x: destX}, distance * 2.1)
          .start();
          // game.add.tween(customer.state.thoughtBubble)
          // .to({alpha: 1}, 500)
          // .delay(1000)
          // .start();
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

    // clean up the poop
    if (this.poopGroup.children.length && !this.cleaningUpPoop) {
      this.cleaningUpPoop = true;

      // send out the janitor to clean the mess
      var targetMess = this.poopGroup.children[0];
      if (targetMess.x < this.janitor.x) {
        this.janitor.scale.x = -1;
      }
      else {
        this.janitor.scale.x = 1;
      }
      this.janitor.y = targetMess.y - 10;
      distance = Math.abs(targetMess.x - this.janitor.x);
      var tween1 = game.add.tween(this.janitor)
      .to({x: targetMess.x + targetMess.width / 2}, distance * 4.5)
      .start();
      tween1.onComplete.add(function() {
        _this.janitorSound.play();
        _this.janitor.play("mop");
        var tween2 = game.add.tween(targetMess)
        .to({alpha: 0}, 4500)
        .start();
        tween2.onComplete.add(function() {
          console.log('before: ', _this.cash);
          _this.cash -= game.state.janitorCost;
          console.log('after: ', _this.cash);
          _this.moneyLostSound.play()
          _this.poopGroup.remove(targetMess);
          _this.janitor.play("walk");
          if (!_this.poopGroup.children.length) {
            destX = Math.random() > .5 ? game.width + 200 : -200;
            if (destX < _this.janitor.x) {
              _this.janitor.scale.x = -1;
            }
            else {
              _this.janitor.scale.x = 1;
            }
            distance = Math.abs(destX - _this.janitor.x);
            var tween3 = game.add.tween(_this.janitor)
            .to({x: destX}, distance * 4.5)
            .start();
            tween3.onComplete.add(function() {
              _this.cleaningUpPoop = false;
            })
          }
          else {
            _this.cleaningUpPoop = false;
          }
        });
      });
    }
  },
  render: function() {
  },
  loadLevel: function() {
    this.cashGoal = game.state.cashGoal;
    this.timer = game.state.timer
    this.numCustomerPositions = game.state.numCustomerPositions;
    // add items to scrollable list
    var numFoodItems = game.state.numFoodItems;
    this.customerTypes = game.state.customerTypes;
    this.foodTypes = game.state.foodTypes;
    for (var i = 0; i < numFoodItems; i ++) {
      var food = this.makeFood();
      food.position.x = game.width / 2 - FOOD_ITEM_SIZE * numFoodItems / 2 + i * FOOD_ITEM_SIZE;
    }

    this.numPotties = game.state.numPotties;
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
    var food = this.makeFoodSprite(foodType, Math.random() > .8 ? true : false, 0, game.height - FOOD_ITEM_SIZE);

    // set state
    food.state = {originalX: -1, originalY: -1, foodType: foodType};

    // drag and drop
    food.inputEnabled = true;
    food.input.enableDrag(false);
    food.events.onDragStart.add(function() {
      food.state.originalX = food.position.x;
      food.state.originalY = food.position.y;
      this.pickUpFoodSound.play();
    }, this);
    food.events.onDragStop.add(function() {
      // see if food landed on animal head. If it didn't, put it back
      var eaten = false;
      var sick = true;
      var foodEaten;
      for (var i = 0; i < this.customers.length; i ++) {
        var customer = this.customers[i];
        game.physics.arcade.overlap(food, customer, function() {
          if (customer.state.sick) {
            return;
          }

          foodEaten = food;
          
          eaten = true;
          // play eat sound
          _this.eatSound.play();

          for (var j = customer.state.foodTypes.length - 1; j >= 0; j --) {
            var foodType = customer.state.foodTypes[j];
            if (foodType === food.state.foodType) {
              sick = false;
              break;
            }
          }
          if (sick) {
            customer.state.onBecomeSick();
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
          // game.add.tween(customer.state.thoughtBubble)
          // .to({alpha: 0}, 500)
          // .start();
        }
        if (sick) {
          // TODO: play sick face
          this.sickSound.play();
        }

        var cashWon = game.state.foodValue(foodEaten.state.type);
        // TODO: make a cash particle
        this.cash += cashWon;
        this.moneyGainedSound.play();
        if (this.cash >= this.cashGoal) {
          this.playerWon();
        }
        else if (this.cash < 0) {
          this.playerLost();
        }
        game.add.tween(this)
        .to({displayCash: this.cash}, 250)
        .start();

        if (customer.state.foodTypes.length === 0 && !sick) {
          // send customer off screen to right
          customer.state.leaveScene(1);
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
  // 0 - bunny
  // 1 - cat
  // 2 - dog
  // 3 - bird
  // 4 - frog
  makeFoodSprite: function(foodType, rotten, x, y) {
    var food = game.add.sprite(x, y, "Sprites");

    // set animation
    var foodName = "";
    var foodNames = null;
    switch (foodType) {
      case 0: foodNames = ["CarrotBun", "Salad"]; break;
      case 1: foodNames = ["FishKebob", "MouseBurger"]; break;
      case 2: foodNames = ["BoneBun", "SteakKebob"]; break;
      case 3: foodNames = ["WormBun", "CornBurger"]; break;
      case 4: foodNames = ["FlyKebob", "DragonBurger"]; break;
    }

    foodName = "Food_" + foodNames[Math.floor(Math.random() * foodNames.length)] + "_";
    if (rotten) {
      foodName += "Bad"
    }
    else {
      foodName += "Good"
    }
    foodName += "_1.png";
    food.animations.add("chill", [foodName], 30, true);
    food.play("chill");

    return food;
  },
  makeCustomer: function(type) {
    var _this = this;
    var customer = game.add.sprite(-CUSTOMER_SIZE * 1.5, game.height - CUSTOMER_SIZE * 2.15);

    // state
    customer.state = {
      foodTypes: [],
      // thoughtBubble: null,
      // foodThoughts: [],
      sick: false,
      jumpTween: null,
      scaleStartY: -1,
      body: null,
      leaveScene: null,
      messYoself: null,
      urgeToPurgeTimer: null
    };
    // var foodDepth = Math.ceil(Math.random() * this.maxFoodDepth);
    // for (var i = 0; i < foodDepth; i ++) {
    //   var foodType = this.foodTypes[Math.floor(Math.random() * this.foodTypes.length)];
    //   customer.state.foodTypes.push(foodType);
    // }
    // graphics

      // 0 - bunny
  // 1 - cat
  // 2 - dog
  // 3 - bird
  // 4 - frog

    var body = game.add.sprite(0, 0, "Sprites");
    customer.state.body = body;
    var animName = null;
    switch (type) {
      case 0: animName = "Bunny"; break;
      case 1: animName = "Cat"; break;
      case 2: animName = "Dog"; break;
      case 3: animName = "Bird"; break;
      case 4: animName = "Frog"; break;
    }
    body.animations.add("walk", ["Customer_" + animName + "_Standing_1.png"], 15, true);
    customer.state.foodTypes = [type];
    body.play("walk");
    // var thoughtBubble = game.add.sprite(60, -130, "Sprites", "Though_Bubble_1.png");
    // thoughtBubble.alpha = 0;
    // customer.state.thoughtBubble = thoughtBubble;
    // for (i = 0; i < customer.state.foodTypes.length; i ++) {
    //   var foodThought = this.makeFoodSprite(customer.state.foodTypes[i]);
    //   foodThought.state = {foodType: customer.state.foodTypes[i]};
    //   thoughtBubble.addChild(foodThought);
    //   customer.state.foodThoughts.push(foodThought);
    //   // TODO: spread'em out
    // }
    customer.addChild(body);
    // customer.addChild(thoughtBubble);

    // animation
    var toY = customer.y - 30;
    customer.state.jumpTween = game.add.tween(customer).to({y: toY}, Math.random() * 100 + 100, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);

    // physics
    game.physics.enable(customer, Phaser.Physics.ARCADE);
    customer.body.width = 240;
    customer.body.height = 200;

    this.customerGroup.add(customer);

    customer.state.onBecomeSick = function() {
      customer.state.foodTypes = [];
      customer.state.sick = true;
      customer.state.jumpTween.stop();
      customer.state.scaleStartY = customer.y;
      customer.inputEnabled = true;
      customer.input.enableDrag(false);
      customer.events.onDragStop.add(function() {
        customer.y = 200; // align with bottom of potties
        if (!customer.state.urgeToPurgeTimer) {
          customer.state.urgeToPurgeTimer = setTimeout(function() {
            customer.input.disableDrag();
            customer.input.stop();
            customer.state.messYoself();
          }, 3000);
        }
        for (var i=0; i<_this.pottyGroup.children.length; i++) {
          var potty = _this.pottyGroup.getChildAt(i);
          game.physics.arcade.overlap(customer, potty, function() {
            potty.state.occupy(customer);
          });
        }
      });
    };

    customer.state.leaveScene = function (direction) {
      // remove customer from position and array
      for (i = _this.customers.length; i >= 0; i --) {
        if (_this.customers[i] === customer) {
          _this.customers.splice(i, 1);
        }
      }
      for (i = 0; i < _this.numCustomerPositions; i ++) {
        if (_this.customerPositions[i] === customer) {
          _this.customerPositions[i] = null;
        }
      }

      var distance = game.width - customer.position.x;
      game.add.tween(customer)
      .to({x: game.width}, distance * 3.3 * direction)
      .start();
    };

    customer.state.messYoself = function () {
      _this.messSound.play();
      _this.makeMess(customer.x - (customer.width /2), 
        customer.y + customer.height + 100);
      customer.state.leaveScene(1);
    };

    return customer;
  },
  makePotty: function(x, y) {
    var _this = this;
    var potty = game.add.sprite(x, y);
    potty.state = {occupied: false, door: null, spinner: null};
    
    var pottyDoor = game.add.sprite(0, 0, "Sprites");
    potty.state.door = pottyDoor;
    pottyDoor.animations.add("unoccupied", ["Potty_1.png"], 15, true);
    pottyDoor.play("unoccupied");

    var pottySpinner = game.add.sprite(pottyDoor.width / 2, 72, "Sprites", "Potty_Alert_1.png");
    potty.state.spinner = pottySpinner;
    pottySpinner.anchor.set(.5, .5);
    
    potty.addChild(pottySpinner);
    potty.addChild(pottyDoor);

    // physics
    game.physics.enable(potty, Phaser.Physics.ARCADE);
    potty.body.width = 162;
    potty.body.height = 286;

    potty.state.occupy = function(customer) {
      if (potty.state.occupied) return;
      clearTimeout(customer.state.urgeToPurgeTimer);
      customer.visible = false;
      potty.state.occupied = true;
      _this.pottyDoorSound.play();
      potty.state.door.play("occupied");
      setTimeout(function() { potty.state.unoccupy(customer) }, game.state.pottyTime(customer));

      game.add.tween(potty.state.spinner)
      .to({rotation: Math.PI}, 750, Phaser.Easing.Elastic.Out)
      .start();
    };

    potty.state.unoccupy = function(customer) {
      potty.state.occupied = false;
      customer.visible = true;
      _this.pottyDoorSound.play();
      potty.state.door.play("unoccupied");
      customer.state.body.play("walk"); // TODO: relieved face?
      var toY = customer.y - 10;
      customer.state.jumpTween = game.add.tween(customer).to({y: toY}, Math.random() * 100 + 100, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);
      customer.state.leaveScene(1);

      game.add.tween(potty.state.spinner)
      .to({rotation: 0}, 750, Phaser.Easing.Elastic.Out)
      .start();
    };

    return potty;
  },
  makeMess: function(x,y) {
    var mess = game.add.sprite(x,y,'mess');
    mess.scale.setTo(0.25, 0.25);
    this.poopGroup.add(mess);

    return mess;
  },
  playerLost: function() {
    if (game.state.ended) return;
    game.state.ended = true; // prevent repeated calls per frame
    console.log("YOU LOSE");
    this.sickSound.play();
    while (this.customers.length) {
      this.customers[0].state.leaveScene(1);
    }
    setTimeout(function() {
      game.state.ended = false;
      game.state.start("Title");
    }, 4000);
  },
  playerWon: function() {
    if (game.state.ended) return;
    game.state.ended = true;
    console.log("YOU WIN");
    this.winSound.play();
    while (this.customers.length) {
      this.customers[0].state.leaveScene(1);
    }
    setTimeout(function() {
      game.state.ended = false;
      game.state.start("LevelSelect");
    }, 4000);
  }
};
