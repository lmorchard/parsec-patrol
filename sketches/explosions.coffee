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
    )

    e_ct = 0

    spawn_explosion = () ->
        v_spawn = new Vector2D(0, (250 - (210 * Math.random())))
        v_center = new Vector2D(0, 0)
        v_spawn.rotateAround(v_center, (Math.PI*2) * Math.random())
        exp = em.create(
            new C.TypeName('Explosion'),
            new C.EntityName("explosion-#{e_ct++}"),
            new C.Position,
            new C.Spawn('at', v_spawn.x, v_spawn.y),
            new C.Explosion(1.0, 75, 50, 4, 150, '#f00'),
        )
        group = em.get(scene, C.EntityGroup)
        C.EntityGroup.add(group, exp)

    setInterval spawn_explosion, 1.5 * Math.random()

    world.dump = () ->
        console.log JSON.stringify(world.entities.store)

    window.world = world

    () ->
        world.start()
        world.publish S.SceneSystem.MSG_SCENE_CHANGE,
            scene: scene
