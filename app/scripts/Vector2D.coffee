define [], ()->
  "use strict"
  ###
  @author Vitalii [Nayjest] Stepanenko <gmail@vitaliy.in>
  ###
  class Vector2D

    @cloneFrom: (object)->
      new Vector2D object.x, object.y
    @fromArray: (array)->
      new Vector2D array[0], array[1]

    @zero: new Vector2D 0,0

    constructor: (x, y)->
      @x = x or 0
      @y = y or 0

    add: (vector) ->
      @x += vector.x
      @y += vector.y
      @

    addScalar: (val)->
      @x += val
      @y += val
      @

    eq: (vector)->
      vector.x == @x and vector.y == @y

    substract: (vector) ->
      @x -= vector.x
      @y -= vector.y
      @

    clone: ->
      new Vector2D @x, @y


    set: (vector)->
      @x = vector.x
      @y = vector.y
      @

    setValues: (@x, @y)-> @

    dist: (vector)->
      Math.sqrt (vector.x - @x) * (vector.x - @x) + (vector.y - @y) * (vector.y - @y)

    normalise: ->
      if !@isZero()
        m = @magnitude()
        @x /= m
        @y /= m
      @

    isZero: ->
      @x == 0 and @y == 0

    reverse: ->
      @x = -@x
      @y = -@y
      @

    magnitude: ->
      Math.sqrt @x * @x + @y * @y

    toArray: ->
      [@x, @y]

    angle: ->
      Math.atan2 @y, @x

    rotate: (angle)->
      cos = Math.cos angle
      sin = Math.sin angle
      @setValues @x * cos - @y * sin, @x * sin + @y * cos

    angleTo: (vector)->
      Math.atan2 vector.y - @y, vector.x - @x

    rotateAround: (point, angle)->
      @substract(point).rotate(angle).add(point)

    multiplyScalar: (val)->
      @x *= val
      @y *= val
      @

    multiply: (vector)->
      @x *= vector.x
      @y *= vector.y
      @

    divide: (vector)->
      @x /= vector.x
      @y /= vector.y
      @

    divideScalar: (val)->
      @x /= val
      @y /= val
      @

    round: ->
      @x = Math.round @x
      @y = Math.round @y
      @
