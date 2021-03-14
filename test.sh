#!/bin/bash

npx xslt3 -xsl:build/generator/links.sef.json -json:test/test.json
npx xslt3 -xsl:build/generator/links.sef.json -json:test/test.json -im:attr
npx xslt3 -xsl:build/generator/lists.sef.json -json:test/test.json
npx xslt3 -xsl:build/generator/lists.sef.json -json:test/test.json -im:attr
npx xslt3 -xsl:build/generator/pr-domain.sef.json -json:test/test.json
npx xslt3 -xsl:build/generator/pr-domain.sef.json -json:test/test.json -im:attr