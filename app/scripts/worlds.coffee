define [
    'utils', 'entities', 'components', 'systems', 'underscore', 'pubsub'
], (
    Utils, Entities, Components, Systems, _, PubSub
) ->

    class World
        tick_delay: 1000 / 60
        ticks: 0
        t_last: 0

        width: 640
        height: 480

        constructor: () ->
            @id = Utils.generateID()
            @is_running = false
            @is_paused = false
            @systems = []
            @entities = new Entities.EntityManager

            PubSub.subscribe "worlds.#{@id}", (msg, data) ->
                console.log "WORLD #{msg} #{JSON.stringify(data)}"

        _pubsubPrefix: (msg) -> "worlds.#{@id}.#{msg}"

        subscribe: (msg, handler) ->
            PubSub.subscribe(@_pubsubPrefix(msg), handler)

        publish: (msg, data) ->
            PubSub.publish(@_pubsubPrefix(msg), data)

        unsubscribe: (thing) ->
            PubSub.unsubscribe(thing)

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
            @t_last = Utils.now() - @tick_delay
            tick_loop = () =>
                if not @is_paused
                    t_now = Utils.now()
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
            @t_last = Utils.now() - @tick_delay
            @is_paused = false

    class BasicWorld extends World
        constructor: () ->
            super

    return {
        World, BasicWorld
    }
