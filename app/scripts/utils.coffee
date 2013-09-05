define [], () ->
    
    curr_id = 0

    return {
        generateID: () -> curr_id++
        now: () -> Date.now()
    }
