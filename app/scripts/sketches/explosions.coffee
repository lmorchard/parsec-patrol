define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore', 'Vector2D', 'utils', 'dat'
], (
    W, E, C, S, PubSub, $, _, Vector2D, Utils, dat
) -> (canvas, use_gui=true, measure_fps=true) ->

    world = new W.World(640, 480,
        vp = new S.ViewportSystem(canvas),
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
        return if world.is_paused

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

    if use_gui
        gui = new dat.GUI()
        gui.add(world, 'is_paused')

    world.measure_fps = measure_fps

    window.world = world
    window.C = C
    window.E = E
    window.S = S

    return world
