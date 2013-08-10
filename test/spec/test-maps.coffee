define ['worlds', 'maps'], (Worlds, Maps) ->

    suite 'Maps', () ->

        setup () ->
            return

        test 'Module should be defined', () ->
            assert.isDefined Maps

        ###
        test 'ConstellationGrid should contain a grid of SpaceMaps', () ->
            [expected_width, expected_height] = size = [6, 9]
            game = new Games.BasicGame
            grid = new Maps.ConstellationGrid game, size
            assert.equal grid.maps.length, expected_height
            for row in grid.maps
                assert.equal row.length, expected_width
                for map in row
                    # Having an entities list sounds like a SpaceMap
                    assert.isDefined map.entities.length
        ###
