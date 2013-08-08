define ['entities'], (entities) ->

    should = chai.should()
    assert = chai.assert

    suite 'entities', () ->

        setup () ->
            return

        test 'should be defined', () ->
            assert.isDefined entities
