import $ from 'jquery'
import template from '../../lib/page.html'

export default function StyleController(model) {
  const $element = $(template)

  $element.find(":input[name=page-size]").change(pageSizeChangeHandler).change()
  $element.find(":input[name=orientation]").change(pageSizeChangeHandler).change()
  $element.find(":input[name=page-margin-top]").change(marginChangeHandler('top')).change()
  $element.find(":input[name=page-margin-outside]").change(marginChangeHandler('outside')).change()
  $element.find(":input[name=page-margin-bottom]").change(marginChangeHandler('bottom')).change()
  $element.find(":input[name=page-margin-inside]").change(marginChangeHandler('inside')).change()
  $element.find(":input[name=mirror-page-margins]").change(mirrorPageChangeHandler).change()
  $element.find(":input[name=body-column-count]").change(columnChangeHandler('body_column_count')).change()
  $element.find(":input[name=index-column-count]").change(columnChangeHandler('index_column_count')).change()
  $element.find(":input[name=column-gap]").change(columnGapChangeHandler).change()

  return {
    $element: $element
  }

  function pageSizeChangeHandler(event) {
    const s = $element.find(':input[name=page-size]').val().split(' ')
    if($element.find(':input[name=orientation]').val() === 'landscape') {
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
        $element.find(":input[name=column-gap]").prop('disabled', true).parent().hide()
      } else {
        $element.find(":input[name=column-gap]").prop('disabled', false).parent().show()
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

