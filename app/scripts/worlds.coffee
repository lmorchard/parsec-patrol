define [
    'utils', 'entities', 'components', 'systems', 'underscore', 'pubsub',
    'Stats'
], (
    Utils, Entities, Components, Systems, _, PubSub, Stats
) ->
    requestAnimationFrame = (window.requestAnimationFrame or
        window.webkitRequestAnimationFrame or
        window.mozRequestAnimationFrame    or
        window.oRequestAnimationFrame      or
        window.msRequestAnimationFrame     or
        (fn) -> setTimeout(fn, (1000/60)))

    class World
        debug: true
        tick_delay: 1000 / 60
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

            if @debug
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

            @t_last = Utils.now() - @tick_delay
            
            tick_loop = () =>
                @stats.begin()
                if not @is_paused
                    t_now = Utils.now()
                    t_delta = t_draw_delta = t_now - @t_last
                    @t_last = t_now
                    while t_delta > 0
                        @tick Math.min(t_delta, @tick_delay)
                        t_delta -= @tick_delay
                    @draw t_draw_delta

                if @is_running
                    requestAnimationFrame tick_loop

                @stats.end()

            requestAnimationFrame tick_loop

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
