define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore', 'dat'
], (
    W, E, C, S, PubSub, $, _, dat
) -> (canvas, use_gui=true, measure_fps=true) ->

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
        vp = new S.ViewportSystem(canvas),
    )

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

    if use_gui
        gui = new dat.GUI()
        gui.add(world, 'is_paused')
        gui.add(vp, 'use_sprite_cache')
        gui.add(vp, 'draw_bounding_boxes')

    world.measure_fps = measure_fps
    world.current_scene = _.keys(data.groups)[0]

    return world
