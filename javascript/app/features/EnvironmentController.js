define([], function () {
  return function EnvironmentController() {
    $(":input[name='ot_version']").change(toolkitVersionChangeHandler).change()
    $(":input[name='formatter']").change(formatterHandler).change()

    function toolkitVersionChangeHandler(event) {
      toggleByClass($(event.target), 'v')
    }

    function formatterHandler(event) {
      toggleByClass($(event.target), 'f')
    }

    function toggleByClass(p, prefix) {
      const val = p.val()
      p.find('option').each(function () {
        const s = $(this).attr('value')
        const c = "." + prefix + s.replace(/\./g, '_')
        $(c).addClass('disabled').find(":input").attr('disabled', true)
      })
      p.find('option').each(function () {
        const s = $(this).attr('value')
        const c = "." + prefix + s.replace(/\./g, '_')
        if (val === s) {
          $(c).removeClass('disabled').find(":input").removeAttr('disabled')
        }
      })
    }
  }
})