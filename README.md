# Parsec Patrol

Pew-pews in SPAAAAACE!

## Influences

* Super Star Trek
* Star Raiders
* Subspace / Cosmic Rift
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

* Spawner component
    * Opposite of tombstone
    * Generate entities periodically, randomly, up to a max on scene

* Random tombstone
    * eg. Loot table
    * Generate one or more from a random selection of assemblages

* Stop entities at world boundary?

* Refactor sprites - no more ginormous switch statement, maybe animations?

* Multiplayer
    * Kinda have done this before, but [badly](https://github.com/lmorchard/webtrek)
    * I'm scared sarge

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

* EVE-style logi ships
    * Work with flocking and damage priority
    * Heal beam - pump shields into target
    * Power beam - pump energy into target

* Stargates for scene changes

* Open Web App boilerplating

* Per-system damage, when shields are down

* Auto-adjust rendering features based on FPS and estimated spare CPU headroom.
    * Glow on / off

* Auto-pause if it looks like we're no longer in the foreground (ie. big drop
  in FPS from rFA)
