#!/bin/bash

function gen {
  ./get.py -o test/dita-ot-$1/plugins node pdf2 $1
  ant -lib test/dita-ot-$1/lib -f test/dita-ot-$1/integrator.xml
  test/dita-ot-$1/bin/dita -i /Volumes/tmp/test.ditamap -f x -o test/dita-ot-$1/out -v
}

gen 2.3
gen 2.4
gen 2.5
