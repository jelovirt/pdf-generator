import $ from 'jquery'

export default function CoverHandler() {
  $("#cover_image_chooser").change(coverChangeHandler).change()
}

function coverChangeHandler(event) {
  const target = $(event.target)
  const $all = $('#cover_image_file, #cover_image_metadata, #cover_image_topic')
  $('#cover_image_' + target.val()).prop('disable', false).show()
  $all.not('#cover_image_' + target.val()).prop('disable', true).hide()
}