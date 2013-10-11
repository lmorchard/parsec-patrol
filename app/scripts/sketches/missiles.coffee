define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore', 'Vector2D', 'utils', 'dat'
], (
    W, E, C, S, PubSub, $, _, Vector2D, Utils, dat
) -> (canvas, use_gui=true, measure_fps=true) ->

    options = {
        max_enemies: 100
        respawn_enemies: true
    }
    
    world = new W.World(1000, 1000,
        vp = new S.ViewportSystem(canvas),
        new S.RadarSystem(canvas, 0.28),
        new S.PointerInputSystem(canvas),
        new S.ClickCourseSystem,
        new S.SpawnSystem,
        new S.SpinSystem,
        new S.OrbiterSystem,
        new S.SeekerSystem,
        new S.ThrusterSystem,
        new S.HealthSystem,
        new S.BeamWeaponSystem,
        new S.MissileWeaponSystem,
        new S.VaporTrailSystem,
        new S.ExplosionSystem,
    )

    vp.zoom = 2

    em = world.entities

    world.load(data = {
        "entities": {
            "sun": {
                "Sprite": { "shape": "star" },
                "Spawn": { "position_logic": "center", },
                "RadarPing": { "color": "#ff0" },
                "Position": {}
            },
            "hero": {
                "TypeName": { "name": "HeroShip" },
                "Sprite": { "shape": "hero" },
                "Position": {},
                "Collidable": {},
                "Spawn": {
                    "x": 200,
                    "y": 0,
                },
                "Thruster": { "dv": 250, "max_v": 100, "active": false },
                "Seeker": { "rad_per_sec": Math.PI },
                "ClickCourse": { "stop_on_arrival": true },
                "Health": { "max": "20000" }
                "RadarPing": { "color": "#0f0" },
                "WeaponsTarget" : { "team": "commonwealth" },
                "BeamWeapon": {
                    "max_beams": 15,
                    "active_beams": 10,
                    "max_range": 1250,
                    "max_power": 4500,
                    "charge_rate": 4500,
                    "discharge_rate": 4500,
                    "color": "#33f",
                    "target_team": "invaders"
                }
                "Tombstone": {
                    "load": {
                        "Position": {},
                        "Explosion": {
                            "ttl": 5,
                            "radius": 70,
                            "max_particles": 50,
                            "max_particle_size": 1.5,
                            "max_velocity": 300,
                            "color": "#fff"
                        },
                        "Spawn": {
                            "capture_camera": true
                        }
                    }
                }
            },
            "cruiser": {
                "TypeName": { "name": "EnemyCruiser" },
                "Sprite": {
                    "shape": "enemycruiser",
                    "width": 50, "height": 50,
                    "stroke_style": "#f33"
                },
                "Position": {},
                "Collidable": {},
                "Spin": { "rad_per_sec": Math.PI / 16 }
                "Spawn": {
                    "x": -200,
                    "y": 0,
                    "rotation": Math.PI / 2
                },
                "Thruster": { "dv": 50, "max_v": 100, "active": false },
                "Seeker": { "rad_per_sec": Math.PI },
                "Health": { "max": "20000" }
                "RadarPing": { "color": "#f33", "size": 8 },
                "WeaponsTarget" : { "team": "invaders" },
                "MissileWeapon": {
                    "target_team": "commonwealth",
                    "max_turrets": 100,
                    "active_turrets": 15,
                    "loading_time": 3.0,
                    "target_range": 1000,
                    "missile": {
                        "health": 20,
                        "damage": 1000,
                        "speed": 125,
                        "ttl": 6.0,
                        "color": "#f00",
                        "error": 0 #0.125,
                        "rad_per_sec": Math.PI * 1.75
                        "acquisition_delay": 0.75
                    }
                },
                "Tombstone": {
                    "load": {
                        "Position": {},
                        "Explosion": {
                            "ttl": 5,
                            "radius": 70,
                            "max_particles": 50,
                            "max_particle_size": 1.5,
                            "max_velocity": 300,
                            "color": "#33f"
                        },
                    }
                }
            }
        },
        "groups": {
            "main": [ "sun", "hero", "cruiser" ]
        },
        "current_scene": "main"
    })

    c_hero_beam = world.entities.get("hero", C.BeamWeapon)
    c_hero_health = world.entities.get("hero", C.Health)
    c_enemy_turrets = world.entities.get("cruiser", C.MissileWeapon)

    stats = {
        enemy_ct: 0
    }
    world.subscribe S.SpawnSystem.MSG_DESPAWN, (msg, data) =>
        type_name = em.get(data.entity_id, C.TypeName)

        # Reload after a few seconds, if the hero ship dies
        if type_name?.name is "HeroShip"
            r = () -> location.reload()
            setTimeout r, 5000

    window.C = C
    window.E = E
    window.W = W
    window.world = world
    window.vp = vp

    world.measure_fps = measure_fps
    if use_gui
        gui = new dat.GUI()
        gui.add(world, 'is_paused')
        gui.add(vp, 'glow')
        gui.add(vp, 'use_sprite_cache')
        gui.add(vp, 'zoom', 0.125, 15).step(0.125)
        gui.add(vp, 'use_grid')
        gui.add(c_hero_beam, 'active_beams', 1, 15).step(1)
        gui.add(c_enemy_turrets, 'active_turrets', 1, 100).step(1)

    ###
    f_missiles = gui.addFolder('turrets')
    for idx in [0..c_enemy_turrets.max_turrets-1]
        f_missiles.add(c_enemy_turrets.turrets[idx], 'loading', 0, 5).listen()
    ###
    
    return world
