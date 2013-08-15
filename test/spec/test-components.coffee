define [
    'components', 'entities', 'worlds', 'underscore'
], (
    Components, Entities, Worlds, _
) ->

    [C, E, W] = [Components, Entities, Worlds]

    suite 'Components', () ->
        
        setup () ->
            @world = new Worlds.World

        test 'Module should be defined', () ->
            assert.isDefined Components

        suite 'EntityGroup', () ->

            setup () ->
                @planets_g1 = (@world.entities.create(
                    new C.TypeName('Planet'),
                    new C.EntityName("System 1 - #{idx}"),
                ) for idx in [0..3])
                @planets_g2 = (@world.entities.create(
                    new C.TypeName('Planet'),
                    new C.EntityName("System 2 - #{idx}"),
                ) for idx in [0..3])
                @g1 = @world.entities.create(
                    new C.TypeName('SolarSystem'),
                    new C.EntityName('System 1'),
                    new C.EntityGroup(@planets_g1...)
                )
                @g2 = @world.entities.create(
                    new C.TypeName('SolarSystem'),
                    new C.EntityName('System 2'),
                    new C.EntityGroup()
                )
                @eg1 = @world.entities.get(@g1, C.EntityGroup)
                @eg2 = @world.entities.get(@g2, C.EntityGroup)
            
            test 'EntityGroup.has() helper should work', () ->
                assert.ok(C.EntityGroup.has(@eg1, @planets_g1...))

            test 'EntityGroup.add() helper should work', () ->
                C.EntityGroup.add(@eg2, @planets_g2...)
                assert.ok(C.EntityGroup.has(@eg2, @planets_g2...))
            
            test 'EntityGroup.remove() helper should work', () ->
                C.EntityGroup.add(@eg2, @planets_g2...)
                assert.ok(C.EntityGroup.has(@eg2, @planets_g2...))
                C.EntityGroup.remove(@eg2, @planets_g2...)
                assert.ok(not C.EntityGroup.has(@eg2, @planets_g2...))

            test 'EntityGroup.move() helper should work', () ->
                assert.ok(C.EntityGroup.has(@eg1, @planets_g1...))
                assert.ok(not C.EntityGroup.has(@eg2, @planets_g1...))
                C.EntityGroup.move(@eg1, @eg2, @planets_g1...)
                assert.ok(not C.EntityGroup.has(@eg1, @planets_g1...))
                assert.ok(C.EntityGroup.has(@eg2, @planets_g1...))
