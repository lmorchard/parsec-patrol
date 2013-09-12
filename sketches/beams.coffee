define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore', 'Vector2D', 'utils'
], (
    W, E, C, S, PubSub, $, _, Vector2D, Utils
) ->

    canvas = document.getElementById('gameCanvas')
    area = document.getElementById('gameArea')
        
    world = new W.World(640, 480,
        new S.ViewportSystem(window, area, canvas, 1.0, 1.0),
        new S.KeyboardInputSystem(canvas),
        new S.PointerInputSystem(canvas),
        new S.ClickCourseSystem,
        new S.SpawnSystem,
        new S.SceneSystem,
        new S.OrbiterSystem,
        new S.SpinSystem,
        new S.SeekerSystem,
        new S.ThrusterSystem,
        new S.HealthSystem,
        new S.BeamWeaponSystem,
        new S.ExplosionSystem,
    )

    em = world.entities

    scene = E.Scene.create(em, "Scene 1",
        e_sun = E.Star.create(em, 'Sun'),
        e_hero = em.create(
            new C.TypeName('HeroShip'),
            new C.EntityName('hero'),
            new C.Sprite('hero'),
            new C.Position,
            new C.Spawn('at', -65, 65),
            new C.Collidable,
            new C.Orbit(e_sun, Math.PI/4),
            #new C.Thruster(150, 75, 0, 0, false),
            #new C.Seeker(null, Math.PI),
            #new C.ClickCourse(true),
            new C.Health(20000),
            new C.WeaponsTarget("commonwealth"),
            c_hero_beam = new C.BeamWeapon(15, 9, 1250, 3500, 3500, 3500, "#33f", "invaders"),
        ),
    )

    if false
        e_enemy = em.create(
            new C.TypeName('EnemyScout'),
            new C.EntityName("enemy-#{enemy_ct}"),
            new C.Sprite('enemyscout', '#f33', 12, 12),
            new C.Spawn('at', -65, -65),
            new C.Position,
            new C.Collidable,
            #new C.Thruster(100, 50, 0, 0),
            new C.Seeker(e_hero, Math.PI * 2),
            new C.Health(3000000),
            new C.WeaponsTarget("invaders"),
            new C.BeamWeapon(1, 1, 75, 250, 250, 500, "#f44", "commonwealth"),
        )
        group = em.get(scene, C.EntityGroup)
        C.EntityGroup.add(group, e_enemy)

    window.beam = c_hero_beam

    MAX_ENEMIES = 24

    v_spawn = new Vector2D(0, -300)
    v_center = new Vector2D(0, 0)
    enemy_ct = 0

    $('#beam_sel').click (ev) ->
        target_el = $(ev.target)
        c_hero_beam.active_beams = target_el.attr('value')
        return false

    spawn_enemy = () ->
        enemy_ct++
        v_spawn.rotateAround(v_center, (Math.PI*2) * Math.random())
        enemy = em.create(
            new C.TypeName('EnemyScout'),
            new C.EntityName("enemy-#{enemy_ct}"),
            new C.Sprite('enemyscout', '#f33', 12, 12),
            new C.Spawn('at', v_spawn.x, v_spawn.y),
            new C.Position,
            new C.Collidable,
            new C.Thruster(100, 50, 0, 0),
            new C.Seeker(e_hero, Math.PI * 2),
            new C.Health(300),
            new C.WeaponsTarget("invaders"),
            new C.BeamWeapon(1, 1, 75, 250, 250, 500, "#f44", "commonwealth"),
        )
        group = em.get(scene, C.EntityGroup)
        C.EntityGroup.add(group, enemy)

    spawn_explosion = (dying_eid) ->
        pos = em.get(dying_eid, C.Position)
        exp = em.create(
            new C.TypeName('Explosion'),
            new C.Position,
            new C.Spawn('at', pos.x, pos.y),
            new C.Explosion(0.5, 70, 100, 1.5, 125, '#f33'),
        )
        group = em.get(scene, C.EntityGroup)
        C.EntityGroup.add(group, exp)

    world.subscribe S.SpawnSystem.MSG_DESPAWN, (msg, data) =>
        
        type_name = em.get(data.entity_id, C.TypeName)

        # Respawn an enemy, if necessary
        if type_name?.name is "EnemyScout"
            
            spawn_explosion(data.entity_id)

            scouts = (eid for eid, tn of em.getComponents(C.TypeName) when tn.name is 'EnemyScout')
            if scouts.length <= MAX_ENEMIES
                spawn_enemy()

        # Reload after a few seconds, if the hero ship dies
        if type_name?.name is "HeroShip"
            r = () -> location.reload()
            setTimeout r, 5000

    if MAX_ENEMIES
        for idx in [1..MAX_ENEMIES]
            spawn_enemy()

    damage_log = []
    if false then world.subscribe S.HealthSystem.MSG_DAMAGE, (msg, data) =>
        
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
        
        dps = dmg_sum / (duration/1000)
        $('#dps').attr('value', "#{dps}")

    world.subscribe S.SpawnSystem.MSG_SPAWN, (msg, data) =>
        #scouts = (eid for eid, tn of em.getComponents(C.TypeName) when tn.name is 'EnemyScout')

    world.dump = () ->
        console.log JSON.stringify(world.entities.store)

    window.world = world

    () ->
        world.start()
        world.publish S.SceneSystem.MSG_SCENE_CHANGE,
            scene: scene
