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
        new S.OrbiterSystem,
        new S.SeekerSystem,
        new S.ThrusterSystem,
        new S.HealthSystem,
        new S.BeamWeaponSystem,
        new S.ExplosionSystem,
    )
    em = world.entities
    world.current_scene = scene = em.createGroup(
        sun = E.Star.create(em, "Star 1"),
        em.create(
            new C.TypeName('HeroShip'),
            new C.EntityName('hero'),
            new C.Spawn('at', 100, -100),
            new C.Position,
            new C.Orbit(sun, Math.PI/10),
            new C.Sprite('hero')
        ),
        em.create(
            new C.TypeName('EnemyScout'),
            new C.EntityName('enemy1'),
            new C.Spawn('at', -100, -100),
            new C.Position,
            new C.Orbit(sun, Math.PI/10),
            new C.Sprite('enemyscout')
        ),
        em.create(
            new C.TypeName('EnemyCruiser'),
            new C.EntityName('enemy1'),
            new C.Spawn('at', -150, 0),
            new C.Position,
            new C.Orbit(sun, Math.PI/10),
            new C.Sprite('enemycruiser')
        ),
        em.create(
            new C.TypeName('Asteroid'),
            new C.EntityName('asteroid1'),
            new C.Spawn('at', -100, 100),
            new C.Position,
            new C.Orbit(sun, Math.PI/10),
            new C.Sprite('asteroid')
        ),
        em.create(
            new C.TypeName('Torpedo'),
            new C.EntityName('torpedo1'),
            new C.Spawn('at', 100, 100),
            new C.Position,
            new C.Orbit(sun, Math.PI/10),
            new C.Sprite('torpedo')
        )
    )
    world.start()
