define ['worlds', 'systems', 'components'], (Worlds, Systems, C) ->

    suite 'Worlds', () ->

        setup () ->
            return

        test 'Module should be defined', () ->
            assert.isDefined Worlds

        test 'PubSub should be isolated between Worlds', (done) ->
            w1 = new Worlds.World
            w2 = new Worlds.World

            topic = 'test_iso'

            w1_msgs = []
            w1.subscribe topic, (msg, data) -> w1_msgs.push(data)
            w2_msgs = []
            w2.subscribe topic, (msg, data) -> w2_msgs.push(data)
            
            w1.publish(topic, 'alpha')
            w2.publish(topic, 'beta')

            next = () ->
                assert.equal(w1_msgs.length, 1)
                assert.equal(w1_msgs[0], 'alpha')
                assert.equal(w2_msgs.length, 1)
                assert.equal(w2_msgs[0], 'beta')
                done()

            setTimeout(next, 0.1)
