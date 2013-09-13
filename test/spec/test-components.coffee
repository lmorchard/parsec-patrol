define [
    'components', 'entities', 'worlds', 'underscore'
], (
    Components, Entities, Worlds, _
) ->
    [C, E, W] = [Components, Entities, Worlds]

    suite 'Components', () ->
        
        setup () ->
            @world = new Worlds.World

        test 'Module should be defined', () ->
            assert.isDefined Components
