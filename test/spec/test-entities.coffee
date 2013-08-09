define ['entities', 'components', 'underscore'], (Entities, C, _) ->

    suite 'Entities', () ->

        setup () ->
            this.em = new Entities.EntityManager
            this.eid0 = this.em.createEntity([
                new C.TypeName('test0'),
                new C.MapPosition(null, 4, 8)
            ])

        test 'Module should be defined', () ->
            assert.isDefined Entities

        test "An entity should just be a numeric ID", () ->
            assert.ok(_.isNumber(this.eid0))

        test "em.get() should give quick access to an entity component", () ->
            mp = this.em.get(this.eid0, 'MapPosition')
            assert.equal(mp.x, 4)
            assert.equal(mp.y, 8)
            
        test "create/destroyEntity should properly manage component indexes", () ->

            components = [
                new C.TypeName('test1'),
                new C.MapPosition(null, 4, 8)
            ]

            eid1 = this.em.createEntity(components)

            assert.ok(this.em.hasEntity(this.eid0))
            assert.ok(this.em.hasEntity(eid1))

            for c in components
                by_entity = this.em.getComponentsByEntity(eid1)
                assert.ok(_.isArray(by_entity))
                assert.ok(by_entity.indexOf(c) != -1)

                by_type = this.em.components_by_type[c.type]
                assert.ok(_.isArray(by_type))
                assert.ok(by_type.indexOf(c) != -1)

            this.em.destroyEntity(eid1)

            assert.ok(this.em.hasEntity(this.eid0))
            assert.ok(not this.em.hasEntity(eid1))

            for c in components
                by_entity = this.em.getComponentsByEntity(eid1)
                assert.ok(_.isUndefined(by_entity))

                by_type = this.em.components_by_type[c.type]
                if _.isArray(by_type)
                    assert.ok(by_type.indexOf(c) == -1)
