define ['components', 'entities'], (Components, Entities) ->

    suite 'Components', () ->

        setup () ->
            @em = new Entities.EntityManager

        test 'Module should be defined', () ->
            assert.isDefined Components

        test 'component.getEntity() should yield an EntityAccessor', () ->
            c = new Components.TypeName('test0')
            entity = @em.createEntity().add(c)
            assert.equal(c.getEntity().id, entity.id)
