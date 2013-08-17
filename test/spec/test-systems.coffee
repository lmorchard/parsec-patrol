define [
    'systems', 'entities', 'components', 'worlds', 'async'
], (
    Systems, E, C, W, async
) ->

    suite 'Systems', () ->

        test 'Module should be defined', () ->
            assert.isDefined Systems

        suite 'SpawnSystem', () ->

            setup () ->
                @world = new W.World
                @spawn_system = new Systems.SpawnSystem
                @world.addSystem(@spawn_system)

            test 'SpawnSystem should spawn unspawned entities', (done) ->
                @timeout(5000)

                msgs = []
                @world.subscribe @spawn_system.constructor.MSG_SPAWN,
                    (msg, data) -> msgs.push(data)
                
                spawnable_entities = (@world.entities.create(
                    new C.TypeName('SpawnableEntity'),
                    new C.EntityName("test#{idx}"),
                    new C.Position,
                    new C.Spawn
                ) for idx in [0..3])

                no_spawn_entities = (@world.entities.create(
                    new C.TypeName('NoSpawnEntity'),
                    new C.EntityName("test#{idx}"),
                ) for idx in [4..6])

                async.waterfall [
                    
                    (next) =>
                        assert.equal msgs.length, 0
                        @world.tick 10
                        next()

                    (next) =>
                        assert.equal msgs.length, 4
                        for e in spawnable_entities
                            assert.ok(@world.entities.get(e, C.Spawn)?.spawned)
                        for e in no_spawn_entities
                            assert.ok(!@world.entities.get(e, C.Spawn)?.spawned)

                        msgs.length = 0
                        @world.tick 10
                        next()

                    (next) =>
                        assert.equal msgs.length, 0
                        next()

                ], done
