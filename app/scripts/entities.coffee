define ['underscore', 'backbone'], (_, Backbone) ->

    class Entity
        type: "Entity"
        is_active: true

        constructor: (@map, @position=[0,0]) ->
            @spawned = false

        tick: (t_delta) ->

        toString: () ->
            return "#{@type} @ #{@position}"

    class SpaceEntity extends Entity


    class Celestial extends SpaceEntity
        is_active: false

    class Star extends Celestial
        type: 'Star'
        constructor: (@game, @position=[0,0]) ->
            super
            [m_width, m_height] = @map.size
            @position = [m_width/2, m_height/2]

    class Asteroid extends Celestial

    class Planet extends Celestial
        type: 'Planet'
        constructor: (@game, @position=[0,0]) ->
            super
            [m_width, m_height] = @map.size
            @position = [
                m_width * Math.random(),
                m_height * Math.random()
            ]


    class SpaceBase extends SpaceEntity

    class FriendlyBase extends SpaceBase


    class Ship extends SpaceEntity
    
    class PlayerShip extends Ship

    class HeroPlayerShip extends PlayerShip

    class EnemyShip extends Ship

    class KlangonScoutShip extends Ship


    return {
        Star, Planet, Asteroid,
        FriendlyBase,
        HeroPlayerShip, KlangonScoutShip
    }
