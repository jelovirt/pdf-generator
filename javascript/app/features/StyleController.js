import $ from 'jquery'
import _ from 'lodash'
import StyleView from './StyleView'
import StyleModel from './StyleModel'
import StylePreviewController from './StylePreviewController'
import styles from '../../lib/styles'

export default function StyleController() {
  const view = StyleView()
  const allFields = getAllFields()
  const styleModel = StyleModel(view, allFields)

  const stylePreview = StylePreviewController()

  styleModel.change.subscribe(stylePreview.previewSpaceHandler)
  styleModel.fields.change()

  _.forEach(allFields, function(field) {
    view.$styleForm.find(":input[id='" + field + "']").change(styleEditorHandler)
  })

  var pdfStyleSelectorCurrent
  view.$styleSelector.change(styleHandler).val('body').change()

  return {
    $element: view.$element.add(stylePreview.$element)
  }

  function getAllFields() {
    return _(styles.styles).map(function(pv, e) {
      return _.map(pv, function(v, p) {
        return p
      })
    }).flatten().uniq().value()
  }

  /**
   * Change which style to edit
   * @param event UI change event
   */
  function styleHandler(event) {
    var target = $(event.target)
    var style = target.val()
    view.$styleForm.find('[data-style]').each(function() {
      var f = $(this)
      f.toggle($(this).attr('data-style').split(" ").indexOf(style) !== -1)
    })
    var type = target.find(":selected").parent("optgroup.block")
    const $blocks = view.$styleForm.find(".style-selector-block")
    if(type.length === 0) {
      view.$styleForm.find(".style-selector-block").hide().find(":input").attr('disabled', true)
    } else {
      view.$styleForm.find(".style-selector-block").show().find(":input").removeAttr('disabled')
    }
    pdfStyleSelectorCurrent = target.val()
    styleModel.readFromModel(target.val())
  }

  /**
   * Update store when UI changes
   * @param event UI change event
   */
  function styleEditorHandler(event) {
    var ui = $(event.target)
    var field = ui.attr('id')
    styleModel.writeFieldToModel(field, pdfStyleSelectorCurrent)
  }

}
