define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore'
], (
    W, E, C, S, PubSub, $, _
) ->

    class ColorCollideSystem extends S.System
        match_component: C.Collidable
        update_match: (dt, eid, collidable) ->
            sprite = @world.entities.get(eid, C.Sprite)
            if _.keys(collidable.in_collision_with).length > 0
                sprite.stroke_style = "#f33"
            else
                sprite.stroke_style = "#fff"

    class PointerFollower extends C.Component
    
    class PointerFollowerSystem extends S.System
        match_component: PointerFollower
        update_match: (dt, eid, pointer_follower) ->
            pos = @world.entities.get(eid, C.Position)
            pos.x = @world.inputs.pointer_world_x
            pos.y = @world.inputs.pointer_world_y

    canvas = document.getElementById('gameCanvas')
    area = document.getElementById('gameArea')
        
    world = new W.World(320, 240,
        new S.PointerInputSystem(canvas),
        new S.SpawnSystem,
        new S.BouncerSystem,
        new S.SpinSystem,
        new S.OrbiterSystem,
        new S.SeekerSystem,
        new S.ThrusterSystem,
        new S.CollisionSystem,
        new ColorCollideSystem,
        new PointerFollowerSystem,
        vp_system = new S.ViewportSystem(
            window, area, canvas, 1.0, 1.0, true
        ),
    )

    vp_system.draw_bounding_boxes = true

    em = world.entities

    scene = E.Scene.create(em, "Scene 1",
        e_sun = E.Star.create(em, 'Sun'),
        e_torp = em.create(
            new C.TypeName('Torpedo'),
            new C.EntityName('torpedo1'),
            new C.Spawn('at', 30, 0),
            new C.Position,
            new C.Collidable,
            new PointerFollower,
            new C.Spin(Math.PI * 2),
            new C.Sprite('torpedo', '#f33', 10, 10)
        ),
        e_enemy1 = em.create(
            new C.TypeName('EnemyCruiser'),
            new C.EntityName('enemy1'),
            new C.Sprite('enemycruiser', '#fff', 50, 50)
            new C.Spawn('at', 0, -60),
            new C.Position,
            new C.Collidable,
            new C.Spin(Math.PI / 4),
            new C.Thruster(30, 20, 0, 0),
            new C.Seeker(e_sun, Math.PI/2)
        ),
        e_enemy2 = em.create(
            new C.TypeName('EnemyScout'),
            new C.EntityName('enemy2'),
            new C.Sprite('enemyscout', '#fff', 15, 15),
            new C.Spawn('at', -80, 0),
            new C.Position,
            new C.Collidable,
            new C.Thruster(75, 50, 0, 0),
            new C.Seeker(e_sun, Math.PI)
        ),
        e_enemy3 = em.create(
            new C.TypeName('EnemyScout'),
            new C.EntityName('enemy3'),
            new C.Sprite('enemyscout', '#fff', 15, 15),
            new C.Spawn('at', -80, 0),
            new C.Position,
            new C.Collidable,
            new C.Thruster(75, 50, 0, 0),
            new C.Seeker(e_torp, Math.PI)
        ),
        e_hero = em.create(
            new C.TypeName('HeroShip'),
            new C.EntityName('hero'),
            new C.Sprite('hero')
            new C.Spawn('at', 80, 0),
            new C.Position,
            new C.Collidable,
            new C.Thruster(50, 50, 0, 0),
            new C.Seeker(e_enemy1, Math.PI)
        ),
    )

    world.subscribe '', (msg, data) ->
        console.log("MSG #{msg} <- #{JSON.stringify(data)}")

    world.dump = () ->
        console.log JSON.stringify(world.entities.store)

    window.world = world

    () ->
        world.start()
        world.publish S.ViewportSystem.MSG_SCENE_CHANGE,
            scene: scene
