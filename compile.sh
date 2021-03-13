#!/bin/bash

xslt3 -xsl:src/generator/links.xsl -export:build/generator/links.sef.json -nogo
xslt3 -xsl:src/generator/lists.xsl -export:build/generator/lists.sef.json -nogo