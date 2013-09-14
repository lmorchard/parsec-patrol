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
        new S.ClickCourseSystem,
        new S.SpawnSystem,
        new S.ExplosionSystem,
    )

    em = world.entities

    world.current_scene = scene = em.createGroup(
        e_sun = E.Star.create(em, 'Sun'),
    )

    spawn_explosion = () ->
        v_spawn = new Vector2D(0, (250 - (150 * Math.random())))
        v_center = new Vector2D(0, 0)
        v_spawn.rotateAround(v_center, (Math.PI*2) * Math.random())
        em.addToGroup(scene, em.create(
            new C.TypeName('Explosion'),
            new C.Position,
            new C.Spawn('at', v_spawn.x, v_spawn.y),
            new C.Explosion(0.75, 70, 50, 2, 175, '#f00'),
        ))

    setInterval spawn_explosion, 0.5 * Math.random()

    world.start()
