define ['components', 'utils', 'underscore', 'QuadTree'], (C, Utils, _, QuadTree) ->

    class EntityManager

        constructor: (@width=1000, @height=1000) ->
            @reset()

        reset: () ->
            @store = {}
            @max_eid = 0
            @max_gid = 0
            @entities_by_group = {}
            @groups_by_entity = {}
            @quadtrees = {}

        load: (data) ->
            @reset()

            for eid, c_data of data.entities
                components = @loadComponents(c_data)
                @put(eid, components...)

            for gid, eids of data.groups
                @addToGroup(gid, eids...)

            @max_eid = data.max_eid || 0
            @max_gid = data.max_gid || 0

        loadComponents: (c_data) ->
            components = []
            for name, props of c_data
                components.push(new C[name](props))
            return components

        save: () ->
            data = {
                @max_eid, @max_gid,
                groups: {},
                entities: {},
            }
            for gid, eids of @entities_by_group
                data.groups[gid] = _.keys(eids)
            for type, by_eid of @store
                for eid, component of by_eid
                    data.entities[eid] ?= {}
                    data.entities[eid][type] = _.clone(component)
            
            return data

        # Create an entity with the given components
        create: (components...) ->
            return @put(@max_eid++, components...)

        # Store a collection of components with given ID
        put: (entity_id, components...) ->
            for c in components
                @addComponent(entity_id, c)
            return entity_id

        # Destroy an entity and all its components by ID
        destroy: (entity_id) ->
            gid = @groupForEntity(entity_id)
            if gid isnt null
                @removeFromGroup(gid, entity_id)
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
                return @store[components[0].defaults.type]?[entity_id]
            else if components.length > 1
                out = []
                for c in components
                    out.push @store[c.defaults.type]?[entity_id]
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
            @store[component.defaults.type] || {}

        createGroup: (entities...) ->
            @entities_by_group[id = ++@max_gid] = {}
            if entities.length > 0
                @addToGroup(id, entities...)
            return id

        addToGroup: (group_id, entities...) ->
            if not (group_id of @entities_by_group)
                @entities_by_group[group_id] = {}
            for entity_id in entities
                @entities_by_group[group_id][entity_id] = 1
                @groups_by_entity[entity_id] = group_id

        removeFromGroup: (group_id, entity_id) ->
            if not @groupHasEntity(group_id, entity_id)
                return false
            delete @entities_by_group[group_id][entity_id]
            delete @groups_by_entity[entity_id]

        groupForEntity: (entity_id) ->
            return @groups_by_entity[entity_id]

        groupHasEntity: (group_id, entity_id) ->
            if not (group_id of @entities_by_group)
                return false
            return entity_id of @entities_by_group[group_id]

        entitiesForGroup: (group_id) ->
            if not (group_id of @entities_by_group)
                return []
            return @entities_by_group[group_id]

        update: (t_delta) ->
            @updateQuadtrees()

        updateQuadtrees: () ->
            for gid of @entities_by_group
                @updateQuadtree(gid)

        updateQuadtree: (gid) ->
            if @quadtrees[gid]
                qt = @quadtrees[gid]
                qt.clear()
            else
                qt = @quadtrees[gid] = new QuadTree({
                    x: 0 - @width / 2,
                    y: 0 - @height / 2,
                    width: @width,
                    height: @height
                }, false)

            for eid, ignore of @entities_by_group[gid]
                
                spawn = @store.Spawn[eid]
                continue if not spawn or (spawn.destroy) or (not spawn.spawned)
                
                sprite = @store.Sprite[eid]
                continue if not sprite

                collidable = @store.Collidable[eid]
                pos = @store.Position[eid]
                qt.insert({
                    eid: eid,
                    x: pos.x,
                    y: pos.y,
                    width: sprite.width,
                    height: sprite.height,
                    collidable: collidable,
                    pos: pos,
                    sprite: sprite
                })

    class EntityTemplate
        @create: (entity_manager) ->
            return entity_manager.create()

    class SpaceEntity extends EntityTemplate

    class Celestial extends SpaceEntity

    class Star extends Celestial
        @create: (em, name='unnamed') -> em.create(
            new C.TypeName('Star'),
            new C.EntityName(name),
            new C.Spawn('center'),
            new C.Position,
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
        EntityManager, Star, Asteroid, Planet
    }
