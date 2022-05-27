#!/bin/bash

rm build/generator/*
for f in src/generator/com/elovirta/pdf/*.xsl; do
  file=${f##*/}
  base=${file%%.*}
  echo $base
  xslt3 "-xsl:src/generator/com/elovirta/pdf/${base}.xsl" "-export:build/generator/${base}.sef.json" -nogo
done
