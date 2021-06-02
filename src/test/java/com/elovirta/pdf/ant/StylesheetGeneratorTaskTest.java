package com.elovirta.pdf.ant;

import net.sf.saxon.s9api.*;
import org.apache.tools.ant.Project;
import org.dita.dost.log.DITAOTAntLogger;
import org.dita.dost.util.XMLUtils;
import org.json.JSONException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.skyscreamer.jsonassert.JSONCompareMode;

import java.io.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.stream.Collectors;

import static java.util.Collections.emptyMap;
import static org.dita.dost.util.Constants.ANT_REFERENCE_XML_UTILS;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.skyscreamer.jsonassert.JSONAssert.assertEquals;

public class StylesheetGeneratorTaskTest {

    private XMLUtils xmlUtils;
    private StylesheetGeneratorTask task;
    private XPathCompiler xpathCompiler;

    @BeforeEach
    public void setUp() {
        xmlUtils = new XMLUtils();
        xpathCompiler = xmlUtils.getProcessor().newXPathCompiler();
        final Project project = new Project();
        xmlUtils.setLogger(new DITAOTAntLogger(project));
        project.addReference(ANT_REFERENCE_XML_UTILS, xmlUtils);
        task = new StylesheetGeneratorTask();
        task.setProject(project);
        task.init();
    }

    @Test
    public void getTemplate_normalizeImage() throws URISyntaxException, SaxonApiException, JSONException {
        final URI src = getClass().getClassLoader().getResource("src/image.json").toURI();
        task.setTemplate(new File(src));

        final XdmValue act = task.parseTemplate();

        final String image = src.resolve("image/logo.svg").toString();
        final String exp = "{\"style\":{"
                + "\"body\":{\"background-image\":\"url('" + image + "')\"},"
                + "\"topic\":{\"background-image\":\"url('" + image + "')\"},"
                + "\"topic.topic\":{\"background-image\":\"url('" + image + "')\"}"
                + "}}";
        assertEquals(exp, toString(act),
                JSONCompareMode.STRICT);
    }

    @Test
    public void getTemplate_empty() throws URISyntaxException, SaxonApiException, JSONException {
        final URI src = getClass().getClassLoader().getResource("src/empty.json").toURI();
        task.setTemplate(new File(src));

        final XdmValue act = task.parseTemplate();

        final String image = src.resolve("image/logo.svg").toString();
        final String exp = "{\"style\":{}}";
        assertEquals(exp, toString(act),
                JSONCompareMode.STRICT);
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "front-matter.xsl",
            "commons.xsl",
            "tables.xsl",
            "toc.xsl",
            "links.xsl",
            "lists.xsl",
            "pr-domain.xsl",
            "static-content.xsl",
            "topic.xsl",
            "layout-masters.xsl",
            "front-matter.xsl",
            "commons.xsl",
            "layout-masters.xsl",
            "static-content.xsl",
            "tables.xsl",
            "toc.xsl",
            "tables.xsl",
            //"basic-settings.xsl",
            "links.xsl",
            "lists.xsl",
            "pr-domain.xsl",
            "topic.xsl",
//            "shell.xsl",
//            "vars.xsl"
    })
    public void generate_empty(final String stylesheet, final @TempDir Path tempDir) throws SaxonApiException {
        task.setTodir(tempDir.toFile());
        final XdmItem theme = xpathCompiler.evaluateSingle("parse-json(.)", new XdmAtomicValue("{\"style\":{}}"));

        task.generate(theme, stylesheet, stylesheet, null, emptyMap());
        task.generate(theme, stylesheet, stylesheet, QName.fromClarkName("{}attr"), emptyMap());

        assertTrue(Files.exists(tempDir.resolve(stylesheet)));
    }

    public void generate_empty_shell(final @TempDir Path tempDir) throws SaxonApiException {
        final String stylesheet = "shell.xsl";
        task.setTodir(tempDir.toFile());
        final XdmItem theme = xpathCompiler.evaluateSingle("parse-json(.)", new XdmAtomicValue("{\"style\":{}}"));

        task.generate(theme, stylesheet, stylesheet, null, emptyMap());

        assertTrue(Files.exists(tempDir.resolve(stylesheet)));
    }

    public void generate_empty_basicSettings(final @TempDir Path tempDir) throws SaxonApiException {
        final String stylesheet = "basic-settings.xsl";
        task.setTodir(tempDir.toFile());
        final XdmItem theme = xpathCompiler.evaluateSingle("parse-json(.)", new XdmAtomicValue("{\"style\":{}}"));

        task.generate(theme, stylesheet, stylesheet, QName.fromClarkName("{}attr"), emptyMap());

        assertTrue(Files.exists(tempDir.resolve(stylesheet)));
    }

    @Test
    public void getTemplate_normalize() throws URISyntaxException, SaxonApiException, JSONException {
        task.setTemplate(new File(getClass().getClassLoader().getResource("src/authored.json").toURI()));

        final XdmValue act = task.parseTemplate();

        assertEquals(readToString("exp/authored.json"), toString(act),
                JSONCompareMode.STRICT);
    }

    @Test
    public void getTemplate() throws URISyntaxException, SaxonApiException, JSONException {
        task.setTemplate(new File(getClass().getClassLoader().getResource("src/theme.json").toURI()));

        final XdmValue act = task.parseTemplate();

        assertEquals(readToString("exp/theme.json"), toString(act),
                JSONCompareMode.STRICT);
    }

    private String readToString(final String name) {
        final InputStream baseInput = getClass().getClassLoader().getResourceAsStream(name);
        return new BufferedReader(new InputStreamReader(baseInput, StandardCharsets.UTF_8))
                .lines()
                .collect(Collectors.joining("\n"));
    }

    private String toString(final XdmValue act) throws SaxonApiException {
        final StringWriter buf = new StringWriter();
        final Serializer serializer = xmlUtils.getProcessor().newSerializer(buf);
        serializer.setOutputProperty(Serializer.Property.METHOD, "json");
        serializer.serializeXdmValue(act.itemAt(0));
        return buf.toString();
    }

}