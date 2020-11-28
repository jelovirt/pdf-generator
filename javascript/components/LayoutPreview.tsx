import React from 'react';
import { Length } from '../app/Model';
import { PreviewPage } from './PagePreview';

export default function LayoutPreview(props: {
  force_page_count: 'auto' | 'even' | 'odd';
  mirror_page_margins: boolean;
  page_size: string;
  orientation: 'portrait' | 'landscape';
  top: Length;
  outside: Length;
  bottom: Length;
  inside: Length;
}) {
  return (
    <div className="example-block col-md-7">
      {props.force_page_count === 'auto' && (
        <>
          <PreviewPage {...props} even={true} />
          {/*  title="Even page"*/}
          <PreviewPage {...props} even={false} cut_off={true} />
          {/*  title="Even odd, last page of chapter"*/}
          <PreviewPage {...props} even={true} />
          {/*  title="Even page, first page of chapter"*/}
          <PreviewPage {...props} even={false} />
          {/*  title="Odd page"*/}
        </>
      )}
      {props.force_page_count === 'even' && (
        <>
          <PreviewPage {...props} even={true} />
          {/*  title="Even page"*/}
          <PreviewPage {...props} even={false} cut_off={true} />
          {/*  title="Odd page, last page of chapter"*/}
          <PreviewPage {...props} even={true} blank={true} />
          {/*  title="Even page, blank page"*/}
          <PreviewPage {...props} even={false} />
          {/*  title="Odd page, first page of chapter"*/}
        </>
      )}
      {props.force_page_count === 'odd' && (
        <>
          <PreviewPage {...props} even={true} cut_off={true} />
          {/*  title="Even page, last page of chapter"*/}
          <PreviewPage {...props} even={false} />
          {/*  title="Odd page, blank page"*/}
          <PreviewPage {...props} even={true} />
          {/*  title="Even page, first page of chapter"*/}
          <PreviewPage {...props} even={false} />
          {/*  title="Odd page"*/}
        </>
      )}
    </div>
  );
}
