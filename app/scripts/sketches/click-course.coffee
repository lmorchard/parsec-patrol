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
        new S.PointerInputSystem(canvas),
        new S.ClickCourseSystem,
        new S.SpawnSystem,
        new S.SpinSystem,
        new S.SeekerSystem,
        new S.ThrusterSystem,
    )

    em = world.entities

    world.load(data = {
        "entities": {
            "sun": {
                "Sprite": { "shape": "star" },
                "Spawn": { "position_logic": "center" },
                "Position": {}
            },
            "hero": {
                "Sprite": { "shape": "hero" },
                "Position": {},
                "Collidable": {},
                "Spawn": { "x": -40, "y": -40 },
                "Thruster": { "dv": 250, "max_v": 100, "active": false },
                "Seeker": { "rad_per_sec": Math.PI },
                "ClickCourse": { "stop_on_arrival": true },
            },
            "enemy3": {
                "Sprite": {
                    "shape": "enemyscout",
                    "stroke_style": "#3ff",
                    "width": 15, "height": 15
                },
                "Spawn": { "x": -80, "y": 0 },
                "Position": {},
                "Collidable": {},
                "Thruster": { "dv": 150, "max_v": 75 },
                "Seeker": { "target": "hero", "rad_per_sec": Math.PI }
            },
            "enemy4": {
                "Sprite": {
                    "shape": "enemyscout", "stroke_style": "#f3f",
                    "width": 15, "height": 15
                },
                "Spawn": { "x": 0, "y": 80 },
                "Position": {},
                "Collidable": {},
                "Thruster": { "dv": 150, "max_v": 75 },
                "Seeker": { "target": "enemy3", "rad_per_sec": Math.PI }
            },
            "enemy5": {
                "Sprite": {
                    "shape": "enemyscout", "stroke_style": "#ff3",
                    "width": 15, "height": 15
                },
                "Spawn": { "x": 80, "y": 0 },
                "Position": {},
                "Collidable": {},
                "Thruster": { "dv": 150, "max_v": 75 },
                "Seeker": { "target": "enemy4", "rad_per_sec": Math.PI }
            },
            "enemy6": {
                "Sprite": {
                    "shape": "enemyscout", "stroke_style": "#3f3",
                    "width": 15, "height": 15
                },
                "Spawn": { "x": 80, "y": -80 },
                "Position": {},
                "Collidable": {},
                "Thruster": { "dv": 150, "max_v": 75 },
                "Seeker": { "target": "enemy5", "rad_per_sec": Math.PI }
            },
        },
        "groups": {
            "main": [ "sun", "hero", "enemy3", "enemy4", "enemy5", "enemy6" ]
        },
        "max_gid": "100",
        "max_eid": "100",
        "current_scene": "main",
    })

    gui = new dat.GUI()
    gui.add(world, 'is_paused')
    gui.add(vp, 'use_sprite_cache')
    gui.add(vp, 'draw_bounding_boxes')

    window.world = world
    window.C = C
    window.E = E
    window.S = S

    world.measure_fps = true
    world.start()
