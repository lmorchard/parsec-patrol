define ['underscore', 'backbone'], (_, Backbone) ->

    class SpaceEntity
        constructor: (@name) ->

    class Base extends SpaceEntity

    class Ship extends SpaceEntity
    
    class FriendlyBase extends Base

    class PlayerShip extends Ship

    class HeroPlayerShip extends PlayerShip

    class EnemyShip extends Ship

    class KlangonScoutShip extends Ship

    return {
        SpaceEntity, Base, Ship, FriendlyBase, PlayerShip, EnemyShip
    }
