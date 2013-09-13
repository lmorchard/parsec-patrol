define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore'
], (
    W, E, C, S, PubSub, $, _
) ->

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
        new S.SpinSystem,
        new S.SeekerSystem,
        new S.ThrusterSystem,
        new PointerFollowerSystem,
        new S.ViewportSystem(
            window, area, canvas, 1.0, 1.0
        ),
    )

    em = world.entities
    world.current_scene = scene = em.createGroup(
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
        e_enemy3 = em.create(
            new C.TypeName('EnemyScout'),
            new C.EntityName('enemy3'),
            new C.Sprite('enemyscout', '#3ff', 15, 15),
            new C.Spawn('at', -80, 0),
            new C.Position,
            new C.Collidable,
            new C.Thruster(150, 75, 0, 0),
            new C.Seeker(e_torp, Math.PI)
        ),
        e_enemy4 = em.create(
            new C.TypeName('EnemyScout'),
            new C.EntityName('enemy3'),
            new C.Sprite('enemyscout', '#f3f', 15, 15),
            new C.Spawn('at', 0, 80),
            new C.Position,
            new C.Collidable,
            new C.Thruster(150, 75, 0, 0),
            new C.Seeker(e_enemy3, Math.PI)
        ),
        e_enemy5 = em.create(
            new C.TypeName('EnemyScout'),
            new C.EntityName('enemy5'),
            new C.Sprite('enemyscout', '#ff3', 15, 15),
            new C.Spawn('at', 80, 0),
            new C.Position,
            new C.Collidable,
            new C.Thruster(150, 75, 0, 0),
            new C.Seeker(e_enemy4, Math.PI * 2)
        ),
        e_enemy6 = em.create(
            new C.TypeName('EnemyScout'),
            new C.EntityName('enemy6'),
            new C.Sprite('enemyscout', '#3f3', 15, 15),
            new C.Spawn('at', 80, -80),
            new C.Position,
            new C.Collidable,
            new C.Thruster(150, 75, 0, 0),
            new C.Seeker(e_enemy5, Math.PI * 2)
        ),
    )

    () -> world.start()
