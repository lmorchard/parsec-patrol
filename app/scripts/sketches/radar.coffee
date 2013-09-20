define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore', 'Vector2D', 'utils', 'dat'
], (
    W, E, C, S, PubSub, $, _, Vector2D, Utils, dat
) ->

    options = {
        max_enemies: 100
        respawn_enemies: true
    }
    
    canvas = document.getElementById('gameCanvas')
    area = document.getElementById('gameArea')
        
    world = new W.World(3000, 3000,
        vp = new S.ViewportSystem(window, area, canvas, 1.0, 1.0, 5.0),
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
        new S.ExplosionSystem,
    )
    world.measure_fps = true
    
    window.C = C
    window.E = E
    window.W = W
    window.world = world
    window.vp = vp

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
                    "x": -65, "y": 65,
                    "capture_camera": true
                },
                "Thruster": { "dv": 250, "max_v": 100, "active": false },
                "Seeker": { "rad_per_sec": Math.PI },
                "ClickCourse": { "stop_on_arrival": true },
                "Health": { "max": "20000" }
                "RadarPing": { "color": "#0f0" },
                "WeaponsTarget" : { "team": "commonwealth" },
                "BeamWeapon": {
                    "max_beams": 15,
                    "active_beams": 9,
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
        },
        "groups": {
            "main": [ "sun", "hero" ]
        }
    })
    c_hero_beam = world.entities.get("hero", C.BeamWeapon)
    c_hero_health = world.entities.get("hero", C.Health)
    world.current_scene = scene = _.keys(data.groups)[0]

    v_center = new Vector2D(0, 0)
    spawn_enemy = () ->
        v_spawn = new Vector2D(0, -1500 * Math.random())
        v_spawn.rotateAround(v_center, (Math.PI*2) * Math.random())
        components = em.loadComponents({
            "TypeName": { "name": "EnemyScout" },
            "Sprite": {
                "shape": "enemyscout",
                "stroke_style": "#f33",
                "width": 12, "height": 12
            },
            "Spawn": { "x": v_spawn.x, "y": v_spawn.y },
            "Position": {},
            "Collidable": {},
            "Thruster": { "dv": 100, "max_v": 50 },
            "Seeker": { "target": "hero", "rad_per_sec": Math.PI }
            "Health": { "max": "300" }
            "WeaponsTarget" : { "team": "invaders" },
            "RadarPing": { "color": "#f00" },
            "BeamWeapon": {
                "max_beams": 1,
                "active_beams": 1,
                "max_range": 75,
                "max_power": 250,
                "charge_rate": 250,
                "discharge_rate": 500,
                "color": "#f44",
                "target_team": "commonwealth"
            }
            "Tombstone": {
                "load": {
                    "Position": {},
                    "Explosion": {
                        "ttl": 0.5,
                        "radius": 40,
                        "max_particles": 25,
                        "max_particle_size": 1.25,
                        "max_velocity": 250,
                        "color": "#f33"
                    }
                }
            }
        })
        e = em.create(components...)
        em.addToGroup(scene, e)

    stats = {
        enemy_ct: 0
    }
    world.subscribe S.SpawnSystem.MSG_DESPAWN, (msg, data) =>
        type_name = em.get(data.entity_id, C.TypeName)

        scouts = (eid for eid, tn of em.getComponents(C.TypeName) when tn.name is 'EnemyScout')
        stats.enemy_ct = scouts.length
        
        # Respawn an enemy, if necessary
        if type_name?.name is "EnemyScout"
            if options.respawn_enemies and scouts.length <= options.max_enemies
                spawn_enemy()
            if scouts.length is 1
                r = () -> location.reload()
                setTimeout r, 5000

        # Reload after a few seconds, if the hero ship dies
        if type_name?.name is "HeroShip"
            r = () -> location.reload()
            setTimeout r, 5000

    if options.max_enemies
        for idx in [1..options.max_enemies]
            spawn_enemy()

    gui = new dat.GUI()
    gui.add(vp, 'use_sprite_cache')
    gui.add(vp, 'zoom', 1, 15).step(0.25)
    gui.add(c_hero_beam, 'active_beams', 1, 15).step(1)
    gui.add(options, 'max_enemies', 1, 200).step(10)
    gui.add(options, 'respawn_enemies')
    gui.add(stats, 'enemy_ct').listen()

    () -> world.start()
