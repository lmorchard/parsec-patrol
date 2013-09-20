define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore', 'dat'
], (
    W, E, C, S, PubSub, $, _, dat
) ->
    canvas = document.getElementById('gameCanvas')
    area = document.getElementById('gameArea')

    world = new W.World(640, 480,
        vp = new S.ViewportSystem(window, area, canvas, 1.0, 1.0),
        new S.SpawnSystem,
        new S.OrbiterSystem,
    )

    world.load(data = {
        entities: {
            "10": {
                Sprite: { shape: "star" },
                Spawn: { position_logic: "center" },
                Position: {}
            },
            "20": {
                Sprite: { shape: "hero" },
                Spawn: { position_logic: "at", x: 100, y: -100 },
                Orbit: { orbited_id: "10", rad_per_sec: 0.31415 },
                Position: {}
            },
            "30": {
                Sprite: { shape: "enemyscout" },
                Spawn: { position_logic: "at", x: -100, y: -100 },
                Orbit: { orbited_id: "10", rad_per_sec: 0.31415 },
                Position: {}
            },
            "40": {
                Sprite: { shape: "enemycruiser" },
                Spawn: { position_logic: "at", x: -150, y: 0 },
                Orbit: { orbited_id: "10", rad_per_sec: 0.31415 },
                Position: {}
            },
            "50": {
                Sprite: { shape: "asteroid" },
                Spawn: { position_logic: "at", x: -100, y: 100 },
                Orbit: { orbited_id: "10", rad_per_sec: 0.31415 },
                Position: {}
            },
            "60": {
                Sprite: { shape: "torpedo" },
                Spawn: { position_logic: "at", x: 100, y: 100 },
                Orbit: { orbited_id: "10", rad_per_sec: 0.31415 },
                Position: {}
            },
        },
        groups: {
            "10": ["10", "20", "30", "40", "50", "60"]
        },
        current_scene: '10'
    })

    gui = new dat.GUI()
    gui.add(vp, 'use_draw_buffer')
    gui.add(vp, 'use_sprite_cache')
    gui.add(vp, 'draw_bounding_boxes')

    world.measure_fps = true
    
    window.C = C
    window.E = E
    window.W = W
    window.world = world
    window.vp = vp
    
    () -> world.start()
