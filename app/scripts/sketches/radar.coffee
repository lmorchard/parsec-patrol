define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore', 'Vector2D', 'utils'
], (
    W, E, C, S, PubSub, $, _, Vector2D, Utils
) ->

    POINTER_SHADOW = false
    MAX_ENEMIES = 100
    RESPAWN_ENEMIES = false
    
    class PointerFollower extends C.Component
    
    class PointerFollowerSystem extends S.System
        match_component: PointerFollower
        update_match: (dt, eid, pointer_follower) ->
            pos = @world.entities.get(eid, C.Position)
            pos.x = @world.inputs.pointer_world_x
            pos.y = @world.inputs.pointer_world_y

    canvas = document.getElementById('gameCanvas')
    area = document.getElementById('gameArea')
        
    world = new W.World(3000, 3000,
        vp = new S.ViewportSystem(window, area, canvas, 1.0, 1.0, 5.0),
        new S.RadarSystem(canvas, 0.28),
        new S.PointerInputSystem(canvas),
        new PointerFollowerSystem,
        new S.ClickCourseSystem,
        new S.SpawnSystem,
        new S.SpinSystem,
        new S.OrbiterSystem,
        new S.SeekerSystem,
        new S.ThrusterSystem,
        new S.HealthSystem,
        new S.BeamWeaponSystem,
        new S.ExplosionSystem,
    )
    world.measure_fps = true
    
    window.world = world
    window.vp = vp

    em = world.entities
    world.current_scene = scene = em.createGroup(
        e_sun = em.create(
            new C.TypeName('Star'),
            new C.EntityName('sun'),
            new C.Spawn('center'),
            new C.Position,
            new C.Sprite('star')
            new C.RadarPing('#ff3'),
        ),
        e_hero = em.create(
            new C.TypeName('HeroShip'),
            new C.EntityName('hero'),
            new C.Sprite('hero'),
            new C.Position,
            new C.Collidable,
            new C.Spawn('at', -45, 45),
            #new C.Orbit(e_sun, Math.PI/28),
            new C.Seeker(null, Math.PI)
            new C.Thruster(150, 75, 0, 0, false),
            new C.ClickCourse(stop_on_arrival=true),
            new C.Health(20000),
            new C.WeaponsTarget("commonwealth"),
            c_hero_beam = new C.BeamWeapon(
                15, 4, 600, 4500, 4500, 4500,
                "#33f", "invaders"
            ),
            new C.RadarPing('#3f3'),
            new C.Tombstone(
                new C.TypeName('Explosion'),
                new C.Position,
                new C.Explosion(5, 100, 50, 1.5, 250, '#fff'),
            ),
        ),
    )

    if POINTER_SHADOW
        em.addToGroup(scene, e_torp = em.create(
            new C.TypeName('Torpedo'),
            new C.EntityName('torpedo1'),
            new C.Spawn('at', 30, 0),
            new C.Position,
            new C.Collidable,
            new PointerFollower,
            new C.Spin(Math.PI * 2),
            new C.Sprite('torpedo', '#222', 30, 30)
        ))

    vp.follow_entity = e_hero
    
    v_center = new Vector2D(0, 0)
    enemy_ct = 0

    $('#beam_sel').click (ev) ->
        target_el = $(ev.target)
        c_hero_beam.active_beams = target_el.attr('value')
        return false

    spawn_enemy = () ->
        enemy_ct++
        v_spawn = new Vector2D(0, -1500 * Math.random())
        v_spawn.rotateAround(v_center, (Math.PI*2) * Math.random())
        em.addToGroup(scene, em.create(
            new C.TypeName('EnemyScout'),
            new C.EntityName("enemy-#{enemy_ct}"),
            new C.Sprite('enemyscout', '#f33', 12, 12),
            new C.Spawn('at', v_spawn.x, v_spawn.y),
            new C.Position,
            new C.Collidable,
            new C.Thruster(100, 50, 0, 0),
            new C.Seeker(e_hero, Math.PI * 2),
            new C.Health(300),
            new C.WeaponsTarget("invaders"),
            # new C.BeamWeapon(1, 1, 100, 250, 250, 500, "#f44", "commonwealth"),
            new C.RadarPing('#f33'),
            new C.Tombstone(
                new C.TypeName('Explosion'),
                new C.Position,
                new C.Explosion(0.5, 40, 25, 1.5, 175, '#f33'),
            ),
        ))

    world.subscribe S.SpawnSystem.MSG_DESPAWN, (msg, data) =>
        type_name = em.get(data.entity_id, C.TypeName)
        
        scouts = (eid for eid, tn of em.getComponents(C.TypeName) when tn.name is 'EnemyScout')

        # Respawn an enemy, if necessary
        if RESPAWN_ENEMIES and type_name?.name is "EnemyScout"
            if scouts.length <= MAX_ENEMIES
                spawn_enemy()
        else if scouts.length is 0
            r = () -> location.reload()
            setTimeout r, 5000

        # Reload after a few seconds, if the hero ship dies
        if type_name?.name is "HeroShip"
            r = () -> location.reload()
            setTimeout r, 5000

    if MAX_ENEMIES
        for idx in [1..MAX_ENEMIES]
            spawn_enemy()

    () -> world.start()
