define ['games'], (Games) ->

    suite 'Games', () ->

        setup () ->
            return

        test 'Module should be defined', () ->
            assert.isDefined Games

        test 'A game should have a grid', () ->
            game = new Games.BasicGame
            assert.isDefined game.grid

