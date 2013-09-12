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
        constructor: (@orbited_id, @rad_per_sec=null, @rotate=true) ->
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
        constructor: (@position_logic='random', @x=0, @y=0, @destroy=false) ->

    class Sprite extends Component
        type: 'Sprite'
        constructor: (@shape, @stroke_style='#fff', @width=30, @height=30) ->

    class Renderable extends Component
        type: 'Renderable'

    class Collidable extends Component
        type: 'Collidable'
        constructor: () ->
            @in_collision_with = {}

    class Thruster extends Component
        type: 'Thruster'
        constructor: (@dv=0, @max_v=0, @dx=0, @dy=0, @active=true)->

    class Seeker extends Component
        type: 'Seeker'
        constructor: (@target, @rad_per_sec=0)->

    class ClickCourse extends Component
        type: 'ClickCourse'
        constructor: (@stop_on_arrival=false) ->
            @active = true

    class WeaponsTarget extends Component
        type: 'WeaponsTarget'
        constructor: (@team="foe") ->

    class BeamWeapon extends Component
        type: 'BeamWeapon'
        constructor: (@max_beams=12, @active_beams=4,
                      @max_range=150,
                      @max_power=150, @charge_rate=150, @discharge_rate=300,
                      @color="#6f6", @target_team="enemy", @split_penalty=0.2) ->
            @x = 0
            @y = 0
            @beams = ({
                target: null,
                x: 0, y: 0,
                charging: true,
                charge: 0
            } for idx in [1..max_beams])

    class Health extends Component
        type: 'Health'
        constructor: (@max=1000) ->
            @current = @max

    class Explosion extends Component
        type: 'Explosion'
        constructor: (@ttl=2.0, @radius=100,
                      @max_particles=100, @max_particle_size=4,
                      @max_velocity=300, @color='#f00') ->
            @age = 0
            @stop = false
            @particles = []
            for idx in [0..@max_particles-1]
                @particles.push({
                    free: true, x: 0, y: 0, dx: 0, dy: 0, s: 0, mr: 0
                })

    return {
        Component, TypeName, EntityName, EntityGroup, Position, Orbit, Spin,
        Bouncer, Spawn, Collidable, Renderable, Sprite, Thruster, Seeker,
        ClickCourse, WeaponsTarget, BeamWeapon, Health, Explosion
    }
