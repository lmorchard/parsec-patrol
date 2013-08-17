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
        constructor: (entities...) ->
            @entities = {}
            EntityGroup.add(@, entities...)

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

    class Position extends Component
        type: 'Position'
        constructor: (@map, @x, @y, @rotation=0) ->
    
    class Orbit extends Component
        type: 'Orbit'
        constructor: (@orbited_id, @rad_per_sec=null) ->
            @angle = 0.0
            @rad_per_sec ?= _.random(Math.PI/32, Math.PI)

    class Spin extends Component
        type: 'Spin'
        constructor: (@rad_per_sec=null) ->

    class Bouncer extends Component
        type: 'Bouncer'
        constructor: (@x_dir=1, @y_dir=1, @x_sec=null, @y_sec=null) ->
            @x_sec ?= _.random(20, 200)
            @y_sec ?= _.random(20, 200)

    class Spawn extends Component
        type: 'Spawn'
        constructor: (@position_logic='random', @x=0, @y=0) ->

    class Sprite extends Component
        type: 'Sprite'
        constructor: (@shape, @stroke_style='#fff', @width=30, @height=30) ->

    class Renderable extends Component
        type: 'Renderable'
    
    class ViewportObserver extends Component
        type: 'ViewportObserver'
        constructor: (@pointer_x=0, @pointer_y=0) ->

    class Collidable extends Component
        type: 'Collidable'
        constructor: () ->
            @in_collision_with = {}

    return {
        Component, TypeName, EntityName, EntityGroup, Position, Orbit, Spin, Bouncer, Spawn,
        Collidable, Renderable, Sprite, ViewportObserver
    }
