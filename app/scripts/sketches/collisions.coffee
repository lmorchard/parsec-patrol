define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore', 'dat', 'Vector2D'
], (
    W, E, C, S, PubSub, $, _, dat, Vector2D
) -> (canvas, use_gui=true, measure_fps=true) ->

    options = {
        MAX_ENTITIES: 30
        MAX_SPEED: 70
    }

    class ColorCollideSystem extends S.System
        match_component: C.Collidable
        update_match: (dt, eid, collidable) ->
            sprite = @world.entities.get(eid, C.Sprite)
            if _.keys(collidable.in_collision_with).length > 0
                sprite.stroke_style = "#f33"
                spawn = @world.entities.get(eid, C.Spawn)
                balls = (eid for eid, tn of world.entities.getComponents(C.Position))
                if balls.length >= options.MAX_ENTITIES
                    spawn.destroy = true
            else
                sprite.stroke_style = "#fff"

    world = new W.World(400, 400,
        vp = new S.ViewportSystem(canvas),
        new S.SpawnSystem,
        new S.CollisionSystem,
        new S.BouncerSystem,
        new S.MotionSystem,
        new S.SpinSystem,
        new S.ExplosionSystem,
        new ColorCollideSystem,
    )
    vp.zoom = 1

    world.load
        entities: {}
        groups:
            main: [ ]
        current_scene: "main"

    presets = [
        [-170, 4, 100, 0, 10, 10, 10],
        [170, -4, -100, 0, 10, 10, 10]
    ]
    spawn_presets = () ->
        balls = (eid for eid, tn of world.entities.getComponents(C.Position))
        return if balls.length >= options.MAX_ENTITIES

        for [x, y, dx, dy, width, height, m] in presets
            components = world.entities.loadComponents
                Sprite:
                    shape: "torpedo"
                    width: width
                    height: height
                Collidable: {}
                Position: {}
                Spawn:
                    x: x
                    y: y
                Motion:
                    dx: dx
                    dy: dy
                    drotation: 0 # (Math.PI * 2) * Math.random()
                Bouncer:
                    mass: m
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

    spawn_presets()
    setInterval spawn_presets, 500

    v_center = new Vector2D(0, 0)
    spawn_random = () ->
        balls = (eid for eid, tn of world.entities.getComponents(C.Position))
        return if balls.length >= options.MAX_ENTITIES

        v_spawn = new Vector2D(0, 20 + (100 * Math.random()))
        v_spawn.rotateAround(v_center, (Math.PI*2) * Math.random())
        
        components = world.entities.loadComponents
            Sprite:
                shape: "torpedo"
                width: 15
                height: 15
            Spawn:
                x: v_spawn.x
                y: v_spawn.y
            Motion:
                dx: options.MAX_SPEED - (options.MAX_SPEED * 2 * Math.random())
                dy: options.MAX_SPEED - (options.MAX_SPEED * 2 * Math.random())
                drotation: 0 # (Math.PI * 2) * Math.random()
            Bouncer:
                mass: 15
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
                        color: "#f33"

        eid = world.entities.create(components...)
        world.entities.addToGroup('main', eid)

    setInterval spawn_random, 500

    if options.MAX_ENTITIES then for idx in [1..options.MAX_ENTITIES/2]
        spawn_random()

    vp.draw_bounding_boxes = true
    world.measure_fps = measure_fps
    if use_gui
        gui = new dat.GUI()
        gui.add(world, 'is_paused').listen()
        gui.add(vp, 'zoom', 0.125, 3).step(0.25)
        gui.add(vp, 'use_sprite_cache')
        gui.add(vp, 'draw_bounding_boxes')
        gui.add(options, 'MAX_ENTITIES', 1, 500).step(1)

    return world
