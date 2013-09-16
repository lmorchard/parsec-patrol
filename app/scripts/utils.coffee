define [], () ->
    
    curr_id = 0

    return {
        generateID: () -> curr_id++
        now: () -> Date.now()

        maximizeCanvas: (window, canvas) ->
            resize = () ->
                canvas.style.width = window.innerWidth + 'px'
                canvas.width = window.innerWidth
                canvas.style.height = window.innerHeight + 'px'
                canvas.height = window.innerHeight
            resize()
            window.addEventListener 'resize', resize, false
            window.addEventListener 'orientationchange', resize, false
    }
