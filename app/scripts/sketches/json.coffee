define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore'
], (
    W, E, C, S, PubSub, $, _
) ->
    canvas = document.getElementById('gameCanvas')
    area = document.getElementById('gameArea')
    world = new W.World(640, 480,
        new S.ViewportSystem(window, area, canvas, 1.0, 1.0),
        new S.PointerInputSystem(canvas),
        new S.ClickCourseSystem,
        new S.SpawnSystem,
        new S.OrbiterSystem,
        new S.SeekerSystem,
        new S.ThrusterSystem,
        new S.HealthSystem,
        new S.BeamWeaponSystem,
        new S.ExplosionSystem,
    )
    data = {
        entities: {
            "10": {
                Sprite: { shape: "sun" },
                Spawn: { position_logic: "sun" },
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
    }
    
    window.world = world
    window.C = C
    window.E = E
    window.S = S

    world.load(data)
    world.measure_fps = true
    world.current_scene = _.keys(data.groups)[0]
    world.start()
