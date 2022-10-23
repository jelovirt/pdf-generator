package com.elovirta.pdf.ant;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.google.common.annotations.VisibleForTesting;
import net.sf.saxon.s9api.*;
import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.Task;
import org.dita.dost.log.DITAOTAntLogger;
import org.dita.dost.util.XMLUtils;

import javax.xml.transform.TransformerException;
import javax.xml.transform.URIResolver;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;

import static java.util.Collections.emptyMap;
import static java.util.Collections.singletonMap;
import static org.dita.dost.util.Configuration.configuration;
import static org.dita.dost.util.Constants.ANT_REFERENCE_XML_UTILS;

public class StylesheetGeneratorTask extends Task {
    private static final QName LANG = QName.fromClarkName("{}lang");
    private static final QName ATTR = QName.fromClarkName("{}attr");
    private static final QName VERSION = QName.fromClarkName("{}version");
    private static final QName FORMATTER = QName.fromClarkName("{}formatter");

    private File template;
    private File dstDir;
    private XMLUtils xmlUtils;
    private URIResolver resolver;
    private Processor processor;
    private XsltCompiler compiler;
    private XPathCompiler xpathCompiler;
    private ObjectMapper yamlReader;
    private ObjectMapper jsonWriter;

    @Override
    public void init() {
        resolver = new ClasspathResolver();
        xmlUtils = getProject().getReference(ANT_REFERENCE_XML_UTILS);
        if (xmlUtils == null) {
            xmlUtils = new XMLUtils();
            xmlUtils.setLogger(new DITAOTAntLogger(getProject()));
        }
        processor = xmlUtils.getProcessor();
        compiler = processor.newXsltCompiler();
        compiler.setURIResolver(resolver);
        xpathCompiler = processor.newXPathCompiler();
        yamlReader = new ObjectMapper(new YAMLFactory());
        jsonWriter = new ObjectMapper();
    }

    @Override
    public void execute() throws BuildException {
        if (!dstDir.exists()) {
            try {
                dstDir = Files.createDirectories(dstDir.toPath()).toFile();
            } catch (IOException e) {
                throw new BuildException("Failed to generate stylesheet directory", e);
            }
        }

        final XdmItem xdmItem = parseTemplate();
        generate(xdmItem, "front-matter.xsl", "xsl/fo/front-matter.xsl", null);
        generate(xdmItem, "commons.xsl", "xsl/fo/commons.xsl", null);
        generate(xdmItem, "tables.xsl", "xsl/fo/tables.xsl", null);
        generate(xdmItem, "toc.xsl", "xsl/fo/toc.xsl", null);
        generate(xdmItem, "links.xsl", "xsl/fo/links.xsl", null);
        generate(xdmItem, "lists.xsl", "xsl/fo/lists.xsl", null);
        generate(xdmItem, "pr-domain.xsl", "xsl/fo/pr-domain.xsl", null);
        generate(xdmItem, "static-content.xsl", "xsl/fo/static-content.xsl", null);
        generate(xdmItem, "topic.xsl", "xsl/fo/topic.xsl", null);
        generate(xdmItem, "layout-masters.xsl", "cfg/fo/layout-masters.xsl", null);
        generate(xdmItem, "front-matter.xsl", "cfg/fo/attrs/front-matter-attr.xsl", ATTR);
        generate(xdmItem, "commons.xsl", "cfg/fo/attrs/commons-attr.xsl", ATTR);
        generate(xdmItem, "layout-masters.xsl", "cfg/fo/attrs/layout-masters-attr.xsl", ATTR);
        generate(xdmItem, "static-content.xsl", "cfg/fo/attrs/static-content-attr.xsl", ATTR);
        generate(xdmItem, "tables.xsl", "cfg/fo/attrs/tables-attr.xsl", ATTR);
        generate(xdmItem, "toc.xsl", "cfg/fo/attrs/toc-attr.xsl", ATTR);
        generate(xdmItem, "tables.xsl", "cfg/fo/attrs/tables-attr.xsl", ATTR);
        generate(xdmItem, "basic-settings.xsl", "cfg/fo/attrs/basic-settings.xsl", ATTR);
        generate(xdmItem, "links.xsl", "cfg/fo/attrs/links-attr.xsl", ATTR);
        generate(xdmItem, "lists.xsl", "cfg/fo/attrs/lists-attr.xsl", ATTR);
        generate(xdmItem, "pr-domain.xsl", "cfg/fo/attrs/pr-domain-attr.xsl", ATTR);
        generate(xdmItem, "topic.xsl", "cfg/fo/attrs/topic-attr.xsl", ATTR);
        final File shell = generate(xdmItem, "shell.xsl", "xsl/fo/topic2fo_shell.xsl", null);
        for (String lang : new String[]{"de", "en", "es", "fi", "fr", "he", "it", "ja", "nl", "ro", "ru", "sl", "sv", "zh-CN"}) {
            generate(xdmItem, "vars.xsl", String.format("cfg/common/vars/%s.xml", lang), null,
                    singletonMap(LANG, new XdmAtomicValue(lang)));
        }
    }

    private File generate(final XdmItem xdmItem,
                          final String name,
                          final String dst,
                          final QName mode) throws BuildException {
        return generate(xdmItem, name, dst, mode, emptyMap());
    }

