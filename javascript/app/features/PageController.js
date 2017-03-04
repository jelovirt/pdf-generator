import $ from 'jquery'
import template from '../../lib/page.html'

export default function StyleController(model) {
  const $root = $('#p2')
  $root.append(template)

  $(":input[name=page-size]").change(pageSizeChangeHandler).change()
  $(":input[name=orientation]").change(pageSizeChangeHandler).change()
  $(":input[name=page-margin-top]").change(marginChangeHandler('top')).change()
  $(":input[name=page-margin-outside]").change(marginChangeHandler('outside')).change()
  $(":input[name=page-margin-bottom]").change(marginChangeHandler('bottom')).change()
  $(":input[name=page-margin-inside]").change(marginChangeHandler('inside')).change()
  $(":input[name=mirror-page-margins]").change(mirrorPageChangeHandler).change()
  $(":input[name=body-column-count]").change(columnChangeHandler('body_column_count')).change()
  $(":input[name=index-column-count]").change(columnChangeHandler('index_column_count')).change()
  $(":input[name=column-gap]").change(columnGapChangeHandler).change()

  function pageSizeChangeHandler(event) {
    const s = $(':input[name=page-size]').val().split(' ')
    if($(':input[name=orientation]').val() === 'landscape') {
      s.reverse()
    }
    model.configuration.page.width = s[0]
    model.configuration.page.height = s[1]
  }

  function marginChangeHandler(margin) {
    return (event) => {
      model.configuration.page[margin] = $(event.target).val() || '20mm'
    }
  }

  function columnChangeHandler(page) {
    return (event) => {
      const target = $(event.target)
      model.configuration[page] = Number(target.val())
      if(model.configuration.body_column_count === 1 && model.configuration.index_column_count === 1) {
        $(":input[name=column-gap]").prop('disabled', true).parent().hide()
      } else {
        $(":input[name=column-gap]").prop('disabled', false).parent().show()
      }
    }
  }

  function mirrorPageChangeHandler(event) {
    model.configuration.mirror_page_margins = $(event.target).is(':checked')
  }
  
  function columnGapChangeHandler(event) {
    model.configuration.column_gap = $(event.target).val()
  }
}

