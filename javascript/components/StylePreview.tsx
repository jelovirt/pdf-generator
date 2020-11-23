import React from 'react';

export default function StylePreview() {
  return (
    <div className="example-block col-md-7" id="example-style">
      <div className="example-block-page" id="start-indent.examplex">
        <div className="example-page-content" id="text-align.examplex">
          <div className="example-page-content-topic">
            <span
              data-style="topic"
              data-field="title-numbering"
              data-value="true"
            >
              1{' '}
            </span>
            Heading 1
          </div>
          <div className="example-page-content-topic_topic">
            <span
              data-style="topic_topic"
              data-field="title-numbering"
              data-value="true"
            >
              1.1{' '}
            </span>
            Heading 2
          </div>
          <p className="example-page-content-body">
            The quick brown fox jumps over the lazy dog. The quick brown fox
            jumps over the lazy dog. The quick brown fox jumps over the lazy
            dog. The quick brown fox jumps over the lazy dog.
          </p>
          <table className="example-page-content-note">
            <tr>
              <td data-style="note" data-field="icon" data-value="icon">
                <img
                  src="../../public/images/hand.gif"
                  style={{ height: '16px' }}
                />
              </td>
              <td>
                <strong className="example-page-content-note-label">
                  Note:
                </strong>{' '}
                The quick brown fox jumps over the lazy dog.
              </td>
            </tr>
          </table>
          <p className="example-page-content-body">
            The quick brown fox jumps over the lazy dog. The quick brown fox
            jumps over the lazy dog. The quick brown fox jumps over the lazy
            dog. The quick brown fox jumps over the lazy dog. The quick brown
            fox jumps over the lazy dog.
          </p>
          <ol className="example-page-content-ol">
            <li>
              <span data-field="ol-before-1" data-style="ol"></span>
              <span data-field="ol-1" data-style="ol">
                1
              </span>
              <span data-field="ol-after-1" data-style="ol">
                .
              </span>
              The quick brown fox jumps over the lazy dog.
              <ol>
                <li>
                  <span data-field="ol-before-2" data-style="ol"></span>
                  <span
                    data-field="ol-sublevel"
                    data-style="ol"
                    data-value="true"
                  >
                    <span data-field="ol-1" data-style="ol">
                      1
                    </span>
                    .
                  </span>
                  <span data-field="ol-2" data-style="ol">
                    1
                  </span>
                  <span data-field="ol-after-2" data-style="ol">
                    .
                  </span>
                  The quick brown fox jumps over the lazy dog.
                  <ol>
                    <li>
                      <span data-field="ol-before-3" data-style="ol"></span>
                      <span
                        data-field="ol-sublevel"
                        data-style="ol"
                        data-value="true"
                      >
                        <span data-field="ol-1" data-style="ol">
                          1
                        </span>
                        .
                        <span data-field="ol-2" data-style="ol">
                          1
                        </span>
                        .
                      </span>
                      <span data-field="ol-3" data-style="ol">
                        1
                      </span>
                      <span data-field="ol-after-3" data-style="ol">
                        .
                      </span>
                      The quick brown fox jumps over the lazy dog.
                      <ol>
                        <li>
                          <span data-field="ol-before-4" data-style="ol"></span>
                          <span
                            data-field="ol-sublevel"
                            data-style="ol"
                            data-value="true"
                          >
                            <span data-field="ol-1" data-style="ol">
                              1
                            </span>
                            .
                            <span data-field="ol-2" data-style="ol">
                              1
                            </span>
                            .
                            <span data-field="ol-3" data-style="ol">
                              1
                            </span>
                            .
                          </span>
                          <span data-field="ol-4" data-style="ol">
                            1
                          </span>
                          <span data-field="ol-after-4" data-style="ol">
                            .
                          </span>
                          The quick brown fox jumps over the lazy dog.
                        </li>
                      </ol>
                    </li>
                  </ol>
                </li>
              </ol>
            </li>
          </ol>

          <ul className="example-page-content-ul">
            <li>
              <span data-field="ul-1" data-style="ul">
                &#x2022;
              </span>
              The quick brown fox jumps over the lazy dog.
              <ul>
                <li>
                  <span data-field="ul-2" data-style="ul">
                    &#x2022;
                  </span>
                  The quick brown fox jumps over the lazy dog.
                  <ul>
                    <li>
                      <span data-field="ul-3" data-style="ul">
                        &#x2022;
                      </span>
                      The quick brown fox jumps over the lazy dog.
                      <ul>
                        <li>
                          <span data-field="ul-4" data-style="ul">
                            &#x2022;
                          </span>
                          The quick brown fox jumps over the lazy dog.
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
          <dl
            className="example-page-content-dl"
            data-style="dl"
            data-field="dl-type"
            data-value="html"
            style={{ width: '100%' }}
          >
            <dt>
              <strong>Pangram</strong>
            </dt>
            <dd>The quick brown fox jumps over the lazy dog.</dd>
            <dt>
              <strong>XXX</strong>
            </dt>
            <dd>The quick brown fox jumps over the lazy dog.</dd>
          </dl>
          <table
            className="example-page-content-dl"
            data-style="dl"
            data-field="dl-type"
            data-value="table"
            style={{ width: '100%' }}
          >
            <colgroup>
              <col />
              <col style={{ width: '100%' }} />
            </colgroup>
            <tr>
              <th>
                <strong>Pangram</strong>
              </th>
              <td>The quick brown fox jumps over the lazy dog.</td>
            </tr>
            <tr>
              <th>
                <strong>XXX</strong>
              </th>
              <td>The quick brown fox jumps over the lazy dog.</td>
            </tr>
          </table>
          <ul
            className="example-page-content-dl"
            data-style="dl"
            data-field="dl-type"
            data-value="list"
            style={{ width: '100%' }}
          >
            <li>
              <strong>Pangram</strong>
              <br />
              The quick brown fox jumps over the lazy dog.
            </li>
            <li>
              <strong>XXX</strong>
              <br />
              The quick brown fox jumps over the lazy dog.
            </li>
          </ul>
          <p className="example-page-content-body">
            The quick brown{' '}
            <span className="example-page-content-link">fox jumps</span>
            <span
              data-style="link"
              data-field="link-page-number"
              data-value="true"
            >
              on page 42
            </span>
            over the lazy dog. The quick
            <span className="example-page-content-link">brown fox</span>
            <span data-style="link" data-field="link-url" data-value="true">
              at www.example.com
            </span>
            jumps over the lazy dog.
          </p>
          <p className="example-page-content-body">
            The
            <span className="example-page-content-tm">
              quick brown fox
              <span
                data-style="tm"
                data-field="symbol-scope"
                data-value="always"
              >
                ™
              </span>
              <span
                data-style="tm"
                data-field="symbol-scope"
                data-value="chapter"
              >
                ™
              </span>
            </span>
            jumps over the
            <span className="example-page-content-tm">
              lazy dog
              <span
                data-style="tm"
                data-field="symbol-scope"
                data-value="always"
              >
                ®
              </span>
              <span
                data-style="tm"
                data-field="symbol-scope"
                data-value="chapter"
              >
                ®
              </span>
            </span>
            . The
            <span className="example-page-content-tm">
              quick brown fox
              <span
                data-style="tm"
                data-field="symbol-scope"
                data-value="always"
              >
                ™
              </span>
            </span>
            jumps over the
            <span className="example-page-content-tm">
              lazy dog
              <span
                data-style="tm"
                data-field="symbol-scope"
                data-value="always"
              >
                ®
              </span>
            </span>
            .
          </p>
          <p className="example-page-content-section">Section title</p>
          <p className="example-page-content-body">
            The quick brown fox jumps over the lazy dog. The quick brown fox
            jumps over the lazy dog. The quick brown fox jumps over the lazy
            dog. The quick brown fox jumps over the lazy dog. The quick brown
            fox jumps over the lazy dog.
          </p>
          <div className="example-page-content-example wrapper">
            <p
              className="example-page-content-example_title"
              style={{ marginLeft: '0pt', marginRight: '0pt' }}
            >
              Example title
            </p>
            <p className="example-page-content-body">Example content</p>
          </div>
          <div className="example-page-content-topic_topic_topic">
            <span
              data-style="topic_topic_topic"
              data-field="title-numbering"
              data-value="true"
            >
              1.1.1{' '}
            </span>
            Heading 3
          </div>
          <p className="example-page-content-body">
            The quick brown fox jumps over the lazy dog. The quick brown fox
            jumps over the lazy dog. The quick brown fox jumps over the lazy
            dog. The quick brown fox jumps over the lazy dog.
          </p>
          <div className="example-page-content-topic_topic_topic_topic">
            <span
              data-style="topic_topic_topic_topic"
              data-field="title-numbering"
              data-value="true"
            >
              1.1.1.1{' '}
            </span>
            Heading 4
          </div>
          <p className="example-page-content-body">
            The quick brown fox jumps over the lazy dog. The quick brown fox
            jumps over the lazy dog. The quick brown fox jumps over the lazy
            dog. The quick brown fox jumps over the lazy dog.
          </p>
          <pre className="example-page-content-pre">
            The quick brown fox jumps over the lazy dog.
          </pre>
          <pre className="example-page-content-codeblock">
            <span
              data-style="codeblock"
              data-field="line-numbering"
              data-value="true"
            >
              1{' '}
            </span>
            (defun factorial (n)
            <span
              data-style="codeblock"
              data-field="line-numbering"
              data-value="true"
            >
              2{' '}
            </span>
            (if (&lt;= n 1)
            <span
              data-style="codeblock"
              data-field="line-numbering"
              data-value="true"
            >
              3{' '}
            </span>{' '}
            1
            <span
              data-style="codeblock"
              data-field="line-numbering"
              data-value="true"
            >
              4{' '}
            </span>{' '}
            (* n (factorial (- n 1)))))
          </pre>
          <p
            className="example-page-content-body example-page-content-table-title"
            data-style="table"
            data-field="caption-position"
            data-value="before"
          >
            <strong>
              Table
              <span
                data-style="table"
                data-field="caption-number"
                data-value="document"
              >
                4
              </span>
              <span
                data-style="table"
                data-field="caption-number"
                data-value="chapter"
              >
                1&#x2014;4
              </span>
              : Table caption
            </strong>
          </p>
          <table className="example-page-content-table" border="1">
            <tr className="example-page-content-tr">
              <td className="example-page-content-td">Dog</td>
              <td className="example-page-content-td">lazy</td>
            </tr>
            <tr className="example-page-content-tr">
              <td className="example-page-content-td">Fox</td>
              <td className="example-page-content-td">quick, brown</td>
            </tr>
          </table>
          <p
            className="example-page-content-body example-page-content-table-title"
            data-style="table"
            data-field="caption-position"
            data-value="after"
          >
            <strong>
              Table
              <span
                data-style="table"
                data-field="caption-number"
                data-value="document"
              >
                4
              </span>
              <span
                data-style="table"
                data-field="caption-number"
                data-value="chapter"
              >
                1&#x2014;4
              </span>
              : Table caption
            </strong>
          </p>
          <p
            className="example-page-content-body example-page-content-fig-title"
            data-style="fig"
            data-field="caption-position"
            data-value="before"
          >
            <strong>
              Figure
              <span
                data-style="fig"
                data-field="caption-number"
                data-value="document"
              >
                6
              </span>
              <span
                data-style="fig"
                data-field="caption-number"
                data-value="chapter"
              >
                1&#x2014;6
              </span>
              : Figure caption
            </strong>
          </p>
          <p className="example-page-content-fig">
            <img
              src="../../public/images/figure.png"
              style={{ height: '30px' }}
            />
          </p>
          <p
            className="example-page-content-body example-page-content-fig-title"
            data-style="fig"
            data-field="caption-position"
            data-value="after"
          >
            <strong>
              Figure
              <span
                data-style="fig"
                data-field="caption-number"
                data-value="document"
              >
                6
              </span>
              <span
                data-style="fig"
                data-field="caption-number"
                data-value="chapter"
              >
                1&#x2014;6
              </span>
              : Figure caption
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}
