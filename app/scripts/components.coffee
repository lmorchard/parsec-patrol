define ['entities', 'underscore', 'backbone'], (Entities, _, Backbone) ->

    class Component
        type: 'AbstractComponent'
        entity_manager: null
        entity_id: null
        getEntity: () ->
            @entity_manager?.getEntity(@entity_id)
        find: (em) ->
            em.getComponentsByType(@type)
        toString: () ->
            "(#{@type} #{JSON.stringify(this)})"

    class TypeName extends Component
        type: 'TypeName'
        constructor: (@name) ->

    class EntityName extends Component
        type: 'EntityName'
        constructor: (@name) ->

    class MapPosition extends Component
        type: 'MapPosition'
        constructor: (@map, @x, @y, @rotation) ->
    
    class Orbit extends Component
        type: 'Orbit'
        constructor: (@orbited_entity_id) ->
            @angle = 0.0
            @rad_per_sec = _.random(Math.PI/16, Math.PI/2)

    class Bouncer extends Component
        type: 'Bouncer'
        constructor: () ->
            @x_dir = 1
            @y_dir = 1
            @x_sec = 80
            @y_sec = 80

    class Spawn extends Component
        type: 'Spawn'
        constructor: (@position_logic='random') ->

    class Sprite extends Component
        type: 'Sprite'
        constructor: (@shape) ->

    class Renderable extends Component
        type: 'Renderable'
        constructor: () ->

    return {
        Component, TypeName, EntityName, MapPosition, Orbit, Bouncer, Spawn,
        Renderable, Sprite
    }
