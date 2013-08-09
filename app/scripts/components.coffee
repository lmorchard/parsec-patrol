define ['underscore', 'backbone'], (_, Backbone) ->

    class Component
        type: 'AbstractComponent'

    class TypeName extends Component
        type: 'TypeName'
        constructor: (@name) ->

    class EntityName extends Component
        type: 'EntityName'
        constructor: (@name) ->

    class MapPosition extends Component
        type: 'MapPosition'
        constructor: (@map, @x, @y) ->
    
    class CenterSpawn extends Component
        type: 'CenterSpawn'

    class RandomSpawn extends Component
        type: 'RandomSpawn'

    class Renderable extends Component
        type: 'Renderable'

    return {
        Component, TypeName, MapPosition, Renderable
    }
