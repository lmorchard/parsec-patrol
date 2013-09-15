define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore'
], (
    W, E, C, S, PubSub, $, _
) ->

    class ColorCollideSystem extends S.System
        match_component: C.Collidable
        update_match: (dt, eid, collidable) ->
            sprite = @world.entities.get(eid, C.Sprite)
            if _.keys(collidable.in_collision_with).length > 0
                sprite.stroke_style = "#f33"
            else
                sprite.stroke_style = "#fff"

    world = new W.World(320, 240,
        new S.SpawnSystem,
        new S.BouncerSystem,
        new S.SpinSystem,
        new S.OrbiterSystem,
        new S.CollisionSystem,
        new ColorCollideSystem,
        render_system = new S.ViewportSystem(
            window,
            document.getElementById('gameArea'),
            document.getElementById('gameCanvas'),
            1.0, 1.0,
            true
        )
    )

    render_system.draw_bounding_boxes = true

    world.load(data = {
        entities: {
            "10": {
                "Sprite": { "shape": "hero" },
                "Spawn": { "x": 80, "y": 0 },
                "Position": {},
                "Collidable": {},
                "Spin": { "rad_per_sec": Math.PI / 2 }
            },
            "15": {
                "Spawn": { "x": -80, "y": 0 },
                "Position": {},
                "Collidable": {},
                "Spin": { "rad_per_sec": Math.PI / 2 },
                "Sprite": {
                    "shape": "enemyscout",
                    "stroke_style": "#fff",
                    "width": 15,
                    "height": 15
                }
            },
            "20": {
                "Spawn": { "x": 0, "y": -60 },
                "Position": {},
                "Collidable": {},
                "Spin": { "rad_per_sec": Math.PI / 2 },
                "Sprite": {
                    "shape": "enemyscout",
                    "stroke_style": "#fff",
                    "width": 15,
                    "height": 15
                }
            },
            "25": {
                "Spawn": { "x": 30, "y": 0 },
                "Position": {},
                "Collidable": {},
                "Spin": { "rad_per_sec": Math.PI * 2 },
                "Bouncer": { "x_dir": 1, "y_dir": 1, "x_sec": 100, "y_sec": 25 },
                "Sprite": {
                    "shape": "torpedo",
                    "stroke_style": "#f33",
                    "width": 10,
                    "height": 10
                }
            },
            "30": {
                "Spawn": { "x": 0, "y": 30 },
                "Position": {},
                "Collidable": {},
                "Spin": { "rad_per_sec": Math.PI * 4 },
                "Bouncer": { "x_dir": -1, "y_dir": 1, "x_sec": 25, "y_sec": 100 },
                "Sprite": {
                    "shape": "torpedo",
                    "stroke_style": "#f33",
                    "width": 10, "height": 10
                }
            },
            "35": {
                "Spawn": { "x": 30, "y": 30 },
                "Position": {},
                "Collidable": {},
                "Spin": { "rad_per_sec": Math.PI * 6 },
                "Bouncer": { "x_dir": -1, "y_dir": -1, "x_sec": 50, "y_sec": 25 },
                "Sprite": {
                    "shape": "torpedo",
                    "stroke_style": "#f33",
                    "width": 10, "height": 10
                }
            }
        },
        "groups": {
            "10": [ "10", "15", "20", "25", "30", "35" ]
        }
    })

    world.measure_fps = true
    world.current_scene = _.keys(data.groups)[0]
    world.start()
