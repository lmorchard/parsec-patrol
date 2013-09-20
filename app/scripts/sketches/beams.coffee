define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore', 'Vector2D', 'utils', 'dat'
], (
    W, E, C, S, PubSub, $, _, Vector2D, Utils, dat
) ->
    stats = {
        dps: 0,
        enemies_ct: 0,
    }
    options = {
        max_enemies: 24,
        measure_dps: true
    }

    canvas = document.getElementById('gameCanvas')
    area = document.getElementById('gameArea')
        
    world = new W.World(640, 480,
        vp = new S.ViewportSystem(window, area, canvas, 1.0, 1.0),
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
    world.measure_fps = true
    
    window.C = C
    window.E = E
    window.W = W
    window.world = world

    em = world.entities

    world.load(data = {
        "entities": {
            "sun": {
                "Sprite": { "shape": "star" },
                "Spawn": { "position_logic": "center" },
                "Position": {}
            },
            "hero": {
                "TypeName": { "name": "HeroShip" },
                "Sprite": { "shape": "hero" },
                "Position": {},
                "Collidable": {},
                "Spawn": { "x": -65, "y": 65 },
                "Orbit": { "orbited_id": "sun", "rad_per_sec": Math.PI/4 },
                # "Thruster": { "dv": 250, "max_v": 100, "active": false },
                # "Seeker": { "rad_per_sec": Math.PI },
                # "ClickCourse": { "stop_on_arrival": true },
                "Health": { "max": "20000" }
                "WeaponsTarget" : { "team": "commonwealth" },
                "BeamWeapon": {
                    "max_beams": 15,
                    "active_beams": 9,
                    "dmg_penalty": 0.2,
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
    world.current_scene = scene = _.keys(data.groups)[0]

    v_spawn = new Vector2D(0, -300)
    v_center = new Vector2D(0, 0)
    enemy_ct = 0

    spawn_enemy = () ->
        enemy_ct++
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

    world.subscribe S.SpawnSystem.MSG_SPAWN, (msg, data) =>
        scouts = (eid for eid, tn of em.getComponents(C.TypeName) when tn.name is 'EnemyScout')
        stats.enemies_ct = scouts.length

    world.subscribe S.SpawnSystem.MSG_DESPAWN, (msg, data) =>
        type_name = em.get(data.entity_id, C.TypeName)
        
        scouts = (eid for eid, tn of em.getComponents(C.TypeName) when tn.name is 'EnemyScout')
        stats.enemies_ct = scouts.length

        # Respawn an enemy, if necessary
        if type_name?.name is "EnemyScout"
            if scouts.length <= options.max_enemies
                spawn_enemy()

        # Reload after a few seconds, if the hero ship dies
        if type_name?.name is "HeroShip"
            r = () -> location.reload()
            setTimeout r, 5000

    if options.max_enemies
        for idx in [1..options.max_enemies]
            spawn_enemy()

    damage_log = []
    world.subscribe S.HealthSystem.MSG_DAMAGE, (msg, data) =>
        return if not options.measure_dps
        
        # Only count hero ship DPS
        type_name = em.get(data.from, C.TypeName)
        return if type_name?.name isnt "HeroShip"

        # This is wasted damage - target already dead.
        health = em.get(data.to, C.Health)
        return if not health

        t_now = Utils.now()

        damage_log.push([t_now, data.amount])
        while t_now - damage_log[0][0] > 30000
            damage_log.shift()

        t_start = damage_log[0][0]
        t_end = damage_log[damage_log.length-1][0]
        duration = t_end - t_start

        dmg_sum = 0
        for entry in damage_log
            dmg_sum += entry[1]
        
        stats.dps = dmg_sum / (duration/1000)
    
    gui = new dat.GUI()
    # gui.add(vp, 'use_sprite_cache')
    gui.add(options, 'max_enemies', 1, 200).step(10)
    gui.add(stats, 'enemies_ct').listen()
    gui.add(c_hero_beam, 'active_beams', 1, 15).step(1)
    gui.add(options, 'measure_dps')
    gui.add(stats, 'dps').listen()
    gui.add(c_hero_beam.current_stats, 'beam_range').listen()
    gui.add(c_hero_beam.current_stats, 'max_charge').listen()
    gui.add(c_hero_beam.current_stats, 'charge_rate').listen()
    gui.add(c_hero_beam.current_stats, 'discharge_rate').listen()
    gui.add(c_hero_beam.current_stats, 'dmg_penalty', 0.0, 1.0).step(0.001).listen()

    f_beams = gui.addFolder('beams')
    for idx in [0..c_hero_beam.max_beams-1]
        f_beams.add(c_hero_beam.beams[idx], 'charge', 0, 4500).listen()

    world.start()
