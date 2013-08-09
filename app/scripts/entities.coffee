define ['underscore', 'backbone', 'components'], (_, Backbone, C) ->

    class EntityManager
        curr_id = 0
        generateID = () -> curr_id++

        constructor: () ->
            @components_by_type = {}
            @components_by_entity = {}

        # Create an entity with the given components
        createEntity: (components=null) ->
            entity_id = generateID()
            @components_by_entity[entity_id] = []
            entity = new EntityAccessor(this, entity_id)
            if components
                entity.add(c) for c in components
            return entity

        # Add the given component to the entity
        addComponentToEntity: (entity_id, component) ->
            @components_by_entity[entity_id].push(component)
            type = component.type
            if not @components_by_type[type]
                @components_by_type[type] = []
            @components_by_type[type].push(component)
            return this

        # Remove the given component from the entity_id
        removeComponentFromEntity: (entity_id, component) ->
            return false if not this.hasEntity(entity_id)
            by_type = @components_by_type[component.type]
            idx = by_type.indexOf(component)
            by_type.splice(idx, 1) if idx != -1
            by_entity = @components_by_entity[entity_id]
            idx = by_entity.indexOf(component)
            by_entity.splice(idx, 1) if idx != -1

        # Destroy an entity and all its components by ID
        destroyEntity: (entity_id) ->
            return false if not this.hasEntity(entity_id)
            components = this.components_by_entity[entity_id]
            delete @components_by_entity[entity_id]
            for c in components
                by_type = @components_by_type[c.type]
                idx = by_type.indexOf(c)
                if idx  != -1
                    by_type.splice(idx, 1)

        # Determine whether this manager has this entity
        hasEntity: (entity_id) ->
            if not _.isNumber(entity_id)
                entity_id = entity_id.id
            return _.isArray(@components_by_entity[entity_id])

        # Build an entity accessor, if we know of this entity ID
        getEntity: (entity_id) ->
            return null if not self.hasEntity(entity_id)
            return new EntityAccessor(this, entity_id)

        # Shortcut to get the first named component from an entity
        getFirstComponentByEntity: (entity_id, type) ->
            if not _.isString(type)
                type = type.prototype.type
            by_entity = this.getComponentsByEntity(entity_id)
            for c in by_entity
                return c if c.type == type
            return null

        # Get a list of all components for an entity
        getComponentsByEntity: (entity_id) ->
            _.clone(@components_by_entity[entity_id])

        # Get a list of all components by type
        getComponentsByType: (type) ->
            if not _.isNumber(entity_id)
                entity_id = entity_id.id
            _.clone(@components_by_type[type])


    # Thin convenience wrapper around entity IDs
    class EntityAccessor
        constructor: (@manager, @id) ->
        destroy: () ->
            @manager.destroyEntity(@id)
        components: () ->
            @manager.getComponentsByEntity(@id)
        get: (type) ->
            @manager.getFirstComponentByEntity(@id, type)
        add: (component) ->
            @manager.addComponentToEntity(@id, component)
            return this
        remove: (component) ->
            @manager.removeComponentFromEntity(@id, component)
            return this


    class EntityTemplate
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
