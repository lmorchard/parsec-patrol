define ['components', 'utils', 'underscore'], (C, Utils, _) ->

    class EntityManager

        constructor: () ->
            # Component store, indexed by @store[component][entity]
            @store = {}

        # Create an entity with the given components
        create: (components...) ->
            entity_id = Utils.generateID()
            for c in components
                @addComponent(entity_id, c)
            return entity_id

        # Destroy an entity and all its components by ID
        destroy: (entity_id) ->
            for type, by_entity of @store
                if entity_id of by_entity
                    delete by_entity[entity_id]
            return @
        
        # Determine whether this manager has this entity
        has: (entity_id) ->
            for type, by_entity of @store
                if entity_id of by_entity
                    return true
            return false

        # Get a list of all components for an entity
        get: (entity_id, components...) ->
            if components.length is 1
                return @store[components[0].prototype.type]?[entity_id]
            else if components.length > 1
                out = []
                for c in components
                    out.push @store[c.prototype.type]?[entity_id]
                return out
            else
                out = {}
                for type, by_entity of @store
                    if entity_id of by_entity
                        out[type] = by_entity[entity_id]
                return out

        # Add the given component to the entity
        addComponent: (entity_id, components...) ->
            for component in components
                type = component.type
                @store[type] ?= {}
                @store[type][entity_id] = component
            return @

        # Remove the given component from the entity_id
        removeComponent: (entity_id, components...) ->
            for component in components
                delete @store[component.type][entity_id]
            return @

        # Get a by-entity map of all components by type
        getComponents: (component) ->
            @store[component.prototype.type] || {}

    class EntityTemplate
        @create: (entity_manager) ->
            return entity_manager.create()

    class Scene extends EntityTemplate
        @create: (em, name='unnamed', entities...) -> em.create(
            new C.TypeName('Scene'),
            new C.EntityName(name),
            new C.EntityGroup(entities...)
        )

    class SpaceEntity extends EntityTemplate

    class Celestial extends SpaceEntity

    class Star extends Celestial
        @create: (em, name='unnamed') -> em.create(
            new C.TypeName('Star'),
            new C.EntityName(name),
            new C.Spawn('center'),
            new C.Position,
            # new C.Bouncer(),
            new C.Sprite('star')
        )

    class Asteroid extends Celestial
        @create: (em, name='unnamed') -> em.create(
            new C.TypeName('Asteroid'),
            new C.EntityName(name),
            new C.Spawn('random'),
            new C.Position,
            new C.Sprite('asteroid')
        )

    class Planet extends Celestial
        @create: (em, name='unnamed', sun) -> em.create(
            new C.TypeName('Planet'),
            new C.EntityName(name),
            new C.Spawn('random'),
            new C.Position,
            new C.Orbit(sun),
            new C.Sprite('planet')
        )

    return {
        EntityManager, Scene, Star, Asteroid, Planet
    }
