import React from 'react';

export default function Download() {
  return (
    <>
      <h3>Download</h3>
      <div className="col-md-12">
        <p>
          Download of generated DITA-OT PDF plugin will start immediately...
        </p>
        <p>
          See
          <a
            className="v3_5 hidden-when-disabled"
            target="_blank"
            href="https://www.dita-ot.org/3.5/topics/plugins-installing.html"
          >
            plugin installation documentation
          </a>
          <a
            className="v3_0 hidden-when-disabled"
            target="_blank"
            href="https://www.dita-ot.org/3.0/topics/plugins-installing.html"
          >
            plugin installation documentation
          </a>
          <a
            className="v2_5 hidden-when-disabled"
            target="_blank"
            href="https://www.dita-ot.org/2.5/dev_ref/plugins-installing.html"
          >
            plugin installation documentation
          </a>
          for next steps.
        </p>
        <h4 className="donation">Donations</h4>
        <p className="donation">
          The DITA-OT PDF plugin generator is developed as a spare time project
          by
          <a href="http://fi.linkedin.com/in/jelovirt">Jarno Elovirta</a> and is
          available for use free of charge. Donations are welcome per "value for
          value" model:
          <em>you give value only when you feel you have received value</em>.
        </p>
      </div>
    </>
  );
}
