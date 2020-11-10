import $ from 'jquery';
import { toPt, getVal } from './pdf-utils';

export default function PdfPreviewController(store) {
  const factor = 0.12;

  $(":input[name='title-numbering']").change(titleNumberingHandler).change();
  $(":input[name='table-numbering']," + ":input[name='figure-numbering']")
    .change(tableAndFigureNumberingHandler)
    .change();
  $(":input[name='dl']").change(definitionListHandler).change();
  $(":input[name='mirror-page-margins']").change(mirrorPageHandler).change();
  $(":input[name='task-label']").change(taskLabelHandler).change();
  $(":input[name='force-page-count']")
    .change(forcePageCountChangeHandler)
    .change();
  $(
    ":input[name='page-size']," +
      ":input[name='orientation']," +
      ":input[name='page-margin-top']," +
      ":input[name='page-margin-bottom']," +
      ":input[name='page-margin-inside']," +
      ":input[name='page-margin-outside']," +
      ":input[name='body-column-count']," +
      ":input[name='column-gap']"
  )
    .change(pageMarginHandler)
    .first()
    .change();

  function pageMarginHandler(event) {
    $('.example-page').each(function () {
      updatePageExample($(this));
    });
    $('.example-block-page').each(function () {
      updateFixedPageExample($(this));
    });

    /**
     * For pages with fixed factor
     */
    function updatePageExample(page) {
      const isOdd = page.is('.odd');
      const dim = readPageDimensions();

      page.height(dim.pageHeight * factor);
      page.width(dim.pageWidth * factor);

      const content = page.find('.example-page-body');
      content.css('margin-top', dim.marginTop * factor + 'px');
      content.css(
        isOdd ? 'margin-right' : 'margin-left',
        dim.marginOutside * factor + 'px'
      );
      content.css('margin-bottom', dim.marginBottom * factor + 'px');
      content.css(
        isOdd ? 'margin-left' : 'margin-right',
        dim.marginInside * factor + 'px'
      );
      content.height(
        (dim.pageHeight - dim.marginTop - dim.marginBottom) * factor
      );
      content.width(
        (dim.pageWidth - dim.marginInside - dim.marginOutside) * factor
      );

      const columns = Number($(":input[name='body-column-count']").val());
      const columnWidth = toPt(getVal($(":input[name='column-gap']")));
      const tr = page.find('.example-page-body tr');
      const buf = $('<tr></tr>');
      for (let i = 0; i < columns; i++) {
        if (i !== 0) {
          buf.append(
            $("<td class='gap'><span/></td>").width(columnWidth * factor)
          );
        }
        buf.append($('<td><div/></td>'));
      }
      tr.replaceWith(buf);
    }

    /**
     * For pages with fixed width
     */
    function updateFixedPageExample(page) {
      const dim = readPageDimensions();

      const blockWidth = 700;
      const factor = blockWidth / dim.pageWidth;

      const content = page.find('.example-page-content');
      content.css('margin-right', dim.marginOutside * factor + 'px');
      content.css('margin-left', dim.marginInside * factor + 'px');
    }
  }

  /**
   * Return page dimensions in points.
   */
  function readPageDimensions() {
    const res = new Dimensions();

    const pageSize = $(":input[name='page-size']").val().split(' ');
    if ($(':input[name=orientation]').val() === 'landscape') {
      res.pageWidth = toPt(pageSize[1]);
      res.pageHeight = toPt(pageSize[0]);
    } else {
      res.pageWidth = toPt(pageSize[0]);
      res.pageHeight = toPt(pageSize[1]);
    }
    res.marginTop = toPt(getVal($(":input[name='page-margin-top']")));
    res.marginOutside = toPt(getVal($(":input[name='page-margin-outside']")));
    res.marginBottom = toPt(getVal($(":input[name='page-margin-bottom']")));
    res.marginInside = toPt(getVal($(":input[name='page-margin-inside']")));

    return res;
  }

  function forcePageCountChangeHandler(event) {
    const target = $(event.target);
    $(
      '.force-page-count_example_auto, .force-page-count_example_odd, .force-page-count_example_even'
    ).each(function () {
      const t = $(this);
      if (t.is('.force-page-count_example_' + target.val())) {
        t.show();
      } else {
        t.hide();
      }
    });
  }

  function taskLabelHandler(event) {
    const target = $(event.target);
    const e = $('.example-task-label');
    if (target.is(':checked')) {
      e.show();
    } else {
      e.hide();
    }
  }

  function mirrorPageHandler(event) {
    const target = $(event.target);
    const evenPage = $('.even');
    if (target.prop('checked')) {
      evenPage.show();
    } else {
      evenPage.hide();
    }
    pageMarginHandler(event);
  }

  function definitionListHandler(event) {
    const target = $(event.target);
    $(
      "*[id='dl.example.html'], *[id='dl.example.list'], *[id='dl.example.table']"
    ).hide();
    $("*[id='dl.example." + target.val() + "']").show();
  }

  function titleNumberingHandler(event) {
    const target = $(event.target);
    const preview = $("*[id='title-numbering.example']");
    preview.children().hide();
    $("*[id='title-numbering.example." + target.val() + "']").show();
  }

  function tableAndFigureNumberingHandler(event) {
    const target = $(event.target);
    const preview = $("*[id='" + target.attr('name') + ".example']");
    if (target.val() === 'none') {
      preview.hide();
    } else {
      preview.show();
    }
  }
}

/**
 * Page dimensions in points.
 */
function Dimensions() {
  let pageWidth;
  let pageHeight;
  let marginTop;
  let marginOutside;
  let marginBottom;
  let marginInside;
}
