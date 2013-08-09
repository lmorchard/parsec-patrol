define ['underscore', 'backbone', 'components'], (_, Backbone, C) ->

    curr_id = 0
    generateID = () -> curr_id++

    class EntityManager
        constructor: () ->
            @components_by_type = {}
            @components_by_entity = {}

        createEntity: (components) ->
            entity_id = generateID()
            @components_by_entity[entity_id] = components
            for component in components
                type = component.type
                if not @components_by_type[type]
                    @components_by_type[type] = []
                @components_by_type[type].push(component)
            return entity_id

        destroyEntity: (entity_id) ->
            return false if not this.hasEntity(entity_id)
            components = this.components_by_entity[entity_id]
            delete @components_by_entity[entity_id]
            for c in components
                by_type = @components_by_type[c.type]
                idx = by_type.indexOf c
                if idx  != -1
                    by_type.splice(idx, 1)

        hasEntity: (entity_id) ->
            return _.isArray(@components_by_entity[entity_id])

        # Shortcut to get the first named component from an entity
        get: (entity_id, component_type) ->
            by_entity = @components_by_entity[entity_id]
            return null if not by_entity
            for c in by_entity
                if c.type == component_type
                    return c
            return null

        # Get a list of all components for an entity
        getComponentsByEntity: (entity_id) ->
            _.clone(@components_by_entity[entity_id])

        # Get a list of all components by type
        getComponentsByType: (type) ->
            _.clone(@components_by_type[type])


    class EntityTemplate
        @GARGLE: 'EET POO'
        @create: (entity_manager) ->
            eid = entity_manager.createEntity([])
            return eid

    class SpaceEntity extends EntityTemplate

    class Celestial extends SpaceEntity

    class Star extends Celestial
        @create: (em, name='unnamed') ->
            return em.createEntity([
                new C.TypeName('Star'),
                new C.EntityName(name),
                new C.CenterSpawn
            ])

    class Asteroid extends Celestial
        @create: (em, name='unnamed') ->
            return em.createEntity([
                new C.TypeName('Asteroid'),
                new C.EntityName(name),
                new C.RandomSpawn
            ])

    class Planet extends Celestial
        @create: (em, name='unnamed') ->
            return em.createEntity([
                new C.TypeName('Planet'),
                new C.EntityName(name),
                new C.RandomSpawn
            ])

    return {
        EntityManager, Star, Asteroid, Planet
    }
