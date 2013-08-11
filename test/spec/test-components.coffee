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
            
            test 'EntityGroup add/remove/has helpers should work properly', () ->
                
                planets_g1 = (@world.entities.create(
                    new C.TypeName('Planet'),
                    new C.EntityName("System 1 - #{idx}"),
                ) for idx in [0..3])
                
                planets_g2 = (@world.entities.create(
                    new C.TypeName('Planet'),
                    new C.EntityName("System 2 - #{idx}"),
                ) for idx in [0..3])

                g1 = @world.entities.create(
                    new C.TypeName('SolarSystem'),
                    new C.EntityName('System 1'),
                    new C.EntityGroup(planets_g1)
                )

                g2 = @world.entities.create(
                    new C.TypeName('SolarSystem'),
                    new C.EntityName('System 2'),
                    new C.EntityGroup()
                )

                eg1 = @world.entities.get(g1, C.EntityGroup)
                eg2 = @world.entities.get(g2, C.EntityGroup)

                for p in planets_g1
                    assert.ok(C.EntityGroup.has(eg1, p))

                for p in planets_g2
                    C.EntityGroup.add(eg2, p)
                for p in planets_g2
                    assert.ok(C.EntityGroup.has(eg2, p))
                for p in planets_g2
                    C.EntityGroup.remove(eg2, p)
                for p in planets_g2
                    assert.ok(not C.EntityGroup.has(eg2, p))

                for p in planets_g1
                    assert.ok(not C.EntityGroup.has(eg2, p))
                for p in planets_g1
                    C.EntityGroup.move(eg1, eg2, p)
                for p in planets_g1
                    assert.ok(not C.EntityGroup.has(eg1, p))
                    assert.ok(C.EntityGroup.has(eg2, p))

                console.log "WORLD #{JSON.stringify(@world.entities)}"
