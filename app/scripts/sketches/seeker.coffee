define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore', 'dat'
], (
    W, E, C, S, PubSub, $, _, dat
) -> (canvas, use_gui=true, measure_fps=true) ->

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
                    rad_per_sec: Math.PI * 0.27
                Sprite:
                    shape: "torpedo"
                    stroke_style: "#ff3"
                    width: 20,
                    height: 20
        groups:
            main: [ "sun", "target" ]
        current_scene: "main"
    )

    target = 'target'
    for idx in [0..3]

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

    if use_gui
        gui = new dat.GUI()
        gui.add(world, 'is_paused')
        gui.add(vp, 'glow')
        gui.add(vp, 'use_sprite_cache')
        gui.add(vp, 'draw_bounding_boxes')
    
    window.world = world
    window.C = C
    window.E = E
    window.S = S

    world.measure_fps = measure_fps

    return world
