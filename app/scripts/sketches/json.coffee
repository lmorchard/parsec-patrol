define [
    'worlds', 'entities', 'components', 'systems', 'pubsub', 'jquery',
    'underscore'
], (
    W, E, C, S, PubSub, $, _
) ->
    canvas = document.getElementById('gameCanvas')
    area = document.getElementById('gameArea')

    class PointerFollower extends C.Component
        @defaults:
            type: "PointerFollower"
    
    C.PointerFollower = PointerFollower

    class PointerFollowerSystem extends S.System
        match_component: PointerFollower
        update_match: (dt, eid, pointer_follower) ->
            pos = @world.entities.get(eid, C.Position)
            pos.x = @world.inputs.pointer_world_x
            pos.y = @world.inputs.pointer_world_y

    class SaverSystem extends S.System
        update: (dt) ->
            $('#out').val(JSON.stringify(@world.save()))

    world = new W.World(3000, 3000,
        vp = new S.ViewportSystem(window, area, canvas, 1.0, 1.0, 5.0),
        new S.RadarSystem(canvas, 0.28),
        new S.PointerInputSystem(canvas),
        new S.ClickCourseSystem,
        new S.SpawnSystem,
        new S.OrbiterSystem,
        new S.SeekerSystem,
        new S.ThrusterSystem,
        new S.HealthSystem,
        new S.BeamWeaponSystem,
        new S.ExplosionSystem,
        new PointerFollowerSystem,
        # new SaverSystem,
    )

    $('#save').click () ->
        $('#out').val(JSON.stringify(world.save()))
        return false

    $('#load').click () ->
        world.load(JSON.parse($('#out').val()))
        return false

    $('#sample1').click () ->
        $.getJSON 'json-sample1.json', (d, s, x) -> world.load(d)
        return false

    $('#sample2').click () ->
        $.getJSON 'json-sample2.json', (d, s, x) -> world.load(d)
        return false

    $('#sample3').click () ->
        $.getJSON 'json-sample3.json', (d, s, x) -> world.load(d)
        return false

    $('#sample4').click () ->
        $.getJSON 'json-sample4.json', (d, s, x) -> world.load(d)
        return false

    window.world = world
    window.C = C
    window.E = E
    window.S = S

    $.getJSON 'json-sample1.json', (data, status, xhr) ->
        world.load(data)
        world.measure_fps = true
        world.start()
