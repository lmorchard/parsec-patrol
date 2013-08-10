define ['components', 'underscore', 'pubsub'], (C, _, PubSub) ->

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
            spawns = @entity_manager.getComponentsByType(C.Spawn)
            for spawn in spawns when !spawn.spawned

                pos = spawn.getEntity().get(C.MapPosition)
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

    class OrbiterSystem extends System
        pixels_per_sec: 5,

        update: (t_delta) ->
            p_delta = (t_delta / 1000) * @pixels_per_sec
            orbiters = @entity_manager.getComponentsByType(C.Orbit)
            for orbiter in orbiters
                pos = orbiter.getEntity().get(C.MapPosition)
                pos.x += p_delta
                pos.y += p_delta

    class RenderSystem extends System

        constructor: (@canvas) ->
            @ctx = @canvas.getContext('2d')

        update: (t_delta) ->

            @ctx.save()
            @ctx.clearRect(0, 0, @canvas.width, @canvas.height)
            @ctx.fillStyle = "#000"
            @ctx.fillRect(0, 0, @canvas.width, @canvas.height)
            @ctx.restore()

            sprites = @entity_manager.getComponentsByType(C.Sprite)
            for sprite in sprites
                pos = sprite.getEntity().get(C.MapPosition)
                
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

    class MapPositionSystem extends System

    return {
        System, SpawnSystem, OrbiterSystem, MapPositionSystem, RenderSystem
    }
