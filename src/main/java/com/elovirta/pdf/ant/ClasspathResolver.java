package com.elovirta.pdf.ant;

import javax.xml.transform.Source;
import javax.xml.transform.TransformerException;
import javax.xml.transform.URIResolver;
import javax.xml.transform.stream.StreamSource;
import java.io.InputStream;
import java.net.URI;

class ClasspathResolver implements URIResolver {
    private static final String CLASSPATH_SCHEME = "classpath";

    @Override
    public Source resolve(String href, String base) throws TransformerException {
        URI abs = URI.create(href);
        if (!abs.isAbsolute()) {
            abs = URI.create(base).resolve(href);
        }
        if (!abs.getScheme().equals(CLASSPATH_SCHEME)) {
            throw new IllegalArgumentException(String.format("Only %s URI scheme supported: %s", CLASSPATH_SCHEME, abs));
        }
        String path = abs.getPath();
        if (path.startsWith("/")) {
            path = path.substring(1);
        }
        final InputStream resourceAsStream = getClass().getClassLoader().getResourceAsStream(path);
        if (resourceAsStream == null) {
            throw new TransformerException(String.format("%s not found", abs));
        }
        return new StreamSource(resourceAsStream, abs.toString());
    }
}
