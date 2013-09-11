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

            if spawn.destroy
                @world.entities.destroy(eid)

            else if not spawn.spawned
                pos = @world.entities.get(eid, C.Position)
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

    class SceneSystem extends System
        @MSG_SCENE_CHANGE = 'scene.change'
        match_component: C.EntityGroup

        setWorld: (world) ->
            super world
            
            @world.subscribe SceneSystem.MSG_SCENE_CHANGE, (msg, data) =>
                @current_scene = data.scene

            @world.subscribe SpawnSystem.MSG_DESPAWN, (msg, data) =>
                return if not @current_scene
                scene = @world.entities.get(@current_scene, C.EntityGroup)
                C.EntityGroup.remove(scene, data.entity_id)

        update_match: (dt, eid, entity_group) ->

    class ViewportSystem extends System
        match_component: C.Sprite

        constructor: (@window, @game_area, @canvas,
                      @scale_x=1.0, @scale_y=1.0) ->
            @ctx = @canvas.getContext('2d')
            @draw_bounding_boxes = false
            @viewport_ratio = 1.0

        setWorld: (world) ->
            super world
            @world.subscribe SceneSystem.MSG_SCENE_CHANGE, (msg, data) =>
                @current_scene = data.scene

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

            return if not @current_scene

            @ctx.save()
            @ctx.fillStyle = "rgba(0, 0, 0, 0.9)"
            @ctx.fillRect(0, 0, @canvas.width, @canvas.height)
            @ctx.restore()

            if @world.inputs.pointer_x
                @world.inputs.pointer_world_x = (
                    @world.inputs.pointer_x - (@viewport_width / 2)
                ) / @viewport_ratio
                @world.inputs.pointer_world_y = (
                    @world.inputs.pointer_y - (@viewport_height / 2)
                ) / @viewport_ratio

            scene = @world.entities.get(@current_scene, C.EntityGroup)
            for eid, ignore of scene.entities

                [sprite, pos] = @world.entities.get(eid, C.Sprite, C.Position)
                continue if not sprite or not pos

                @draw_beams t_delta, eid, pos

                @ctx.save()

                vp_x = @convertX(pos.x)
                vp_y = @convertY(pos.y)
                
                sprite_size = 20 * @viewport_ratio

                w = sprite.width * @viewport_ratio
                h = sprite.height * @viewport_ratio

                @ctx.translate(vp_x, vp_y)

                if @draw_bounding_boxes
                    @ctx.strokeStyle = "#33c"
                    wb = w / 2
                    hb = h / 2
                    @ctx.strokeRect(0-wb, 0-wb, w, h)

                @draw_health_bar t_delta, eid, w, h
                @draw_sprite t_delta, eid, w, h, pos, sprite_size, sprite

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
            @ctx.shadowColor = "#333"
            @ctx.shadowBlur = 3 * @viewport_ratio
            @ctx.beginPath()
            @ctx.moveTo(left, top)
            @ctx.lineTo(left + w, top)
            @ctx.stroke()
            if perc > 0
                @ctx.strokeStyle = "#3e3"
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
                    fudge = 2.125 * @viewport_ratio
                    target_x = @convertX(beam.x + (Math.random() * fudge) - (fudge/2))
                    target_y = @convertY(beam.y + (Math.random() * fudge) - (fudge/2))

                    @ctx.lineWidth = (1 * @viewport_ratio)
                    @ctx.shadowBlur = (4 * @viewport_ratio)
                    @ctx.strokeStyle = beam_weapon.color
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

            pos.x += bouncer.x_dir * ((dt/1000) * bouncer.x_sec)
            pos.y += bouncer.y_dir * ((dt/1000) * bouncer.y_sec)
                
    class SpinSystem extends System
        match_component: C.Spin

        update_match: (dt, eid, spin) ->
            pos = @world.entities.get(eid, C.Position)
            d_angle = (dt / 1000) * spin.rad_per_sec
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

            angle_delta = (dt / 1000) * orbiter.rad_per_sec
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
            d_angle = (dt / 1000) * seeker.rad_per_sec
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

            tick_dv = (dt / 1000) * thruster.dv
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
            pos.x += (dt / 1000) * thruster.dx
            pos.y += (dt / 1000) * thruster.dy

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
        
        update_match: (t_delta, eid, weap) ->

            pos = @world.entities.get(eid, C.Position)
            weap.x = pos.x
            weap.y = pos.y
            @v_beam.setValues(pos.x, pos.y)
            
            # Figure out the number of available beams
            weap.active_beams = Math.min(weap.active_beams,
                                         weap.max_beams)
            return if weap.active_beams is 0

            # Scale beam parameters so that more beams are faster, but base
            # total DPS on a single target is the same.
            # TODO: Could cache these calculations?
            max_charge = weap.max_power / (weap.active_beams * weap.active_beams)
            charge_rate = weap.charge_rate / weap.active_beams
            discharge_rate = weap.discharge_rate / weap.active_beams
            # Damage penalty for splitting the beam, up to 20%
            penalty = 1 - ((weap.active_beams / weap.max_beams) * weap.split_penalty)

            beams_to_target = []
            for idx in [0..weap.active_beams-1]
                beam = weap.beams[idx]

                if beam.charging
                    beam.charge += charge_rate * t_delta
                    if beam.charge >= max_charge
                        beam.charge = max_charge
                        beam.charging = false
                        beam.target = null
                        beams_to_target.push(beam)

            # Per-beam range is split over availables
            beam_range = weap.max_range / weap.active_beams

            if beams_to_target.length > 0
                
                # Find targets within beam range
                targets = @world.entities.getComponents(C.WeaponsTarget)
                by_range = []
                for t_eid, target of targets

                    # Do not target self!
                    continue if t_eid is eid

                    # Target only the intended team
                    if target.team is weap.target_team
                        t_pos = @world.entities.get(t_eid, C.Position)
                        @v_target.setValues(t_pos.x, t_pos.y)
                        t_range = @v_beam.dist(@v_target)
                        if t_range <= beam_range
                            by_range.push([t_range, t_eid, t_pos])

                # Bail, if no targets found
                return if not by_range.length > 0

                # Sort targets by range
                _.sortBy(by_range, (a)->a[0])

                # Assign targets to beams ready to switch
                while beams_to_target.length
                    for [t_range, t_eid, t_pos] in by_range
                        # Fetch next beam to target, bail if we're out
                        beam = beams_to_target.pop()
                        break if not beam
                        beam.target = t_eid

            # Process damage for all available beams
            for idx in [0..weap.active_beams-1]
                beam = weap.beams[idx]
                continue if beam.charging

                t_pos = @world.entities.get(beam.target, C.Position)
                if not t_pos
                    # beam.target = null
                else
                    beam.x = t_pos.x
                    beam.y = t_pos.y

                # Consume charge for beam, start charging cycle if needed
                discharge = discharge_rate * t_delta
                discharge = beam.charge if beam.charge < discharge
                beam.charge -= discharge
                if beam.charge <= 0
                    beam.charge = 0
                    beam.charging = true

                # Damage is power discharged, with some wasteage
                dmg = discharge * penalty

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

    return {
        System, SpawnSystem, BouncerSystem, SpinSystem, OrbiterSystem,
        ViewportSystem, PointerInputSystem, CollisionSystem, SeekerSystem,
        ThrusterSystem, ClickCourseSystem, KeyboardInputSystem,
        BeamWeaponSystem, HealthSystem, SceneSystem
    }
