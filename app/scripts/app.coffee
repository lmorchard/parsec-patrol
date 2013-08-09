define ['games'], (Games) ->

    class App

        run: () ->
            console.log "App launched"

            @game = new Games.BasicGame
