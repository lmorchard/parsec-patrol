define [
    'worlds', 'entities', 'components', 'systems', 'utils', 'pubsub', 'jquery',
    'underscore', 'dat', 'Vector2D'
], (
    W, E, C, S, Utils, PubSub, $, _, dat, Vector2D
) -> (canvas, use_gui=true, measure_fps=true) ->

    options = {
        max_entities: 50
        max_speed: 70
    }
    stats = {
        entities_ct: 0
    }

    world = new W.World(1600, 1600,
        vp = new S.ViewportSystem(canvas),
        new S.SpawnSystem,
        new S.HealthSystem,
        new S.CollisionSystem,
        # new S.OldCollisionSystem,
        new S.BouncerSystem,
        new S.MotionSystem,
        new S.SpinSystem,
        new S.ExplosionSystem,
    )
    vp.zoom = 1.0

    world.load
        entities: {}
        groups:
            main: [ ]
        current_scene: "main"

    spawn_asteroid = (x, y, width, height, dx, dy, dr, mass, health) ->
        components = world.entities.loadComponents
            Sprite:
                shape: "asteroid"
                width: width
                height: height
            Spawn:
                x: x
                y: y
            Motion:
                dx: dx
                dy: dy
                drotation: dr
            Health:
                max: health
                show_bar: false
            Bouncer:
                mass: mass
                damage: 0.007
            Collidable: {}
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
        MAX_TRIES = 3,
        MIN_SIZE = 15,
        MAX_SIZE = 100,
        MAX_GRAV = 6,
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
                    if Utils.inCollision(x, y,
                                         w, h,
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
                    4 * size,
                    40 * size
                )

    spawn_field(-300, -300, 230)
    spawn_field(300, 300, 230)
    spawn_field(300, -300, 230)
    spawn_field(-300, 300, 230)

    vp.draw_bounding_boxes = false
    world.measure_fps = measure_fps
    if use_gui
        gui = new dat.GUI()
        gui.add(world, 'is_paused').listen()
        gui.add(vp, 'zoom', 0.125, 3).step(0.125)
        gui.add(vp, 'use_grid')
        gui.add(vp, 'use_sprite_cache')
        gui.add(vp, 'draw_bounding_boxes')

    return world
