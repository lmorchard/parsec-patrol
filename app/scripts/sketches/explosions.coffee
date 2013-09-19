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
        e_sun = em.create(
            new C.Sprite({ shape: "star" }),
            new C.Spawn({ position_logic: "center" }),
            new C.Position
        )
    )

    spawn_explosion = () ->
        v_spawn = new Vector2D(0, (250 - (150 * Math.random())))
        v_center = new Vector2D(0, 0)
        v_spawn.rotateAround(v_center, (Math.PI*2) * Math.random())
        em.addToGroup(scene, em.create(
            new C.Position,
            new C.Spawn({
                x: v_spawn.x,
                y: v_spawn.y
            }),
            new C.Explosion({
                ttl: 0.75, radius: 70, max_particles: 50,
                max_particle_size: 2,
                max_velocity: 175, color: '#f00'
            }),
        ))

    setInterval spawn_explosion, 0.5 * Math.random()

    $('#save').click () ->
        $('#out').val(JSON.stringify(world.save()))
        return false


    window.world = world
    window.C = C
    window.E = E
    window.S = S

    world.start()
