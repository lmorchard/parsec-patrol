define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore'
], (
    W, E, C, S, PubSub, $, _
) ->

    () ->
        canvas = $('#display')[0]
        return if not canvas

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

        num_scenes = 10
        scenes = (E.Scene.create(
            em, "Scene #{idx}"
        ) for idx in [0..num_scenes-1])

        for scene in scenes
            sun = E.Star.create(em, "Star 1")
            num_planets = _.random(3,10)
            planets = (E.Planet.create(
                em, "Planet #{idx}", sun
            ) for idx in [0..num_planets-1])
            group = em.get(scene, C.EntityGroup)
            C.EntityGroup.add(group, sun, planets...)

        console.log("SCENES #{scenes}")

        world.subscribe '', (msg, data) ->
            console.log("MSG #{msg} <- #{JSON.stringify(data)}")

        world.publish S.RenderSystem.MSG_SCENE_CHANGE,
            scene: scenes[0]

        curr_scene_idx = 0
        change_scene = () ->
            curr_scene_idx = (curr_scene_idx + 1) % num_scenes
            world.publish S.RenderSystem.MSG_SCENE_CHANGE,
                scene: scenes[curr_scene_idx]
        setInterval(change_scene, 3000)


        world.dump = () ->
            console.log JSON.stringify(world.entities.store)
        window.world = world

        world.start()
