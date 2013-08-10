define [
    'entities', 'components', 'systems', 'underscore'
], (
    Entities, Components, Systems, _
) ->

    class World
        @tick_delay = 1000 / 60

        constructor: () ->
            @entity_manager = new Entities.EntityManager
            @systems = []

        tick: (t_delta) ->
            for s in @systems
                s.update t_delta

        run: () ->

        stop: () ->

        pause: () ->

    class BasicWorld extends World
        constructor: () ->
            super

    return {
        World, BasicWorld
    }
