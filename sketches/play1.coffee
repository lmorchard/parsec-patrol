define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore'
], (
    W, E, C, S, PubSub, $, _
) ->

    canvas = $('#display')[0]

    world = new W.World

    world.tick_delay = 1000 / 60
    
    world.width = canvas.width
    world.height = canvas.height

    world.addSystem(
        new S.SpawnSystem,
        new S.BouncerSystem,
        new S.OrbiterSystem,
        new S.RenderSystem canvas
    )

    em = world.entities
    sun = E.Star.create(em, "Star 1")
    for idx in [0..7]
        E.Planet.create(em, "Planet #{idx}", sun)

    world.dump = () ->
        console.log JSON.stringify(world.entities.store)
    window.world = world

    () -> world.start()
