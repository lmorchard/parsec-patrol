define ['underscore', 'backbone', 'components'], (_, Backbone, C) ->

    class EntityManager
        curr_id = 0
        generateID = () -> curr_id++

        constructor: () ->
            @_by_type = {}
            @_by_entity = {}

        # Create an entity with the given components
        create: (components=[]) ->
            entity_id = generateID()
            for c in components
                @addComponent(entity_id, c)
            return entity_id

        # Destroy an entity and all its components by ID
        destroy: (entity_id) ->
            return @ if not @has(entity_id)
            delete @_by_entity[entity_id]
            for type, entities of @_by_type
                if entity_id of entities
                    delete entities[entity_id]
            return @
        
        # Determine whether this manager has this entity
        has: (entity_id) ->
            if not _.isNumber(entity_id)
                entity_id = entity_id.id
            return entity_id of @_by_entity

        # Get a list of all components for an entity
        get: (entity_id, component=null) ->
            if component
                @_by_entity[entity_id]?[component.prototype.type]
            else
                @_by_entity[entity_id]

        # Add the given component to the entity
        addComponent: (entity_id, component) ->
            type = component.type
            @_by_type[type] ?= {}
            @_by_type[type][entity_id] = component
            @_by_entity[entity_id] ?= {}
            @_by_entity[entity_id][type] = component
            return @

        # Remove the given component from the entity_id
        removeComponent: (entity_id, component) ->
            if @has(entity_id)
                type = component.type
                delete @_by_entity[entity_id][type]
                delete @_by_type[type][entity_id]
            return @

        # Get a list of all components by type
        getComponents: (component) ->
            @_by_type[component.prototype.type] || {}

    class EntityTemplate
        @create: (entity_manager) ->
            eid = entity_manager.create([])
            return eid

    class SpaceEntity extends EntityTemplate

    class Celestial extends SpaceEntity

    class Star extends Celestial
        @create: (em, name='unnamed') ->
            return em.create([
                new C.TypeName('Star'),
                new C.EntityName(name),
                new C.Spawn('center'),
                new C.MapPosition,
                new C.Bouncer(),
                new C.Sprite('star')
            ])

    class Asteroid extends Celestial
        @create: (em, name='unnamed') ->
            return em.create([
                new C.TypeName('Asteroid'),
                new C.EntityName(name),
                new C.Spawn('random'),
                new C.MapPosition,
                new C.Sprite('asteroid')
            ])

    class Planet extends Celestial
        @create: (em, name='unnamed', sun) ->
            return em.create([
                new C.TypeName('Planet'),
                new C.EntityName(name),
                new C.Spawn('random'),
                new C.MapPosition,
                new C.Orbit(sun),
                new C.Sprite('planet')
            ])

    return {
        EntityManager, Star, Asteroid, Planet
    }
