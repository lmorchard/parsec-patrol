define ['entities', 'components', 'underscore'], (Entities, C, _) ->

    suite 'Entities', () ->

        setup () ->
            @em = new Entities.EntityManager
            @entity_0 = @em.create(
                new C.TypeName({name: 'test0'}),
                new C.Position({x: 4, y: 8})
            )

            @gid1 = @em.createGroup()
            @gid2 = @em.createGroup()
            @gid3 = 12345
            @em.addToGroup(@gid1, @entity_0)

        test 'Module should be defined', () ->
            assert.isDefined Entities

        suite 'EntityManager', () ->

            test ".get should give quick access to a component", () ->
                mp = @em.get(@entity_0, C.Position)
                assert.equal(mp.x, 4)
                assert.equal(mp.y, 8)

            test ".get should accept multiple components", () ->
                [mp, tn] = @em.get(@entity_0, C.Position, C.TypeName)
                assert.equal(mp.x, 4)
                assert.equal(mp.y, 8)
                assert.equal(tn.name, 'test0')

            test ".get with no specified component should return all", () ->
                expected_name = 'My Test 0'
                c = new C.EntityName({name: expected_name})
                @em.addComponent(@entity_0, c)

                all = @em.get(@entity_0)
                assert.equal(all.EntityName.name, expected_name)

                all_keys = _.keys(all)
                all_keys.sort()
                expected_keys = ["EntityName","Position","TypeName"]
                for idx in [0..all_keys.length-1]
                    assert.equal(all_keys[idx], expected_keys[idx])

            test ".addComponent should add a component to an entity", () ->
                expected_name = 'My Test 0'
                c = new C.EntityName({name: expected_name})
                @em.addComponent(@entity_0, c)

                en = @em.get(@entity_0, C.EntityName)
                assert.equal(en.name, expected_name)
                
            test ".removeComponent should remove a component", () ->
                c = new C.EntityName("Blah blah")
                @em.addComponent(@entity_0, c)
                @em.removeComponent(@entity_0, c)
                en = @em.get(@entity_0, C.EntityName)
                assert.equal(en, null)

            test "create/destroyEntity should properly manage indexes", () ->
                components = [
                    new C.TypeName('test1'),
                    new C.Position(null, 4, 8)
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

            test ".addEntityToGroup should add to group", () ->
                assert.equal(@em.groupForEntity(@entity_0), @gid1)
                assert.equal(@em.entitiesForGroup(@gid1)[@entity_0], 1)
                assert.ok(@em.groupHasEntity(@gid1, @entity_0))
                assert.ok(not @em.groupHasEntity(@gid2, @entity_0))
                assert.ok(not @em.groupHasEntity(@gid3, @entity_0))

            test ".removeEntityFromGroup should remove from group", () ->
                @em.removeFromGroup(@gid1, @entity_0)

                assert.equal(@em.groupForEntity(@entity_0), null)
                assert.equal(@em.entitiesForGroup(@gid1)[@entity_0], null)
                assert.ok(not @em.groupHasEntity(@gid1, @entity_0))
                assert.ok(not @em.groupHasEntity(@gid2, @entity_0))
                assert.ok(not @em.groupHasEntity(@gid3, @entity_0))

            test "Destruction should remove from group", () ->
                @em.destroy(@entity_0)

                assert.equal(@em.groupForEntity(@entity_0), null)
                assert.equal(@em.entitiesForGroup(@gid1)[@entity_0], null)
                assert.ok(not @em.groupHasEntity(@gid1, @entity_0))
                assert.ok(not @em.groupHasEntity(@gid2, @entity_0))
                assert.ok(not @em.groupHasEntity(@gid3, @entity_0))
