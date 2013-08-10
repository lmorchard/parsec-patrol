define ['worlds'], (Worlds) ->

    class App

        run: () ->
            console.log "App launched"

            @game = new Worlds.BasicWorld
