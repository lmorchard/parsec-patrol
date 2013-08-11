define [
    'entities', 'components', 'systems', 'underscore'
], (
    Entities, Components, Systems, _
) ->

    now = () -> (new Date).getTime()

    class World
        tick_delay: 1000 / 60
        ticks: 0
        t_last: 0

        width: 640
        height: 480

        constructor: () ->
            @is_running = false
            @is_paused = false
            @entity_manager = new Entities.EntityManager
            @systems = []

        addSystem: (system) ->
            system.setWorld(this)
            @systems.push(system)
            return this

        removeSystem: (system) ->
            @systems.splice(@systems.indexOf(system), 1)
            return this

        tick: (t_delta) ->
            @ticks++
            for s in @systems
                s.update t_delta
            return true

        start: () ->
            return if @is_running
            @is_running = true
            @t_last = now() - @tick_delay
            tick_loop = () =>
                if not @is_paused
                    t_now = now()
                    @tick t_now - @t_last
                    @t_last = t_now
                if @is_running
                    setTimeout tick_loop, @tick_delay
            tick_loop()

        stop: () ->
            @is_running = false

        pause: () ->
            @is_paused = true

        unpause: () ->
            @t_last = now() - @tick_delay
            @is_paused = false

    class BasicWorld extends World
        constructor: () ->
            super

    return {
        World, BasicWorld
    }
