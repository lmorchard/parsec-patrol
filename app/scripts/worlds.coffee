define [
    'utils', 'entities', 'components', 'systems', 'underscore', 'pubsub',
    #'Stats'
], (
    Utils, Entities, Components, Systems, _, PubSub#, Stats
) ->
    requestAnimationFrame = (window.requestAnimationFrame or
        window.webkitRequestAnimationFrame or
        window.mozRequestAnimationFrame    or
        window.oRequestAnimationFrame      or
        window.msRequestAnimationFrame     or
        (fn) -> setTimeout(fn, (1000/60)))

    class World
        debug: true
        tick_duration: Math.floor(1000 / 60)
        max_ticks_per_loop: 10,
        ticks: 0
        t_last: 0

        constructor: (@width=640, @height=480, systems...) ->
            @id = Utils.generateID()

            @is_running = false
            @is_paused = false
            
            @inputs = {}
            @entities = new Entities.EntityManager
            @systems = []
            @addSystem(systems...)

            if false and @debug
                @stats = new Stats()
                @stats.setMode(0)
                document.body.appendChild(@stats.domElement)

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

        draw: (t_delta) ->
            for s in @systems
                s.draw t_delta
            return true

        start: () ->
            return if @is_running
            @is_running = true

            @t_last = Utils.now()
            tick_loop = () =>
            
                t_now = Utils.now()
                t_delta = t_now - @t_last
                @t_last = t_now

                if not @is_paused
                    @tick t_delta
                    if false
                        # TODO: Fixed-step game logic frames, with an
                        # accumulator to trigger fill-in frames that don't
                        # exactly match real timing.
                        steps = Math.min((t_delta / @tick_duration),
                                         @max_ticks_per_loop)
                        for step in [1..steps]
                            @tick @tick_duration

                if not @is_running
                    cancelInterval(@interval_id)

            # TODO: Use a variable setTimeout instead? in case game logic time
            # takes more than @tick_duration, maybe adjust tick_duration?
            @interval_id = setInterval tick_loop, @tick_duration

            @t_last_ts = 0
            draw_loop = (ts) =>
                #@stats.begin() if @debug
                t_delta = ts - @t_last_ts
                @t_last_ts = ts
                @draw t_delta
                #@stats.end() if @debug
                requestAnimationFrame draw_loop

            requestAnimationFrame draw_loop

        stop: () ->
            @is_running = false

        pause: () ->
            @is_paused = true

        unpause: () ->
            @t_last = Utils.now() - @tick_duration
            @is_paused = false

    class BasicWorld extends World
        constructor: () ->
            super

    return {
        World, BasicWorld
    }
