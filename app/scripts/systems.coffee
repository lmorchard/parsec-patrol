define ['components', 'underscore', 'pubsub', 'Vector2D'], (C, _, PubSub, Vector2D) ->

    class System
        world: null,
        entity_manager: null,
        setWorld: (world) ->
            @world = world
            @entity_manager = world.entity_manager
        update: (t_delta) ->

    class SpawnSystem extends System
        @MSG_SPAWN = 'spawn'
        update: (t_delta) ->
            spawns = @entity_manager.getComponents(C.Spawn)
            for eid, spawn of spawns when !spawn.spawned
                if @world
                    pos = @entity_manager.get(eid, C.MapPosition)
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
                PubSub.publish @constructor.MSG_SPAWN,
                    entity_id: spawn.entity_id

    class RenderSystem extends System

        constructor: (@canvas) ->
            @ctx = @canvas.getContext('2d')

        update: (t_delta) ->

            @ctx.save()
            #@ctx.clearRect(0, 0, @canvas.width, @canvas.height)
            @ctx.fillStyle = "#000"
            @ctx.fillRect(0, 0, @canvas.width, @canvas.height)
            @ctx.restore()

            sprites = @entity_manager.getComponents(C.Sprite)
            for eid, sprite of sprites
                pos = @entity_manager.get(eid, C.MapPosition)
                
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
        update: (dt) ->
            bouncers = @entity_manager.getComponents(C.Bouncer)
            for eid, bouncer of bouncers
                pos = @entity_manager.get(eid, C.MapPosition)

                if pos.x > @world.width
                    bouncer.x_dir = -1
                if pos.x < 0
                    bouncer.x_dir = 1

                if pos.y > @world.height
                    bouncer.y_dir = -1
                if pos.y < 0
                    bouncer.y_dir = 1

                pos.x += bouncer.x_dir * ((dt/1000) * bouncer.x_sec)
                pos.y += bouncer.y_dir * ((dt/1000) * bouncer.y_sec)
                
    class OrbiterSystem extends System

        constructor: () ->
            @v_orbited = new Vector2D()
            @v_orbiter = new Vector2D()

        update: (dt) ->
            orbiters = @entity_manager.getComponents(C.Orbit)
            for eid, orbiter of orbiters
                pos = @entity_manager.get(orbiter.entity_id, C.MapPosition)
                o_pos = @entity_manager.get(orbiter.orbited_entity_id,
                                            C.MapPosition)

                @v_orbited.setValues(o_pos.x, o_pos.y)
                @v_orbiter.setValues(pos.x, pos.y)

                angle_delta = (dt / 1000) * orbiter.rad_per_sec
                @v_orbiter.rotateAround(@v_orbited, angle_delta)

                pos.x = @v_orbiter.x
                pos.y = @v_orbiter.y

    return {
        System, SpawnSystem, BouncerSystem, OrbiterSystem, RenderSystem
    }
