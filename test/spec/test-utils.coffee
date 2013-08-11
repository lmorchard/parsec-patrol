define ['utils', 'underscore'], (Utils, _) ->

    suite 'Utils', () ->

        setup () ->

        test 'Module should be defined', () ->
            assert.isDefined Utils

        test 'Utils.generateID should generate unique IDs', () ->
            ids = (Utils.generateID() for idx in [0..5])
            for i1 in [0..ids.length-1]
                for i2 in [0..ids.length-2]
                    continue if i1 == i2
                    assert.ok(ids[i1] isnt ids[i2])

        test 'Utils.now() should report the current time in ms', () ->
            t_now = Utils.now()
            assert.ok(_.isNumber(t_now))
