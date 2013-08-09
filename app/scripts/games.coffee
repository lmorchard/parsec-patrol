define ['underscore', 'backbone', 'maps'], (_, Backbone, Maps) ->

    class Game
        constructor: (@grid_size=[8,8]) ->
            @grid = new Maps.ConstellationGrid(@grid_size)

    class BasicGame extends Game
        constructor: () ->
            super

    return {
        BasicGame
    }
