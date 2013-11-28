define [
    'utils', 'entities', 'components', 'systems', 'underscore', 'pubsub',
    'Stats', 'QuadTree'
], (
    Utils, Entities, Components, Systems, _, PubSub, Stats, QuadTree
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

        constructor: (@width=640, @height=480, systems...) ->
            @id = Utils.generateID()

            @is_running = false
            @is_paused = false
            
            @inputs = {}
            @entities = new Entities.EntityManager(@width, @height)
            @systems = []
            @msg_subscribers = {}
            @addSystem(systems...)

        _psPrefix: (msg=null) ->
            msg = if not msg then '' else ".#{msg}"
            "worlds.#{@id}#{msg}"

        subscribe: (msg, handler) ->
            (@msg_subscribers[msg] ?= []).push(handler)
            #PubSub.subscribe(@_psPrefix(msg), handler)

        publish: (msg, data) ->
            return if not @msg_subscribers[msg]
            for handler in @msg_subscribers[msg]
                handler(msg, data)
            #PubSub.publish(@_psPrefix(msg), data)

        unsubscribe: (thing) ->
            #PubSub.unsubscribe(thing)

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
            @entities.update(t_delta)
            for s in @systems
                s.update t_delta
            return @

        draw: (t_delta) ->
            for s in @systems
                s.draw t_delta
            return @

        load: (data) ->
            @entities.load(data)
            @current_scene = data.current_scene
            return @

        save: (data) ->
            data = @entities.save()
            data.current_scene = @current_scene
            return data

        start: () ->
            return if @is_running
            @is_running = true

            @t_draw_last = 0
            @t_game_last = 0
            @accumulator = 0

            @tick_duration_sec = @tick_duration / 1000

            if @measure_fps
                @stats = new Stats()
                @stats.setMode(0)
                document.body.appendChild(@stats.domElement)

            run_draw_loop = (ts) =>
                @stats.begin() if @measure_fps
                t_delta = Math.min(ts - @t_draw_last, @max_t_delta)
                @t_draw_last = ts
                @draw t_delta
                @stats.end() if @measure_fps
                if @is_running
                    requestAnimationFrame run_draw_loop

            requestAnimationFrame run_draw_loop

            # See also: http://www.chandlerprall.com/2012/06/requestanimationframe-is-not-your-logics-friend/
            @t_game_last = Date.now()
            run_game_loop = () =>
                t_delta = Math.min(Date.now() - @t_game_last, @max_t_delta)
                @t_game_last = Date.now()
                if not @is_paused
                    # Fixed-step game logic loop
                    # see: http://gafferongames.com/game-physics/fix-your-timestep/
                    @accumulator += t_delta
                    while @accumulator > @tick_duration
                        @tick @tick_duration_sec
                        @accumulator -= @tick_duration
                if @is_running
                    setTimeout run_game_loop, @tick_duration

            setTimeout run_game_loop, @tick_duration

            return @

        stop: () ->
            @is_running = false
            return @

        pause: () ->
            @is_paused = true
            return @

        unpause: () ->
            @is_paused = false
            return @

    class BasicWorld extends World
        constructor: () ->
            super

    return {
        World, BasicWorld
    }
