define ['components', 'entities'], (Components, Entities) ->

    suite 'Components', () ->

        setup () ->
            @em = new Entities.EntityManager

        test 'Module should be defined', () ->
            assert.isDefined Components
