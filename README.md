# Parsec Patrol

[![Build Status](https://travis-ci.org/lmorchard/parsec-patrol.svg?branch=master)](https://travis-ci.org/lmorchard/parsec-patrol)

Pew-pews in SPAAAAACE!

## Influences

* [Super Star Trek](http://en.wikipedia.org/wiki/Star_Trek_%28text_game%29)
* [SEGA's Star Trek](http://www.youtube.com/watch?v=u28eDfO8SqU)
* [Star Raiders](http://en.wikipedia.org/wiki/Star_Raiders)
* [Subspace](http://en.wikipedia.org/wiki/SubSpace_%28video_game%29) 
* [Cosmic Rift](http://en.wikipedia.org/wiki/Cosmic_Rift)
* [Bosconian](http://en.wikipedia.org/wiki/Bosconian)
* [Kobo](http://www.olofson.net/kobodl/)
* [Netrek](http://www.netrek.org/)
* [EVE Online](http://www.eveonline.com/)

## Development
```
# Install all the dependencies
npm install

# Start a build filewatcher along with a local web server on port 3001
gulp server
# http://localhost:3001/
# http://localhost:3001/sketches/

# Start the Karma test watcher
./node_modules/.bin/karma start
```

## TODO / Ideas

* Move core engine code out of src/ root?

* Upgrade Browserify once [issue #1044](https://github.com/substack/node-browserify/issues/1044) is fixed

* Come up with less brittle component / system registry names when necessary
  * Use ES6 Symbols?

* Check out some pubsub libraries and see if one is performant in the game loop

* Hitboxes / hit-shapes independent of sprite height / width
    * eg. for asteroids, make smaller than actual shape & tolerate some overlap
    * use circles instead of boxes? distance calcs may be expensive, though

* Destructable asteroids 
    * break into pieces using tombstones to spawn smaller ones?

* "Splash" effect / waypoint sprite at click to indicate current destination
    * Multiple waypoints on single-click? Set destination on double?

* Damage & destruction on collision

* Collision improvements, eg. quadtrees?

* Gravity
    * Black holes & etc to attract ships & bend courses
    * More realistic orbits? would that be fun?

* Inertia component and repulsor fields
    * Inertia to resist incoming forces
    * Inerial to impart outgoing forces
    * Collisions from asteroids can impart an impulse
    * Torpedo bursts can also push enemies away
    * Maybe tractor beams someday?

* Shield effects
    * circle surrounding ship
    * flash an arc segment of the circle centered on the direction of the damage
    * thickness & arc degrees based on magnitude of damage

* Destructable asteroids 
    * Generate variable radius points around center, connect dots
    * break into pieces using tombstones to spawn smaller ones?

* Auto-pause when not visible and/or when FPS dips below 10?

* Merge world & entity manager - they're not really useful separately

* Dumb bullet projectiles
    * Keep them very simple, so we can have lots of them
    * Entity pool / reuse rather than destruction when at end-of-life (eg. hit
      target, expired)

* Nuke torpedoes - fly to tap/click, splash damage radius, animated explosion

* Flocking behavior for enemy scouts

* Spawner component
    * Opposite of tombstone
    * Generate entities periodically, randomly, up to a max on scene

* Random tombstone
    * eg. Loot table
    * Generate one or more from a random selection of assemblages

* Stop entities at world boundary?

* Multiplayer
    * Kinda have done this before, but [badly](https://github.com/lmorchard/webtrek)
    * I'm scared sarge

* Ship power stores

* Shield regeneration

* Further beam weapon optimizations - that thing is a CPU hog

* Flux capacitor control for defense / offense / speed power distribution

* Arc slider for beam split control

* Stargates for scene changes

* Open Web App boilerplating

* Per-system damage, when shields are down

* Auto-adjust rendering features based on FPS and estimated spare CPU headroom.
    * Glow on / off

* EVE-style logi ships
    * Work with flocking and damage priority
    * Heal beam - pump shields into target
    * Power beam - pump energy into target

* Game types
    * Horde
        * Endless stream of enemies, fight until dead, high score hooray
    * Repel the invasion
        * Super Star Trek style, 8x8 sectors, starbases under attack, defend & clear 
        * Bosses generating raider squads that roam from sector to sector in
          search of starbases
    * MOBA
        * One scene, mothership on one side generating creeps, starbase on
          other side generating creeps, towers in the middle, hero makes the
          difference
    * Deathmatch
        * See also: multiplayer
    * Competitive Netrek clone
        * Neat idea, but yikes

