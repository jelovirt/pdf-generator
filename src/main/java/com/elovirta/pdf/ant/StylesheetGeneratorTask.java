package com.elovirta.pdf.ant;

import net.sf.saxon.s9api.*;
import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.Task;
import org.dita.dost.log.DITAOTAntLogger;
import org.dita.dost.util.XMLUtils;

import javax.xml.transform.Source;
import javax.xml.transform.TransformerException;
import javax.xml.transform.URIResolver;
import javax.xml.transform.stream.StreamSource;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;

import static java.util.Collections.emptyMap;
import static java.util.Collections.singletonMap;
import static org.dita.dost.util.Configuration.configuration;
import static org.dita.dost.util.Constants.ANT_REFERENCE_XML_UTILS;

public class StylesheetGeneratorTask extends Task {
    private File template;
    private File dstDir;
    private XMLUtils xmlUtils;
    private URIResolver resolver;

    private class ClasspathResolver implements URIResolver {
        @Override
        public Source resolve(String href, String base) throws TransformerException {
            URI abs = URI.create(href);
            if (!abs.isAbsolute()) {
                abs = URI.create(base).resolve(href);
            }
            if (!abs.getScheme().equals("classpath")) {
                throw new IllegalArgumentException(String.format("Only classpath URI scheme supported: %s", abs));
            }
            final String path = abs.getPath().startsWith("/") ? abs.getPath().substring(1) : abs.getPath();
            final InputStream resourceAsStream = getClass().getClassLoader().getResourceAsStream(path);
            return new StreamSource(resourceAsStream, abs.toString());
        }
    }

    @Override
    public void init() {
        resolver = new ClasspathResolver();
        xmlUtils = getProject().getReference(ANT_REFERENCE_XML_UTILS);
        if (xmlUtils == null) {
            xmlUtils = new XMLUtils();
            xmlUtils.setLogger(new DITAOTAntLogger(getProject()));
        }
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
        final QName attrMode = QName.fromClarkName("{}attr");
        generate("front-matter.xsl", "cfg/fo/attrs/front-matter-attr.xsl", attrMode);
        generate("commons.xsl", "cfg/fo/attrs/commons-attr.xsl", attrMode);
        generate("layout-masters.xsl", "cfg/fo/attrs/layout-masters-attr.xsl", attrMode);
        generate("static-content.xsl", "cfg/fo/attrs/static-content-attr.xsl", attrMode);
        generate("tables.xsl", "cfg/fo/attrs/tables-attr.xsl", attrMode);
        generate("toc.xsl", "cfg/fo/attrs/toc-attr.xsl", attrMode);
        generate("tables.xsl", "cfg/fo/attrs/tables-attr.xsl", attrMode);
        generate("basic-settings.xsl", "cfg/fo/attrs/basic-settings.xsl", attrMode);
        generate("links.xsl", "cfg/fo/attrs/links-attr.xsl", attrMode);
        generate("lists.xsl", "cfg/fo/attrs/lists-attr.xsl", attrMode);
        generate("pr-domain.xsl", "cfg/fo/attrs/pr-domain-attr.xsl", attrMode);
        generate("topic.xsl", "cfg/fo/attrs/topic-attr.xsl", attrMode);
        final File shell = generate("shell.xsl", "xsl/fo/topic2fo_shell.xsl", null);
//        getProject().setProperty(property, shell.getAbsolutePath());
        for (String lang : new String[] {"de", "en", "es", "fi", "fr", "he", "it", "ja", "nl", "ro", "ru", "sl", "sv", "zh-CN"}) {
            generate("vars.xsl", String.format("cfg/common/vars/%s.xml", lang), null,
                    singletonMap(QName.fromClarkName("{}lang"), new XdmAtomicValue(lang)));
        }
    }

    private File generate(final String name, final String dst, final QName mode) throws BuildException {
        return generate(name, dst, mode, emptyMap());
    }

    private File generate(final String name, final String dst, final QName mode, final Map<QName, XdmAtomicValue> params) throws BuildException {
        final File dstFile = new File(dstDir.toURI().resolve(dst));
        getProject().log(this, "Generating " + dstFile.toURI(), Project.MSG_INFO);
        try {
            final Processor processor = xmlUtils.getProcessor();
            final XsltCompiler compiler = processor.newXsltCompiler();
            compiler.setURIResolver(resolver);
            final String stylesheetUri = String.format("classpath:/%s", name);
            final XsltExecutable executable = compiler.compile(resolver.resolve(stylesheetUri, null));
            final Xslt30Transformer transformer = executable.load30();
            final Map<QName, XdmAtomicValue> parameters = getParameters();
            parameters.putAll(params);
            transformer.setStylesheetParameters(parameters);
            final XdmItem xdmItem = parseTemplate();
            transformer.setGlobalContextItem(xdmItem);
            if (mode != null) {
                transformer.setInitialMode(mode);
            }
            final Serializer destination = processor.newSerializer(dstFile);
            transformer.applyTemplates(xdmItem, destination);
            return dstFile;
        } catch (SaxonApiException | TransformerException e) {
            throw new BuildException(String.format("Failed to generate stylesheet %s", name), e);
        }
    }

    private XdmItem parseTemplate() {
        try {
            final XPathCompiler compiler = xmlUtils.getProcessor().newXPathCompiler();
            return compiler.evaluateSingle("json-doc(.)", new XdmAtomicValue(template.toURI()));
        } catch (SaxonApiException e) {
            throw new BuildException(String.format("Failed to parse template %s", template), e);
        }
    }

    private Map<QName, XdmAtomicValue> getParameters() {
        final Map<QName, XdmAtomicValue> parameters = new HashMap<>();
        parameters.put(QName.fromClarkName("{}version"), new XdmAtomicValue(configuration.get("otrelease")));
        String formatter = getProject().getProperty("pdf.formatter");
        if (formatter == null) {
            formatter = "fop";
        }
        parameters.put(QName.fromClarkName("{}formatter"), new XdmAtomicValue(formatter));
        return parameters;
    }

    public void setTemplate(final File template) {
        this.template = template;
    }

    public void setTodir(final File dstDir) {
        this.dstDir = dstDir;
    }
}
