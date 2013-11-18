define [
    'worlds', 'entities', 'components', 'systems', 'utils', 'pubsub', 'jquery',
    'underscore', 'dat', 'Vector2D'
], (
    W, E, C, S, Utils, PubSub, $, _, dat, Vector2D
) -> (canvas, use_gui=true, measure_fps=true) ->

    world = new W.World(1000, 1000,
        vp = new S.ViewportSystem(canvas),
        new S.PointerInputSystem(canvas),
        new S.ClickCourseSystem,
        new S.SpawnSystem,
        new S.HealthSystem,
        new S.CollisionSystem,
        new S.BouncerSystem,
        new S.SeekerSystem,
        new S.SteeringSystem,
        new S.ThrusterSystem,
        new S.MotionSystem,
        new S.SpinSystem,
        new S.BeamWeaponSystem,
        new S.ExplosionSystem,
    )
    em = world.entities

    world.load
        entities:

            rock:
                TypeName: { name: "Rock" }
                Sprite: { shape: "asteroid", width: 300, height: 300 }
                Spawn: { x: 0, y: 0 }
                Position: {}
                Motion: { drotation: Math.PI / 8 }
                Collidable: {}
                CollisionCircle: { radius: 150 }
                # Bouncer: { mass: 2000, damage: 0 }

            hero:
                TypeName: { name: "HeroShip" }
                Sprite: { shape: "hero", width: 30, height: 30 }
                Spawn: { x: 450, y: 0 }
                Position: {},
                Motion: { dx:0, dy: 0 },
                Collidable: {},
                CollisionCircle: { radius: 15 }

            enemy:
                Sprite: { shape: 'enemyscout', width: 30, height: 30 }
                Spawn: { x: -450, y: 0 }
                Position: {}
                Motion: {}
                Collidable: {},
                Bouncer: { mass: 2000, damage: 0 }
                Thruster: { dv: 250, max_v: 120 }
                Steering:
                    target: 'hero'
                    rad_per_sec: Math.PI

        groups:
            main: [ 'rock', 'hero', 'enemy' ]

        current_scene: "main"

    vp.zoom = 1.0
    vp.draw_bounding_boxes = false
    world.measure_fps = measure_fps
    if use_gui
        gui = new dat.GUI()
        gui.add(world, 'is_paused').listen()
        gui.add(vp, 'zoom', 0.125, 3).step(0.125)
        gui.add(vp, 'use_grid')
        gui.add(vp, 'glow')
        gui.add(vp, 'use_sprite_cache')
        gui.add(vp, 'draw_bounding_boxes')

    window.world = world

    return world
