define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore'
], (
    W, E, C, S, PubSub, $, _
) ->

    canvas = document.getElementById('gameCanvas')
    area = document.getElementById('gameArea')
        
    world = new W.World(640, 480,
        new S.KeyboardInputSystem(canvas),
        new S.PointerInputSystem(canvas),
        new S.ClickCourseSystem,
        new S.SpawnSystem,
        new S.OrbiterSystem,
        new S.SpinSystem,
        new S.SeekerSystem,
        new S.ThrusterSystem,
        new S.HealthSystem,
        new S.BeamWeaponSystem,
        new S.ViewportSystem(window, area, canvas, 1.0, 1.0),
    )

    em = world.entities

    scene = E.Scene.create(em, "Scene 1",
        e_sun = E.Star.create(em, 'Sun'),
        e_hero = em.create(
            new C.TypeName('HeroShip'),
            new C.EntityName('hero'),
            new C.Sprite('hero'),
            new C.Position,
            new C.Spawn('at', -30, 30),
            new C.Collidable,
            new C.Orbit(e_sun, Math.PI/3),
            # new C.Thruster(150, 75, 0, 0, false),
            # new C.Seeker(null, Math.PI),
            # new C.ClickCourse(true),
            new C.Health(2000),
            new C.BeamWeapon(4, 125, 100),
        ),
        e_enemy3 = em.create(
            new C.TypeName('EnemyScout'),
            new C.EntityName('enemy3'),
            new C.Sprite('enemyscout', '#3ff', 15, 15),
            new C.Spawn('at', -100, 0),
            new C.Position,
            new C.Collidable,
            #new C.Thruster(100, 50, 0, 0),
            new C.Seeker(e_hero, Math.PI),
            new C.Health(1000),
            new C.WeaponsTarget,
        ),
        e_enemy4 = em.create(
            new C.TypeName('EnemyScout'),
            new C.EntityName('enemy3'),
            new C.Sprite('enemyscout', '#f3f', 15, 15),
            new C.Spawn('at', 0, 100),
            new C.Position,
            new C.Collidable,
            #new C.Thruster(100, 50, 0, 0),
            new C.Seeker(e_enemy3, Math.PI),
            new C.Health(1000),
            new C.WeaponsTarget,
        ),
        e_enemy5 = em.create(
            new C.TypeName('EnemyScout'),
            new C.EntityName('enemy5'),
            new C.Sprite('enemyscout', '#ff3', 15, 15),
            new C.Spawn('at', 100, 0),
            new C.Position,
            new C.Collidable,
            #new C.Thruster(100, 50, 0, 0),
            new C.Seeker(e_enemy4, Math.PI * 2),
            new C.Health(1000),
            new C.WeaponsTarget,
        ),
        e_enemy6 = em.create(
            new C.TypeName('EnemyScout'),
            new C.EntityName('enemy6'),
            new C.Sprite('enemyscout', '#3f3', 15, 15),
            new C.Spawn('at', 0, -100),
            new C.Position,
            new C.Collidable,
            #new C.Thruster(100, 50, 0, 0),
            new C.Seeker(e_enemy5, Math.PI * 2),
            new C.Health(1000),
            new C.WeaponsTarget,
        ),
    )

    #world.subscribe '', (msg, data) ->
    #    console.log("MSG #{msg} <- #{JSON.stringify(data)}")

    world.dump = () ->
        console.log JSON.stringify(world.entities.store)

    window.world = world

    () ->
        world.start()
        world.publish S.ViewportSystem.MSG_SCENE_CHANGE,
            scene: scene
