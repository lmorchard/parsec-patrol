define ['entities', 'components', 'underscore'], (Entities, C, _) ->

    suite 'Entities', () ->

        setup () ->
            @em = new Entities.EntityManager
            @entity_0 = @em.create(
                new C.TypeName('test0'),
                new C.MapPosition(null, 4, 8)
            )

        test 'Module should be defined', () ->
            assert.isDefined Entities

        suite 'EntityManager', () ->

            test "EntityManager.get should give quick access to a component", () ->
                mp = @em.get(@entity_0, C.MapPosition)
                assert.equal(mp.x, 4)
                assert.equal(mp.y, 8)

            test "EntityManager.get should accept multiple components", () ->
                [mp, tn] = @em.get(@entity_0, C.MapPosition, C.TypeName)
                assert.equal(mp.x, 4)
                assert.equal(mp.y, 8)
                assert.equal(tn.name, 'test0')

            test "EntityManager.get with no specified component should return all", () ->
                expected_name = 'My Test 0'
                c = new C.EntityName(expected_name)
                @em.addComponent(@entity_0, c)

                all = @em.get(@entity_0)
                assert.equal(all.EntityName.name, expected_name)

                all_keys = _.keys(all)
                all_keys.sort()
                expected_keys = ["EntityName","MapPosition","TypeName"]
                for idx in [0..all_keys.length-1]
                    assert.equal(all_keys[idx], expected_keys[idx])

            test "EntityManager.addComponent should add a component to an entity", () ->
                expected_name = 'My Test 0'
                c = new C.EntityName(expected_name)
                @em.addComponent(@entity_0, c)

                en = @em.get(@entity_0, C.EntityName)
                assert.equal(en.name, expected_name)
                
            test "EntityManager.removeComponent() should remove a component from an entity", () ->
                c = new C.EntityName("Blah blah")
                @em.addComponent(@entity_0, c)
                @em.removeComponent(@entity_0, c)
                en = @em.get(@entity_0, C.EntityName)
                assert.equal(en, null)

            test "create/destroyEntity should properly manage component indexes", () ->
                components = [
                    new C.TypeName('test1'),
                    new C.MapPosition(null, 4, 8)
                ]

                entity_1 = @em.create components...

                assert.ok(@em.has(@entity_0))
                assert.ok(@em.has(entity_1))
                for c in components
                    assert.equal(@em.store[c.type][entity_1], c)

                @em.destroy(entity_1)
                
                assert.ok(@em.has(@entity_0))
                assert.ok(!@em.has(entity_1))
                for c in components
                    assert.ok(_.isUndefined(@em.store[c.type][entity_1]))
