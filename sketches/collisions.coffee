define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore'
], (
    W, E, C, S, PubSub, $, _
) ->

    () ->
        world = new W.World(320, 240,
            new S.SpawnSystem,
            new S.CollisionSystem,
            new S.BouncerSystem,
            new S.SpinSystem,
            new S.OrbiterSystem,
            render_system = new S.RenderSystem(
                window,
                document.getElementById('gameArea'),
                document.getElementById('gameCanvas'),
                1.0, 1.0,
                true
            )
        )

        render_system.draw_bounding_boxes = true

        em = world.entities

        scene = E.Scene.create(em, "Scene 1",
            e_hero = em.create(
                new C.TypeName('HeroShip'),
                new C.EntityName('hero'),
                new C.Spawn('at', 80, 0),
                new C.MapPosition,
                new C.Collidable,
                new C.Sprite('hero')
            ),
            e_enemy = em.create(
                new C.TypeName('EnemyScout'),
                new C.EntityName('enemy1'),
                new C.Spawn('at', -80, 0),
                new C.MapPosition,
                new C.Collidable,
                new C.Sprite('enemyscout', '#fff', 15, 15)
            ),
            e_enemy2 = em.create(
                new C.TypeName('EnemyCruiser'),
                new C.EntityName('enemy1'),
                new C.Spawn('at', 0, -60),
                new C.MapPosition,
                new C.Collidable,
                new C.Sprite('enemycruiser', '#fff', 40, 40)
            ),
            em.create(
                new C.TypeName('Torpedo'),
                new C.EntityName('torpedo1'),
                new C.Spawn('at', 0, 0),
                new C.MapPosition,
                new C.Collidable,
                new C.Spin(Math.PI * 2),
                new C.Bouncer(1, 1, 50, 50),
                new C.Sprite('torpedo', '#f33', 10, 10)
            ),
            em.create(
                new C.TypeName('Torpedo'),
                new C.EntityName('torpedo1'),
                new C.Spawn('at', 0, 0),
                new C.MapPosition,
                new C.Collidable,
                new C.Spin(Math.PI * 4),
                new C.Bouncer(-1, 1, 50, 50),
                new C.Sprite('torpedo', '#f33', 10, 10)
            ),
            em.create(
                new C.TypeName('Torpedo'),
                new C.EntityName('torpedo1'),
                new C.Spawn('at', 0, 0),
                new C.MapPosition,
                new C.Collidable,
                new C.Spin(Math.PI * 6),
                new C.Bouncer(-1, -1, 50, 50),
                new C.Sprite('torpedo', '#f33', 10, 10)
            )
        )

        world.subscribe '', (msg, data) ->
            console.log("MSG #{msg} <- #{JSON.stringify(data)}")

        world.subscribe "collision", (msg, data) ->
            [sprite, type_name] = em.get(data.entity, C.Sprite, C.TypeName)
            return if 'Torpedo' == type_name.name
            if data.state is 'enter'
                sprite.stroke_style = '#f33'
            else
                sprite.stroke_style = '#fff'

        world.dump = () ->
            console.log JSON.stringify(world.entities.store)

        window.world = world

        world.start()

        world.publish S.RenderSystem.MSG_SCENE_CHANGE,
            scene: scene
