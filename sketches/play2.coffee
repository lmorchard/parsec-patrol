define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore'
], (
    W, E, C, S, PubSub, $, _
) ->

    () ->
        game_canvas = document.getElementById('gameCanvas')
        return if not game_canvas

        world = new W.World
        world.tick_delay = 1000 / 60
        world.width = 1600
        world.height = 900
        world.addSystem(
            new S.SpawnSystem,
            new S.BouncerSystem,
            new S.OrbiterSystem,
            render_system = new S.RenderSystem document.getElementById('gameCanvas')
        )

        resizeGame = () ->

            [new_w, new_h] = [window.innerWidth, window.innerHeight]

            ###
            ratio = 9 / 16 # 3/4
            new_ratio = new_w / new_h
            if new_ratio > ratio
                new_w = new_h * ratio
            else
                new_h = new_w / ratio
            ###

            game_area = document.getElementById('gameArea')
            game_area.style.width = "#{new_w}px"
            game_area.style.height = "#{new_h}px"
            game_area.style.marginLeft = "#{-new_w/2}px"
            game_area.style.marginTop = "#{-new_h/2}px"
            
            game_canvas = document.getElementById('gameCanvas')
            game_canvas.width = new_w * 1.00
            game_canvas.height = new_h * 1.00

            render_system.setViewportSize(new_w, new_h)

        resizeGame()
        window.addEventListener('resize', resizeGame, false)
        window.addEventListener('orientationchange', resizeGame, false)

        em = world.entities

        num_scenes = 1 # 10
        scenes = (E.Scene.create(
            em, "Scene #{idx}"
        ) for idx in [0..num_scenes-1])

        for scene in scenes
            
            sun = E.Star.create(em, "Star 1")

            num_planets = 50 # _.random(3,10)
            planets = (E.Planet.create(
                em, "Planet #{idx}", sun
            ) for idx in [0..num_planets-1])
            
            group = em.get(scene, C.EntityGroup)
            C.EntityGroup.add(group, sun, planets...)

            #world.subscribe '', (msg, data) ->
            #console.log("MSG #{msg} <- #{JSON.stringify(data)}")

        s_idx = 0
        change_scene = () ->
            world.publish S.RenderSystem.MSG_SCENE_CHANGE,
                scene: scenes[s_idx]
            s_idx = (s_idx + 1) % scenes.length
        change_scene()
        setInterval(change_scene, 4000)

        world.dump = () ->
            console.log JSON.stringify(world.entities.store)
        window.world = world

        world.start()
