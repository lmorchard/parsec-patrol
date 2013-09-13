define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore'
], (
    W, E, C, S, PubSub, $, _
) ->
    canvas = document.getElementById('gameCanvas')
    area = document.getElementById('gameArea')
        
    world = new W.World(640, 480,
        new S.ViewportSystem(window, area, canvas, 1.0, 1.0),
        new S.PointerInputSystem(canvas),
        new S.ClickCourseSystem,
        new S.SpawnSystem,
        new S.SpinSystem,
        new S.SeekerSystem,
        new S.ThrusterSystem,
    )

    em = world.entities

    world.current_scene = scene = em.createGroup(
        e_sun = E.Star.create(em, 'Sun'),
        e_hero = em.create(
            new C.TypeName('HeroShip'),
            new C.EntityName('hero'),
            new C.Sprite('hero'),
            new C.Position,
            new C.Spawn('at', -40, 40),
            new C.Collidable,
            new C.Thruster(150, 75, 0, 0, false),
            new C.ClickCourse(true),
            new C.Seeker(null, Math.PI)
        ),
        e_enemy3 = em.create(
            new C.TypeName('EnemyScout'),
            new C.EntityName('enemy3'),
            new C.Sprite('enemyscout', '#fff', 15, 15),
            new C.Spawn('at', -80, 0),
            new C.Position,
            new C.Collidable,
            new C.Thruster(100, 50, 0, 0),
            new C.Seeker(e_hero, Math.PI)
        ),
        e_enemy4 = em.create(
            new C.TypeName('EnemyScout'),
            new C.EntityName('enemy3'),
            new C.Sprite('enemyscout', '#fff', 15, 15),
            new C.Spawn('at', 0, 80),
            new C.Position,
            new C.Collidable,
            new C.Thruster(100, 50, 0, 0),
            new C.Seeker(e_enemy3, Math.PI)
        ),
        e_enemy5 = em.create(
            new C.TypeName('EnemyScout'),
            new C.EntityName('enemy5'),
            new C.Sprite('enemyscout', '#fff', 15, 15),
            new C.Spawn('at', 80, 0),
            new C.Position,
            new C.Collidable,
            new C.Thruster(100, 50, 0, 0),
            new C.Seeker(e_enemy4, Math.PI * 2)
        ),
        e_enemy6 = em.create(
            new C.TypeName('EnemyScout'),
            new C.EntityName('enemy6'),
            new C.Sprite('enemyscout', '#fff', 15, 15),
            new C.Spawn('at', 80, -80),
            new C.Position,
            new C.Collidable,
            new C.Thruster(100, 50, 0, 0),
            new C.Seeker(e_enemy5, Math.PI * 2)
        ),
    )

    window.world = world

    world.start()