    @VisibleForTesting
    File generate(final XdmItem xdmItem,
                  final String name,
                  final String dst,
                  final QName mode,
                  final Map<QName, XdmAtomicValue> params) throws BuildException {
        final File dstFile = new File(dstDir.toURI().resolve(dst));
        getProject().log(this, String.format("Generating %s", dstFile.toURI()), Project.MSG_INFO);
        try {
            final String stylesheetUri = String.format("classpath:/com/elovirta/pdf/%s", name);
            final XsltExecutable executable = compiler.compile(resolver.resolve(stylesheetUri, null));
            final Xslt30Transformer transformer = executable.load30();
            final Map<QName, XdmAtomicValue> parameters = getParameters();
            parameters.putAll(params);
            transformer.setStylesheetParameters(parameters);
            transformer.setGlobalContextItem(xdmItem);
            if (mode != null) {
                transformer.setInitialMode(mode);
            }
            final Serializer destination = processor.newSerializer(dstFile);
            destination.setOutputProperty(Serializer.Property.METHOD, "xml");
            transformer.applyTemplates(xdmItem, destination);
            destination.close();
            return dstFile;
        } catch (SaxonApiException | TransformerException e) {
            throw new BuildException(String.format("Failed to generate stylesheet %s", name), e);
        }
    }

    @VisibleForTesting
    XdmItem parseTemplate() {
        getProject().log(this, String.format("Reading %s", template.toURI()), Project.MSG_INFO);
        final String name = template.getName().toLowerCase();
        try {
            final XsltExecutable executable = compiler.compile(resolver.resolve("classpath:/com/elovirta/pdf/merge.xsl", null));
            final XdmItem merged;
            // XXX: Saxon's JSON functions don't use URIResolver, so have to parse manually
            if (name.endsWith(".yml") || name.endsWith(".yaml")) {
                merged = parseYamlTemplate(executable, parseYaml(template.toURI()), template.toURI());
            } else {
                merged = parseJsonTemplate();
            }
            return resolveVariables(executable, merged);
        } catch (SaxonApiException | TransformerException e) {
            throw new BuildException(String.format("Failed to parse template %s", template), e);
        }
    }

    private XdmItem resolveVariables(final XsltExecutable executable, final XdmItem base) {
        try {
            final Xslt30Transformer transformer = executable.load30();
            final XdmValue resolved = transformer.callFunction(QName.fromClarkName("{x}resolve"), new XdmValue[]{
                    base
            });
            final XdmValue expanded = transformer.callFunction(QName.fromClarkName("{x}expandShorthand"), new XdmValue[]{
                    resolved
            });
            return expanded.itemAt(0);
        } catch (SaxonApiException e) {
            throw new BuildException("Failed to resolve variables", e);
        }
    }

    private XdmItem parseJsonTemplate() {
        try {
            final XdmItem theme = xpathCompiler.evaluateSingle("json-doc(.)", new XdmAtomicValue(template.toURI()));
            final XsltExecutable executable = compiler.compile(resolver.resolve("classpath:/com/elovirta/pdf/merge.xsl", null));
            final Xslt30Transformer transformer = executable.load30();
            final Map<QName, XdmItem> parameters = singletonMap(
                    QName.fromClarkName("{}base-url"), new XdmAtomicValue(template.toURI())
            );
            transformer.setStylesheetParameters(parameters);
            transformer.setGlobalContextItem(theme);
            return transformer.applyTemplates(theme).itemAt(0);
        } catch (TransformerException | SaxonApiException e) {
            throw new BuildException(String.format("Failed to parse template %s", template), e);
        }
    }

    private XdmItem parseYamlTemplate(final XsltExecutable executable, final XdmItem base, final URI url) {
        try {
            final Xslt30Transformer transformer = executable.load30();
            final XdmItem extendsValue = xpathCompiler.evaluateSingle(". ?extends", base);
            if (extendsValue != null) {
                final URI extendsUri = url.resolve(extendsValue.getStringValue());
                final XdmItem extendsRes = parseYamlTemplate(executable, parseYaml(extendsUri), url);
                final XdmValue flattened = transformer.callFunction(QName.fromClarkName("{x}flatten"), new XdmValue[]{
                        base
                });
                final XdmValue normalized = transformer.callFunction(QName.fromClarkName("{x}normalize"), new XdmValue[]{
                        flattened, XdmEmptySequence.getInstance(), new XdmAtomicValue(extendsUri)
                });
                return transformer.callFunction(QName.fromClarkName("{x}merge"), new XdmValue[]{
                        extendsRes.stream().asXdmValue(), normalized
                }).itemAt(0);
            } else {
                final XdmValue flattened = transformer.callFunction(QName.fromClarkName("{x}flatten"), new XdmValue[]{
                        base
                });
                final XdmValue normalized = transformer.callFunction(QName.fromClarkName("{x}normalize"), new XdmValue[]{
                        flattened, XdmEmptySequence.getInstance(), new XdmAtomicValue(url)
                });
                return normalized.itemAt(0);
            }
        } catch (SaxonApiException e) {
            throw new BuildException(String.format("Failed to parse template %s", template), e);
        }
    }

    private XdmItem parseYaml(final URI abs) {
        try {
            final Object yaml = yamlReader.readValue(abs.toURL(), Object.class);
            final String json = jsonWriter.writeValueAsString(yaml);
            return xpathCompiler.evaluateSingle("parse-json(.)", new XdmAtomicValue(json));
        } catch (SaxonApiException | IOException e) {
            e.printStackTrace();
            throw new BuildException("Failed to convert YAML to JSON: " + e.getMessage(), e);
        }
    }

    private Map<QName, XdmAtomicValue> getParameters() {
        final Map<QName, XdmAtomicValue> parameters = new HashMap<>();
        parameters.put(VERSION, new XdmAtomicValue(configuration.get("otrelease")));
        String formatter = getProject().getProperty("pdf.formatter");
        if (formatter == null) {
            formatter = "fop";
        }
        parameters.put(FORMATTER, new XdmAtomicValue(formatter));
        return parameters;
    }

    public void setTemplate(final File template) {
        this.template = template;
    }

    public void setTodir(final File dstDir) {
        this.dstDir = dstDir;
    }
}
