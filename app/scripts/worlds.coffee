define [
    'utils', 'entities', 'components', 'systems', 'underscore', 'pubsub'
], (
    Utils, Entities, Components, Systems, _, PubSub
) ->

    class World
        tick_delay: 1000 / 60
        ticks: 0
        t_last: 0

        constructor: (@width=640, @height=480, systems) ->
            @id = Utils.generateID()

            @is_running = false
            @is_paused = false
            
            @entities = new Entities.EntityManager
            @systems = []
            @addSystem(systems...)

        _psPrefix: (msg=null) ->
            msg = if not msg then '' else ".#{msg}"
            "worlds.#{@id}#{msg}"

        subscribe: (msg, handler) ->
            PubSub.subscribe(@_psPrefix(msg), handler)

        publish: (msg, data) ->
            PubSub.publish(@_psPrefix(msg), data)

        unsubscribe: (thing) ->
            PubSub.unsubscribe(thing)

        addSystem: (to_add...) ->
            for system in to_add
                system.setWorld(@)
                @systems.push(system)
            return @

        removeSystem: (system) ->
            system.world = null
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

            @t_last = Utils.now() - @tick_delay
            
            tick_loop = () =>
                if not @is_paused
                    t_now = Utils.now()
                    @tick t_now - @t_last
                    @t_last = t_now
                if @is_running
                    setTimeout tick_loop, @tick_delay

            setTimeout tick_loop, 0.1

        stop: () ->
            @is_running = false

        pause: () ->
            @is_paused = true

        unpause: () ->
            @t_last = Utils.now() - @tick_delay
            @is_paused = false

    class BasicWorld extends World
        constructor: () ->
            super

    return {
        World, BasicWorld
    }
