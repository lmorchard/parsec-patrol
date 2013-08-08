define ['hello'], (hello) ->
    describe 'hello', () ->
        it 'should exist', () ->
            console.log "HELLO HELLO TEST"
            should.exist hello
