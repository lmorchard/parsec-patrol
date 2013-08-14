define ['components', 'underscore', 'pubsub', 'Vector2D'], (C, _, PubSub, Vector2D) ->

    class System
        world: null
        match_component: null

        setWorld: (world) ->
            @world = world
        
        update: (t_delta) ->
            return if not @match_component
            matches = @world.entities.getComponents(@match_component)
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
                    when 'center'
                        pos.x = 0
                        pos.y = 0
                    when 'random'
                        pos.x = _.random(0-(@world.width / 2), @world.width / 2)
                        pos.y = _.random(0-(@world.height / 2), @world.height / 2)
                    else
                        pos.x = 0 - (@world.width / 2)
                        pos.y = 0 - (@world.height / 2)

            spawn.spawned = true
            @world.publish @constructor.MSG_SPAWN,
                entity_id: eid, spawn: spawn

    class RenderSystem extends System
        @MSG_SCENE_CHANGE = 'scene.change'
        
        match_component: C.Sprite

        constructor: (@canvas) ->
            @ctx = @canvas.getContext('2d')

        setWorld: (world) ->
            super world
            @world.subscribe @constructor.MSG_SCENE_CHANGE, (msg, data) =>
                @current_scene = data.scene

        setViewportSize: (width, height) ->
            @viewport_width = width
            @viewport_height = height

        update: (t_delta) ->

            return if not @current_scene

            v_is_wide = @viewport_width > @viewport_height
            w_is_wide = @world.width > @world.height

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

                switch sprite.shape
                    when 'star'
                        @ctx.fillStyle = "#fff"
                        @ctx.beginPath()
                        @ctx.arc(vp_x, vp_y, sprite_size/2, 0, Math.PI*2, true)
                        @ctx.fill()
                    else
                        @ctx.strokeStyle = "#fff"
                        @ctx.beginPath()
                        @ctx.arc(vp_x, vp_y, sprite_size/2, 0, Math.PI*2, true)
                        @ctx.stroke()

                @ctx.restore()

    class BouncerSystem extends System
        match_component: C.Bouncer
        update_match: (dt, eid, bouncer) ->
            pos = @world.entities.get(eid, C.MapPosition)
            pos.x += bouncer.x_dir * ((dt/1000) * bouncer.x_sec)
            pos.y += bouncer.y_dir * ((dt/1000) * bouncer.y_sec)
            if pos.x > @world.width then bouncer.x_dir = -1
            if pos.x < 0 then bouncer.x_dir = 1
            if pos.y > @world.height then bouncer.y_dir = -1
            if pos.y < 0 then bouncer.y_dir = 1
                
    class OrbiterSystem extends System
        match_component: C.Orbit

        constructor: () ->
            @v_orbited = new Vector2D()
            @v_orbiter = new Vector2D()

        update_match: (dt, eid, orbiter) ->
            pos = @world.entities.get(eid, C.MapPosition)
            o_pos = @world.entities.get(orbiter.orbited_id, C.MapPosition)

            @v_orbited.setValues(o_pos.x, o_pos.y)
            @v_orbiter.setValues(pos.x, pos.y)

            angle_delta = (dt / 1000) * orbiter.rad_per_sec
            @v_orbiter.rotateAround(@v_orbited, angle_delta)

            pos.x = @v_orbiter.x
            pos.y = @v_orbiter.y

    return {
        System, SpawnSystem, BouncerSystem, OrbiterSystem, RenderSystem
    }
