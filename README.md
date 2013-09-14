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

* Rework all component constructors to accept an object, looking forward to
  JSON (de)serialization of the world

* Ship power stores

* Shield regeneration

* Flux capacitor control for defense / offense / speed power distribution

* Arc slider for beam split control

* Cluster seeker missiles - laser targets, low health, lots of em

* Motion trails behind some sprites (eg. seeker missiles)

* Nuke torpedoes - fly to tap/click, splash damage radius, animated explosion

* Destructable asteroids - break into pieces using tombstones?

* Flocking behavior for enemy scouts

* Stargates for scene changes

* Open Web App boilerplating

* Per-system damage, when shields are down

* Auto-adjust rendering features based on FPS and estimated spare CPU headroom.
    * Glow on / off

* Auto-pause if it looks like we're no longer in the foreground (ie. big drop
  in FPS from rFA)
