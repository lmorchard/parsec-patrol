define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore', 'dat'
], (
    W, E, C, S, PubSub, $, _, dat
) -> (canvas, use_gui=true, measure_fps=true) ->

    MAX_SEEKERS = 4

    world = new W.World(320, 240,
        new S.SpawnSystem,
        new S.OrbiterSystem,
        new S.SpinSystem,
        new S.SeekerSystem,
        new S.ThrusterSystem,
        new S.MotionSystem,
        vp = new S.ViewportSystem(canvas)
    )

    world.load(
        entities:
            sun:
                Sprite:
                    shape: "star"
                Spawn: {}
                Position: {}
            target:
                Spawn:
                    x: 70
                    y: 0
                Position: {}
                Collidable: {}
                Orbit:
                    orbited_id: 'sun'
                    rad_per_sec: Math.PI * 0.26
                Sprite:
                    shape: "torpedo"
                    stroke_style: "#ff3"
                    width: 20,
                    height: 20
        groups:
            main: [ "sun", "target" ]
        current_scene: "main"
    )

    targets = []
    target = 'target'
    for idx in [0..MAX_SEEKERS-1]

        components = world.entities.loadComponents
            Sprite:
                shape: 'enemyscout'
                width: 20
                height: 20
                stroke_style: ['#f33', '#3f3', '#33f', '#f3f'][idx]
            Spawn:
                position_logic: 'random'
            Position: {}
            Motion: {}
            Thruster:
                dv: 150
                max_v: 75
            Seeker:
                target: target
                rad_per_sec: Math.PI

        target = eid = world.entities.create components...
        world.entities.addToGroup 'main', eid
        targets[idx] = eid

    if use_gui
        gui = new dat.GUI()
        gui.add(world, 'is_paused')
        gui.add(vp, 'glow')
        gui.add(vp, 'use_sprite_cache')
        gui.add(vp, 'draw_bounding_boxes')

        for idx in [0..MAX_SEEKERS-1]
            fld = gui.addFolder("Seeker #{idx}")
            motion = world.entities.store.Motion[idx]
            motion.velocity = 0
            fld.add(motion, 'velocity').listen()
            fld.add(world.entities.store.Thruster[idx], 'active')
            fld.add(world.entities.store.Thruster[idx], 'stop')
            fld.add(world.entities.store.Thruster[idx], 'use_brakes')
            fld.open()

    update_vels = () ->
        for idx in [0..MAX_SEEKERS-1]
            motion = world.entities.store.Motion[idx]
            motion.velocity = Math.sqrt (motion.dx * motion.dx +
                                         motion.dy * motion.dy)
    setInterval(update_vels, 32)
    
    window.world = world
    window.C = C
    window.E = E
    window.S = S

    world.measure_fps = measure_fps

    return world
