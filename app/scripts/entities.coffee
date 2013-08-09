define ['underscore', 'backbone'], (_, Backbone) ->

    class SpaceEntity
        constructor: (@name) ->


    class Celestial extends SpaceEntity

    class Asteroid extends Celestial


    class SpaceBase extends SpaceEntity

    class FriendlyBase extends SpaceBase


    class Ship extends SpaceEntity
    
    class PlayerShip extends Ship

    class HeroPlayerShip extends PlayerShip

    class EnemyShip extends Ship

    class KlangonScoutShip extends Ship


    return {
        Asteroid, FriendlyBase,
        HeroPlayerShip, KlangonScoutShip
    }
