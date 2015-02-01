var FOOD_ITEM_SIZE = 182;
var CUSTOMER_SIZE = 240;

var Play = {
  preload: function() {
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
    //this.game.add.sprite(0, 0, "ExtraSprites", "Awning_1.png");
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

    // audio
    this.eatSound = game.add.audio("EatingFood", 1.0);
    this.moneyGainedSound = game.add.audio("MoneyGained", 1.0);
    this.pickUpFoodSound = game.add.audio("PickingUpFood", .7);
    this.sickSound = game.add.audio("UhOh", 1.0);
    this.winSound = game.add.audio("YouWin", 1.0);
    this.loseSound = game.add.audio("YouLose", 1.0);
    this.messSound = game.add.audio("MessSound", 1.0);
    this.janitorSound = game.add.audio("Janitor", 4.0);
    this.pottyDoorSound = game.add.audio("PortaPottyOpen", 1.0);
    this.moneyLostSound = game.add.audio("MoneyLost", 6.0);

    var emitterTypes = ['Plus','Minus'], emitterLifespan = 2000;
    for (var i in emitterTypes) {
      var type = emitterTypes[i]
        , emitter = this['cash'+type+'Emitter'] = game.add.emitter(0, 0, 10);
      emitter.makeParticles('Cash'+type);
      emitter.setAlpha(1, 0, emitterLifespan, Phaser.Easing.Cubic.In);
      emitter.setScale(1, 3, 1, 3, emitterLifespan, Phaser.Easing.Linear.None);
      emitter.setRotation(1, 3);
      emitter.gravity = 0;
      emitter.minParticleSpeed.setTo(40, -100);
      emitter.maxParticleSpeed.setTo(-40, -200);
      emitter.lifespan = emitterLifespan;
    }

    this.loadLevel();
    this.timerText = game.add.text(30, 30, "", {fill: "#252525", font: "50px Bangers"});
    this.scoreText = game.add.text(this.game.width - 230, 30, "", {fill: "#252525", font: "50px Bangers"});

    // sliding table of foods
    var lastX = -1;
    var lastY = -1;
    var moveAmountX = -1;
    var moveAmountY = -1;
    var deltaX = 0;
    var MAX = (((2+game.state.numFoodItems) * FOOD_ITEM_SIZE) - game.width) / 2;
    var MIN = MAX * -1;
    var SPEED = 1.8;
    game.input.addMoveCallback(function(pointer, x, y) {
      if (pointer.isDown && y > game.height - 150) {
        x = pointer.clientX;
        y = pointer.clientY;
        moveAmountX = (x - lastX) * SPEED;
        moveAmountY = (y - lastY) * SPEED;
        if (lastX != -1) {
          var dX = deltaX + moveAmountX
            , mX = 0;
          if (moveAmountX > 0) {
            if (dX < MAX) {
              mX = moveAmountX;
            }
            else {
              mX = MAX - deltaX;
            }
          }
          else if (moveAmountX < 0) {
            if (dX > MIN) {
              mX = moveAmountX;
            }
            else {
              mX = MIN - deltaX;
            }
          }
          if (mX != 0 && Math.abs(mX) < 80) {
            deltaX += mX;
            this.foodItems.children.forEach(function(foodItem) {
              foodItem.position.x += mX;
              foodItem.state.originalX += mX;
            });
          }
        }
        lastX = x;
      }
      else {
        lastX = -1;
        lastY = -1;
      }
    }, this);
  },
  update: function() {
    var _this = this;

    // update cash text
    this.scoreText.text = "Cash " + this.displayCash.toFixed(0) + "/" + this.cashGoal.toFixed(0) + " ";

    // update timer text
    if (!game.state.ended) {
      this.timer -= .01;
      this.timerText.text = "Time " + this.timer.toFixed(0) + " ";
      if (this.timer <= 0) {
        this.playerLost();
      }
    }

    // scroll the food items with pointer
    // console.log(game.input.activePointer.movementX);

    // make customer and move him to position
    if (!game.state.ended && this.customers.length < this.numCustomerPositions && (game.state.spawnCustomer())) {
      var randomType = this.customerTypes[Math.floor(Math.random() * this.customerTypes.length)]
      var customer = this.makeCustomer(randomType);
      this.customers.push(customer);
      for (var i = this.numCustomerPositions - 1; i >= 0; i--) {
        if (!this.customerPositions[i]) {
          var spacing =
            (game.width - (customer.body.width*this.numCustomerPositions)) / (this.numCustomerPositions + 1);
          var destX =
            ((spacing + customer.body.width) * (i+1)) - (customer.body.width/2);

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

    // scale the customer large/small depending on y to give affect
    // of dragging customer far away into background so they are
    // proportionally sized with potty
    var MAX = 1, MIN = .60;
    this.customers.forEach(function(customer) {
      if (customer.state.sick) {
        game.state.activeCustomer = customer;
        customer.scale.x = customer.scale.y = customer.y / customer.state.scaleStartY * .75 + .25;
        if (customer.scale.x > MAX) {
          customer.scale.x = customer.scale.y = MAX;
        }
        if (customer.scale.x < MIN) {
          customer.scale.x = customer.scale.y = MIN;
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
      this.janitor.y = targetMess.y - 70;
      var working = game.add.group();
      working.add(this.janitor);
      working.add(targetMess);
      targetMess.bringToTop();
      distance = Math.abs(targetMess.x - this.janitor.x);
      var tween1 = game.add.tween(this.janitor)
      .to({x: targetMess.x + targetMess.width / 2}, distance * 4.5)
      .start();
      tween1.onComplete.add(function() {
        _this.janitorSound.play();
        _this.janitor.play("mop");
        var tween2 = game.add.tween(targetMess)
        .to({alpha: 0}, 3000)
        .start();
        tween2.onComplete.add(function() {
          _this.adjustCash(game.state.janitorCost * -1, targetMess);
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
    //game.debug.pointer(game.input.activePointer);
    //if (game.state.activeCustomer) {
    //  game.debug.bodyInfo(game.state.activeCustomer, 0, 340, 'rgb(0,0,0)');
    //}
    //for (var i in this.customers) {
    //  var customer = this.customers[i];
    //  game.debug.body(customer, 'rgba(0,255,0,1)', false);
    //}
    //this.pottyGroup.children.forEach(function(potty) {
    //  game.debug.body(potty, 'rgba(255,0,0,1)', false);
    //});
    //this.foodItems.children.forEach(function(food) {
    //  game.debug.body(food, 'rgba(0,0,255,1)', false);
    //});
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
      food.state.originalX = food.position.x = game.width / 2 - FOOD_ITEM_SIZE * numFoodItems / 2 + i * FOOD_ITEM_SIZE;
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
    var _the_food = game.state.makeFood();
    var foodType = this.foodTypes[_the_food.type];
    var food = this.makeFoodSprite(foodType, _the_food.rotten, 0, game.height - (FOOD_ITEM_SIZE/2));

    // set state
    food.state = {originalX: -1, originalY: -1, foodType: foodType,
      rotten: _the_food.rotten };
    food.state.originalY = food.position.y;

    // drag and drop
    food.inputEnabled = true;
    food.input.enableDrag(true);
    food.events.onDragStart.add(function() {
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
            if (customer.state.type == 'Frog' && food.state.rotten) {
              sick = false;
              break;
            }
            else if (foodType === food.state.foodType && !food.state.rotten) {
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
        else {
          customer.state.face.play('happy');
        }


        if (customer.state.foodTypes.length === 0 && !sick) {
          var cashWon = game.state.foodValue(foodEaten.state.type);
          this.adjustCash(cashWon, customer);

          // send customer off screen to right
          customer.state.leaveScene(1);
        }

        // add new piece of food
        var replacementFood = this.makeFood();
        replacementFood.state.originalX = replacementFood.x = food.state.originalX;
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
    food.body.setSize(50, 50);

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
    food.anchor.set(.5,.5);

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
    var customer = game.add.sprite(-CUSTOMER_SIZE * 1.5, game.height - CUSTOMER_SIZE * 1.2);

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
    var animName = null;
    switch (type) {
      case 0: animName = "Bunny"; break;
      case 1: animName = "Cat"; break;
      case 2: animName = "Dog"; break;
      case 3: animName = "Bird"; break;
      case 4: animName = "Frog"; break;
    }

    var body = game.add.sprite(0, 0, "Sprites");
    customer.state.body = body;
    customer.state.type = animName;
    body.animations.add("walk", ["Customer_" + animName + "_Standing_1.png"], 15, true);
    body.animations.add("gtg", ["Customer_" + animName + "_Holding_1.png"], 15, true);
    customer.state.foodTypes = [type];
    body.play("walk");
    customer.addChild(body);

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
    // customer.addChild(thoughtBubble);

    var face = game.add.sprite(3, animName == 'Bunny' ? 0 : -30, "Sprites");
    customer.state.face = face;
    var emotes = ['Anger', 'Happy', 'Neutral'];
    for (var i=0; i<emotes.length; i++) {
      var emote = emotes[i];
      face.animations.add(emote.toLowerCase(), ["Face_" + animName + "_"+emote+"_1.png"], 15, true);
    }
    face.play("neutral");
    customer.addChild(face);
    face.bringToTop();


    // animation
    var toY = customer.y - 30;
    customer.state.jumpTween = game.add.tween(customer).to({y: toY}, Math.random() * 100 + 100, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);

    // physics
    game.physics.enable(customer, Phaser.Physics.ARCADE);
    customer.body.setSize(170, 340, 0, -70);
    customer.anchor.set(.5, .5);
    customer.state.body.anchor.set(.5, .5);
    customer.state.face.anchor.set(.5, 1);

    this.customerGroup.add(customer);

    customer.state.onBecomeSick = function() {
      customer.state.foodTypes = [];
      customer.state.sick = true;
      customer.state.body.play('gtg');
      customer.state.face.visible = false;
      customer.state.jumpTween.stop();
      customer.state.scaleStartY = customer.y;
      customer.inputEnabled = true;
      customer.input.enableDrag(true);
      customer.events.onDragStart.add(function() {
        if (!customer.state.urgeToPurgeTimer) {
          customer.state.urgeToPurgeTimer = setTimeout(function() {
            customer.input.disableDrag();
            customer.input.stop();
            customer.state.messYoself();
          }, 3000);
        }
      });
      customer.events.onDragStop.add(function() {
        customer.y = 380; // align with bottom of potties
        var occupied = false;
        for (var i=0; i<_this.pottyGroup.children.length; i++) {
          if (occupied) { return; }
          var potty = _this.pottyGroup.getChildAt(i);
          game.physics.arcade.overlap(customer, potty, function() {
            potty.state.occupy(customer);
            occupied = true;
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
      .to({x: game.width+customer.body.width+10*direction}, distance * 5.3)
      .start();
    };

    customer.state.messYoself = function () {
      customer.y = 380; // align with bottom of potties
      customer.scale.x = customer.scale.y = .6;
      _this.messSound.play();
      _this.makeMess(customer.x - (customer.width /2),
        customer.y + customer.height + 60);
      customer.state.face.play('anger');
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
      _this.pottyDoorSound.play();
      potty.state.door.play("unoccupied");
      customer.state.face.visible = true;
      customer.state.face.play('anger');
      customer.state.body.play("walk");
      customer.visible = true;
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
    mess.scale.setTo(0.9, 0.9);
    this.poopGroup.add(mess);
    mess.bringToTop();

    return mess;
  },
  adjustCash: function(delta, source) {
    this.cash += delta;
    var x = source.body ? source.body.center.x : source.x + (source.width/2),
        y = (source.body ? source.body.y : source.y) + 40;
    if (delta > 0) {
      this.moneyGainedSound.play();
      this.cashPlusEmitter.x = x;
      this.cashPlusEmitter.y = y;
      this.cashPlusEmitter.emitParticle();
    }
    else {
      this.moneyLostSound.play();
      this.cashMinusEmitter.x = x;
      this.cashMinusEmitter.y = y;
      this.cashMinusEmitter.emitParticle();
    }
    if (this.cash >= this.cashGoal) {
      this.playerWon();
    }
    else if (this.cash < 0) {
      this.playerLost();
    }

    // animate change in cash
    game.add.tween(this)
    .to({ displayCash: this.cash }, 250)
    .start()
    .onComplete.add(function() {
      this.displayCash = this.cash;
    });
  },
  playerLost: function() {
    if (game.state.ended) return;
    game.state.ended = true; // prevent repeated calls per frame
    this.loseSound.play();
    while (this.customers.length) {
      this.customers[0].state.face.play('anger');
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
    if (game.state.level > highestLevelBeat) {
      localStorage.setItem("highestLevelBeat", game.state.level + "");
    }
    this.winSound.play();
    while (this.customers.length) {
      this.customers[0].state.face.play('happy');
      this.customers[0].state.leaveScene(1);
    }
    setTimeout(function() {
      game.state.ended = false;
      game.state.start("LevelSelect");
    }, 4000);
  }
};
