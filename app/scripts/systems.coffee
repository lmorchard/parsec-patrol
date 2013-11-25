define [
    'components', 'utils', 'jquery', 'underscore', 'pubsub', 'Vector2D',
    'Hammer', 'THREEx.KeyboardState', 'QuadTree'
], (
    C, Utils, $, _, PubSub, Vector2D, Hammer, KeyboardState, QuadTree
) ->

    class System
        world: null
        match_component: null

        setWorld: (world) ->
            @world = world
        
        getMatches: () ->
            return [] if not @match_component
            return @world.entities.getComponents(@match_component)

        update: (t_delta) ->
            matches = @getMatches()
            for entity_id, component of matches
                @update_match(t_delta, entity_id, component)

        update_match: (t_delta, entity_id, match) ->

        draw: (t_delta) ->

    class KeyboardInputSystem extends System
        constructor: (@canvas) ->

        setWorld: (world) ->
            super world
            @world.inputs.keyboard = {} #new KeyboardState(document.body)

        update: (dt) ->

    class PointerInputSystem extends System
        constructor: (@canvas) ->

        setWorld: (world) ->
            super world

            button_names = ['left', 'middle', 'right']

            button_ev = (is_down) => (ev) =>
                name = "pointer_button_#{button_names[ev.button]}"
                @world.inputs[name] =
                    if is_down then Utils.now()
                    else null
                return false

            touch_ev = (is_down) => (ev) =>
                name = "pointer_button_#{button_names[0]}"
                @world.inputs[name] =
                    if is_down then Utils.now()
                    else null
                @world.inputs.pointer_x = (ev.gesture.center.pageX -
                                           @canvas.offsetLeft)
                @world.inputs.pointer_y = (ev.gesture.center.pageY -
                                           @canvas.offsetTop)
                return false

            $(@canvas)
                .bind("contextmenu", (ev) -> false)
                .bind("mousedown", button_ev(true))
                .bind("mouseup", button_ev(false))
                .bind("mousemove", (ev) =>
                    @world.inputs.pointer_x = ev.pageX - @canvas.offsetLeft
                    @world.inputs.pointer_y = ev.pageY - @canvas.offsetTop
                )
            Hammer(@canvas)
                .on("touch", touch_ev(true))
                .on("release", touch_ev(false))

        update: (dt) ->

    class SpawnSystem extends System
        @MSG_SPAWN = 'spawn.spawn'
        @MSG_DESPAWN = 'spawn.despawn'
        
        match_component: C.Spawn

        setWorld: (world) ->
            super world
            
            @world.subscribe SpawnSystem.MSG_DESPAWN, (msg, data) =>
                spawn = @world.entities.get(data.entity_id, C.Spawn)
                if spawn
                    spawn.destroy = true

        update_match: (t_delta, eid, spawn) ->
            return if not @world

            pos = @world.entities.get(eid, C.Position)

            if spawn.destroy
                tombstone = @world.entities.get(eid, C.Tombstone)
                if tombstone

                    components = if tombstone.load
                        @world.entities.loadComponents(tombstone.load)
                    else
                        tombstone.components

                    # Modify existing Spawn component, or add new one, that
                    # positions tombstone at last position of destroyed
                    found_spawn = false
                    for c in components when c.type is 'Spawn'
                        found_spawn = true
                        c.x = pos.x
                        c.y = pos.y
                    if not found_spawn
                        components.push(new C.Spawn({x: pos.x, y: pos.y}))

                    t_eid = @world.entities.create(components...)
                    gid = @world.entities.groupForEntity(eid)
                    if gid isnt null
                        @world.entities.addToGroup(gid, t_eid)

                @world.entities.destroy(eid)

            else if not spawn.spawned
                switch spawn.position_logic
                    when 'random'
                        pos.x = _.random(0-(@world.width/2), @world.width/2)
                        pos.y = _.random(0-(@world.height/2), @world.height/2)
                        pos.rotation = _.random(0, Math.PI*2)
                    when 'at'
                        pos.x = spawn.x
                        pos.y = spawn.y
                        pos.rotation = spawn.rotation
                    else
                        pos.x = pos.y = 0

                spawn.spawned = true
                @world.publish @constructor.MSG_SPAWN,
                    entity_id: eid, spawn: spawn

                if spawn.capture_camera
                    @world.publish ViewportSystem.MSG_CAPTURE_CAMERA,
                        entity_id: eid

            else if spawn.ttl isnt null
                # Process time-to-live for this entity, if any
                spawn.ttl -= t_delta
                if spawn.ttl <= 0
                    spawn.destroy = true

    class RadarSystem extends System
        match_component: C.Position

        constructor: (@canvas, @gui_size=0.2, @position='bottomright') ->
            @ctx = @canvas.getContext('2d')

        draw: (t_delta) ->
            canvas_w = @canvas.width
            canvas_h = @canvas.height
            gui_size = @gui_size * Math.min(canvas_w, canvas_h)

            switch @position
                when 'topright'
                    x = canvas_w - gui_size
                    y = 0
                    w = gui_size
                    h = gui_size
                when 'bottomright'
                    x = canvas_w - gui_size
                    y = canvas_h - gui_size
                    w = gui_size
                    h = gui_size

            ratio = if w < h
                w / @world.width
            else
                h / @world.height

            @ctx.save()
            @ctx.globalAlpha = 0.75

            @ctx.strokeStyle = "#33c"
            @ctx.fillStyle = "#000"
            @ctx.strokeRect(x, y, w, h)
            @ctx.fillRect(x, y, w, h)

            @ctx.translate(x+(w/2), y+(h/2))
            @ctx.scale(ratio, ratio)
            s_dot = (1/ratio) * 2

            scene = @world.entities.entitiesForGroup(@world.current_scene)
            for eid, ignore of scene

                spawn = @world.entities.get(eid, C.Spawn)
                pos = @world.entities.get(eid, C.Position)
                ping = @world.entities.get(eid, C.RadarPing)
                continue if not ping or not spawn?.spawned or not pos

                @ctx.fillStyle = ping.color
                @ctx.strokeStyle = ping.color
                @ctx.fillRect(pos.x, pos.y, s_dot, s_dot)

            @ctx.restore()

    class ViewportSystem extends System
        @MSG_CAPTURE_CAMERA = 'viewport.capture_camera'

        glow: false
        draw_bounding_boxes: false
        draw_mass: false
        draw_beam_range: false
        draw_steering: false
        grid_size: 150
        grid_color: '#111'
        source_size: 100
        use_sprite_cache: false
        use_grid: true
        prev_zoom: 0
        zoom: 1
        camera_x: 0
        camera_y: 0

        sprite_names: [
            'star', 'hero', 'enemyscout', 'enemycruiser', 'torpedo', 'default'
        ]

        constructor: (@canvas) ->

            if true
                @buffer_canvas = document.createElement('canvas')
                @ctx = @buffer_canvas.getContext('2d')
                @screen_ctx = @canvas.getContext('2d')
            else
                @buffer_canvas = null
                @screen_ctx = null
                @ctx = @canvas.getContext('2d')

            @viewport_width = 0
            @viewport_height = 0
            @viewport_ratio = 1.0

            @follow_entity = null

            @sprite_cache = {}
            for name in @sprite_names
                canvas_size = @source_size + 10
                canvas = document.createElement('canvas')
                canvas.width = canvas_size
                canvas.height = canvas_size
                @sprite_cache[name] = canvas
                ctx = canvas.getContext("2d")
                ctx.translate(canvas_size / 2, canvas_size / 2)
                ctx.lineWidth = 3
                ctx.strokeStyle = "#fff"
                @['draw_sprite_' + name](ctx)

        setWorld: (world) ->
            super world
            @world.subscribe @constructor.MSG_CAPTURE_CAMERA, (msg, data) =>
                @follow_entity = data.entity_id

        draw: (t_delta) ->

            # If we have a followed entity, move the camera center
            if @follow_entity
                pos = @world.entities.get(@follow_entity, C.Position)
                if pos
                    @camera_x = pos.x
                    @camera_y = pos.y

            @updateViewportMetrics()

            # Adjust pointer-to-world coords based on camera
            if @world.inputs.pointer_x
                @world.inputs.pointer_world_x = ((
                    @world.inputs.pointer_x - (@viewport_width/2)
                ) / @zoomed_ratio) + @camera_x
                @world.inputs.pointer_world_y = ((
                    @world.inputs.pointer_y - (@viewport_height/2)
                ) / @zoomed_ratio) + @camera_y

            # Clear the canvas
            @ctx.save()
            @ctx.fillStyle = "rgba(0, 0, 0, 1.0)"
            @ctx.fillRect(0, 0, @viewport_width, @viewport_height)

            # Translate and scale based on the viewport center and zoom level
            @ctx.translate(@viewport_center_left, @viewport_center_top)
            @ctx.scale(@zoomed_ratio, @zoomed_ratio)

            # Adjust the camera center
            @ctx.translate(0-@camera_x, 0-@camera_y)

            @draw_backdrop(t_delta)
            @draw_scene(t_delta)

            @ctx.restore()

            if false and @world.is_paused
                @draw_paused_bezel(t_delta)
            
            if @screen_ctx
                @screen_ctx.drawImage(@buffer_canvas, 0, 0)
        
        updateViewportMetrics: (width, height) ->
            width = @canvas.width
            height = @canvas.height

            if not (@viewport_width is width and @viewport_height is height and @prev_zoom is @zoom)

                @prev_zoom = @zoom
                @viewport_width = width
                @viewport_height = height
                if @buffer_canvas
                    @buffer_canvas.width = width
                    @buffer_canvas.height = height

                @viewport_ratio = if @viewport_width > @viewport_height
                    @viewport_width / @world.width
                else
                    @viewport_height / @world.height

                @viewport_center_left = @viewport_width / 2
                @viewport_center_top = @viewport_height / 2

                @zoomed_ratio = @viewport_ratio * @zoom

                @visible_width = @viewport_width / @zoomed_ratio
                @visible_height = @viewport_height / @zoomed_ratio

            @visible_left = (0 - @visible_width/2) + @camera_x
            @visible_top = (0 - @visible_height/2) + @camera_y
            @visible_right = @visible_left + @visible_width
            @visible_bottom = @visible_top + @visible_height

        draw_paused_bezel: (t_delta) ->
            width = @canvas.width * 0.75
            height = @canvas.height * 0.25
            left = (@canvas.width - width) / 2
            top = (@canvas.height - height) / 2

            @ctx.globalAlpha = 0.85
            @ctx.strokeStyle = "#fff"
            @ctx.fillStyle = "#000"
            @ctx.fillRect(left, top, width, height)
            @ctx.strokeRect(left, top, width, height)

            @ctx.fillStyle = "#fff"
            font_size = 48 * @viewport_ratio
            @ctx.font = "#{font_size}px monospace"
            @ctx.textAlign = 'center'
            @ctx.textBaseline = 'middle'
            @ctx.strokeText('Paused', left+(width/2), top+(height/2), width)

        draw_backdrop: (t_delta) ->
            return if not @use_grid

            @ctx.strokeStyle = @grid_color
            @ctx.lineWidth = 1

            @ctx.beginPath()

            grid_offset_x = @visible_left % @grid_size
            start = @visible_left - grid_offset_x
            end = @visible_right
            for left in [start..end] by @grid_size
                @ctx.moveTo(left, @visible_top)
                @ctx.lineTo(left, @visible_bottom)

            grid_offset_y = @visible_top % @grid_size
            start = @visible_top - grid_offset_y
            end = @visible_bottom
            for top in [start..end] by @grid_size
                @ctx.moveTo(@visible_left, top)
                @ctx.lineTo(@visible_right, top)

            @ctx.stroke()

        draw_scene: (t_delta) ->
            scene = @world.entities.entitiesForGroup(@world.current_scene)
            for eid, ignore of scene

                spawn = @world.entities.get(eid, C.Spawn)
                continue if not spawn?.spawned

                pos = @world.entities.get(eid, C.Position)
                continue if not pos

                @draw_beams t_delta, eid, pos

                sprite = @world.entities.get(eid, C.Sprite)

                # Skip drawing offscreen entities
                margin_w = if sprite then sprite.width / 2 else 0
                margin_h = if sprite then sprite.height / 2 else 0
                if pos.x < @visible_left - margin_w or
                        pos.x > @visible_right + margin_w or
                        pos.y < @visible_top - margin_h or
                        pos.y > @visible_bottom + margin_h
                    continue

                @ctx.save()

                vapor_trail = @world.entities.get(eid, C.VaporTrail)
                if vapor_trail
                    @draw_vapor_trail t_delta, eid, vapor_trail
                
                if @draw_steering
                    steering = @world.entities.store.Steering[eid]
                    if steering
                        @ctx.save()

                        if steering.hit_circles
                            @ctx.strokeStyle = 'rgba(128, 0, 0, 0.5)'
                            for [x, y, r] in steering.hit_circles
                                @ctx.beginPath()
                                @ctx.arc(x, y, r, 0, Math.PI*2, false)
                                @ctx.stroke()

                        if steering.dodging
                            @ctx.beginPath()
                            @ctx.strokeStyle = 'rgba(128, 128, 0, 0.75)'
                            v = new Vector2D(pos.x + 800, pos.y)
                            v.rotateAround(pos, steering.angle_a2b)
                            @ctx.moveTo(pos.x, pos.y)
                            @ctx.lineTo(v.x, v.y)
                            @ctx.stroke()

                        @ctx.beginPath()
                        if steering.dodging
                            @ctx.strokeStyle = 'rgba(128, 0, 0, 0.5)'
                        else
                            @ctx.strokeStyle = 'rgba(0, 128, 0, 0.5)'
                        v = new Vector2D(pos.x + 800, pos.y)
                        v.rotateAround(pos, steering.target_angle)
                        @ctx.moveTo(pos.x, pos.y)
                        @ctx.lineTo(v.x, v.y)
                        @ctx.stroke()

                        @ctx.restore()

                @ctx.translate(pos.x, pos.y)

                if sprite
                    w = sprite.width
                    h = sprite.height

                    if @draw_bounding_boxes
                        @ctx.strokeStyle = "#33c"
                        hc = @world.entities.store.CollisionCircle?[eid]
                        if not hc
                            wb = w / 2
                            hb = h / 2
                            @ctx.strokeRect(0-wb, 0-wb, w, h)
                        else
                            @ctx.beginPath()
                            @ctx.arc(0, 0, hc.radius, Math.PI*2, false)
                            @ctx.stroke()

                    @draw_health_bar t_delta, eid, w, h

                    if @draw_mass
                        bouncer = @world.entities.get(eid, C.Bouncer)
                        if bouncer
                            @ctx.fillStyle = "#fff"
                            @ctx.strokeStyle = "#fff"
                            font_size = 14 * @viewport_ratio
                            @ctx.font = "normal normal #{font_size}px monospace"
                            @ctx.textAlign = 'center'
                            @ctx.textBaseline = 'middle'
                            @ctx.fillText(bouncer.mass, 0, 0)

                    @draw_sprite t_delta, eid, w, h, pos, sprite

                explosion = @world.entities.get(eid, C.Explosion)
                if explosion
                    @draw_explosion t_delta, eid, explosion
                
                @ctx.restore()

        draw_vapor_trail: (t_delta, eid, vapor_trail) ->
            @ctx.save()
            alpha_unit = 1.0 / vapor_trail.particles.length
            @ctx.globalAlpha = 1.0
            skip_ct = vapor_trail.skip
            for p in vapor_trail.particles
                continue if (skip_ct--) > 0
                @ctx.globalAlpha -= alpha_unit
                @ctx.fillStyle = vapor_trail.color
                @ctx.fillRect(p.x, p.y,
                              vapor_trail.width, vapor_trail.width)
            @ctx.restore()

        draw_explosion: (t_delta, eid, explosion) ->

            @ctx.save()

            @ctx.strokeStyle = explosion.color
            @ctx.fillStyle = explosion.color
            if @glow
                @ctx.shadowColor = explosion.color
                @ctx.shadowBlur = 4

            # Explosion fades out overall as it nears expiration
            duration_alpha = 1 - (explosion.age / explosion.ttl)

            for p in explosion.particles
                continue if p.free

                # Particles fade out as they reach the radius
                @ctx.globalAlpha = (1 - (p.r / p.mr)) * duration_alpha
                s = p.s

                @ctx.beginPath()
                @ctx.moveTo(0, 0)
                @ctx.lineWidth = s
                @ctx.lineTo(p.x, p.y)
                @ctx.stroke()
            
            @ctx.restore()

        draw_health_bar: (t_delta, eid, w, h) ->
            health = @world.entities.get(eid, C.Health)
            return if not health or not health.show_bar

            perc = (health.current / health.max)
            
            top = 0 - (h/2) - 5
            left = 0 - (w/2)
           
            @ctx.save()
            
            @ctx.lineWidth = 2
            @ctx.strokeStyle = "#333"
            if @glow
                @ctx.shadowColor = "#333"
                @ctx.shadowBlur = 4
            @ctx.beginPath()
            @ctx.moveTo(left, top)
            @ctx.lineTo(left + w, top)
            @ctx.stroke()

            if perc > 0
                @ctx.strokeStyle = "#3e3"
                if @glow
                    @ctx.shadowColor = "#3e3"
                @ctx.beginPath()
                @ctx.moveTo(left, top)
                @ctx.lineTo(left + (w * perc), top)
                @ctx.stroke()
            
            @ctx.restore()

        draw_beams: (t_delta, eid, pos) ->
            beam_weapon = @world.entities.get(eid, C.BeamWeapon)
            return if not beam_weapon

            origin_x = beam_weapon.x
            origin_y = beam_weapon.y
                        
            v_origin = new Vector2D(origin_x, origin_y)
            v_turret = new Vector2D(origin_x, beam_weapon.y - 6)
            v_turret.rotateAround(v_origin, pos.rotation)
            turret_rad = (Math.PI*2) / beam_weapon.active_beams

            perc_active = (beam_weapon.active_beams / beam_weapon.max_beams)

            if @draw_beam_range
                perc_active = beam_weapon.active_beams / beam_weapon.max_beams
                range = beam_weapon.max_range / beam_weapon.active_beams
                @ctx.save()
                @ctx.globalAlpha = 0.05
                @ctx.strokeStyle = beam_weapon.color
                @ctx.beginPath()
                @ctx.arc(origin_x, origin_y, range, 0, Math.PI*2, false)
                @ctx.stroke()
                @ctx.restore()

            for idx in [0..beam_weapon.active_beams-1]
                beam = beam_weapon.beams[idx]
                continue if not beam

                @ctx.save()

                v_turret.rotateAround(v_origin, turret_rad)

                # TODO: Drawing these turret dots seems amazingly expensive
                if false
                    @ctx.fillStyle = beam_weapon.color
                    @ctx.beginPath()
                    @ctx.arc(v_turret.x, v_turret.y, 1.0, 0, Math.PI*2, true)
                    @ctx.fill()
                
                if beam?.target and not beam?.charging
                    fudge = 1.25
                    target_x = beam.x + (Math.random() * fudge) - (fudge/2)
                    target_y = beam.y + (Math.random() * fudge) - (fudge/2)

                    max_width = 2
                    @ctx.lineWidth = (max_width - (max_width * 0.75 * perc_active))

                    @ctx.strokeStyle = beam_weapon.color
                    if @glow
                        @ctx.shadowBlur = 4
                        @ctx.shadowColor = beam_weapon.color
                    @ctx.beginPath()
                    @ctx.moveTo(v_turret.x, v_turret.y)
                    @ctx.lineTo(target_x, target_y)
                    @ctx.stroke()

                @ctx.restore()

        draw_sprite: (t_delta, eid, w, h, pos, sprite) ->

            BASE_W = 100
            BASE_H = 100

            @ctx.rotate(pos.rotation + Math.PI/2)
            @ctx.scale(w / BASE_W, h / BASE_H)

            if @use_sprite_cache
                @ctx.drawImage(
                    @sprite_cache[sprite.shape] || @sprite_cache['default'],
                    5, 5, @source_size, @source_size,
                    -50, -50, 100, 100)
                return

            @ctx.fillStyle = "#000"
            @ctx.strokeStyle = sprite.stroke_style
            line_ratio = (BASE_W / w)
            if @glow
                @ctx.shadowColor = sprite.stroke_style
                @ctx.shadowBlur = 4.0 * line_ratio
            @ctx.lineWidth = 0.75 * line_ratio

            shape_fn = @['draw_sprite_' + sprite.shape] || @draw_sprite_default
            shape_fn.call(@, @ctx, sprite, t_delta)

        draw_sprite_default: (ctx, sprite, t_delta) ->
            ctx.strokeRect(-50, -50, 100, 100)
            
        draw_sprite_star: (ctx, sprite, t_delta) ->
            ctx.fillStyle = "#ccc"
            ctx.beginPath()
            ctx.arc(0, 0, 50, 0, Math.PI*2, true)
            ctx.fill()

        draw_sprite_hero: (ctx, sprite, t_delta) ->
            ctx.rotate(Math.PI)
            ctx.beginPath()
            ctx.moveTo(-12.5, -50)
            ctx.lineTo(-25, -50)
            ctx.lineTo(-50, 0)
            ctx.arc(0, 0, 50, Math.PI, 0, true)
            ctx.lineTo(25, -50)
            ctx.lineTo(12.5, -50)
            ctx.lineTo(25, 0)
            ctx.arc(0, 0, 25, 0, Math.PI, true)
            ctx.lineTo(-12.5, -50)
            ctx.stroke()

        draw_sprite_enemyscout: (ctx, sprite, t_delta) ->
            ctx.beginPath()
            ctx.moveTo(0, -50)
            ctx.lineTo(-45, 50)
            ctx.lineTo(-12.5, 12.5)
            ctx.lineTo(0, 25)
            ctx.lineTo(12.5, 12.5)
            #ctx.arc(0, 12.5, 12.5, Math.PI, 0, true)
            ctx.lineTo(45, 50)
            ctx.lineTo(0, -50)
            ctx.moveTo(0, -50)
            ctx.stroke()

        draw_sprite_enemycruiser: (ctx, sprite, t_delta) ->
            w = 100
            h = 100
            hu = h / 5
            wu = w / 4

            ctx.beginPath()
            ctx.moveTo(0, 0-hu*2.5)
            ctx.lineTo(-(wu*1), hu*0.5)
            ctx.lineTo(-(wu*1.25), 0-hu*1.5)
            ctx.lineTo(-(wu*2), hu*2.5)
            ctx.arc(0-wu, hu*2.5, w*0.25, Math.PI, Math.PI/2, true)
            ctx.lineTo(-wu*0.5, hu*2.5)
            ctx.arc(0, hu*2.5, w*0.125, Math.PI, 0, true)
            ctx.lineTo(wu, hu*3.75)
            ctx.arc(wu, hu*2.5, w*0.25, Math.PI/2, 0, true)
            ctx.lineTo(wu*1.25, 0-hu*1.5)
            ctx.lineTo(wu*1, hu*0.5)
            ctx.lineTo(0, 0-hu*2.5)

            ctx.stroke()

        draw_sprite_torpedo: (ctx, sprite, t_delta) ->
            ctx.beginPath()
            ctx.moveTo(-50, 0)
            ctx.arc(-50, -50, 50, Math.PI*0.5, 0, true)
            ctx.moveTo(0, -50)
            ctx.arc(50, -50, 50, Math.PI, Math.PI*0.5, true)
            ctx.moveTo(0, 50)
            ctx.arc(50, 50, 50, Math.PI*1.0, Math.PI*1.5, false)
            ctx.moveTo(-50, 0)
            ctx.arc(-50, 50, 50, Math.PI*1.5, 0, false)
            ctx.stroke()

        draw_sprite_asteroid: (ctx, sprite, t_delta) ->
            if not sprite.points
                NUM_POINTS = 8 + Math.floor(8 * Math.random())
                MAX_RADIUS = 50
                MIN_RADIUS = 35
                ROTATION = (Math.PI*2) / NUM_POINTS

                v_center = new Vector2D(0, 0)
                v_point = new Vector2D(0, 0)
                sprite.points = []
                for idx in [1..NUM_POINTS]
                    v_point.setValues(_.random(MIN_RADIUS, MAX_RADIUS), 0)
                    v_point.rotateAround(v_center, idx * ROTATION)
                    sprite.points.push([v_point.x, v_point.y])

            ctx.beginPath()
            ctx.moveTo(sprite.points[0][0], sprite.points[0][1])
            for idx in [1..sprite.points.length-1]
                ctx.lineTo(sprite.points[idx][0], sprite.points[idx][1])
            ctx.lineTo(sprite.points[0][0], sprite.points[0][1])
            ctx.stroke()

    class CollisionSystem extends System
        
        constructor: () ->
            @quadtrees = {}

        match_component: C.Collidable

        update: (t_delta) ->
            matches = @world.entities.getComponents(@match_component)
            for a_eid, a_collidable of matches
                @checkCollisions(a_eid, a_collidable)

        checkCollisions: (a_eid, a_collidable) ->
            # Ignore unspawned or destroyed entities
            spawn = @world.entities.store.Spawn[a_eid]
            return if not spawn or (spawn.destroy) or (not spawn.spawned)

            # Reset collision state for this entity
            for k, v of a_collidable.in_collision_with
                delete a_collidable.in_collision_with[k]

            # Find the group for this entity, and the quadtree indexing
            # positions for that group.
            gid = @world.entities.groupForEntity(a_eid)
            qt = @world.entities.quadtrees[gid]
            return if not qt
            
            # Use the entity's position and shape to look up potential
            # collisions from the quadtree
            a_pos = @world.entities.store.Position[a_eid]
            a_sprite = @world.entities.store.Sprite[a_eid]
            items = qt.retrieve({
                x: a_pos.x,
                y: a_pos.y,
                width: a_sprite.width,
                height: a_sprite.height
            })

            # Finally, check for collisions with the quadtree results
            for b in items
                continue if b.eid is a_eid
                @checkCollision(
                    b.eid, b.collidable, b.pos, b.sprite,
                    a_eid, a_collidable, a_pos, a_sprite)

        checkCollision: (b_eid, b_collidable, b_pos, b_sprite,
                         a_eid, a_collidable, a_pos, a_sprite) ->

            a_hc = @world.entities.store.CollisionCircle?[a_eid]
            b_hc = @world.entities.store.CollisionCircle?[b_eid]

            if a_hc and b_hc
                dx = b_pos.x - a_pos.x
                dy = b_pos.y - a_pos.y
                radii = a_hc.radius + b_hc.radius
                if (dx*dx) + (dy*dy) < radii*radii
                    a_collidable.in_collision_with[b_eid] = 1 #Date.now()
                    b_collidable.in_collision_with[a_eid] = 1 #Date.now()
            else
                if Math.abs(a_pos.x - b_pos.x) * 2 < (a_sprite.width + b_sprite.width)
                    if Math.abs(a_pos.y - b_pos.y) * 2 < (a_sprite.height + b_sprite.height)
                        a_collidable.in_collision_with[b_eid] = 1 #Date.now()
                        b_collidable.in_collision_with[a_eid] = 1 #Date.now()

    class MotionSystem extends System
        match_component: C.Motion
        update_match: (dt, eid, motion) ->
            pos = @world.entities.get(eid, C.Position)
            pos.x += motion.dx * dt
            pos.y += motion.dy * dt
            # Update the rotation, ensuring a 0..2*Math.PI range.
            pos.rotation = (pos.rotation + (motion.drotation*dt)) % (Math.PI*2)
            pos.rotation += 2*Math.PI if pos.rotation < 0

    class BouncerSystem extends System
        @DAMAGE_TYPE = 'Bounce'

        match_component: C.Bouncer

        update: (dt) ->

            xb = @world.width / 2
            yb = @world.height / 2

            # Assemble list of unique pairs in collision, process edge bounce
            pairs = {}
            for a_eid, a_bouncer of @getMatches()
                a_collidable = @world.entities.get(a_eid, C.Collidable)
                for b_eid, ts of a_collidable.in_collision_with
                    pair = [a_eid, b_eid]
                    pair.sort()
                    pairs[pair.join(':')] = pair

                pos = @world.entities.get(a_eid, C.Position)
                motion = @world.entities.get(a_eid, C.Motion)
                if pos and motion
                    if pos.x > xb or pos.x < -xb
                        motion.dx = 0 - motion.dx
                    if pos.y > yb or pos.y < -yb
                        motion.dy = 0 - motion.dy

            # Process the collision pairs
            for key, [a_eid, b_eid] of pairs

                a_bouncer = @world.entities.get(a_eid, C.Bouncer)
                continue if not a_bouncer

                b_bouncer = @world.entities.get(b_eid, C.Bouncer)
                continue if not b_bouncer

                a_pos = @world.entities.get(a_eid, C.Position)
                a_sprite = @world.entities.get(a_eid, C.Sprite)
                a_motion = @world.entities.get(a_eid, C.Motion)

                b_pos = @world.entities.get(b_eid, C.Position)
                b_sprite = @world.entities.get(b_eid, C.Sprite)
                b_motion = @world.entities.get(b_eid, C.Motion)

                @resolve_elastic_collision(dt,
                    a_eid, a_pos, a_sprite, a_motion, a_bouncer,
                    b_eid, b_pos, b_sprite, b_motion, b_bouncer)

        # See also: https://gist.github.com/kevinfjbecker/1670913
        # TODO: Optimize this. Reuse vector objects, at least.
        resolve_elastic_collision: (dt,
                eid, pos, sprite, motion, bouncer,
                c_eid, c_pos, c_sprite, c_motion, c_bouncer) ->
            
            # Vector between entities
            dn = new Vector2D(pos.x - c_pos.x, pos.y - c_pos.y)

            # Distance between entities
            delta = dn.magnitude()
            
            # Normal vector of the collision plane
            dn.normalize()
            
            # Tangential vector of the collision plane 
            dt = new Vector2D(dn.y, -dn.x)
            
            # HACK: avoid divide by zero
            c_pos.x += 0.01 if delta is 0
            
            # Get total mass for entities
            m1 = bouncer.mass
            m2 = c_bouncer.mass
            M = m1 + m2

            # Minimum translation vector to push entities apart
            mt = {
                x: dn.x * (sprite.width + c_sprite.width - delta),
                y: dn.y * (sprite.width + c_sprite.width - delta)
            }
             
            # Velocity vectors of entities before collision
            v1 = if motion
                new Vector2D(motion.dx, motion.dy)
            else
                new Vector2D(0, 0)
            v2 = if c_motion
                new Vector2D(c_motion.dx, c_motion.dy)
            else
                new Vector2D(0, 0)
             
            # split the velocity vector of the first entity into a normal
            # and a tangential component in respect of the collision plane
            v1n = new Vector2D(dn.x * v1.dot(dn), dn.y * v1.dot(dn))
            v1t = new Vector2D(dt.x * v1.dot(dt), dt.y * v1.dot(dt))
             
            # split the velocity vector of the second entity into a normal
            # and a tangential component in respect of the collision plane
            v2n = new Vector2D(dn.x * v2.dot(dn), dn.y * v2.dot(dn))
            v2t = new Vector2D(dt.x * v2.dot(dt), dt.y * v2.dot(dt))
             
            # calculate new velocity vectors of the entitys, the tangential
            # component stays the same, the normal component changes analog to
            # the 1-Dimensional case
            
            # TODO: refactor below
            
            if motion

                v_motion = new Vector2D(
                    v1t.x + dn.x * ((m1 - m2) / M * v1n.magnitude() + 2 * m2 / M * v2n.magnitude())
                    v1t.y + dn.y * ((m1 - m2) / M * v1n.magnitude() + 2 * m2 / M * v2n.magnitude())
                )

                @process_damage(eid, c_eid, v_motion, bouncer, m1)
                
                motion.dx = v_motion.x
                motion.dy = v_motion.y

            if c_motion
                
                v_c_motion = new Vector2D(
                    v2t.x - dn.x * ((m2 - m1) / M * v2n.magnitude() + 2 * m1 / M * v1n.magnitude())
                    v2t.y - dn.y * ((m2 - m1) / M * v2n.magnitude() + 2 * m1 / M * v1n.magnitude())
                )

                @process_damage(eid, c_eid, v_c_motion, c_bouncer, m2)

                c_motion.dx = v_c_motion.x
                c_motion.dy = v_c_motion.y

        process_damage: (eid, c_eid, v_motion, bouncer, m1) ->
            return if not bouncer.damage

            if bouncer.target_team
                c_wt = @world.entities.get(c_wt, C.WeaponsTarget)
                return if not c_wt
                return if c_wt.team isnt bouncer.target_team
            
            # Convert a fraction of the rebound velocity into damage by mass
            v_motion.multiplyScalar(1.0 - bouncer.damage)
            dmg = v_motion.magnitude() * bouncer.damage * m1

            @world.publish HealthSystem.MSG_DAMAGE,
                to: eid
                from: c_eid
                kind: @constructor.DAMAGE_TYPE
                amount: dmg / 2

            @world.publish HealthSystem.MSG_DAMAGE,
                to: c_eid
                from: eid
                kind: @constructor.DAMAGE_TYPE
                amount: dmg / 2

    # TODO: MotionSystem conflicts with & obsoletes this.
    class SpinSystem extends System
        match_component: C.Spin

        update_match: (dt, eid, spin) ->
            motion = @world.entities.get(eid, C.Motion)
            motion.drotation =  spin.rad_per_sec
            
    # TODO: Find a way to reconcile this with MotionSystem as orbit AI
    class OrbiterSystem extends System
        match_component: C.Orbit

        constructor: () ->
            @v_orbited = new Vector2D()
            @v_orbiter = new Vector2D()
            @v_old = new Vector2D()

        update_match: (dt, eid, orbiter) ->
            pos = @world.entities.get(eid, C.Position)
            o_pos = @world.entities.get(orbiter.orbited_id, C.Position)

            @v_orbited.setValues(o_pos.x, o_pos.y)
            @v_orbiter.setValues(pos.x, pos.y)

            angle_delta = dt * orbiter.rad_per_sec
            @v_orbiter.rotateAround(@v_orbited, angle_delta)

            @v_old.setValues(pos.x, pos.y)
            pos.x = @v_orbiter.x
            pos.y = @v_orbiter.y
            if orbiter.rotate
                pos.rotation = @v_old.angleTo(@v_orbiter)

    class SteeringSystem extends System
        match_component: C.Steering

        constructor: () ->
            @v_steering = new Vector2D()
            @v_ray = new Vector2D()
            @v_ray_unit = new Vector2D()
            @v_target = new Vector2D()
            @v_dodge = new Vector2D()
            @v_dodge_unit = new Vector2D()

        castRay: (eid, pos, sprite, steering, side) ->
            hw = sprite.width * 0.5
            offset = side * hw * 1
            steps = steering.los_range / (hw*2)

            @v_ray_unit.setValues(hw*2, 0)
            @v_ray_unit.rotate(pos.rotation)
            @v_ray.setValues(pos.x, pos.y + offset)
            @v_ray.rotateAround(pos, pos.rotation)

            f = 0.15
            b = 1 - f
            s = f / steps
            for idx in [0..steps]
                hr = hw * (b + s * (steps - idx))
                items = @findHits(eid, steering, @v_ray.x, @v_ray.y, hr, hr)
                return items if items.length > 0
                @v_ray.add(@v_ray_unit)

            return []

        findHits: (eid, steering, x, y, width, height) ->
            steering.hit_circles.push([x, y, width])

            gid = @world.entities.groupForEntity(eid)
            qt = @world.entities.quadtrees[gid]
            return [] if not qt

            items = qt.retrieve({x: x, y: y, width: width, height: height})

            hits = []
            for item in items
                continue if item.eid is eid
                radii = (item.width/2) + (width/2)
                dx = item.x - x
                dy = item.y - y
                dist_sq = (dx*dx) + (dy*dy)
                if dist_sq <= radii*radii
                    hits.push([dist_sq, item])

            return _.sortBy(hits, 0)

        calculateDodgeTarget: (side, steering, a_x, a_y, a_diameter, b_x, b_y, b_diameter) ->

            angle_a2b = Math.atan2(b_y-a_y, b_x-a_x)
            steering.angle_a2b = angle_a2b

            # Adjacent leg represents safe margin radius
            ac = (a_diameter * 1.85) + (b_diameter * 0.85)
            # Hypotenuse is distance to obstacle
            ab = Math.sqrt((b_x-a_x) * (b_x-a_x) +
                           (b_y-a_y) * (b_x-a_y))

            angle_goal = side * if (ab > ac)
                # Tangent to safe margin radius
                Math.asin(ac / ab)
            else
                # Already inside safe margin, panic!
                Math.PI * 0.66
            return angle_a2b + angle_goal

        update_match: (dt, eid, steering) ->

            pos = @world.entities.get(eid, C.Position)
            return if not pos

            motion = @world.entities.get(eid, C.Motion)
            return if not motion

            sprite = @world.entities.get(eid, C.Sprite)
            return if not sprite

            steering.hit_circles = []
            steering.ray_left = @castRay(eid, pos, sprite, steering, -1)
            steering.ray_right = @castRay(eid, pos, sprite, steering, 1)
            
            if steering.ray_right.length
                dodge_item = steering.ray_right[0][1]
                dodge_side = -1
            else if steering.ray_left.length
                dodge_item = steering.ray_left[0][1]
                dodge_side = 1
            else
                dodge_item = null
                dodge_side = false

            if dodge_item
                steering.dodging = true
                steering.target_angle = target_angle = @calculateDodgeTarget(
                    dodge_side, steering,
                    pos.x, pos.y, sprite.width,
                    dodge_item.x, dodge_item.y, dodge_item.width
                )
            else
                # Accept either a raw x/y coord or entity ID as target
                target_pos = steering.target
                if not _.isObject(target_pos)
                    target_pos = @world.entities.get(steering.target, C.Position)
                steering.dodging = false

                # TODO: Consider target relative velocity to optionally
                # calculate intercept goal position.

                # Set up the vectors for angle math...
                @v_steering.setValues(pos.x, pos.y)
                @v_target.setValues(target_pos.x, target_pos.y)

                # Get the target angle, ensuring a 0..2*Math.PI range.
                target_angle = @v_steering.angleTo(@v_target)

            target_angle += 2*Math.PI if target_angle < 0
            steering.target_angle = target_angle

            # Pick the direction from current to target angle
            direction = if target_angle < pos.rotation then -1 else 1
   
            # If the offset between the angles is more than half a circle, go
            # the other way because it'll be shorter.
            offset = Math.abs(target_angle - pos.rotation)
            if offset > Math.PI
                direction = 0 - direction

            # Work out the desired delta-rotation to steer toward target
            target_dr = direction * Math.min(steering.rad_per_sec, offset/dt)

            # Calculate the delta-rotation impulse required to meet the goal,
            # but constrain to the capability of the steering thrusters
            impulse_dr = (target_dr - motion.drotation)
            if Math.abs(impulse_dr) > steering.rad_per_sec
                impulse_dr = if impulse_dr > 0
                    steering.rad_per_sec
                else if impulse_dr < 0
                    0 - steering.rad_per_sec
            motion.drotation += impulse_dr

    class SeekerSystem extends System
        match_component: C.Seeker

        constructor: () ->
            @v_seeker = new Vector2D()
            @v_target = new Vector2D()

        update_match: (dt, eid, seeker) ->

            # Process a delay before the seeker "acquires" the target and
            # starts steering. Makes missiles look interesting.
            if seeker.acquisition_delay > 0
                seeker.acquisition_delay -= dt
                return

            pos = @world.entities.get(eid, C.Position)
            return if not pos

            motion = @world.entities.get(eid, C.Motion)
            return if not motion

            # Accept either a raw x/y coord or entity ID as target
            target_pos = seeker.target
            if not _.isObject(target_pos)
                target_pos = @world.entities.get(seeker.target, C.Position)
            return if not target_pos or (not target_pos.x and target_pos.y)

            # Set up the vectors for angle math...
            @v_seeker.setValues(pos.x, pos.y)
            @v_target.setValues(target_pos.x, target_pos.y)

            # Get the target angle, ensuring a 0..2*Math.PI range.
            target_angle = @v_seeker.angleTo(@v_target)
            target_angle += 2*Math.PI if target_angle < 0

            # Pick the direction from current to target angle
            direction = if target_angle < pos.rotation then -1 else 1
   
            # If the offset between the angles is more than half a circle, go
            # the other way because it'll be shorter.
            offset = Math.abs(target_angle - pos.rotation)
            if offset > Math.PI
                direction = 0 - direction

            # Work out the desired delta-rotation to steer toward target
            target_dr = direction * Math.min(seeker.rad_per_sec, offset/dt)

            # Calculate the delta-rotation impulse required to meet the goal,
            # but constrain to the capability of the steering thrusters
            impulse_dr = (target_dr - motion.drotation)
            if Math.abs(impulse_dr) > seeker.rad_per_sec
                impulse_dr = if impulse_dr > 0
                    seeker.rad_per_sec
                else if impulse_dr < 0
                    0 - seeker.rad_per_sec
            motion.drotation += impulse_dr

    class ThrusterSystem extends System
        # Simple-minded thruster system. Pushes entity in the direction of
        # rotation, attempts to apply brakes to enforce a max velocity.
        
        match_component: C.Thruster

        constructor: () ->
            @v_inertia = new Vector2D()
            @v_thrust = new Vector2D()
            @v_brakes = new Vector2D()

        update_match: (dt, eid, thruster) ->
            return if not thruster.active

            pos = @world.entities.get(eid, C.Position)
            motion = @world.entities.get(eid, C.Motion)
            return if not pos or not motion

            @v_inertia.setValues(motion.dx, motion.dy)

            # delta-v available for the current tick
            tick_dv = dt * thruster.dv

            if not thruster.stop
                # Create thrust vector per rotation and add to inertia.
                #@v_thrust.setValues(0, 0-tick_dv)
                @v_thrust.setValues(tick_dv, 0)
                @v_thrust.rotate(pos.rotation)
                @v_inertia.add(@v_thrust)

            if thruster.use_brakes
                # Try to enforce the max_v limit with braking thrust.
                max_v = if thruster.stop then 0 else thruster.max_v
                curr_v = @v_inertia.magnitude()
                over_v = curr_v - max_v
                if over_v > 0
                    # Braking delta-v is max thruster output or remaining overage,
                    # whichever is smallest. Braking vector opposes inertia.
                    braking_dv = Math.min(tick_dv, over_v)
                    @v_brakes.setValues(@v_inertia.x, @v_inertia.y)
                    @v_brakes.normalize()
                    @v_brakes.multiplyScalar(0-braking_dv)
                    @v_inertia.add(@v_brakes)
                if thruster.stop and curr_v is 0
                    thruster.active = false

            # Update inertia. Note that we've been careful only to make changes
            # to inertia within the delta-v of the thruster. Other influences
            # on inertia should be preserved.
            motion.dx = @v_inertia.x
            motion.dy = @v_inertia.y

    class ClickCourseSystem extends System
        match_component: C.ClickCourse
        update_match: (t_delta, eid, click_course) ->
            pos = @world.entities.get(eid, C.Position)
            sprite = @world.entities.get(eid, C.Sprite)
            seeker = @world.entities.get(eid, C.Seeker)
            thruster = @world.entities.get(eid, C.Thruster)
            
            # Set course destination on left button down
            if click_course.active and (@world.inputs.pointer_button_left)
                click_course.x = @world.inputs.pointer_world_x
                click_course.y = @world.inputs.pointer_world_y
                thruster?.active = true
                thruster?.stop = false
                seeker?.target =
                    x: click_course.x,
                    y: click_course.y

            # Full stop, when the sprite collides with the destination
            x_offset = Math.abs(pos.x - click_course.x)
            y_offset = Math.abs(pos.y - click_course.y)
            if x_offset < sprite.width/2 and y_offset < sprite.height/2
                if click_course.stop_on_arrival
                    thruster?.stop = true
                #seeker?.target = null

    class MissileWeaponSystem extends System
        @DAMAGE_TYPE = 'Missile'

        match_component: C.MissileWeapon

        constructor: () ->
            @v_center = new Vector2D(0, 0)
            @v_pos = new Vector2D(0, 0)
            @v_unit = new Vector2D(0, 0)

        update_match: (t_delta, eid, weapon) ->
            pos = @world.entities.get(eid, C.Position)
            sprite = @world.entities.get(eid, C.Sprite)

            weapon.x = pos.x
            weapon.y = pos.y
            weapon.rotation = pos.rotation
            weapon.length = 50 #sprite.height

            @load_turrets(t_delta, weapon, eid)
            @target_turrets(t_delta, weapon, eid)
            @fire_turrets(t_delta, weapon, eid, pos)

        load_turrets: (t_delta, weapon, eid) ->
            for idx in [0..weapon.active_turrets-1]
                turret = weapon.turrets[idx]
                if turret.loading > 0
                    turret.loading -= t_delta
                if turret.loading <= 0
                    turret.loading = 0
                    turret.target = null

        target_turrets: (t_delta, weapon, eid) ->

            # Get turrets ready for targeting
            to_target = []
            for idx in [0..weapon.active_turrets-1]
                turret = weapon.turrets[idx]
                if turret.loading is 0 and turret.target is null
                    to_target.push(turret)
            return if to_target.length is 0

            # TODO: Extract target rangefinding into a reusable utility
            
            # Find valid targets within range
            max_range_sq = Math.pow(weapon.target_range, 2)
            targets = @world.entities.getComponents(C.WeaponsTarget)
            by_range = []
            for t_eid, target of targets

                # Do not target self!
                continue if t_eid is eid

                # Target only the intended team.
                continue if target.team isnt weapon.target_team

                # Finally, let's see if the target is in range.
                t_pos = @world.entities.get(t_eid, C.Position)
                t_range_sq = ((t_pos.x - weapon.x) * (t_pos.x - weapon.x) +
                             (t_pos.y - weapon.y) * (t_pos.y - weapon.y))
                # t_range = Math.sqrt t_range_sq
                if t_range_sq <= max_range_sq
                    by_range.push([t_range_sq, t_eid])

            # Assign available beams to closest targets (if any)
            if by_range.length
                by_range.sort (a, b) -> a[0] - b[0]
                while to_target.length
                    for [t_range_sq, t_eid] in by_range
                        turret = to_target.pop()
                        break if not turret
                        turret.target = t_eid

        fire_turrets: (t_delta, weapon, eid, pos) ->

            # TODO: This turret layout algorithm is horribly inefficient and
            # needs a lot of work. Trying to simulate a a strip of launchers
            # down the center of the ship, alternating port and starboard
            # facing
            
            size = 4

            @v_unit.setValues(0, 0 - (weapon.length / weapon.active_turrets))
            @v_unit.rotateAround({x:0, y:0}, pos.rotation)

            @v_pos.setValues(weapon.x, weapon.y + (weapon.length / 2))
            @v_pos.rotateAround({x:weapon.x, y:weapon.y}, pos.rotation)

            for idx in [0..weapon.active_turrets-1]

                @v_pos.add(@v_unit)

                turret = weapon.turrets[idx]
                continue if turret.target is null or turret.loading > 0

                missile = weapon.missile
                color = missile.color
                rotation = pos.rotation + if (idx % 2) is 0
                    Math.PI / 2
                else
                    0 - (Math.PI / 2)

                missile_data =
                    Sprite:
                        shape: 'enemyscout'
                        width: size
                        height: size
                        stroke_style: color
                    Spawn:
                        x: @v_pos.x
                        y: @v_pos.y
                        rotation: rotation
                        ttl: missile.ttl
                    Position: {}
                    Motion: {}
                    Collidable: {}
                    Bouncer:
                        mass: 100
                        damage: 0.007
                        target_team: weapon.target_team
                    Thruster:
                        dv: missile.speed
                        max_v: missile.speed
                        active: true
                    Seeker:
                        rad_per_sec: missile.rad_per_sec
                        acquisition_delay: missile.acquisition_delay * Math.random()
                        target: turret.target
                    Health:
                        max: missile.health
                        show_bar: false
                    RadarPing:
                        color: color
                        size: 3
                    VaporTrail:
                        color: '#aaa'
                        history: 15
                        skip: 3
                        width: 1
                    WeaponsTarget:
                        team: "invaders"
                    Tombstone:
                        load:
                            Position: {}
                            Explosion:
                                ttl: 0.5
                                radius: size * 4
                                max_particles: 15
                                max_particle_size: 1
                                max_velocity: 100
                                color: color

                missile_data['Missile'] = {}
                for k,v in missile
                    missile_data.Missile[k] = v

                components = @world.entities.loadComponents(missile_data)
                e = @world.entities.create(components...)
                gid = @world.entities.groupForEntity(eid)
                @world.entities.addToGroup(gid, e)

                turret.loading = weapon.loading_time
                turret.target = null

    class BeamWeaponSystem extends System
        @DAMAGE_TYPE = 'Beam'

        match_component: C.BeamWeapon
        
        constructor: () ->
            @stats = {}

        update_match: (t_delta, eid, weap) ->

            pos = @world.entities.get(eid, C.Position)
            weap.x = pos.x
            weap.y = pos.y
            
            # Figure out the number of available beams
            weap.active_beams = Math.min(weap.active_beams,
                                         weap.max_beams)
            return if weap.active_beams is 0

            # Calculate current beam weapon parameters
            stats = @calculate_stats(weap)
            for k, v of stats
                weap.current_stats[k] = v

            # Charge beams, target any that have become available.
            to_target = @charge_beams(t_delta, stats, weap)
            if to_target.length > 0
                @target_beams(t_delta, stats, weap, eid, to_target)

            # Discharge beams, apply damage to targets
            @discharge_beams(t_delta, stats, weap, eid)

        calculate_stats: (weap) ->
            # Scale beam parameters so that more beams are faster, yet have the
            # same base total DPS on a single target.
            key = "#{weap.active_beams}:#{weap.max_power}"
            if not (key of @stats)
                # Cache these calculations, because they happen on every frame.
                active = weap.active_beams
                perc_active = weap.active_beams / weap.max_beams
                # Total range is split per-beam
                # TODO: Come up with more of a curve to weapon range drop-off?
                beam_range = weap.max_range / weap.active_beams
                @stats[key] =
                    # Charge is active-squared, because beams are active-times
                    # as numerous AND active-times as fast. That took me awhile
                    # to figure out.
                    max_charge: weap.max_power / (active * active)
                    # Rate that the capacitor fills from energy stores
                    charge_rate: weap.charge_rate / active
                    # Rate that capacitor drains in delivering damage
                    discharge_rate: weap.discharge_rate / active
                    beam_range: beam_range
                    # Square the beam range here, so we don't have to sqrt
                    # during target range-finding later. (Maybe this is dumb?)
                    beam_range_sq: Math.pow(beam_range, 2)
                    # Damage penalty for splitting the beam
                    dmg_penalty: 1.0 - (perc_active * weap.dmg_penalty)

            return @stats[key]
        
        # Perform beam charging. Immediately after charging, a beam can target.
        charge_beams: (t_delta, stats, weap) ->
            to_target = []
            for idx in [0..weap.active_beams-1]
                beam = weap.beams[idx]
                if beam.charging
                    beam.charge += stats.charge_rate * t_delta
                    if beam.charge >= stats.max_charge
                        beam.charge = stats.max_charge
                        beam.charging = false
                        beam.target = null

                if beam.target is null
                    to_target.push(beam)

            return to_target

        target_beams: (t_delta, stats, weap, eid, to_target) ->
            # Find valid targets within beam range
            targets = @world.entities.getComponents(C.WeaponsTarget)
            by_range = []
            for t_eid, target of targets

                # Do not target self!
                continue if t_eid is eid

                # Target only the intended team.
                continue if target.team isnt weap.target_team

                # Finally, let's see if the target is in range.
                t_pos = @world.entities.get(t_eid, C.Position)
                t_range_sq = ((t_pos.x - weap.x) * (t_pos.x - weap.x) +
                             (t_pos.y - weap.y) * (t_pos.y - weap.y))
                # t_range = Math.sqrt t_range_sq
                if t_range_sq <= stats.beam_range_sq
                    by_range.push([t_range_sq, t_eid])

            # Assign available beams to closest targets (if any)
            if by_range.length
                by_range.sort (a, b) -> a[0] - b[0]
                while to_target.length
                    for [t_range_sq, t_eid] in by_range
                        beam = to_target.pop()
                        break if not beam
                        beam.target = t_eid

        discharge_beams: (t_delta, stats, weap, eid) ->
            # Process discharge and damage for all active beams
            for idx in [0..weap.active_beams-1]
                beam = weap.beams[idx]

                # A beam charging does no damage
                if beam.charging or beam.target is null
                    continue

                # Consume charge for beam, start charging cycle if needed
                discharge = stats.discharge_rate * t_delta
                discharge = beam.charge if beam.charge < discharge
                beam.charge -= discharge
                if beam.charge <= 0
                    beam.charge = 0
                    beam.charging = true

                # Damage is power discharged, with some wasteage
                dmg = discharge * stats.dmg_penalty

                # Update the beam's end-point and send damage, if the target
                # still exists.
                t_pos = @world.entities.get(beam.target, C.Position)
                if t_pos
                    beam.x = t_pos.x
                    beam.y = t_pos.y
                    @world.publish HealthSystem.MSG_DAMAGE,
                        to: beam.target
                        from: eid
                        kind: @constructor.DAMAGE_TYPE
                        amount: dmg

    class HealthSystem extends System
        @MSG_DAMAGE = 'health.damage'
        @MSG_HEAL = 'health.heal'

        match_component: C.Health

        setWorld: (world) ->
            super world

            @world.subscribe @constructor.MSG_DAMAGE, (msg, data) =>
                health = @world.entities.get(data.to, C.Health)
                return if not health
                health.current -= data.amount

            @world.subscribe @constructor.MSG_HEAL, (msg, data) =>
                health = @world.entities.get(data.to, C.Health)
                return if not health
                health.health += data.amount

        update_match: (t_delta, eid, health) ->
            if health.current < 0
                @world.publish SpawnSystem.MSG_DESPAWN,
                    entity_id: eid

    class VaporTrailSystem extends System
        match_component: C.VaporTrail

        update_match: (t_delta, eid, vapor_trail) ->
            pos = @world.entities.get(eid, C.Position)
            particle = vapor_trail.particles.pop()
            particle.x = pos.x
            particle.y = pos.y
            vapor_trail.particles.unshift(particle)

    class ExplosionSystem extends System
        match_component: C.Explosion

        constructor: () ->
            @v_center = new Vector2D(0, 0)
            @v_scratch = new Vector2D(0, 0)

        update_match: (t_delta, eid, explosion) ->

            for p in explosion.particles

                if not explosion.stop and p.free
                    p.x = p.y = 0
                    @v_scratch.setValues(0, explosion.max_velocity * Math.random())
                    @v_scratch.rotateAround(@v_center, (Math.PI * 2) * Math.random())
                    p.dx = @v_scratch.x
                    p.dy = @v_scratch.y
                    p.mr = explosion.radius * Math.random()
                    p.s = explosion.max_particle_size # * Math.random()
                    p.free = false

                if not p.free
                    p.x += p.dx * t_delta
                    p.y += p.dy * t_delta

                    @v_scratch.setValues(p.x, p.y)
                    p.r = @v_scratch.dist(@v_center)
                    if p.r >= p.mr
                        p.r = p.mr
                        p.free = true

            explosion.age += t_delta
            if not explosion.stop and explosion.age >= (explosion.ttl * 0.75)
                explosion.stop = true

            if explosion.stop
                all_free = true
                for p in explosion.particles
                    if not p.free
                        all_free = false
                        break
                if all_free or explosion.age >= explosion.ttl
                    explosion.age = explosion.ttl
                    @world.publish SpawnSystem.MSG_DESPAWN,
                        entity_id: eid

    return {
        System, SpawnSystem, MotionSystem, BouncerSystem, SpinSystem,
        OrbiterSystem, ViewportSystem, PointerInputSystem, CollisionSystem,
        SeekerSystem, SteeringSystem, ThrusterSystem,
        ClickCourseSystem, KeyboardInputSystem, BeamWeaponSystem, HealthSystem,
        ExplosionSystem, RadarSystem, MissileWeaponSystem, VaporTrailSystem
    }
