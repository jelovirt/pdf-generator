import $ from 'jquery'
import template from '../../lib/header.html'

export default function HeaderController(model) {
  const $root = $('#p3')
  $root.append(template)

  $(':input[name="header.even"]').change(headerChange).change()
  $(':input[name="header.odd"]').change(headerChange).change()
  $(':input[name=drop-folio]').change(headerChange).change()

  function headerChange(event) {
    // FIXME this should get the current value from model, but this also should be triggered by change in model
    const mirrorPages = true // model.configuration.mirror_page_margins
    const __header_folio = ["pagenum"]
    if($(':input[name=drop-folio]').is(':checked')) {
      model.configuration.header.odd = getTokens($(':input[name="header.even"]'))
      model.configuration.footer.odd = __header_folio
      if (mirrorPages) {
        model.configuration.header.even = getTokens($(':input[name="header.odd"]'))
        model.configuration.footer.even = __header_folio
      }
    } else {
      model.configuration.header.odd = getTokens($(':input[name="header.even"]')).concat(__header_folio)
      model.configuration.footer.odd = []
      if (mirrorPages) {
        model.configuration.header.even = __header_folio.concat(getTokens($(':input[name="header.odd"]')))
        model.configuration.footer.even = []
      }
    }
    if (!mirrorPages) {
      delete model.configuration.header.even
      delete model.configuration.footer.even
    }
  }

  function getTokens(elem) {
    return (elem.val() || '').trim().split(/\s+/)
  }

}

