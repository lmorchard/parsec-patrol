define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore', 'Vector2D'
], (
    W, E, C, S, PubSub, $, _, Vector2D
) ->

    canvas = document.getElementById('gameCanvas')
    area = document.getElementById('gameArea')
        
    world = new W.World(640, 480,
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
        new S.ViewportSystem(window, area, canvas, 1.0, 1.0),
    )

    em = world.entities

    TOTAL_DPS = 2000
    TOTAL_RANGE = 1000
    NUM_BEAMS = 5
    BEAM_DPS = TOTAL_DPS / NUM_BEAMS
    BEAM_RANGE = 150 # TOTAL_RANGE / NUM_BEAMS

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
            # new C.Thruster(150, 75, 0, 0, false),
            # new C.Seeker(null, Math.PI),
            # new C.ClickCourse(true),
            new C.Health(2000),
            new C.WeaponsTarget("commonwealth"),
            c_hero_beam = new C.BeamWeapon(NUM_BEAMS, BEAM_RANGE, BEAM_DPS, "#33f", "invaders"),
        ),
    )

    window.beam = c_hero_beam

    MAX_ENEMIES = 24

    v_spawn = new Vector2D(0, -300)
    v_center = new Vector2D(0, 0)
    enemy_ct = 0

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
            new C.BeamWeapon(1, 75, 50, "#f44", "commonwealth"),
        )
        group = em.get(scene, C.EntityGroup)
        C.EntityGroup.add(group, enemy)

    for idx in [1..MAX_ENEMIES]
        spawn_enemy()

    world.subscribe S.SpawnSystem.MSG_SPAWN, (msg, data) =>
        #scouts = (eid for eid, tn of em.getComponents(C.TypeName) when tn.name is 'EnemyScout')

    world.subscribe S.SpawnSystem.MSG_DESPAWN, (msg, data) =>
        
        type_name = em.get(data.entity_id, C.TypeName)

        # Respawn an enemy, if necessary
        if type_name?.name is "EnemyScout"
            scouts = (eid for eid, tn of em.getComponents(C.TypeName) when tn.name is 'EnemyScout')
            if scouts.length <= MAX_ENEMIES
                spawn_enemy()

        # Reload after a few seconds, if the hero ship dies
        if type_name?.name is "HeroShip"
            r = () -> location.reload()
            setTimeout r, 5000

    world.dump = () ->
        console.log JSON.stringify(world.entities.store)

    window.world = world

    () ->
        world.start()
        world.publish S.SceneSystem.MSG_SCENE_CHANGE,
            scene: scene
