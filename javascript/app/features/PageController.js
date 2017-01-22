import $ from 'jquery'

export default function StyleController() {
  $(":input[name='body-column-count']").change(columnChangeHandler).change()

  /**
   * Show/hide column gap input based on column count.
   */
  function columnChangeHandler(event) {
    const target = $(event.target)
    if(target.val() === 1) {
      $(":input[name='column-gap']").prop('disable', true).parent().hide()
    } else {
      $(":input[name='column-gap']").prop('disable', false).parent().show()
    }
  }
}
