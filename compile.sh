#!/bin/bash

rm build/generator/*
for f in src/generator/*.xsl; do
  file=${f##*/}
  base=${file%%.*}
  echo $base
  xslt3 "-xsl:src/generator/${base}.xsl" "-export:build/generator/${base}.sef.json" -nogo
done
