define ['underscore'], (_) ->

    class System
        constructor: (@game, @entity_manager) ->
        update: (t_delta) ->

    class SpawnSystem extends System

    class MapPositionSystem extends System

    class RenderSystem extends System

    return {
    }
