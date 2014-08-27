define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore', 'dat', 'Vector2D', 'systems/PixiViewportSystem'
], (
    W, E, C, S, PubSub, $, _, dat, Vector2D, PixiViewportSystem
) -> (canvas, use_gui=true, measure_fps=true) ->

    world = new W.World(640, 480,
        vp = new PixiViewportSystem.PixiViewportSystem(document),
        new S.SpawnSystem,
        new S.OrbiterSystem,
    )

    world.load
        entities:
            sun:
                Sprite:
                    shape: "star"
                Position: {}
                Spawn:
                    x: 0
                    y: 0
        groups:
            main: ['sun']
        current_scene: 'main'

    sprites = [
        'hero', 'enemyscout', 'enemycruiser', 'asteroid', 'torpedo'
    ]

    rad_per = (Math.PI*2) / sprites.length
    v_center = new Vector2D(0, 0)
    v_spawn = new Vector2D(0, -200)
    for name in sprites
        v_spawn.rotateAround(v_center, rad_per)
        components = world.entities.loadComponents
            Sprite:
                shape: name
                width: 50
                height: 50
            Position: {}
            Spawn:
                x: v_spawn.x
                y: v_spawn.y
            Orbit:
                orbited_id: 'sun'
                rad_per_sec: Math.PI / 5
        eid = world.entities.create components...
        world.entities.addToGroup 'main', eid
    
    if use_gui
        gui = new dat.GUI()
        gui.add(world, 'is_paused')
        gui.add(vp, 'zoom', 0.125, 4).step(0.0125)

    world.measure_fps = measure_fps
    
    window.C = C
    window.E = E
    window.W = W
    window.world = world
    window.vp = vp
    
    return world
