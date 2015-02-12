/*
  Originally by Vitalii [Nayjest] Stepanenko <gmail@vitaliy.in>
  Tweaky & fixes by Les Orchard <me@lmorchard.com>
*/

export default function Vector2D(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Vector2D.cloneFrom = function(object) {
  return new Vector2D(object.x, object.y);
};

Vector2D.fromArray = function(array) {
  return new Vector2D(array[0], array[1]);
};

Vector2D.zero = new Vector2D(0, 0);

Vector2D.prototype.add = function(vector) {
  this.x += vector.x;
  this.y += vector.y;
  return this;
};

Vector2D.prototype.addScalar = function(val) {
  this.x += val;
  this.y += val;
  return this;
};

Vector2D.prototype.eq = function(vector) {
  return vector.x === this.x && vector.y === this.y;
};

Vector2D.prototype.subtract = function(vector) {
  this.x -= vector.x;
  this.y -= vector.y;
  return this;
};

Vector2D.prototype.clone = function() {
  return new Vector2D(this.x, this.y);
};

Vector2D.prototype.set = function(vector) {
  this.x = vector.x;
  this.y = vector.y;
  return this;
};

Vector2D.prototype.setValues = function(_at_x, _at_y) {
  this.x = _at_x;
  this.y = _at_y;
  return this;
};

Vector2D.prototype.dist = function(vector) {
  return Math.sqrt((vector.x - this.x) * (vector.x - this.x) + (vector.y - this.y) * (vector.y - this.y));
};

Vector2D.prototype.normalise = function() {
  return this.normalize();
};

Vector2D.prototype.normalize = function() {
  var m;
  if (!this.isZero()) {
    m = this.magnitude();
    this.x /= m;
    this.y /= m;
  }
  return this;
};

Vector2D.prototype.isZero = function() {
  return this.x === 0 && this.y === 0;
};

Vector2D.prototype.reverse = function() {
  this.x = -this.x;
  this.y = -this.y;
  return this;
};

Vector2D.prototype.magnitude = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector2D.prototype.toArray = function() {
  return [this.x, this.y];
};

Vector2D.prototype.angle = function() {
  return Math.atan2(this.y, this.x);
};

Vector2D.prototype.rotate = function(angle) {
  var cos, sin;
  cos = Math.cos(angle);
  sin = Math.sin(angle);
  return this.setValues(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
};

Vector2D.prototype.angleTo = function(vector) {
  return Math.atan2(vector.y - this.y, vector.x - this.x);
};

Vector2D.prototype.rotateAround = function(point, angle) {
  return this.subtract(point).rotate(angle).add(point);
};

Vector2D.prototype.multiplyScalar = function(val) {
  this.x *= val;
  this.y *= val;
  return this;
};

Vector2D.prototype.multiply = function(vector) {
  this.x *= vector.x;
  this.y *= vector.y;
  return this;
};

Vector2D.prototype.divide = function(vector) {
  this.x /= vector.x;
  this.y /= vector.y;
  return this;
};

Vector2D.prototype.divideScalar = function(val) {
  this.x /= val;
  this.y /= val;
  return this;
};

Vector2D.prototype.round = function() {
  this.x = Math.round(this.x);
  this.y = Math.round(this.y);
  return this;
};

Vector2D.prototype.dot = function(vector) {
  return (this.x * vector.x) + (this.y * vector.y);
};
