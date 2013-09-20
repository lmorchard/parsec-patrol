define [
    'components', 'utils', 'jquery', 'underscore', 'pubsub', 'Vector2D',
    'Hammer' #, 'THREEx.KeyboardState'
], (
    C, Utils, $, _, PubSub, Vector2D, Hammer, KeyboardState
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
        draw_beam_range: false
        grid_size: 150
        grid_color: '#111'
        source_size: 100
        use_sprite_cache: false
        use_grid: true
        camera_x: 0
        camera_y: 0

        sprite_names: [
            'star', 'hero', 'enemyscout', 'enemycruiser', 'torpedo', 'default'
        ]

        constructor: (@window, @game_area, @canvas,
                      @window_scale_x=1.0, @window_scale_y=1.0,
                      @zoom=1.0) ->

            @buffer_canvas = document.createElement('canvas')
            @buffer_canvas.width = @canvas.width
            @buffer_canvas.height = @canvas.height

            @ctx = @buffer_canvas.getContext('2d')
            @screen_ctx = @canvas.getContext('2d')

            @viewport_ratio = 1.0
            @follow_entity = null

            @sprite_cache = {}
            for name in @sprite_names
                canvas_size = @source_size + 10
                canvas = document.createElement('canvas')
                canvas.width = canvas_size
                canvas.height = canvas_size
                # $(@canvas).after(canvas)
                @sprite_cache[name] = canvas
                ctx = canvas.getContext("2d")
                ctx.translate(canvas_size / 2, canvas_size / 2)
                ctx.lineWidth = 3
                ctx.strokeStyle = "#fff"
                @['draw_sprite_' + name](ctx, @source_size, @source_size)

        setWorld: (world) ->
            super world
            @resize()
            bound_resize = () => @resize()
            @window.addEventListener 'resize', bound_resize, false
            @window.addEventListener 'orientationchange', bound_resize, false

            @world.subscribe @constructor.MSG_CAPTURE_CAMERA, (msg, data) =>
                @follow_entity = data.entity_id

        setViewportSize: (width, height) ->
            @viewport_width = width
            @viewport_height = height
            @viewport_ratio = if @viewport_width > @viewport_height
                @viewport_width / @world.width
            else
                @viewport_height / @world.height

        resize: () ->
            [new_w, new_h] = [@window.innerWidth, @window.innerHeight]

            @game_area.style.width = "#{new_w}px"
            @game_area.style.height = "#{new_h}px"
            @game_area.style.marginLeft = "#{-new_w/2}px"
            @game_area.style.marginTop = "#{-new_h/2}px"
            
            @canvas.width = new_w * @window_scale_x
            @canvas.height = new_h * @window_scale_y
            @buffer_canvas.width = @canvas.width
            @buffer_canvas.height = @canvas.height

            @setViewportSize(@canvas.width, @canvas.height)

        draw: (t_delta) ->

            zoomed_ratio = @viewport_ratio * @zoom

            # If we have a followed entity, move the camera center
            if @follow_entity
                pos = @world.entities.get(@follow_entity, C.Position)
                if pos
                    @camera_x = pos.x
                    @camera_y = pos.y

            # Adjust pointer-to-world coords based on camera
            if @world.inputs.pointer_x
                @world.inputs.pointer_world_x = ((
                    @world.inputs.pointer_x - (@viewport_width/2)
                ) / zoomed_ratio) + @camera_x
                @world.inputs.pointer_world_y = ((
                    @world.inputs.pointer_y - (@viewport_height/2)
                ) / zoomed_ratio) + @camera_y

            # Calculate parameters defining the visible portion of world
            visible_width = @viewport_width / zoomed_ratio
            visible_height = @viewport_height / zoomed_ratio
            visible_left = (0 - visible_width/2) + @camera_x
            visible_top = (0 - visible_height/2) + @camera_y
            visible_right = visible_left + visible_width
            visible_bottom = visible_top + visible_height

            # Clear the canvas
            @ctx.save()
            @ctx.fillStyle = "rgba(0, 0, 0, 1.0)"
            @ctx.fillRect(0, 0, @canvas.width, @canvas.height)

            # Translate and scale based on the viewport center and zoom level
            @ctx.translate(@viewport_width / 2, @viewport_height / 2)
            @ctx.scale(zoomed_ratio, zoomed_ratio)

            # Adjust the camera center
            @ctx.translate(0-@camera_x, 0-@camera_y)

            @draw_backdrop(t_delta, visible_left, visible_top,
                           visible_right, visible_bottom)

            @draw_scene(t_delta, visible_left, visible_top,
                        visible_right, visible_bottom)

            @ctx.restore()

            @screen_ctx.drawImage(@buffer_canvas, 0, 0)

        draw_backdrop: (t_delta, visible_left, visible_top, visible_right, visible_bottom) ->
            return if not @use_grid

            @ctx.save()
            @ctx.strokeStyle = @grid_color
            @ctx.lineWidth = 1

            grid_offset_x = visible_left % @grid_size
            start = visible_left - grid_offset_x
            end = visible_right
            for left in [start..end] by @grid_size
                @ctx.moveTo(left, visible_top)
                @ctx.lineTo(left, visible_bottom)

            grid_offset_y = visible_top % @grid_size
            start = visible_top - grid_offset_y
            end = visible_bottom
            for top in [start..end] by @grid_size
                @ctx.moveTo(visible_left, top)
                @ctx.lineTo(visible_right, top)

            @ctx.stroke()
            @ctx.restore()

        draw_scene: (t_delta, visible_left, visible_top, visible_right, visible_bottom) ->
            scene = @world.entities.entitiesForGroup(@world.current_scene)
            for eid, ignore of scene

                spawn = @world.entities.get(eid, C.Spawn)
                continue if not spawn?.spawned

                pos = @world.entities.get(eid, C.Position)
                continue if not pos

                @draw_beams t_delta, eid, pos

                # Skip drawing offscreen entities
                # FIXME: Account for partially-offscreen entities
                if pos.x < visible_left or pos.x > visible_right or
                        pos.y < visible_top or pos.y > visible_bottom
                    continue

                @ctx.save()
                @ctx.translate(pos.x, pos.y)

                sprite = @world.entities.get(eid, C.Sprite)
                if sprite
                    w = sprite.width
                    h = sprite.height

                    if @draw_bounding_boxes
                        @ctx.strokeStyle = "#33c"
                        wb = w / 2
                        hb = h / 2
                        @ctx.strokeRect(0-wb, 0-wb, w, h)

                    @draw_health_bar t_delta, eid, w, h
                    @draw_sprite t_delta, eid, w, h, pos, sprite

                explosion = @world.entities.get(eid, C.Explosion)
                if explosion
                    @draw_explosion t_delta, eid, explosion

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
            
            top = 0 - (h/2) - 10
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

            @ctx.rotate(pos.rotation)

            if @use_sprite_cache
                @ctx.drawImage(
                    @sprite_cache[sprite.shape] || @sprite_cache['default'],
                    5, 5, @source_size, @source_size,
                    0-(w/2), 0-(h/2), w, h)
                return

            @ctx.fillStyle = "#000"
            @ctx.strokeStyle = sprite.stroke_style
            if @glow
                @ctx.shadowColor = sprite.stroke_style
                @ctx.shadowBlur = 4
            @ctx.lineWidth = 1.25

            shape_fn = @['draw_sprite_' + sprite.shape] || @draw_sprite_default
            shape_fn.call(@, @ctx, w, h)
        
        draw_sprite_default: (ctx, w, h) ->
            ctx.beginPath()
            ctx.arc(0, 0, w/2, 0, Math.PI*2, true)
            ctx.stroke()

        draw_sprite_star: (ctx, w, h) ->
            ctx.fillStyle = "#ccc"
            ctx.beginPath()
            ctx.arc(0, 0, w/2, 0, Math.PI*2, true)
            ctx.fill()

        draw_sprite_hero: (ctx, w, h) ->
            ctx.rotate(Math.PI)
            ctx.beginPath()
            ctx.moveTo(0-(w*0.125), 0-(h/2))
            ctx.lineTo(0-(w*0.25), 0-(h/2))
            ctx.lineTo(0-(w*0.5), 0)
            ctx.arc(0, 0, w/2, Math.PI, 0, true)
            ctx.lineTo(w*0.25, 0-(h/2))
            ctx.lineTo(w*0.125, 0-(h/2))
            ctx.lineTo(w*0.25, 0)
            ctx.arc(0, 0, (w*0.25), 0, Math.PI, true)
            ctx.lineTo(0-(w*0.125), 0-(h/2))
            ctx.stroke()

        draw_sprite_enemyscout: (ctx, w, h) ->
            ctx.beginPath()
            ctx.moveTo(0, 0-(h*0.5))
            ctx.lineTo(0-w*0.45, h*0.5)

            ctx.lineTo(0-w*0.125, h*0.125)
            ctx.lineTo(0, h*0.25)
            ctx.lineTo(0+w*0.125, h*0.125)
            
            #ctx.arc(0, h*0.125, w*0.125, Math.PI, 0, true)
            
            ctx.lineTo(w*0.45, h*0.5)
            ctx.lineTo(0, 0-(h*0.5))
            ctx.moveTo(0, 0-(h*0.5))
            ctx.stroke()

        draw_sprite_enemycruiser: (ctx, w, h) ->
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

        draw_sprite_torpedo: (ctx, w, h) ->
            ctx.beginPath()
            ctx.moveTo(0-(w*0.5), 0)
            ctx.arc(0-(w*0.5), 0-(h*0.5), w*0.5, Math.PI*0.5, 0, true)
            ctx.moveTo(0, 0-(h*0.5))
            ctx.arc(w*0.5, 0-(h*0.5), w*0.5, Math.PI, Math.PI*0.5, true)
            ctx.moveTo(0, h*0.5)
            ctx.arc(w*0.5, h*0.5, w*0.5, Math.PI*1.0, Math.PI*1.5, false)
            ctx.moveTo(0-w*0.5, 0)
            ctx.arc(0-(w*0.5), h*0.5, w*0.5, Math.PI*1.5, 0, false)
            ctx.stroke()

    class CollisionSystem extends System
        constructor: () ->

        match_component: C.Collidable

        update: (t_delta) ->
            matches = @world.entities.getComponents(@match_component)

            # TODO: Fix this horrible, naive collision detection
            # No account for shape or rotation. No quadtrees, etc.
            # Probably good-enough for now
            # See also: http://www.mikechambers.com/blog/2011/03/21/
            #   javascript-quadtree-implementation/
            
            boxes = {}
            [COLLIDABLE, LEFT, TOP, HEIGHT, WIDTH] = [0..4]
            for eid, collidable of matches
                [pos, sprite] = @world.entities.get(eid, C.Position, C.Sprite)
                boxes[eid] = [collidable, pos.x, pos.y,
                              sprite.width, sprite.height]

            for [a_eid, b_eid] in @combinations(_.keys(boxes), 2)
                a_box = boxes[a_eid]
                b_box = boxes[b_eid]

                left_dist    = Math.abs(a_box[LEFT] - b_box[LEFT]) * 2
                top_dist     = Math.abs(a_box[TOP] - b_box[TOP]) * 2
                width_total  = a_box[WIDTH] + b_box[WIDTH]
                height_total = a_box[HEIGHT] + b_box[HEIGHT]
                
                already_in_collision = (
                    (b_eid of a_box[COLLIDABLE].in_collision_with) and
                    (a_eid of b_box[COLLIDABLE].in_collision_with)
                )

                if left_dist < width_total and top_dist < height_total
                    if not already_in_collision
                        a_box[COLLIDABLE].in_collision_with[b_eid] = Utils.now()
                        b_box[COLLIDABLE].in_collision_with[a_eid] = Utils.now()

                else if already_in_collision
                    delete a_box[COLLIDABLE].in_collision_with[b_eid]
                    delete b_box[COLLIDABLE].in_collision_with[a_eid]

        combinations: (arr, k) ->
            # Stolen from http://rosettacode.org/wiki/Combinations#JavaScript
            ret = []
            if arr.length > 0 then for i in [0..arr.length-1]
                if k is 1
                    ret.push([arr[i]])
                else
                    sub = @combinations(arr.slice(i+1, arr.length), k-1)
                    if sub.length > 0 then for subI in [0..sub.length-1]
                        next = sub[subI]
                        next.unshift(arr[i])
                        ret.push(next)
            return ret

    class BouncerSystem extends System
        match_component: C.Bouncer

        update_match: (dt, eid, bouncer) ->
            [pos, collidable] = @world.entities.get(eid, C.Position,
                                                         C.Collidable)

            # TODO: This is a horrible bounce-on-collision algo
            if collidable and _.keys(collidable.in_collision_with).length > 0
                bouncer.x_dir = 0 - bouncer.x_dir
                bouncer.y_dir = 0 - bouncer.y_dir
            
            xb = @world.width / 2
            yb = @world.height / 2

            if pos.x > xb then bouncer.x_dir = -1
            if pos.x < -xb then bouncer.x_dir = 1
            if pos.y > yb then bouncer.y_dir = -1
            if pos.y < -yb then bouncer.y_dir = 1

            pos.x += bouncer.x_dir * (dt * bouncer.x_sec)
            pos.y += bouncer.y_dir * (dt * bouncer.y_sec)
                
    class SpinSystem extends System
        match_component: C.Spin

        update_match: (dt, eid, spin) ->
            pos = @world.entities.get(eid, C.Position)
            d_angle = dt * spin.rad_per_sec
            pos.rotation = (pos.rotation + d_angle) % (Math.PI*2)
            
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
                pos.rotation = @v_old.angleTo(@v_orbiter) + (Math.PI * 0.5)

    class SeekerSystem extends System
        match_component: C.Seeker

        constructor: () ->
            @v_seeker = new Vector2D()
            @v_target = new Vector2D()

        update_match: (dt, eid, seeker) ->
            return if not seeker.target

            pos = @world.entities.get(eid, C.Position)
            return if not pos

            if seeker.acquisition_delay > 0
                seeker.acquisition_delay -= dt
                return

            target_pos = seeker.target
            if not _.isObject(target_pos)
                target_pos = @world.entities.get(seeker.target, C.Position)
            return if not target_pos or (not target_pos.x and target_pos.y)

            # Set up the vectors for angle math...
            @v_seeker.setValues(pos.x, pos.y)
            @v_target.setValues(target_pos.x, target_pos.y)

            # Get the target angle, ensuring a 0..2*Math.PI range.
            target_angle = @v_seeker.angleTo(@v_target) + (Math.PI*0.5)
            target_angle += 2*Math.PI if target_angle < 0
            if seeker.error > 0
                error = seeker.rad_per_sec * seeker.error
                target_angle += (error/2) - (error * Math.random())

            # Pick the direction from current to target angle
            direction =
                if target_angle < pos.rotation then -1
                else 1
   
            # If the offset between the angles is more than half a circle, go
            # the other way because it'll be shorter.
            offset = Math.abs(target_angle - pos.rotation)
            if offset > Math.PI
                direction = 0 - direction

            # Figure out the amount of rotation for this tick. If it's more
            # than the remaining offset, just rotate that much (or none)
            d_angle = dt * seeker.rad_per_sec
            d_angle = offset if d_angle > offset

            # Update the rotation, ensuring a 0..2*Math.PI range.
            pos.rotation = (pos.rotation + (direction * d_angle)) % (Math.PI*2)
            pos.rotation += 2*Math.PI if pos.rotation < 0

    class ThrusterSystem extends System
        match_component: C.Thruster

        constructor: () ->
            @v_inertia = new Vector2D()
            @v_thrust = new Vector2D()

        update_match: (dt, eid, thruster) ->
            pos = @world.entities.get(eid, C.Position)

            @v_inertia.setValues(thruster.dx, thruster.dy)

            tick_dv = dt * thruster.dv
            if not thruster.active
                # Fire retro-thrusters until inertia is gone
                @v_inertia.addScalar(0 - tick_dv)
                @v_inertia.x = 0 if @v_inertia.x < 0
                @v_inertia.y = 0 if @v_inertia.y < 0
            else
                # Create a thrust vector pointing straight up, then rotate it to
                # correspond with entity
                @v_thrust.setValues(0, 0-tick_dv)
                @v_thrust.rotate(pos.rotation)

                # Try adding thrust to our current inertia
                @v_inertia.add(@v_thrust)

                # Enforce the speed limit by scaling the inertia vector back
                curr_v = @v_inertia.magnitude()
                if curr_v > thruster.max_v
                    drag = thruster.max_v / curr_v
                    @v_inertia.multiplyScalar(drag)

            # Update inertia
            thruster.dx = @v_inertia.x
            thruster.dy = @v_inertia.y

            # Finally, update position based on inertia
            pos.x += dt * thruster.dx
            pos.y += dt * thruster.dy

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
                seeker?.target =
                    x: click_course.x,
                    y: click_course.y

            # Full stop, when the sprite collides with the destination
            x_offset = Math.abs(pos.x - click_course.x)
            y_offset = Math.abs(pos.y - click_course.y)
            if x_offset < sprite.width/2 and y_offset < sprite.height/2
                if click_course.stop_on_arrival
                    thruster?.active = false
                seeker?.target = null

    class MissileWeaponSystem extends System
        @DAMAGE_TYPE = 'Missile'

        match_component: C.MissileWeapon

        constructor: () ->
            @v_center = new Vector2D(0, 0)
            @v_turret = new Vector2D(0, 0)

        update_match: (t_delta, eid, weapon) ->

            pos = @world.entities.get(eid, C.Position)
            weapon.x = pos.x
            weapon.y = pos.y

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

            rad_per = (Math.PI * 2) / weapon.active_turrets
            
            @v_center.setValues(weapon.x, weapon.y)
            @v_turret.setValues(weapon.x, weapon.y - 20)
            @v_turret.rotateAround(@v_center, pos.rotation)

            for idx in [0..weapon.active_turrets-1]

                turret = weapon.turrets[idx]
                continue if turret.target is null or turret.loading > 0

                #@v_turret.rotateAround(@v_center, rad_per)

                missile = weapon.missile
                size = 5
                color = missile.color
                rotation = if (idx % 2) is 0 then 0 else Math.PI

                missile_data =
                    Position: {}
                    Sprite:
                        shape: 'enemyscout'
                        width: size
                        height: size
                        stroke_style: color
                    Spawn:
                        x: (@v_turret.x - 30) + ( (15 * (idx/2)) % 50 )
                        y: @v_turret.y
                        rotation: rotation
                        ttl: missile.ttl
                    Collidable:
                        on_collide:
                            destruct: true
                            damage: missile.damage
                    Thruster:
                        dv: missile.speed
                        max_v: missile.speed
                        active: true
                    Seeker:
                        rad_per_sec: missile.rad_per_sec
                        acquisition_delay: missile.acquisition_delay * Math.random()
                        error: missile.error
                        target: turret.target
                    Health:
                        max: missile.health
                        show_bar: false
                    RadarPing:
                        color: color
                        size: 3
                    WeaponsTarget:
                        team: "invaders"
                    Tombstone:
                        load:
                            Position: {}
                            Explosion:
                                ttl: 0.75
                                radius: size * 2
                                max_particles: 15
                                max_particle_size: 1.5
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
        System, SpawnSystem, BouncerSystem, SpinSystem, OrbiterSystem,
        ViewportSystem, PointerInputSystem, CollisionSystem, SeekerSystem,
        ThrusterSystem, ClickCourseSystem, KeyboardInputSystem,
        BeamWeaponSystem, HealthSystem, ExplosionSystem, RadarSystem,
        MissileWeaponSystem
    }
