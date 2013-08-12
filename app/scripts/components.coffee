define ['entities', 'underscore'], (Entities, _) ->

    class Component
        type: 'AbstractComponent'
        toString: () ->
            "#{@type}: #{JSON.stringify(this)}"

    class TypeName extends Component
        type: 'TypeName'
        constructor: (@name) ->

    class EntityName extends Component
        type: 'EntityName'
        constructor: (@name) ->

    class EntityGroup extends Component
        type: 'EntityGroup'
        constructor: (to_add=[]) ->
            @entities = {}
            EntityGroup.add(@, e) for e in to_add

        @add: (group, entities...) ->
            for entity in entities
                group.entities[entity] = true
        @remove: (group, entities...) ->
            for entity in entities
                delete group.entities[entity]
        @move: (group1, group2, entities...) ->
            for entity in entities
                delete group1.entities[entity]
                group2.entities[entity] = true
        @has: (group, entities...) ->
            for entity in entities
                if not (entity of group.entities)
                    return false
            return true

    class MapPosition extends Component
        type: 'MapPosition'
        constructor: (@map, @x, @y, @rotation) ->
    
    class Orbit extends Component
        type: 'Orbit'
        constructor: (@orbited_id) ->
            @angle = 0.0
            @rad_per_sec = _.random(Math.PI/16, Math.PI/2)

    class Bouncer extends Component
        type: 'Bouncer'
        constructor: () ->
            @x_dir = 1
            @y_dir = 1
            @x_sec = _.random(20, 200)
            @y_sec = _.random(20, 200)

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
        Component, TypeName, EntityName, EntityGroup, MapPosition, Orbit, Bouncer, Spawn,
        Renderable, Sprite
    }
