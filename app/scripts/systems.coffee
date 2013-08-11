define ['components', 'underscore', 'pubsub', 'Vector2D'], (C, _, PubSub, Vector2D) ->

    class System
        world: null
        entities: null
        match_component: null
        
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
                    when 'random'
                        pos.x = _.random(0, @world.width)
                        pos.y = _.random(0, @world.height)
                    when 'center'
                        pos.x = @world.width / 2
                        pos.y = @world.height / 2
                    else
                        pos.x = pos.y = 0

            spawn.spawned = true
            @world.publish @constructor.MSG_SPAWN,
                entity_id: eid, spawn: spawn

    class RenderSystem extends System
        match_component: C.Sprite

        constructor: (@canvas) ->
            @ctx = @canvas.getContext('2d')

        update: (t_delta) ->
            @ctx.save()
            @ctx.fillStyle = "#000"
            @ctx.fillRect(0, 0, @canvas.width, @canvas.height)
            @ctx.restore()
            super t_delta

        update_match: (t_delta, eid, sprite) ->
            pos = @world.entities.get(eid, C.MapPosition)
            
            @ctx.save()

            switch sprite.shape
                when 'star'
                    @ctx.fillStyle = "#fff"
                    @ctx.beginPath()
                    @ctx.arc(pos.x, pos.y, 5, 0, Math.PI*2, true)
                    @ctx.fill()
                else
                    @ctx.strokeStyle = "#fff"
                    @ctx.beginPath()
                    @ctx.arc(pos.x, pos.y, 5, 0, Math.PI*2, true)
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
