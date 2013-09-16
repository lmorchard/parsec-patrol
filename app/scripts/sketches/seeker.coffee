define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore', 'dat'
], (
    W, E, C, S, PubSub, $, _, dat
) ->
    class PointerFollower extends C.Component
        @defaults:
            type: "PointerFollower"
    
    C.PointerFollower = PointerFollower

    class PointerFollowerSystem extends S.System
        match_component: PointerFollower
        update_match: (dt, eid, pointer_follower) ->
            pos = @world.entities.get(eid, C.Position)
            pos.x = @world.inputs.pointer_world_x
            pos.y = @world.inputs.pointer_world_y

    canvas = document.getElementById('gameCanvas')
    area = document.getElementById('gameArea')
        
    world = new W.World(320, 240,
        new S.PointerInputSystem(canvas),
        new S.SpawnSystem,
        new S.SpinSystem,
        new S.SeekerSystem,
        new S.ThrusterSystem,
        new PointerFollowerSystem,
        vp = new S.ViewportSystem(
            window, area, canvas, 1.0, 1.0
        ),
    )

    world.load(data = {
        "entities": {
            "sun": {
                "Sprite": { "shape": "star" },
                "Spawn": { "position_logic": "center" },
                "Position": {}
            },
            "torp": {
                "Spawn": { "x": 30, "y": 0 },
                "Position": {},
                "Collidable": {},
                "PointerFollower": {},
                "Spin": { "rad_per_sec": Math.PI * 2 },
                "Sprite": {
                    "shape": "torpedo", "stroke_style": "#f33",
                    "width": 10, "height": 10
                }
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
                "Seeker": { "target": "torp", "rad_per_sec": Math.PI }
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
            "main": [ "sun", "torp", "enemy3", "enemy4", "enemy5", "enemy6" ]
        }
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
    world.current_scene = _.keys(data.groups)[0]
    world.start()
