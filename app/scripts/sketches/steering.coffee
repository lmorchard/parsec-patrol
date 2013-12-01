define [
    'worlds', 'entities', 'components', 'systems', 'utils', 'pubsub', 'jquery',
    'underscore', 'dat', 'Vector2D'
], (
    W, E, C, S, Utils, PubSub, $, _, dat, Vector2D
) -> (canvas, use_gui=true, measure_fps=true) ->

    world = new W.World(1200, 1200,
        vp = new S.ViewportSystem(canvas),
        new S.PointerInputSystem(canvas),
        new S.ClickCourseSystem,
        new S.SpawnSystem,
        new S.HealthSystem,
        collision_system = new S.CollisionSystem(debug_bounding_boxes=true, debug_quadtrees=true),
        new S.BouncerSystem,
        new S.SeekerSystem,
        potential_steering_system = new S.PotentialSteeringSystem(debug_potential_steering=true),
        steering_system = new S.SteeringSystem(debug_steering=true),
        new S.ThrusterSystem,
        new S.MotionSystem,
        new S.SpinSystem,
        new S.VaporTrailSystem,
        new S.BeamWeaponSystem,
        new S.ExplosionSystem,
    )
    em = world.entities

    world.load
        entities:
            hero:
                TypeName: { name: "HeroShip" }
                Sprite: { shape: "hero", width: 75, height: 75, stroke_style: "#3f3" }
                Spawn: { x: 450, y: 0, rotation: Math.PI * -0.5 }
                Position: {},
                Motion: { dx:0, dy: 0 },
                Collidable: {},
                CollisionCircle: { radius: 37.5 }

        groups:
            main: [ 'rock', 'hero']

        current_scene: "main"

    spawn_enemies = () ->
        return if world.is_paused
        enemy_positions = [
            [-450, -250, Math.PI * -0.75]
            [-450, -150, Math.PI * -0.5]
            [-450, 0,    0]
            [-450, 150,  Math.PI * 0.5]
            [-450, 250,  Math.PI * 0.75]
        ]
        for [x, y, r] in enemy_positions
            components = world.entities.loadComponents
                Sprite: { shape: 'enemyscout', width: 30, height: 30, stroke_style: '#f33' }
                Spawn:
                    x: x
                    y: y
                    rotation: r
                Position: {}
                Motion: {}
                Collidable: {},
                CollisionCircle: { radius: 15 }
                Bouncer: { mass: 1000, damage: 0 }
                Thruster: { dv: 250, max_v: 120 }
                PotentialSteering: { target: 'hero', sensor_range: 125, rad_per_sec: Math.PI }
                #Steering: { target: 'hero', los_range: 150, rad_per_sec: Math.PI }
                Tombstone:
                    load:
                        Position: {}
                        Explosion:
                            ttl: 0.5
                            radius: 40
                            max_particles: 25
                            max_particle_size: 1.25
                            max_velocity: 250
                            color: "#f33"
            
            eid = world.entities.create(components...)
            world.entities.addToGroup('main', eid)

    #setInterval spawn_enemies, 15 * 1000
    spawn_enemies()

    spawn_asteroid = (x, y, width, height, dx, dy, dr, mass, health) ->
        components = world.entities.loadComponents
            Sprite:
                shape: "asteroid"
                width: width
                height: height
            Spawn:
                x: x
                y: y
                #ttl: 60 * Math.random()
            Motion:
                dx: dx
                dy: dy
                drotation: dr
            Health:
                max: health
                show_bar: false
            Bouncer:
                mass: mass
                damage: 0.0007
            RadarPing:
                color: "#333"
            Collidable: {}
            CollisionCircle:
                radius: (width / 2) * 0.85
            Position: {}
            Tombstone:
                load:
                    Position: {}
                    Explosion:
                        ttl: 0.5
                        radius: 40
                        max_particles: 25
                        max_particle_size: 1.25
                        max_velocity: 250
                        color: "#fff"

        eid = world.entities.create(components...)
        world.entities.addToGroup('main', eid)
        return eid

    spawn_field = (
        center_x = 0,
        center_y = 0,
        radius = 300,
        MAX_ASTEROIDS = 50,
        MAX_TRIES = 5,
        MIN_SIZE = 12,
        MAX_SIZE = 120,
        MAX_GRAV = 8,
    ) ->

        v_center = new Vector2D(center_x, center_y)

        v_spawn = new Vector2D(0, 0)
        v_grav = new Vector2D(0, 0)

        in_field = []
        for idx in [1..MAX_ASTEROIDS]
            for c in [1..MAX_TRIES]

                size = _.random(MIN_SIZE, MAX_SIZE)
                v_spawn.setValues(v_center.x, v_center.y - _.random(1, radius))
                rot = (Math.PI*4) * Math.random()
                v_spawn.rotateAround(v_center, rot)

                is_clear = true
                for [x, y, w, h] in in_field
                    if Utils.inCollision( #Circle(
                            x, y, w, h,
                            v_spawn.x, v_spawn.y,
                            size * 1.0125, size * 1.0125)
                        is_clear = false
                        break

                continue if not is_clear

                in_field.push([v_spawn.x, v_spawn.y, size, size])

                v_grav.setValues(0, Math.random() * MAX_GRAV)
                v_grav.rotate(rot)

                eid = spawn_asteroid(
                    v_spawn.x, v_spawn.y,
                    size, size,
                    v_grav.x, v_grav.y,
                    (Math.PI * 0.25) * Math.random(),
                    4 * size * size,
                    4 * size * size,
                )

    if true
        spawn_fields = () ->
            return if world.is_paused
            spawn_field(-225, -225, 100)
            spawn_field(-225, 225, 100)
            spawn_field(0, 0, 100)
            spawn_field(225, -225, 100)
            spawn_field(225, 225, 100)
        spawn_fields()
        #setInterval spawn_fields, 30 * 1000

    if false
        components = world.entities.loadComponents
            TypeName: { name: "Rock" }
            Sprite: { shape: "asteroid", width: 400, height: 400 }
            Spawn: { x: 0, y: 0 }
            Position: {}
            Motion: { drotation: Math.PI / 8 }
            Collidable: {}
            CollisionCircle: { radius: 200 }
            Bouncer: { mass: 2000, damage: 0 }
        eid = world.entities.create(components...)
        world.entities.addToGroup('main', eid)

    vp.zoom = 1.0
    vp.draw_bounding_boxes = true
    vp.draw_steering = true
    world.measure_fps = measure_fps

    window.entities = world.entities

    if use_gui
        gui = new dat.GUI()
        gui.add(world, 'is_paused').listen()
        gui.add(vp, 'zoom', 0.125, 3).step(0.125)
        gui.add(steering_system, 'debug_steering').listen()
        gui.add(collision_system, 'debug_bounding_boxes').listen()
        gui.add(collision_system, 'debug_quadtrees').listen()
        gui.add(potential_steering_system, 'debug_potential_steering').listen()

    window.world = world

    return world
