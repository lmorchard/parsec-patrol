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

        constructor: (@document) ->
            @canvas = @document.createElement('canvas')
            #document.body.appendChild(@canvas)

            #Utils.maximizeCanvas(window, @canvas)

            @ctx = @canvas.getContext('2d')
            @viewport_width = 0
            @viewport_height = 0
            @viewport_ratio = 1.0
            @follow_entity = null

            @stage = new PIXI.Stage(0x111111)
            @renderer = PIXI.autoDetectRenderer(600, 600)
            document.body.appendChild(@renderer.view)

            makeCanvas = () ->
                canvas = document.createElement('canvas');
                canvas.width = 100
                canvas.height = 100
                return canvas

            canvas = makeCanvas()
            ctx = canvas.getContext('2d')
            ctx.save()
            ctx.strokeStyle = '#fff'
            ctx.translate(50, 50)
            shape = 'hero'
            shape_fn = @['draw_sprite_' + shape] || @draw_sprite_default
            shape_fn.call(@, ctx)
            ctx.restore()
            texture = PIXI.Texture.fromCanvas(canvas)

            @bunny = new PIXI.Sprite(texture)
         
            @bunny.anchor.x = 0.5
            @bunny.anchor.y = 0.5
         
            @bunny.position.x = 200
            @bunny.position.y = 150
         
            @stage.addChild(@bunny)

        setWorld: (world) ->
            super world
            @world.subscribe @constructor.MSG_CAPTURE_CAMERA, (msg, data) =>
                @follow_entity = data.entity_id

        draw: (t_delta) ->
            @bunny.rotation += 0.1
            @renderer.render(@stage)

            # If we have a followed entity, move the camera center
            if @follow_entity
                pos = @world.entities.get(@follow_entity, C.Position)
                if pos
                    @camera_x = pos.x
                    @camera_y = pos.y

            @updateViewportMetrics()

            # Adjust pointer-to-world coords based on camera
            if @world.inputs.pointer_x
                @world.inputs.pointer_world_x = ((
                    @world.inputs.pointer_x - (@viewport_width/2)
                ) / @zoomed_ratio) + @camera_x
                @world.inputs.pointer_world_y = ((
                    @world.inputs.pointer_y - (@viewport_height/2)
                ) / @zoomed_ratio) + @camera_y

            # Clear the canvas
            @ctx.save()
            @ctx.fillStyle = "rgba(0, 0, 0, 1.0)"
            @ctx.fillRect(0, 0, @viewport_width, @viewport_height)

            # Translate and scale based on the viewport center and zoom level
            @ctx.translate(@viewport_center_left, @viewport_center_top)
            @ctx.scale(@zoomed_ratio, @zoomed_ratio)

            # Adjust the camera center
            @ctx.translate(0-@camera_x, 0-@camera_y)

            @draw_backdrop(t_delta)

            @world.publish @constructor.MSG_PRE_DRAW_SCENE, t_delta, @ctx
            @draw_scene(t_delta)
            @world.publish @constructor.MSG_POST_DRAW_SCENE, t_delta, @ctx

            @ctx.restore()

            if @world.is_paused
                @draw_paused_bezel(t_delta)
        
        updateViewportMetrics: (width, height) ->
            width = @canvas.width
            height = @canvas.height

            if not (@viewport_width is width and @viewport_height is height and @prev_zoom is @zoom)

                @prev_zoom = @zoom
                @viewport_width = width
                @viewport_height = height

                @viewport_ratio = if @viewport_width > @viewport_height
                    @viewport_width / @world.width
                else
                    @viewport_height / @world.height

                @viewport_center_left = @viewport_width / 2
                @viewport_center_top = @viewport_height / 2

                @zoomed_ratio = @viewport_ratio * @zoom

                @visible_width = @viewport_width / @zoomed_ratio
                @visible_height = @viewport_height / @zoomed_ratio

            @visible_left = (0 - @visible_width/2) + @camera_x
            @visible_top = (0 - @visible_height/2) + @camera_y
            @visible_right = @visible_left + @visible_width
            @visible_bottom = @visible_top + @visible_height

        draw_paused_bezel: (t_delta) ->
            width = @canvas.width * 0.75
            height = @canvas.height * 0.25
            left = (@canvas.width - width) / 2
            top = (@canvas.height - height) / 2

            @ctx.globalAlpha = 0.85
            @ctx.strokeStyle = "#fff"
            @ctx.fillStyle = "#000"
            @ctx.fillRect(left, top, width, height)
            @ctx.strokeRect(left, top, width, height)

            @ctx.fillStyle = "#fff"
            font_size = 48 * @viewport_ratio
            @ctx.font = "#{font_size}px monospace"
            @ctx.textAlign = 'center'
            @ctx.textBaseline = 'middle'
            @ctx.strokeText('Paused', left+(width/2), top+(height/2), width)

        draw_backdrop: (t_delta) ->
            @ctx.strokeStyle = @grid_color
            @ctx.lineWidth = 1

            @ctx.beginPath()

            grid_offset_x = @visible_left % @grid_size
            start = @visible_left - grid_offset_x
            end = @visible_right
            for left in [start..end] by @grid_size
                @ctx.moveTo(left, @visible_top)
                @ctx.lineTo(left, @visible_bottom)

            grid_offset_y = @visible_top % @grid_size
            start = @visible_top - grid_offset_y
            end = @visible_bottom
            for top in [start..end] by @grid_size
                @ctx.moveTo(@visible_left, top)
                @ctx.lineTo(@visible_right, top)

            @ctx.stroke()

        draw_scene: (t_delta) ->
            scene = @world.entities.entitiesForGroup(@world.current_scene)
            for eid, ignore of scene

                spawn = @world.entities.get(eid, C.Spawn)
                continue if not spawn?.spawned

                pos = @world.entities.get(eid, C.Position)
                continue if not pos

                sprite = @world.entities.get(eid, C.Sprite)

                # Skip drawing offscreen entities
                margin_w = if sprite then sprite.width / 2 else 0
                margin_h = if sprite then sprite.height / 2 else 0
                if pos.x < @visible_left - margin_w or
                        pos.x > @visible_right + margin_w or
                        pos.y < @visible_top - margin_h or
                        pos.y > @visible_bottom + margin_h
                    continue

                @ctx.save()
                
                @world.publish @constructor.MSG_DRAW_SCENE_PRE_TRANSLATE,
                    t_delta, @ctx, eid, pos, spawn, sprite
                
                @ctx.translate(pos.x, pos.y)

                @world.publish @constructor.MSG_DRAW_SCENE_POST_TRANSLATE,
                    t_delta, @ctx, eid, pos, spawn, sprite

                @draw_sprite t_delta, eid, pos, sprite
                
                @ctx.restore()

        draw_sprite: (t_delta, eid, pos, sprite) ->
            return if not sprite

            w = sprite.width
            h = sprite.height
            BASE_W = 100
            BASE_H = 100

            @ctx.rotate(pos.rotation + Math.PI/2)
            @ctx.scale(w / BASE_W, h / BASE_H)

            @ctx.fillStyle = "#000"
            @ctx.strokeStyle = sprite.stroke_style
            line_ratio = (BASE_W / w)
            if @glow
                @ctx.shadowColor = sprite.stroke_style
                @ctx.shadowBlur = 4.0 * line_ratio
            @ctx.lineWidth = 0.75 * line_ratio

            shape_fn = @['draw_sprite_' + sprite.shape] || @draw_sprite_default
            shape_fn.call(@, @ctx, sprite, t_delta)

        draw_sprite_default: (ctx, sprite, t_delta) ->
            ctx.strokeRect(-50, -50, 100, 100)
            
        draw_sprite_star: (ctx, sprite, t_delta) ->
            ctx.fillStyle = "#ccc"
            ctx.beginPath()
            ctx.arc(0, 0, 50, 0, Math.PI*2, true)
            ctx.fill()

        draw_sprite_hero: (ctx, sprite, t_delta) ->
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

        draw_sprite_enemyscout: (ctx, sprite, t_delta) ->
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

        draw_sprite_enemycruiser: (ctx, sprite, t_delta) ->
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

        draw_sprite_torpedo: (ctx, sprite, t_delta) ->
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

        draw_sprite_asteroid: (ctx, sprite, t_delta) ->
            if not sprite.points
                NUM_POINTS = 7 + Math.floor(8 * Math.random())
                MAX_RADIUS = 50
                MIN_RADIUS = 35
                ROTATION = (Math.PI*2) / NUM_POINTS

                sprite.points = []
                for idx in [1..NUM_POINTS]
                    rot = idx * ROTATION
                    dist = _.random(MIN_RADIUS, MAX_RADIUS)
                    sprite.points.push([
                        dist * Math.cos(rot),
                        dist * Math.sin(rot)
                    ])

            ctx.beginPath()
            ctx.moveTo(sprite.points[0][0], sprite.points[0][1])
            for idx in [1..sprite.points.length-1]
                ctx.lineTo(sprite.points[idx][0], sprite.points[idx][1])
            ctx.lineTo(sprite.points[0][0], sprite.points[0][1])
            ctx.stroke()

    return { PixiViewportSystem }
