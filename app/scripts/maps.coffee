define ['underscore', 'entities'], (_, Entities) ->

    class SpaceMap
        constructor: (@grid, @size=[320,320]) ->
            @entities = []

        spawn: (entity) ->
            @entities.push(entity)

    class SystemMap extends SpaceMap
        constructor: (@grid, @size=[320,320], @stars=1, @min_planets=1,
                      @max_planets=15) ->
            super
            #this.spawn(new Entities.Star this)
            #num_planets = _.random(@min_planets, @max_planets)
            #for idx in [1..num_planets]
            #    this.spawn(new Entities.Planet this)


    class GridOfMaps
        map_type: SpaceMap
        constructor: (@game, @size=[8,8]) ->
            [width, height] = @size
            @maps = for row_idx in [1..height]
                new @map_type this for col_idx in [1..width]

    class ConstellationGrid extends GridOfMaps
        map_type: SystemMap
        constructor: (@game, @size=[8,8]) ->
            super

    return {
        SystemMap, ConstellationGrid
    }
