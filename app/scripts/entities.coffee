define ['underscore', 'backbone', 'components'], (_, Backbone, C) ->

    class EntityManager
        curr_id = 0
        generateID = () -> curr_id++

        constructor: () ->
            @_by_type = {}
            @_by_entity = {}

        # Create an entity with the given components
        createEntity: (components=null) ->
            entity_id = generateID()
            @_by_entity[entity_id] = []
            entity = new EntityAccessor(this, entity_id)
            if components
                for c in components
                    @addComponentToEntity(entity_id, c)
            return entity

        # Add the given component to the entity
        addComponentToEntity: (entity_id, component) ->
            component.entity_manager = this
            component.entity_id = entity_id
            @_by_entity[entity_id].push(component)
            type = component.type
            @_by_type[type] or= []
            @_by_type[type].push(component)
            return this

        # Remove the given component from the entity_id
        removeComponentFromEntity: (entity_id, component) ->
            return false if not @hasEntity(entity_id)
            by_entity = @_by_entity[entity_id]
            idx = by_entity.indexOf(component)
            by_entity.splice(idx, 1) if idx != -1
            by_type = @_by_type[component.type]
            idx = by_type.indexOf(component)
            by_type.splice(idx, 1) if idx != -1

        # Destroy an entity and all its components by ID
        destroyEntity: (entity_id) ->
            return false if not @hasEntity(entity_id)
            components = @_by_entity[entity_id]
            delete @_by_entity[entity_id]
            for c in components
                by_type = @_by_type[c.type]
                idx = by_type.indexOf(c)
                by_type.splice(idx, 1) if idx  != -1
            return true

        # Determine whether this manager has this entity
        hasEntity: (entity_id) ->
            if not _.isNumber(entity_id)
                entity_id = entity_id.id
            entity_id of @_by_entity

        # Build an entity accessor, if we know of this entity ID
        getEntity: (entity_id) ->
            if @hasEntity(entity_id)
                new EntityAccessor(this, entity_id)
            else
                null

        # Shortcut to get the first named component from an entity
        getFirstComponentByEntity: (entity_id, type) ->
            if not _.isString(type)
                type = type.prototype.type
            for c in @_by_entity[entity_id]
                return c if c.type == type
            return null

        # Get a list of all components for an entity
        getComponentsByEntity: (entity_id) ->
            _.clone(@_by_entity[entity_id]) || []

        # Get a list of all components by type
        getComponentsByType: (type) ->
            if not _.isString(type)
                type = type.prototype.type
            _.clone(@_by_type[type]) || []


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
                new C.Spawn('center'),
                new C.MapPosition,
                new C.Sprite('star')
            ])

    class Asteroid extends Celestial
        @create: (em, name='unnamed') ->
            return em.createEntity([
                new C.TypeName('Asteroid'),
                new C.EntityName(name),
                new C.Spawn('random'),
                new C.MapPosition,
                new C.Sprite('asteroid')
            ])

    class Planet extends Celestial
        @create: (em, name='unnamed', sun) ->
            return em.createEntity([
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
