define ['underscore', 'backbone'], (_, Backbone) ->

    class SpaceMap
        constructor: (@size=[8,8]) ->
            [@width, @height] = @size
            @entities = ((null for col_idx in [0..@width-1]) for row_idx in [0..@height-1])

    class SectorMap extends SpaceMap

    class GridOfMaps
        map_type: SpaceMap

        constructor: (@size=[8,8]) ->
            [@width, @height] = @size
            @maps = ((new @map_type for col_idx in [0..@width-1]) for row_idx in [0..@height-1])

    class ConstellationGrid extends GridOfMaps
        map_type: SectorMap

    return {
        SectorMap, ConstellationGrid
    }
