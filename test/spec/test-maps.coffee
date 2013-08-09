define ['maps'], (Maps) ->

    suite 'Maps', () ->

        setup () ->
            return

        test 'Module should be defined', () ->
            assert.isDefined Maps

        test 'SectorMap should contain a grid for Entities', () ->
            [expected_width, expected_height] = size = [6, 9]
            map = new Maps.SectorMap size
            assert.equal map.entities.length, expected_height
            for row in map.entities
                assert.equal row.length, expected_width
                for entity in row
                    # Entity grid is initially empty, all cells null
                    assert.equal entity, null

        test 'ConstellationGrid should contain a grid of SpaceMaps', () ->
            [expected_width, expected_height] = size = [6, 9]
            grid = new Maps.ConstellationGrid size
            assert.equal grid.maps.length, expected_height
            for row in grid.maps
                assert.equal row.length, expected_width
                for map in row
                    # Having an entities list sounds like a SpaceMap
                    assert.isDefined map.entities.length

