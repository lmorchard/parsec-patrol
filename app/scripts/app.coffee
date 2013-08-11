define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore'
], (
    W, E, C, S, PubSub, $, _
) ->

    PubSub.subscribe S.SpawnSystem.MSG_SPAWN, (msg, data) ->
        console.log "SPAWN #{msg} #{JSON.stringify(data)}"

    canvas = $('#display')[0]

    return if not canvas

    world = new W.World

    world.tick_delay = 1000 / 60
    
    world.width = canvas.width
    world.height = canvas.height

    world.addSystem(new S.SpawnSystem)
    world.addSystem(new S.BouncerSystem)
    world.addSystem(new S.OrbiterSystem)
    world.addSystem(new S.RenderSystem canvas)

    em = world.entity_manager
    sun = E.Star.create(em, "Star 1")
    for idx in [0..7]
        E.Planet.create(em, "Planet #{idx}", sun)

    world.dump = () ->
        console.log JSON.stringify(world.entity_manager.store)
    window.world = world

    () -> world.start()
