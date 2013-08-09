define ['entities', 'components', 'underscore'], (Entities, C, _) ->

    suite 'Entities', () ->

        setup () ->
            this.em = new Entities.EntityManager
            this.entity_0 = this.em.createEntity([
                new C.TypeName('test0'),
                new C.MapPosition(null, 4, 8)
            ])

        test 'Module should be defined', () ->
            assert.isDefined Entities

        test "create/destroyEntity should properly manage component indexes", () ->

            components = [
                new C.TypeName('test1'),
                new C.MapPosition(null, 4, 8)
            ]

            entity_1 = this.em.createEntity(components)

            assert.ok(this.em.hasEntity(this.entity_0))
            assert.ok(this.em.hasEntity(entity_1))

            for c in components
                by_entity = entity_1.components()
                assert.ok(_.isArray(by_entity))
                assert.ok(by_entity.indexOf(c) != -1)

                by_type = this.em.components_by_type[c.type]
                assert.ok(_.isArray(by_type))
                assert.ok(by_type.indexOf(c) != -1)

            entity_1.destroy()

            assert.ok(this.em.hasEntity(this.entity_0))
            assert.ok(not this.em.hasEntity(entity_1))

            for c in components
                by_entity = entity_1.components()
                assert.ok(_.isUndefined(by_entity))

                by_type = this.em.components_by_type[c.type]
                if _.isArray(by_type)
                    assert.ok(by_type.indexOf(c) == -1)

        test "entity.get() should give quick access to a component", () ->
            mp = this.entity_0.get(C.MapPosition)
            assert.equal(mp.x, 4)
            assert.equal(mp.y, 8)

        test "entity.add() should add a component to an entity", () ->
            expected_name = 'My Test 0'
            c = new C.EntityName(expected_name)
            this.entity_0.add(c)
            en = this.entity_0.get(C.EntityName)
            assert.equal(en.name, expected_name)
            
        test "entity.remove() should remove a component from an entity", () ->
            c = new C.EntityName("Blah blah")
            this.entity_0.add(c)
            this.entity_0.remove(c)
            en = this.entity_0.get(C.EntityName)
            assert.equal(en, null)

