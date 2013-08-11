define [
    'systems', 'entities', 'components', 'worlds', 'async'
], (
    Systems, E, C, W, async
) ->

    setup () ->
        @world = new W.World
        @em = @world.entities

    suite 'Systems', () ->

        test 'Module should be defined', () ->
            assert.isDefined Systems

        suite 'SpawnSystem', () ->

            setup () ->
                @spawn_system = new Systems.SpawnSystem
                @world.addSystem(@spawn_system)

            test 'SpawnSystem should spawn unspawned entities', (done) ->
                msgs = []
                @world.subscribe @spawn_system.constructor.MSG_SPAWN,
                    (msg, data) -> msgs.push(data)
                
                spawnable_entities = (@em.create [
                    new C.TypeName('SpawnableEntity'),
                    new C.EntityName("test#{idx}"),
                    new C.MapPosition,
                    new C.Spawn
                ] for idx in [0..3])

                no_spawn_entities = (@em.create [
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
                            assert.ok(@em.get(e, C.Spawn)?.spawned)
                        for e in no_spawn_entities
                            assert.ok(!@em.get(e, C.Spawn)?.spawned)

                        msgs.length = 0
                        @spawn_system.update 10
                        next()

                    (next) =>
                        assert.equal msgs.length, 0
                        next()

                ], done
