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
        world.width = 640
        world.height = 480
        world.addSystem(
            new S.SpawnSystem,
            new S.BouncerSystem,
            new S.OrbiterSystem,
            render_system = new S.RenderSystem(
                window,
                document.getElementById('gameArea'),
                document.getElementById('gameCanvas')
            )
        )

        em = world.entities

        scene = E.Scene.create(em, "Scene 1")
        
        sun = E.Star.create(em, "Star 1")
        
        sprites = []

        sprites.push em.create(
            new C.TypeName('HeroShip'),
            new C.EntityName('hero'),
            new C.Spawn('at', 100, -100),
            new C.MapPosition,
            new C.Orbit(sun, Math.PI/16),
            new C.Sprite('hero')
        )

        sprites.push em.create(
            new C.TypeName('EnemyScout'),
            new C.EntityName('enemy1'),
            new C.Spawn('at', -100, -100),
            new C.MapPosition,
            new C.Orbit(sun, Math.PI/16),
            new C.Sprite('enemyscout')
        )

        sprites.push em.create(
            new C.TypeName('EnemyCruiser'),
            new C.EntityName('enemy1'),
            new C.Spawn('at', -150, 0),
            new C.MapPosition,
            new C.Orbit(sun, Math.PI/16),
            new C.Sprite('enemycruiser')
        )

        sprites.push em.create(
            new C.TypeName('Asteroid'),
            new C.EntityName('asteroid1'),
            new C.Spawn('at', -100, 100),
            new C.MapPosition,
            new C.Orbit(sun, Math.PI/16),
            new C.Sprite('asteroid')
        )

        sprites.push em.create(
            new C.TypeName('Torpedo'),
            new C.EntityName('torpedo1'),
            new C.Spawn('at', 100, 100),
            new C.MapPosition,
            new C.Orbit(sun, Math.PI/16),
            new C.Sprite('torpedo')
        )

        group = em.get(scene, C.EntityGroup)
        C.EntityGroup.add(group, sun, sprites...)

        world.subscribe '', (msg, data) ->
            console.log("MSG #{msg} <- #{JSON.stringify(data)}")

        world.publish S.RenderSystem.MSG_SCENE_CHANGE,
            scene: scene

        world.dump = () ->
            console.log JSON.stringify(world.entities.store)
        window.world = world

        world.start()
