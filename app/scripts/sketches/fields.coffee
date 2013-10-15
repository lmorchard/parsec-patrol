define [
    'worlds', 'entities', 'components', 'systems', 'utils', 'pubsub', 'jquery',
    'underscore', 'dat', 'Vector2D'
], (
    W, E, C, S, Utils, PubSub, $, _, dat, Vector2D
) -> (canvas, use_gui=true, measure_fps=true) ->

    options = {
        max_entities: 50
        max_speed: 70
    }
    stats = {
        entities_ct: 0
    }

    world = new W.World(1600, 1600,
        vp = new S.ViewportSystem(canvas),
        new S.RadarSystem(canvas, 0.28),
        new S.PointerInputSystem(canvas),
        new S.ClickCourseSystem,
        new S.SpawnSystem,
        new S.HealthSystem,
        new S.CollisionSystem,
        new S.BouncerSystem,
        new S.SeekerSystem,
        new S.ThrusterSystem,
        new S.MotionSystem,
        new S.SpinSystem,
        new S.BeamWeaponSystem,
        new S.ExplosionSystem,
    )
    vp.zoom = 1.5
    em = world.entities

    world.load
        entities:
            hero:
                TypeName:
                    name: "HeroShip"
                Sprite:
                    shape: "hero"
                Position: {},
                Motion: {},
                Collidable: {},
                Bouncer:
                    mass: 50000,
                    damage: 0.007
                Spawn:
                    x: 0
                    y: 0
                    capture_camera: true
                Thruster:
                    dv: 250
                    max_v: 100
                    stop: true
                Seeker:
                    rad_per_sec: Math.PI
                ClickCourse:
                    stop_on_arrival: true
                Health:
                    max: 200000
                RadarPing:
                    color: "#0f0"
                WeaponsTarget:
                    team: "commonwealth"
                BeamWeapon:
                    max_beams: 15
                    active_beams: 9
                    max_range: 1250
                    max_power: 4500
                    charge_rate: 4500
                    discharge_rate: 4500
                    color: "#33f"
                    target_team: "invaders"
                Tombstone:
                    load:
                        Position: {}
                        Explosion:
                            ttl: 5
                            radius: 70
                            max_particles: 50
                            max_particle_size: 1.5
                            max_velocity: 300
                            color: "#fff"
                        Spawn:
                            capture_camera: true
        groups:
            main: [ 'hero' ]
        current_scene: "main"

    spawn_asteroid = (x, y, width, height, dx, dy, dr, mass, health) ->
        components = world.entities.loadComponents
            Sprite:
                shape: "asteroid"
                width: width
                height: height
            Spawn:
                x: x
                y: y
            Motion:
                dx: dx
                dy: dy
                drotation: dr
            Health:
                max: health
                show_bar: false
            Bouncer:
                mass: mass
                damage: 0.007
            RadarPing:
                color: "#333"
            Collidable: {}
            Position: {}
            Tombstone:
                load:
                    Position: {}
                    Explosion:
                        ttl: 0.5
                        radius: 40
                        max_particles: 25
                        max_particle_size: 1.25
                        max_velocity: 250
                        color: "#fff"

        eid = world.entities.create(components...)
        world.entities.addToGroup('main', eid)
        return eid

    spawn_field = (
        center_x = 0,
        center_y = 0,
        radius = 300,
        MAX_ASTEROIDS = 50,
        MAX_TRIES = 5,
        MIN_SIZE = 12,
        MAX_SIZE = 120,
        MAX_GRAV = 8,
    ) ->

        v_center = new Vector2D(center_x, center_y)

        v_spawn = new Vector2D(0, 0)
        v_grav = new Vector2D(0, 0)

        in_field = []
        for idx in [1..MAX_ASTEROIDS]
            for c in [1..MAX_TRIES]

                size = _.random(MIN_SIZE, MAX_SIZE)
                v_spawn.setValues(v_center.x, v_center.y - _.random(1, radius))
                rot = (Math.PI*4) * Math.random()
                v_spawn.rotateAround(v_center, rot)

                is_clear = true
                for [x, y, w, h] in in_field
                    if Utils.inCollision(x, y,
                                         w, h,
                                         v_spawn.x, v_spawn.y,
                                         size * 1.0125, size * 1.0125)
                        is_clear = false
                        break

                continue if not is_clear

                in_field.push([v_spawn.x, v_spawn.y, size, size])

                v_grav.setValues(0, Math.random() * MAX_GRAV)
                v_grav.rotate(rot)

                eid = spawn_asteroid(
                    v_spawn.x, v_spawn.y,
                    size, size,
                    v_grav.x, v_grav.y,
                    (Math.PI * 0.25) * Math.random(),
                    4 * size,
                    400 * size
                )

    spawn_field(-260, -260, 250)
    spawn_field(260, 260, 250)
    spawn_field(260, -260, 250)
    spawn_field(-260, 260, 250)
    
    #world.subscribe S.HealthSystem.MSG_DAMAGE, (msg, data) =>
    #    console.log("DMG #{msg} #{JSON.stringify(data)}")

    world.subscribe S.SpawnSystem.MSG_DESPAWN, (msg, data) =>
        type_name = em.get(data.entity_id, C.TypeName)

        # Reload after a few seconds, if the hero ship dies
        if type_name?.name is "HeroShip"
            r = () -> location.reload()
            setTimeout r, 5000

    vp.draw_bounding_boxes = false
    world.measure_fps = measure_fps
    if use_gui
        gui = new dat.GUI()
        gui.add(world, 'is_paused').listen()
        gui.add(vp, 'zoom', 0.125, 3).step(0.125)
        gui.add(vp, 'use_grid')
        gui.add(vp, 'use_sprite_cache')
        gui.add(vp, 'draw_bounding_boxes')

    return world
