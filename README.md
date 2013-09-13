# Parsec Patrol

Pew-pews in SPAAAAACE!

## Development

npm install
bower install
grunt server
open http://localhost:9000/
open http://localhost:9000/sketches/

## TODO / Ideas

* Rework all component constructors to accept an object, looking forward to
  JSON (de)serialization of the world

* Auto-adjust rendering features based on FPS and estimated spare CPU headroom.
    * Glow on / off

* Auto-pause if it looks like we're no longer in the foreground (ie. big drop
  in FPS from rFA)

* Open Web App boilerplating
