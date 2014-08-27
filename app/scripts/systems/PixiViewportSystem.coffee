define [
    'systems', 'components', 'utils', 'jquery', 'underscore', 'pubsub', 'Vector2D',
    'Hammer', 'THREEx.KeyboardState', 'QuadTree'
], (
    Systems, C, Utils, $, _, PubSub, Vector2D, Hammer, KeyboardState, QuadTree
) ->

    class PixiViewportSystem extends Systems.System
        @MSG_CAPTURE_CAMERA = 'viewport.capture_camera'
        @MSG_DRAW_SCENE_PRE_TRANSLATE = 'viewport.draw_scene_pre_translate'
        @MSG_DRAW_SCENE_POST_TRANSLATE = 'viewport.draw_scene_post_translate'
        @MSG_PRE_DRAW_SCENE = 'viewport.pre_draw_scene'
        @MSG_POST_DRAW_SCENE = 'viewport.post_draw_scene'

        glow: false
        draw_mass: false
        grid_size: 150
        grid_color: '#111'
        source_size: 100
        prev_zoom: 0
        zoom: 1
        camera_x: 0
        camera_y: 0

        textures: {}

        sprites: {}

        getSpriteTexture: (shape) ->
            canvas = document.createElement('canvas')
            canvas.width = 110
            canvas.height = 110
            ctx = canvas.getContext('2d')
            ctx.save()
            ctx.strokeStyle = '#fff'
            ctx.translate(55, 55)
            shape_fn = @['draw_sprite_' + shape] || @draw_sprite_default
            shape_fn.call(@, ctx)
            ctx.restore()
            return PIXI.Texture.fromCanvas(canvas)

        getSpriteTexture2: (shape) ->
            if !@textures[shape]
                canvas = document.createElement('canvas')
                canvas.width = 110
                canvas.height = 110
                ctx = canvas.getContext('2d')
                ctx.save()
                ctx.strokeStyle = '#fff'
                ctx.translate(55, 55)
                shape_fn = @['draw_sprite_' + shape] || @draw_sprite_default
                shape_fn.call(@, ctx)
                ctx.restore()
                @textures[shape] = PIXI.Texture.fromCanvas(canvas)

            return @textures[shape]

        constructor: (@document) ->
            @canvas = @document.createElement('canvas')
            #document.body.appendChild(@canvas)

            #Utils.maximizeCanvas(window, @canvas)

            @ctx = @canvas.getContext('2d')
            @viewport_width = 0
            @viewport_height = 0
            @viewport_ratio = 1.0
            @follow_entity = null

            @renderer = PIXI.autoDetectRenderer(700, 700)
            document.body.appendChild(@renderer.view)

            @stage = new PIXI.Stage(0x111111)

            @zoom = 1.0
            @container = new PIXI.DisplayObjectContainer()
            @container.position.x = @renderer.width/2
            @container.position.y = @renderer.height/2
            @container.scale.x = @zoom
            @container.scale.y = -@zoom
            @stage.addChild(@container)
 
        setWorld: (world) ->
            super world
            @world.subscribe @constructor.MSG_CAPTURE_CAMERA, (msg, data) =>
                @follow_entity = data.entity_id

        draw: (t_delta) ->
            @draw_scene(t_delta)

        draw_scene: (t_delta) ->
            seen_eids = {}

            scene = @world.entities.entitiesForGroup(@world.current_scene)
            for eid, ignore of scene
                seen_eids[eid] = true

                spawn = @world.entities.get(eid, C.Spawn)
                continue if not spawn?.spawned

                pos = @world.entities.get(eid, C.Position)
                continue if not pos

                sprite = @world.entities.get(eid, C.Sprite)

                if @sprites[eid]
                    psprite = @sprites[eid]
                else
                    texture = @getSpriteTexture(sprite.shape)
                    @sprites[eid] = psprite = new PIXI.Sprite(texture)
                    psprite.anchor.x = 0.5
                    psprite.anchor.y = 0.5
                    @container.addChild(psprite)
                
                psprite.width = sprite.width
                psprite.height = sprite.height
                psprite.position.x = pos.x
                psprite.position.y = pos.y

            for eid, psprite of @sprites
                if !seen_eids[eid]
                    @container.removeChild(psprite)

            @renderer.render(@stage)

        draw_sprite_default: (ctx) ->
            ctx.strokeRect(-50, -50, 100, 100)
            
        draw_sprite_star: (ctx) ->
            ctx.fillStyle = "#ccc"
            ctx.beginPath()
            ctx.arc(0, 0, 50, 0, Math.PI*2, true)
            ctx.fill()

        draw_sprite_hero: (ctx) ->
            ctx.rotate(Math.PI)
            ctx.beginPath()
            ctx.moveTo(-12.5, -50)
            ctx.lineTo(-25, -50)
            ctx.lineTo(-50, 0)
            ctx.arc(0, 0, 50, Math.PI, 0, true)
            ctx.lineTo(25, -50)
            ctx.lineTo(12.5, -50)
            ctx.lineTo(25, 0)
            ctx.arc(0, 0, 25, 0, Math.PI, true)
            ctx.lineTo(-12.5, -50)
            ctx.stroke()

        draw_sprite_enemyscout: (ctx) ->
            ctx.beginPath()
            ctx.moveTo(0, -50)
            ctx.lineTo(-45, 50)
            ctx.lineTo(-12.5, 12.5)
            ctx.lineTo(0, 25)
            ctx.lineTo(12.5, 12.5)
            #ctx.arc(0, 12.5, 12.5, Math.PI, 0, true)
            ctx.lineTo(45, 50)
            ctx.lineTo(0, -50)
            ctx.moveTo(0, -50)
            ctx.stroke()

        draw_sprite_enemycruiser: (ctx) ->
            w = 100
            h = 100
            hu = h / 5
            wu = w / 4

            ctx.beginPath()
            ctx.moveTo(0, 0-hu*2.5)
            ctx.lineTo(-(wu*1), hu*0.5)
            ctx.lineTo(-(wu*1.25), 0-hu*1.5)
            ctx.lineTo(-(wu*2), hu*2.5)
            ctx.arc(0-wu, hu*2.5, w*0.25, Math.PI, Math.PI/2, true)
            ctx.lineTo(-wu*0.5, hu*2.5)
            ctx.arc(0, hu*2.5, w*0.125, Math.PI, 0, true)
            ctx.lineTo(wu, hu*3.75)
            ctx.arc(wu, hu*2.5, w*0.25, Math.PI/2, 0, true)
            ctx.lineTo(wu*1.25, 0-hu*1.5)
            ctx.lineTo(wu*1, hu*0.5)
            ctx.lineTo(0, 0-hu*2.5)

            ctx.stroke()

        draw_sprite_torpedo: (ctx) ->
            ctx.beginPath()
            ctx.moveTo(-50, 0)
            ctx.arc(-50, -50, 50, Math.PI*0.5, 0, true)
            ctx.moveTo(0, -50)
            ctx.arc(50, -50, 50, Math.PI, Math.PI*0.5, true)
            ctx.moveTo(0, 50)
            ctx.arc(50, 50, 50, Math.PI*1.0, Math.PI*1.5, false)
            ctx.moveTo(-50, 0)
            ctx.arc(-50, 50, 50, Math.PI*1.5, 0, false)
            ctx.stroke()

        draw_sprite_asteroid: (ctx) ->
            NUM_POINTS = 7 + Math.floor(8 * Math.random())
            MAX_RADIUS = 50
            MIN_RADIUS = 35
            ROTATION = (Math.PI*2) / NUM_POINTS

            points = []
            for idx in [1..NUM_POINTS]
                rot = idx * ROTATION
                dist = _.random(MIN_RADIUS, MAX_RADIUS)
                points.push([
                    dist * Math.cos(rot),
                    dist * Math.sin(rot)
                ])

            ctx.beginPath()
            ctx.moveTo(points[0][0], points[0][1])
            for idx in [1..points.length-1]
                ctx.lineTo(points[idx][0], points[idx][1])
            ctx.lineTo(points[0][0], points[0][1])
            ctx.stroke()

    return { PixiViewportSystem }
