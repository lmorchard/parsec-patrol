define ['systems', 'entities', 'components', 'pubsub', 'async'], (Systems, Entities, C, PubSub, async) ->

    setup () ->
        @em = new Entities.EntityManager

    suite 'Systems', () ->

        test 'Module should be defined', () ->
            assert.isDefined Systems

    suite 'SpawnSystem', () ->

        setup () ->
            @spawn_system = new Systems.SpawnSystem(null, @em)

        test 'SpawnSystem should spawn unspawned entities', (done) ->
            msgs = []
            PubSub.subscribe Systems.SpawnSystem.MSG_SPAWN,
                (msg, data) -> msgs.push(data)
            
            spawnable_entities = (@em.createEntity [
                new C.TypeName('SpawnableEntity'),
                new C.EntityName("test#{idx}"),
                new C.Spawn
            ] for idx in [0..3])

            no_spawn_entities = (@em.createEntity [
                new C.TypeName('NoSpawnEntity'),
                new C.EntityName("test#{idx}"),
            ] for idx in [4..6])

            async.waterfall [
                
                (next) =>
                    assert.equal msgs.length, 0
                    @spawn_system.update 10
                    next()

                (next) =>
                    assert.equal msgs.length, 4
                    for e in spawnable_entities
                        assert.ok(e.get(C.Spawn)?.spawned)
                    for e in no_spawn_entities
                        assert.ok(not e.get(C.Spawn)?.spawned)

                    msgs.length = 0
                    @spawn_system.update 10
                    next()

                (next) =>
                    assert.equal msgs.length, 0
                    next()

            ], done
