define ['components', 'underscore', 'pubsub', 'Vector2D'], (C, _, PubSub, Vector2D) ->

    class System
        world: null
        match_component: null

        setWorld: (world) ->
            @world = world
        
        getMatches: () ->
            return @world.entities.getComponents(@match_component)

        update: (t_delta) ->
            matches = @getMatches()
            for entity_id, component of matches
                @update_match(t_delta, entity_id, component)

        update_match: (t_delta, entity_id, match) ->

    class SpawnSystem extends System
        @MSG_SPAWN = 'spawn'
        
        match_component: C.Spawn

        update_match: (t_delta, eid, spawn) ->
            return if spawn.spawned
            if @world
                pos = @world.entities.get(eid, C.MapPosition)
                switch spawn.position_logic
                    when 'random'
                        pos.x = _.random(0-(@world.width / 2), @world.width / 2)
                        pos.y = _.random(0-(@world.height / 2), @world.height / 2)
                    when 'at'
                        pos.x = spawn.x
                        pos.y = spawn.y
                    else
                        pos.x = pos.y = 0

            spawn.spawned = true
            @world.publish @constructor.MSG_SPAWN,
                entity_id: eid, spawn: spawn

    class RenderSystem extends System
        @MSG_SCENE_CHANGE = 'scene.change'
        
        match_component: C.Sprite

        constructor: (@window, @game_area, @canvas, @scale_x=1.0, @scale_y=1.0) ->
            @ctx = @canvas.getContext('2d')
            @draw_bounding_boxes=false

        setWorld: (world) ->
            super world
            @world.subscribe @constructor.MSG_SCENE_CHANGE, (msg, data) =>
                @current_scene = data.scene

            @resize()

            bound_resize = () => @resize()
            @window.addEventListener('resize', bound_resize, false)
            @window.addEventListener('orientationchange', bound_resize, false)

        setViewportSize: (width, height) ->
            @viewport_width = width
            @viewport_height = height

        resize: () ->

            [new_w, new_h] = [@window.innerWidth, @window.innerHeight]

            @game_area.style.width = "#{new_w}px"
            @game_area.style.height = "#{new_h}px"
            @game_area.style.marginLeft = "#{-new_w/2}px"
            @game_area.style.marginTop = "#{-new_h/2}px"
            
            @canvas.width = new_w * @scale_x
            @canvas.height = new_h * @scale_y

            @setViewportSize(@canvas.width, @canvas.height)

        update: (t_delta) ->

            return if not @current_scene

            v_is_wide = @viewport_width > @viewport_height

            if v_is_wide
                v_ratio = @viewport_width / @world.width
            else
                v_ratio = @viewport_height / @world.height

            @ctx.save()
            @ctx.fillStyle = "#000"
            @ctx.fillRect(0, 0, @canvas.width, @canvas.height)
            @ctx.restore()

            scene = @world.entities.get(@current_scene, C.EntityGroup)
            for eid, ignore of scene.entities

                [sprite, pos] = @world.entities.get(eid, C.Sprite, C.MapPosition)

                @ctx.save()

                vp_x = (pos.x * v_ratio) + (@viewport_width / 2)
                vp_y = (pos.y * v_ratio) + (@viewport_height / 2)
                sprite_size = 20 * v_ratio

                w = sprite.width * v_ratio
                h = sprite.height * v_ratio

                @ctx.translate(vp_x, vp_y)

                if @draw_bounding_boxes
                    @ctx.strokeStyle = "#33c"
                    wb = w / 2
                    hb = h / 2
                    @ctx.strokeRect(0-wb, 0-wb, w, h)

                @ctx.rotate(pos.rotation)

                @ctx.fillStyle = "#fff"
                @ctx.strokeStyle = sprite.stroke_style
                @ctx.lineWidth = 1.25

                # TODO: Yes, I know, this sucks. Refactor into something better
                switch sprite.shape

                    when 'star'
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
                        @ctx.stroke()
                        
                    when 'enemyscout'
                        @ctx.beginPath()
                        @ctx.moveTo(0, 0-(h*0.5))
                        @ctx.lineTo(0-w*0.45, h*0.5)
                        @ctx.arc(0, h*0.125, w*0.125, Math.PI, 0, true)
                        @ctx.lineTo(w*0.45, h*0.5)
                        @ctx.lineTo(0, 0-(h*0.5))
                        @ctx.moveTo(0, 0-(h*0.5))
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
                        @ctx.arc(0-(w*0.5), 0-(h*0.5), w*0.5, Math.PI*0.5, 0, true)
                        @ctx.moveTo(0, 0-(h*0.5))
                        @ctx.arc(w*0.5, 0-(h*0.5), w*0.5, Math.PI, Math.PI*0.5, true)
                        @ctx.moveTo(0, h*0.5)
                        @ctx.arc(w*0.5, h*0.5, w*0.5, Math.PI*1.0, Math.PI*1.5, false)
                        @ctx.moveTo(0-w*0.5, 0)
                        @ctx.arc(0-(w*0.5), h*0.5, w*0.5, Math.PI*1.5, 0, false)

                        @ctx.stroke()

                    else
                        @ctx.beginPath()
                        @ctx.arc(0, 0, sprite_size/2, 0, Math.PI*2, true)
                        @ctx.stroke()

                @ctx.restore()

    class BouncerSystem extends System
        match_component: C.Bouncer

        update_match: (dt, eid, bouncer) ->
            [pos, collidable] = @world.entities.get(eid, C.MapPosition,
                                                         C.Collidable)

            if collidable
                # TODO: This is a horrible bounce-on-collision algo
                if _.keys(collidable.in_collision_with).length > 0
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
            pos = @world.entities.get(eid, C.MapPosition)
            d_angle = (dt / 1000) * spin.rad_per_sec
            pos.rotation = (pos.rotation + d_angle) % (Math.PI*2)
            
    class OrbiterSystem extends System
        match_component: C.Orbit

        constructor: () ->
            @v_orbited = new Vector2D()
            @v_orbiter = new Vector2D()
            @v_old = new Vector2D()

        update_match: (dt, eid, orbiter) ->
            pos = @world.entities.get(eid, C.MapPosition)
            o_pos = @world.entities.get(orbiter.orbited_id, C.MapPosition)

            @v_orbited.setValues(o_pos.x, o_pos.y)
            @v_orbiter.setValues(pos.x, pos.y)

            angle_delta = (dt / 1000) * orbiter.rad_per_sec
            @v_orbiter.rotateAround(@v_orbited, angle_delta)

            @v_old.setValues(pos.x, pos.y)
            pos.x = @v_orbiter.x
            pos.y = @v_orbiter.y
            pos.rotation = @v_old.angleTo(@v_orbiter) + (Math.PI * 0.5)
    
    class CollisionSystem extends System
        constructor: () ->

        match_component: C.Collidable

        update: (t_delta) ->
            matches = @world.entities.getComponents(@match_component)

            # TODO: Fix this horrible, naive collision detection
            # No account for shape or rotation. Probably good-enough for now
            
            boxes = {}
            [COLLIDABLE, LEFT, TOP, HEIGHT, WIDTH] = [0..4]
            for eid, collidable of matches
                [pos, sprite] = @world.entities.get(eid, C.MapPosition, C.Sprite)
                boxes[eid] = [collidable, pos.x, pos.y, sprite.width, sprite.height]

            for combo in @combinations(_.keys(boxes), 2)
                [a_eid, b_eid] = combo
                a_box = boxes[a_eid]
                b_box = boxes[b_eid]

                left_dist    = Math.abs(a_box[LEFT] - b_box[LEFT]) * 2
                top_dist     = Math.abs(a_box[TOP] - b_box[TOP]) * 2
                width_total  = a_box[WIDTH] + b_box[WIDTH]
                height_total = a_box[HEIGHT] + b_box[HEIGHT]
                
                already_in_collision = (
                    a_box[COLLIDABLE].in_collision_with[b_eid] and
                    b_box[COLLIDABLE].in_collision_with[a_eid]
                )

                if left_dist < width_total and top_dist < height_total and
                        not already_in_collision
                    a_box[COLLIDABLE].in_collision_with[b_eid] = true
                    b_box[COLLIDABLE].in_collision_with[a_eid] = true

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

    return {
        System, SpawnSystem, BouncerSystem, SpinSystem, OrbiterSystem,
        RenderSystem, CollisionSystem
    }
