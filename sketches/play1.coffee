define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore'
], (
    W, E, C, S, PubSub, $, _
) ->

    () ->
        gameCanvas = document.getElementById('gameCanvas')
        return if not gameCanvas

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

            gameArea = document.getElementById('gameArea')
            gameArea.style.width = "#{new_w}px"
            gameArea.style.height = "#{new_h}px"
            gameArea.style.marginLeft = "#{-new_w/2}px"
            gameArea.style.marginTop = "#{-new_h/2}px"
            
            gameCanvas = document.getElementById('gameCanvas')
            gameCanvas.width = new_w * 1.00
            gameCanvas.height = new_h * 0.75

        resizeGame()
        window.addEventListener('resize', resizeGame, false)
        window.addEventListener('orientationchange', resizeGame, false)

        world = new W.World

        world.tick_delay = 1000 / 60
        
        world.width = gameCanvas.width
        world.height = gameCanvas.height

        world.addSystem(
            new S.SpawnSystem,
            new S.BouncerSystem,
            new S.OrbiterSystem,
            new S.RenderSystem document.getElementById('gameCanvas')
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

        $('#controlPanel').delegate 'button', 'click', (ev) ->
            switch ev.target.className
                when 'srs'
                    scene = scenes[0]
                when 'lrs'
                    scene = scenes[1]
                when 'nav'
                    scene = scenes[2]
                when 'com'
                    scene = scenes[3]
                when 'pha'
                    scene = scenes[4]
                when 'tor'
                    scene = scenes[5]
                when 'dmg'
                    scene = scenes[6]
                when 'def'
                    scene = scenes[7]

            world.publish S.RenderSystem.MSG_SCENE_CHANGE, {scene: scene}

        world.dump = () ->
            console.log JSON.stringify(world.entities.store)
        window.world = world

        world.start()
