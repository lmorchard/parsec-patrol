define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore', 'dat', 'Vector2D'
], (
    W, E, C, S, PubSub, $, _, dat, Vector2D
) -> (canvas, use_gui=true, measure_fps=true) ->

    options = {
        max_entities: 50
        max_speed: 70
    }
    stats = {
        entities_ct: 0
    }

    update_stats = () ->
        stats.entities_ct = (eid for eid, s of world.entities.getComponents(C.Spawn) when (s.spawned and !s.destroy)).length

    class ColorCollideSystem extends S.System
        match_component: C.Collidable
        update_match: (dt, eid, collidable) ->
            sprite = @world.entities.get(eid, C.Sprite)
            if _.keys(collidable.in_collision_with).length is 0
                sprite.stroke_style = "#fff"
            else
                sprite.stroke_style = "#f33"
                # Destroy colliding entities if we're over capacity
                #if stats.entities_ct >= options.max_entities
                #    @world.entities.get(eid, C.Spawn).destroy = true

    world = new W.World(600, 600,
        vp = new S.ViewportSystem(canvas),
        new S.SpawnSystem,
        new S.HealthSystem,
        new S.CollisionSystem,
        new S.BouncerSystem,
        new S.MotionSystem,
        new S.SpinSystem,
        new S.ExplosionSystem,
        new ColorCollideSystem,
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

    presets = [
        [-270, 4, 100, 0, 15, 15, 100],
        [270, -4, -100, 0, 15, 15, 100],
        [4, -270, 0, 100, 15, 15, 100],
        [-4, 270, 0, -100, 15, 15, 100]
    ]
    spawn_presets = () ->
        return if world.is_paused

        update_stats()
        return if stats.entities_ct >= options.max_entities

        for [x, y, dx, dy, width, height, m] in presets
            dr = (Math.PI*4) * Math.random()
            spawn_asteroid(x, y, width, height, dx, dy, dr, m, 400)

    v_center = new Vector2D(0, 0)
    spawn_random = () ->
        return if world.is_paused

        update_stats()
        return if stats.entities_ct >= options.max_entities

        v_spawn = new Vector2D(0, 40 + (200 * Math.random()))
        v_spawn.rotateAround(v_center, (Math.PI*4) * Math.random())
        
        spawn_asteroid(
            v_spawn.x, v_spawn.y, 30, 30
            options.max_speed - (options.max_speed * 2 * Math.random()),
            options.max_speed - (options.max_speed * 2 * Math.random()),
            (Math.PI * 1) * Math.random(),
            400,
            4000
        )

    setInterval spawn_presets, 400
    setInterval spawn_random, 200

    #world.subscribe S.HealthSystem.MSG_DAMAGE, (msg, data) =>
    #    console.log("DMG #{msg} #{JSON.stringify(data)}")

    vp.draw_bounding_boxes = false
    world.measure_fps = measure_fps
    if use_gui
        gui = new dat.GUI()
        gui.add(world, 'is_paused').listen()
        gui.add(vp, 'zoom', 0.125, 3).step(0.125)
        gui.add(options, 'max_entities', 1, 500).step(1)
        gui.add(stats, 'entities_ct').listen()

    return world
