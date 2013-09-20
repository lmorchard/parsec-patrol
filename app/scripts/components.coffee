define ['entities', 'underscore'], (Entities, _) ->

    class Component
        #@defaults
        #    type: 'AbstractComponent'
        
        toString: () ->
            "#{@type}: #{JSON.stringify(this)}"

        constructor: (props_in) ->
            props_in ?= {}
            props = _.defaults(props_in, @constructor.defaults)
            for k, v of props
                @[k] = if _.isFunction(v) then v() else v

    class TypeName extends Component
        @defaults:
            type: 'TypeName'
            name: ''

    class EntityName extends Component
        @defaults:
            type: 'EntityName'
            name: ''

    class Position extends Component
        @defaults:
            type: 'Position'
            x: 0
            y: 0
            rotation: 0
    
    class Orbit extends Component
        @defaults:
            type: 'Orbit'
            orbited_id: null
            rad_per_sec: -> _.random(Math.PI/32, Math.PI)
            rotate: true
            angle: 0.0

    class Spin extends Component
        @defaults:
            type: 'Spin'
            rad_per_sec: -> _.random(Math.PI/32, Math.PI)

    class Bouncer extends Component
        @defaults:
            type: 'Bouncer'
            x_dir: 1
            y_dir: 1
            x_sec: null
            y_sec: null
            x_sec: -> _.random(20, 200)
            y_sec: -> _.random(20, 200)

    class Spawn extends Component
        @defaults:
            type: 'Spawn'
            position_logic: 'at'
            x: 0
            y: 0
            destroy: false
            capture_camera: false

    class Tombstone extends Component
        @defaults:
            type: 'Tombstone'
            load: {}
            components: []

    class Sprite extends Component
        @defaults:
            type: 'Sprite'
            shape: 'sun'
            stroke_style: '#fff'
            width: 30
            height: 30

    class Renderable extends Component
        @defaults:
            type: 'Renderable'

    class Collidable extends Component
        @defaults:
            type: 'Collidable'
        constructor: (props) ->
            super props
            @in_collision_with = {}

    class Thruster extends Component
        @defaults:
            type: 'Thruster'
            active: true
            max_v: 0
            dv: 0
            dx: 0
            dy: 0

    class Seeker extends Component
        @defaults:
            type: 'Seeker'
            target: null
            rad_per_sec: 0

    class ClickCourse extends Component
        @defaults:
            type: 'ClickCourse'
            stop_on_arrival: false
            active: true

    class WeaponsTarget extends Component
        @defaults:
            type: 'WeaponsTarget'
            team: 'foe'

    class BeamWeapon extends Component
        @defaults:
            type: 'BeamWeapon'
            x: 0
            y: 0
            max_beams: 12
            active_beams: 4
            max_range: 150
            max_power: 150
            charge_rate: 150
            discharge_rate: 300
            color: "#6f6"
            target_team: "enemy"
            dmg_penalty: 0.2
            range_penalty: 0.8

        constructor: (props) ->
            super props
            @current_stats = {
                max_charge: 0, charge_rate: 0, discharge_rate: 0,
                beam_range: 0, beam_range_sq: 0, dmg_penalty: 0
            }
            @beams = ({
                target: null,
                x: 0,
                y: 0,
                charging: true,
                charge: 0
            } for idx in [1..@max_beams])

    class Health extends Component
        @defaults:
            type: 'Health'
            max: 1000
            current: null

        constructor: (props) ->
            super props
            @current ?= @max

    class Explosion extends Component
        @defaults:
            type: 'Explosion'
            ttl: 2.0
            radius: 100
            max_particles: 100
            max_particle_size: 4
            max_velocity: 300
            color: '#f00'
            age: 0
            stop: false

        constructor: (props) ->
            super props
            @particles = []
            for idx in [0..@max_particles-1]
                @particles.push({
                    free: true,
                    x: 0, y: 0,
                    dx: 0, dy: 0,
                    s: 0, mr: 0
                })

    class RadarPing extends Component
        @defaults:
            type: 'RadarPing',
            color: '#fff'

    return {
        Component, TypeName, EntityName, Position, Orbit, Spin, Bouncer, Spawn,
        Tombstone, Collidable, Renderable, Sprite, Thruster, Seeker,
        ClickCourse, WeaponsTarget, BeamWeapon, Health, Explosion, RadarPing
    }
