define [], () ->
    
    curr_id = 0

    return {
        
        generateID: () -> curr_id++

        now: () -> Date.now()

        inCollision: (x1, y1, w1, h1, x2, y2, w2, h2) ->
            left_dist = Math.abs(x1 - x2) * 2
            width_total = w1 + w2
            if left_dist <= width_total
                top_dist = Math.abs(y1 - y2) * 2
                height_total = h1 + h2
                if top_dist <= height_total
                    return true
            return false

        maximizeCanvas: (window, canvas) ->
            resize = () ->
                canvas.style.width = window.innerWidth + 'px'
                canvas.width = window.innerWidth
                canvas.style.height = window.innerHeight + 'px'
                canvas.height = window.innerHeight
            resize()
            window.addEventListener 'resize', resize, false
            window.addEventListener 'orientationchange', resize, false

        pauseWhenHidden: (world, unpause_when_visible=true) ->
            if (typeof document.hidden isnt "undefined")
                doc_hidden = "hidden"
                change_event = "visibilitychange"
            else if (typeof document.mozHidden isnt "undefined")
                doc_hidden = "mozHidden"
                change_event = "mozvisibilitychange"
            else if (typeof document.msHidden isnt "undefined")
                doc_hidden = "msHidden"
                change_event = "msvisibilitychange"
            else if (typeof document.webkitHidden isnt "undefined")
                doc_hidden = "webkitHidden"
                change_event = "webkitvisibilitychange"
            else
                doc_hidden = null

            return if doc_hidden is null

            pause = () -> world.pause()
            unpause = () -> world.unpause()

            handle_change = () ->
                if document[doc_hidden]
                    setTimeout pause, 500
                else if unpause_when_visible
                    setTimeout unpause, 500

            document.addEventListener(change_event, handle_change, false)

    }
