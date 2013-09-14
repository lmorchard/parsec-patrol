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

    TARGET_FPS = 60
    TARGET_DURATION = 1000 / TARGET_FPS

    class World
        measure_fps: false
        tick_duration: TARGET_DURATION
        max_t_delta: TARGET_DURATION * 5
        ticks: 0

        constructor: (@width=640, @height=480, systems...) ->
            @id = Utils.generateID()

            @is_running = false
            @is_paused = false
            
            @inputs = {}
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

        draw: (t_delta) ->
            for s in @systems
                s.draw t_delta
            return true

        start: () ->
            return if @is_running
            @is_running = true

            @t_last = 0
            @accumulator = 0

            @tick_duration_sec = @tick_duration / 1000

            if @measure_fps
                @stats = new Stats()
                @stats.setMode(0)
                document.body.appendChild(@stats.domElement)

            run_loop = (ts) =>
                @stats.begin() if @measure_fps

                t_delta = Math.min(ts - @t_last, @max_t_delta)
                @t_last = ts

                @draw t_delta

                if not @is_paused
                    # Fixed-step game logic loop
                    # see: http://gafferongames.com/game-physics/fix-your-timestep/
                    @accumulator += t_delta
                    while @accumulator > @tick_duration
                        @tick @tick_duration_sec
                        @accumulator -= @tick_duration

                @stats.end() if @measure_fps

                if @is_running
                    requestAnimationFrame run_loop

            requestAnimationFrame run_loop

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
