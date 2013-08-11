define ['worlds', 'systems', 'components'], (Worlds, Systems, C) ->

    suite 'Worlds', () ->

        setup () ->
            return

        test 'Module should be defined', () ->
            assert.isDefined Worlds
