define ['entities', 'components', 'underscore'], (Entities, C, _) ->

    suite 'Entities', () ->

        setup () ->
            @em = new Entities.EntityManager
            @entity_0 = @em.createEntity()
                .add(new C.TypeName('test0'))
                .add(new C.MapPosition(null, 4, 8))

        test 'Module should be defined', () ->
            assert.isDefined Entities

        test "entity.get() should give quick access to a component", () ->
            mp = @entity_0.get(C.MapPosition)
            assert.equal(mp.x, 4)
            assert.equal(mp.y, 8)

        test "entity.add() should add a component to an entity", () ->
            expected_name = 'My Test 0'
            c = new C.EntityName(expected_name)
            @entity_0.add(c)
            en = @entity_0.get(C.EntityName)
            assert.equal(en.name, expected_name)
            
        test "entity.remove() should remove a component from an entity", () ->
            c = new C.EntityName("Blah blah")
            @entity_0.add(c)
            @entity_0.remove(c)
            en = @entity_0.get(C.EntityName)
            assert.equal(en, null)

        test "create/destroyEntity should properly manage component indexes", () ->
            components = [
                new C.TypeName('test1'),
                new C.MapPosition(null, 4, 8)
            ]

            entity_1 = @em.createEntity(components)

            assert.ok(@em.hasEntity(@entity_0))
            assert.ok(@em.hasEntity(entity_1))
            for c in components
                assert.ok(c in entity_1.components())
                assert.ok(c in @em.getComponentsByType(c.type))

            entity_1.destroy()

            assert.ok(@em.hasEntity(@entity_0))
            assert.ok(not @em.hasEntity(entity_1))
            for c in components
                assert.ok(_.isUndefined(entity_1.components()))
                assert.ok(not (c in @em.getComponentsByType(c.type)))
