import $ from 'jquery'
import StylePreviewView from './StylePreviewView'
import Utils from '../../app/pdf-utils'

const f = 0.9

export default function StylePreviewController() {
  const view = StylePreviewView()

  // styleModel.change.subscribe(previewSpaceHandler)
  return previewSpaceHandler

  function previewSpaceHandler(event) {
    var input = $(event.target)
    var id = input.attr('name')
    var idx = id.indexOf(".")
    var field = id.substring(0, idx)
    var type = id.substring(idx + 1)

    var v = Utils.getVal(input)
    if(v === undefined && input.data('inherit') !== undefined) {
      // FIXME this should not access form directly
      v = Utils.getVal($(":input[name='" + field + "." + input.data('inherit') + "']"))
    }

    var isLength = false
    var property
    switch (field) {
      case 'space-before':
        property = 'margin-top'
        isLength = true
        break
      case 'space-after':
        property = 'margin-bottom'
        isLength = true
        break
      case 'start-indent':
        property = 'margin-left'
        isLength = true
        break
      case 'end-indent':
        property = 'margin-right'
        isLength = true
        break
      case 'font-size':
        property = field
        isLength = true
        break
      case 'line-height':
        property = field
        isLength = isNaN(Number(v))
        break
      case 'text-align':
        property = field
        switch (v) {
          case 'start':
            v = 'left'
            break
          case 'end':
            v = 'right'
            break
        }
        break
      case "border-before-style":
      case "border-before-width":
      case "border-before-color":
      case "border-end-style":
      case "border-end-width":
      case "border-end-color":
      case "border-after-style":
      case "border-after-width":
      case "border-after-color":
      case "border-start-style":
      case "border-start-width":
      case "border-start-color":
        const tokens = field.split('-')
        switch (tokens[1]) {
          case "before":
            property = 'border-top-' + tokens[2]
            break
          case "end":
            property = 'border-right-' + tokens[2]
            break
          case "after":
            property = 'border-bottom-' + tokens[2]
            break
          case "start":
            property = 'border-left-' + tokens[2]
            break
        }
        isLength = false
        break;
      default:
        var all = view.$element.find("[data-field='" + field + "'][data-style='" + type + "']")
        if(all.length) {
          if(all.filter("[data-value]").length) {
            all.hide()
            all.filter("[data-value='" + v + "']").show()
          } else {
            all.text(v)
          }
        } else {
          property = field
        }
        break
    }
    if(property !== undefined) {
      if(isLength) {
        if(v === undefined) { // support undefined values
          return true
        }
        v = String(Utils.toPt(v) * f) + 'px'
      }
      view.$element.find("*[class~='example-page-content-" + type + "']").css(property, v)
    }

    // wrapper styling
    if (field === 'start-indent' && type === 'body') {
      view.$element.find('.wrapper > *').css('left', `-${v}`)
    }
  }
}
