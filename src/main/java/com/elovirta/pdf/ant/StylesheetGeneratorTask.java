package com.elovirta.pdf.ant;

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
    private XdmItem xdmItem;

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

        xdmItem = parseTemplate();
        generate("front-matter.xsl", "xsl/fo/front-matter.xsl", null);
        generate("commons.xsl", "xsl/fo/commons.xsl", null);
        generate("tables.xsl", "xsl/fo/tables.xsl", null);
        generate("toc.xsl", "xsl/fo/toc.xsl", null);
        generate("links.xsl", "xsl/fo/links.xsl", null);
        generate("lists.xsl", "xsl/fo/lists.xsl", null);
        generate("pr-domain.xsl", "xsl/fo/pr-domain.xsl", null);
        generate("static-content.xsl", "xsl/fo/static-content.xsl", null);
        generate("topic.xsl", "xsl/fo/topic.xsl", null);
        generate("layout-masters.xsl", "cfg/fo/layout-masters.xsl", null);
        generate("front-matter.xsl", "cfg/fo/attrs/front-matter-attr.xsl", ATTR);
        generate("commons.xsl", "cfg/fo/attrs/commons-attr.xsl", ATTR);
        generate("layout-masters.xsl", "cfg/fo/attrs/layout-masters-attr.xsl", ATTR);
        generate("static-content.xsl", "cfg/fo/attrs/static-content-attr.xsl", ATTR);
        generate("tables.xsl", "cfg/fo/attrs/tables-attr.xsl", ATTR);
        generate("toc.xsl", "cfg/fo/attrs/toc-attr.xsl", ATTR);
        generate("tables.xsl", "cfg/fo/attrs/tables-attr.xsl", ATTR);
        generate("basic-settings.xsl", "cfg/fo/attrs/basic-settings.xsl", ATTR);
        generate("links.xsl", "cfg/fo/attrs/links-attr.xsl", ATTR);
        generate("lists.xsl", "cfg/fo/attrs/lists-attr.xsl", ATTR);
        generate("pr-domain.xsl", "cfg/fo/attrs/pr-domain-attr.xsl", ATTR);
        generate("topic.xsl", "cfg/fo/attrs/topic-attr.xsl", ATTR);
        final File shell = generate("shell.xsl", "xsl/fo/topic2fo_shell.xsl", null);
        for (String lang : new String[]{"de", "en", "es", "fi", "fr", "he", "it", "ja", "nl", "ro", "ru", "sl", "sv", "zh-CN"}) {
            generate("vars.xsl", String.format("cfg/common/vars/%s.xml", lang), null,
                    singletonMap(LANG, new XdmAtomicValue(lang)));
        }
    }

    private File generate(final String name, final String dst, final QName mode) throws BuildException {
        return generate(name, dst, mode, emptyMap());
    }

    private File generate(final String name, final String dst, final QName mode, final Map<QName, XdmAtomicValue> params) throws BuildException {
        final File dstFile = new File(dstDir.toURI().resolve(dst));
        getProject().log(this, String.format("Generating %s", dstFile.toURI()), Project.MSG_INFO);
        try {
            final String stylesheetUri = String.format("classpath:/%s", name);
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
        try {
            getProject().log(this, String.format("Reading %s", template.toURI()), Project.MSG_INFO);
            final XdmItem theme = xpathCompiler.evaluateSingle("json-doc(.)", new XdmAtomicValue(template.toURI()));

            final XsltExecutable executable = compiler.compile(resolver.resolve("classpath:/merge.xsl", null));
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
