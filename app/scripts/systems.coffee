define ['components', 'underscore', 'pubsub'], (C, _, PubSub) ->

    class System
        constructor: (@game, @entity_manager) ->
        update: (t_delta) ->
            console.log "ABSTRACT UPDATE"

    class SpawnSystem extends System
        @MSG_SPAWN = 'spawn'
        update: (t_delta) ->
            spawns = @entity_manager.getComponentsByType(C.Spawn)
            for spawn in spawns when !spawn.spawned
                spawn.spawned = true
                PubSub.publish @constructor.MSG_SPAWN,
                    entity_id: spawn.entity_id

    class MapPositionSystem extends System

    class RenderSystem extends System

    return {
        SpawnSystem
    }
