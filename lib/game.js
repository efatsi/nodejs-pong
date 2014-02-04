'use strict';

const
  util = require('util'),
  events = require('events'),
  Ball = require('./ball'),
  Paddle = require('./paddle'),
  ZmqSubscriber = require('./zmq_subscriber');

function Game() {
  this.paddles = {
    player1: new Paddle(),
    player2: new Paddle()
  };

  this.ball = new Ball();

  this.subscriber1 = new ZmqSubscriber(9000);
  this.subscriber2 = new ZmqSubscriber(9001);

  this.subscriber1.subscribe();
  this.subscriber2.subscribe();

  // Setup:
  this.resetScore();
  this.bindEvents();
}

// Game will emit events for:
// - playerMiss, [playerId]
util.inherits(Game, events.EventEmitter);

Game.prototype.bindEvents = function() {

  let _this = this;
  let
    ball = this.ball,
    subscriber1 = this.subscriber1,
    subscriber2 = this.subscriber2,
    player1 = this.paddles.player1,
    player2 = this.paddles.player2;

  ball.on('player1WallCollision', function() {
    _this.detectPaddleCollision(1);
  });

  ball.on('player2WallCollision', function() {
    _this.detectPaddleCollision(2);
  });

  // can't get these to work :(
  subscriber1.on('playerChange', function(velocity) {
    console.log("heyy: " + velocity)
    player1.move(velocity)
  })

  subscriber2.on('playerChange', function(velocity) {
    player2.move(velocity)
  })

};

Game.prototype.detectPaddleCollision = function(playerId) {
  if (this.hitPaddle(playerId)) {
    this.ball.changeXDirection();
    this.ball.setRandomSpeed();
  } else {
    this.recordMiss(playerId);
  }
};

Game.prototype.hitPaddle = function(player) {
  let paddle = this.paddles['player'+player];
  return (this.ball.y >= paddle.y - 20 && this.ball.y <= paddle.y + 20);
};

Game.prototype.resetScore = function() {
  this.lives = {
    player1: 3,
    player2: 3
  };
};

Game.prototype.removeLife = function(playerId) {
  var player = 'player' + playerId;

  this.lives[player]--;

  this.emit('playerMiss', playerId);

  if (this.lives[player] <= 0) {
    this.emit('over', this.lives);
    this.resetScore();
  }
};

Game.prototype.recordMiss = function(playerId) {
  this.removeLife(playerId);
  this.ball.reset();
};

module.exports = Game;

