#!/bin/bash

function gen {
  ./get.py -o test/dita-ot-$1/plugins localhost pdf $1
  ant -lib test/dita-ot-$1/lib -f test/dita-ot-$1/integrator.xml
  test/dita-ot-$1/bin/dita -i $PWD/test/dita-ot-$1/docsrc/userguide-book.ditamap -f print-pdf -o test/dita-ot-$1/out -v -Dclean.temp=no -t $PWD/test/dita-ot-$1/temp
}

#gen 2.3
gen 2.4
#gen 2.5
