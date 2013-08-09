define ['underscore', 'backbone', 'maps'], (_, Backbone, Maps) ->

    class Game
        @tick_delay = 1000 / 60

        constructor: (@grid_size=[8,8]) ->
            @grid = new Maps.ConstellationGrid(this, @grid_size)
            @entities = []
            @ticks = 0
            @is_running = false
            @is_paused = false
            @is_stopping = false

        run: () ->

        stop: () ->

        pause: () ->

        tick: (t_delta) ->
            for entity in entities
                if not entity.is_active
                    entity.tick(t_delta)

    class BasicGame extends Game
        constructor: () ->
            super

    return {
        BasicGame
    }
