'use strict';

const
  util = require('util'),
  zmq = require('zmq'),
  events = require('events')

function ZmqSubscriber(port) {
  this.address = "tcp://192.168.0.2:" + port;
}

// ZmqSubscriber will emit events for:
// - player1Change
// - player2Change
util.inherits(ZmqSubscriber, events.EventEmitter);

ZmqSubscriber.prototype.subscribe = function() {
  let subscriber = zmq.socket('sub');

  subscriber.subscribe('');

  subscriber.on('message', function(data) {
    let msg = JSON.parse(data.toString());
    if (msg.nunchuck == 1) {
      this.emit('playerChange', -msg.x)
    }
    else {
      this.emit('playerChange', msg.x)
    }
  });

  subscriber.connect(this.address);
}

module.exports = ZmqSubscriber;
