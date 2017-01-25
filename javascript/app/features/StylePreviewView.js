import $ from 'jquery'
import template from '../../lib/style-preview.html'

export default function StylePreviewView() {
  const $root = $('#p4')

  const $preview = $(template({}))
  $root.append($preview)

  return {
    $element: $preview
  }
}
