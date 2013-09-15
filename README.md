# Parsec Patrol

Pew-pews in SPAAAAACE!

## Inspirations

* Super Star Trek
* Star Raiders
* [Bosconian](http://en.wikipedia.org/wiki/Bosconian)
* XKobo
* Netrek
* EVE Online

## Development

npm install
bower install
grunt server
open http://localhost:9000/
open http://localhost:9000/sketches/

## TODO / Ideas

* Stop entities at world boundary?

* Rework all component constructors to accept an object, looking forward to
  JSON (de)serialization of the world

* Refactor sprites - no more ginormous switch statement, maybe animations?

* Ship power stores

* Shield regeneration

* "Splash" effect / waypoint sprite at click to indicate current destination
    * Multiple waypoints on single-click? Set destination on double?

* Further beam weapon optimizations - that thing is a CPU hog

* Flux capacitor control for defense / offense / speed power distribution

* Arc slider for beam split control

* Dumb bullet projectiles
    * Keep them very simple, so we can have lots of them
    * Entity pool / reuse rather than destruction when at end-of-life (eg. hit
      target, expired)

* Cluster seeker missiles - laser targets, low health, lots of em

* Motion trails behind some sprites (eg. seeker missiles)

* Nuke torpedoes - fly to tap/click, splash damage radius, animated explosion

* Destructable asteroids 
    * Generate variable radius points around center, connect dots
    * break into pieces using tombstones to spawn smaller ones?

* Flocking behavior for enemy scouts

* Stargates for scene changes

* Open Web App boilerplating

* Per-system damage, when shields are down

* Auto-adjust rendering features based on FPS and estimated spare CPU headroom.
    * Glow on / off

* Auto-pause if it looks like we're no longer in the foreground (ie. big drop
  in FPS from rFA)
