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
            # console.log("KEYS #{JSON.stringify(@world.inputs.keyboard.keyCodes)}")

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
                spawn.destroy = true

        update_match: (t_delta, eid, spawn) ->
            return if not @world

            pos = @world.entities.get(eid, C.Position)

            if spawn.destroy
                tombstone = @world.entities.get(eid, C.Tombstone)
                if tombstone
                    t_eid = @world.entities.create(
                        new C.Spawn('at', pos.x, pos.y),
                        tombstone.components...
                    )
                    gid = @world.entities.groupForEntity(eid)
                    if gid isnt null
                        @world.entities.addToGroup(gid, t_eid)
                @world.entities.destroy(eid)

            else if not spawn.spawned
                switch spawn.position_logic
                    when 'random'
                        pos.x = _.random(0-(@world.width/2), @world.width/2)
                        pos.y = _.random(0-(@world.height/2), @world.height/2)
                    when 'at'
                        pos.x = spawn.x
                        pos.y = spawn.y
                    else
                        pos.x = pos.y = 0

                spawn.spawned = true
                @world.publish @constructor.MSG_SPAWN,
                    entity_id: eid, spawn: spawn

    class ViewportSystem extends System
        glow: false

        match_component: C.Sprite

        constructor: (@window, @game_area, @canvas,
                      @scale_x=1.0, @scale_y=1.0) ->
            @ctx = @canvas.getContext('2d')
            @draw_bounding_boxes = false
            @viewport_ratio = 1.0

        setWorld: (world) ->
            super world

            @resize()
            bound_resize = () => @resize()
            @window.addEventListener 'resize', bound_resize, false
            @window.addEventListener 'orientationchange', bound_resize, false

        setViewportSize: (width, height) ->
            @viewport_width = width
            @viewport_height = height

            if @viewport_width > @viewport_height
                @viewport_ratio = @viewport_width / @world.width
            else
                @viewport_ratio = @viewport_height / @world.height

        resize: () ->

            [new_w, new_h] = [@window.innerWidth, @window.innerHeight]

            @game_area.style.width = "#{new_w}px"
            @game_area.style.height = "#{new_h}px"
            @game_area.style.marginLeft = "#{-new_w/2}px"
            @game_area.style.marginTop = "#{-new_h/2}px"
            
            @canvas.width = new_w * @scale_x
            @canvas.height = new_h * @scale_y

            @setViewportSize(@canvas.width, @canvas.height)

        convertX: (x) ->
            return (x * @viewport_ratio) + (@viewport_width / 2)

        convertY: (y) ->
            return (y * @viewport_ratio) + (@viewport_height / 2)

        draw: (t_delta) ->
            @ctx.save()
            @ctx.fillStyle = "rgba(0, 0, 0, 1.0)"
            @ctx.fillRect(0, 0, @canvas.width, @canvas.height)
            @ctx.restore()

            if @world.inputs.pointer_x
                @world.inputs.pointer_world_x = (
                    @world.inputs.pointer_x - (@viewport_width / 2)
                ) / @viewport_ratio
                @world.inputs.pointer_world_y = (
                    @world.inputs.pointer_y - (@viewport_height / 2)
                ) / @viewport_ratio

            scene = @world.entities.entitiesForGroup(@world.current_scene)
            for eid, ignore of scene

                spawn = @world.entities.get(eid, C.Spawn)
                continue if not spawn?.spawned

                pos = @world.entities.get(eid, C.Position)
                continue if not pos

                @draw_beams t_delta, eid, pos

                @ctx.save()

                vp_x = @convertX(pos.x)
                vp_y = @convertY(pos.y)
                @ctx.translate(vp_x, vp_y)

                sprite = @world.entities.get(eid, C.Sprite)
                if sprite
                    sprite_size = 20 * @viewport_ratio

                    w = sprite.width * @viewport_ratio
                    h = sprite.height * @viewport_ratio

                    if @draw_bounding_boxes
                        @ctx.strokeStyle = "#33c"
                        wb = w / 2
                        hb = h / 2
                        @ctx.strokeRect(0-wb, 0-wb, w, h)

                    @draw_health_bar t_delta, eid, w, h
                    @draw_sprite t_delta, eid, w, h, pos, sprite_size, sprite

                explosion = @world.entities.get(eid, C.Explosion)
                if explosion
                    @draw_explosion t_delta, eid, explosion

                @ctx.restore()

        draw_explosion: (t_delta, eid, explosion) ->

            @ctx.save()
            @ctx.fillStyle = explosion.color

            # Explosion fades out overall as it nears expiration
            duration_alpha = 1 - (explosion.age / explosion.ttl)

            for p in explosion.particles
                continue if p.free
                # Particles fade out as they reach the radius
                @ctx.globalAlpha = (1 - (p.r / p.mr)) * duration_alpha
                s = p.s * @viewport_ratio
                @ctx.fillRect(
                    p.x * @viewport_ratio,
                    p.y * @viewport_ratio,
                    s, s
                )
            
            @ctx.restore()

        draw_health_bar: (t_delta, eid, w, h) ->
            health = @world.entities.get(eid, C.Health)
            return if not health

            perc = (health.current / health.max)
            
            top = 0 - (h/2) - 10
            left = 0 - (w/2)
           
            @ctx.save()
            @ctx.lineWidth = 2 * @viewport_ratio
            @ctx.strokeStyle = "#333"
            if @glow
                @ctx.shadowColor = "#333"
                @ctx.shadowBlur = 3 * @viewport_ratio
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

            origin_x = @convertX(beam_weapon.x)
            origin_y = @convertY(beam_weapon.y)
                        
            v_origin = new Vector2D(origin_x, origin_y)
            v_turret = new Vector2D(origin_x, @convertY(beam_weapon.y - 6))
            v_turret.rotateAround(v_origin, pos.rotation)
            turret_rad = (Math.PI*2) / beam_weapon.active_beams

            if false
                range = beam_weapon.max_range / beam_weapon.active_beams
                @ctx.strokeStyle = beam_weapon.color
                @ctx.beginPath()
                @ctx.arc(origin_x, origin_y, range * @viewport_ratio, 0, Math.PI*2, false)
                @ctx.stroke()

            for idx in [0..beam_weapon.active_beams-1]
                beam = beam_weapon.beams[idx]
                continue if not beam

                @ctx.save()
                v_turret.rotateAround(v_origin, turret_rad)

                @ctx.fillStyle = beam_weapon.color
                @ctx.beginPath()
                @ctx.arc(v_turret.x, v_turret.y, 1.5, 0, Math.PI*2, true)
                @ctx.fill()
                
                if beam?.target and not beam?.charging
                    fudge = 1.25 * @viewport_ratio
                    target_x = @convertX(beam.x + (Math.random() * fudge) - (fudge/2))
                    target_y = @convertY(beam.y + (Math.random() * fudge) - (fudge/2))

                    @ctx.lineWidth = (0.75 * @viewport_ratio)
                    @ctx.strokeStyle = beam_weapon.color
                    if @glow
                        @ctx.shadowBlur = (4 * @viewport_ratio)
                        @ctx.shadowColor = beam_weapon.color
                    @ctx.beginPath()
                    @ctx.moveTo(v_turret.x, v_turret.y)
                    @ctx.lineTo(target_x, target_y)
                    @ctx.stroke()

                @ctx.restore()

        draw_sprite: (t_delta, eid, w, h, pos, sprite_size, sprite) ->

            @ctx.rotate(pos.rotation)

            @ctx.fillStyle = "#000"
            @ctx.strokeStyle = sprite.stroke_style
            if @glow
                @ctx.shadowColor = sprite.stroke_style
                @ctx.shadowBlur = 3 * @viewport_ratio
            @ctx.lineWidth = 1.25 * @viewport_ratio

            # TODO: Yes, I know, this sucks. Refactor into something better
            switch sprite.shape

                when 'star'
                    @ctx.fillStyle = "#ccc"
                    @ctx.beginPath()
                    @ctx.arc(0, 0, sprite_size/2, 0, Math.PI*2, true)
                    @ctx.fill()

                when 'hero'
                    @ctx.rotate(Math.PI)
                    @ctx.beginPath()
                    @ctx.moveTo(0-(w*0.125), 0-(h/2))
                    @ctx.lineTo(0-(w*0.25), 0-(h/2))
                    @ctx.lineTo(0-(w*0.5), 0)
                    @ctx.arc(0, 0, w/2, Math.PI, 0, true)
                    @ctx.lineTo(w*0.25, 0-(h/2))
                    @ctx.lineTo(w*0.125, 0-(h/2))
                    @ctx.lineTo(w*0.25, 0)
                    @ctx.arc(0, 0, (w*0.25), 0, Math.PI, true)
                    @ctx.lineTo(0-(w*0.125), 0-(h/2))
                    #@ctx.fill()
                    @ctx.stroke()
                    
                when 'enemyscout'
                    @ctx.beginPath()
                    @ctx.moveTo(0, 0-(h*0.5))
                    @ctx.lineTo(0-w*0.45, h*0.5)
                    @ctx.arc(0, h*0.125, w*0.125, Math.PI, 0, true)
                    @ctx.lineTo(w*0.45, h*0.5)
                    @ctx.lineTo(0, 0-(h*0.5))
                    @ctx.moveTo(0, 0-(h*0.5))
                    #@ctx.fill()
                    @ctx.stroke()

                when 'enemycruiser'
                    hu = h / 5
                    wu = w / 4

                    @ctx.beginPath()
                    @ctx.moveTo(0, 0-hu*2.5)
                    @ctx.lineTo(-(wu*1), hu*0.5)
                    @ctx.lineTo(-(wu*1.25), 0-hu*1.5)
                    @ctx.lineTo(-(wu*2), hu*2.5)
                    @ctx.arc(0-wu, hu*2.5, w*0.25, Math.PI, Math.PI/2, true)
                    @ctx.lineTo(-wu*0.5, hu*2.5)
                    @ctx.arc(0, hu*2.5, w*0.125, Math.PI, 0, true)
                    @ctx.lineTo(wu, hu*3.75)
                    @ctx.arc(wu, hu*2.5, w*0.25, Math.PI/2, 0, true)
                    @ctx.lineTo(wu*1.25, 0-hu*1.5)
                    @ctx.lineTo(wu*1, hu*0.5)
                    @ctx.lineTo(0, 0-hu*2.5)

                    @ctx.stroke()

                when 'torpedo'
                    @ctx.beginPath()
                    
                    @ctx.moveTo(0-(w*0.5), 0)
                    @ctx.arc(0-(w*0.5), 0-(h*0.5), w*0.5, Math.PI*0.5, 0,
                             true)
                    @ctx.moveTo(0, 0-(h*0.5))
                    @ctx.arc(w*0.5, 0-(h*0.5), w*0.5, Math.PI, Math.PI*0.5,
                             true)
                    @ctx.moveTo(0, h*0.5)
                    @ctx.arc(w*0.5, h*0.5, w*0.5, Math.PI*1.0, Math.PI*1.5,
                             false)
                    @ctx.moveTo(0-w*0.5, 0)
                    @ctx.arc(0-(w*0.5), h*0.5, w*0.5, Math.PI*1.5, 0,
                             false)

                    @ctx.stroke()

                else
                    @ctx.beginPath()
                    @ctx.arc(0, 0, sprite_size/2, 0, Math.PI*2, true)
                    @ctx.stroke()


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
            if click_course.active and (
                    @world.inputs.pointer_button_left or
                    @world.inputs.keyboard?.pressed('a'))
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

    class BeamWeaponSystem extends System
        @DAMAGE_TYPE = 'Beam'

        match_component: C.BeamWeapon
        
        constructor: () ->
            @v_beam = new Vector2D()
            @v_target = new Vector2D()
            @stats = {}

        calculate_stats: (weap) ->
            # Scale beam parameters so that more beams are faster, yet have the
            # same base total DPS on a single target.
            key = "#{weap.active_beams}:#{weap.max_power}"
            if not (key of @stats)
                # Cache these calculations, because they happen on every frame.
                active = weap.active_beams
                @stats[key] =
                    # Charge is active-squared, because beams are active-times
                    # as numerous AND active-times as fast. That took me awhile
                    # to figure out.
                    max_charge: weap.max_power / (active * active)
                    # Rate that the capacitor fills from energy stores
                    charge_rate: weap.charge_rate / active
                    # Rate that capacitor drains in delivering damage
                    discharge_rate: weap.discharge_rate / active
                    # Total range is split per-beam
                    beam_range: weap.max_range / active
                    # Damage penalty for splitting the beam
                    dmg_penalty: 1 - ((active / weap.max_beams) * weap.split_penalty)
            return @stats[key]

        update_match: (t_delta, eid, weap) ->

            pos = @world.entities.get(eid, C.Position)
            weap.x = pos.x
            weap.y = pos.y
            @v_beam.setValues(pos.x, pos.y)
            
            # Figure out the number of available beams
            weap.active_beams = Math.min(weap.active_beams,
                                         weap.max_beams)
            return if weap.active_beams is 0

            # Calculate current beam weapon parameters
            stats = @calculate_stats(weap)

            # Perform beam charging. Immediately after charging, a beam can
            # change targets.
            beams_to_target = []
            for idx in [0..weap.active_beams-1]
                beam = weap.beams[idx]

                if beam.charging
                    beam.charge += stats.charge_rate * t_delta
                    if beam.charge >= stats.max_charge
                        beam.charge = stats.max_charge
                        beam.charging = false
                        beam.target = null
                        beams_to_target.push(beam)

            # Do we have any beams available for targeting...?
            if beams_to_target.length > 0
                
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
                    @v_target.setValues(t_pos.x, t_pos.y)
                    t_range = @v_beam.dist(@v_target)
                    if t_range <= stats.beam_range
                        by_range.push([t_range, t_eid, t_pos])

                # Assign available beams to closest targets (if any)
                if by_range.length
                    _.sortBy(by_range, (a)->a[0])
                    while beams_to_target.length
                        for [t_range, t_eid, t_pos] in by_range
                            beam = beams_to_target.pop()
                            break if not beam
                            beam.target = t_eid

            # Process discharge and damage for all active beams
            for idx in [0..weap.active_beams-1]
                beam = weap.beams[idx]

                # A beam charging does no damage.
                continue if beam.charging

                # Update the beam's end-point, if the target still exists.
                t_pos = @world.entities.get(beam.target, C.Position)
                if t_pos
                    beam.x = t_pos.x
                    beam.y = t_pos.y

                # Consume charge for beam, start charging cycle if needed
                discharge = stats.discharge_rate * t_delta
                discharge = beam.charge if beam.charge < discharge
                beam.charge -= discharge
                if beam.charge <= 0
                    beam.charge = 0
                    beam.charging = true

                # Damage is power discharged, with some wasteage
                dmg = discharge * stats.dmg_penalty

                # Send damage to the target
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
                    p.x = 0
                    p.y = 0
                    @v_scratch.setValues(0, explosion.max_velocity * Math.random())
                    @v_scratch.rotateAround(@v_center, (Math.PI * 2) * Math.random())
                    p.dx = @v_scratch.x
                    p.dy = @v_scratch.y
                    p.mr = explosion.radius * Math.random()
                    p.s = explosion.max_particle_size * Math.random()
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
        BeamWeaponSystem, HealthSystem, ExplosionSystem
    }
