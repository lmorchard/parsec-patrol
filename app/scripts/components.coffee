define ['entities', 'underscore', 'backbone'], (Entities, _, Backbone) ->

    class Component
        type: 'AbstractComponent'
        entity_manager: null
        entity_id: null
        getEntity: () ->
            @entity_manager?.getEntity(@entity_id)
        find: (em) ->
            em.getComponentsByType(@type)
        toString: () ->
            "(#{@type} #{JSON.stringify(this)})"

    class TypeName extends Component
        type: 'TypeName'
        constructor: (@name) ->

    class EntityName extends Component
        type: 'EntityName'
        constructor: (@name) ->

    class MapPosition extends Component
        type: 'MapPosition'
        constructor: (@map, @x, @y, @rotation) ->
    
    class CenterSpawn extends Component
        type: 'CenterSpawn'

    class RandomSpawn extends Component
        type: 'RandomSpawn'

    class Renderable extends Component
        type: 'Renderable'

    return {
        Component, TypeName, EntityName, MapPosition, CenterSpawn, RandomSpawn,
        Renderable
    }
