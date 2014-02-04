'use strict';

const speed = 5;

function Paddle() {
  this.y = 0;
}

Paddle.prototype.move(velocity) {
  this.y = this.y + (velocity * speed)

  if (this.y > 80) this.y = 80;
  if (this.y < -80) this.y = -80;
}

module.exports = Paddle;
