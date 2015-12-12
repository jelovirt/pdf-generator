define([
    '../../app/Utils'
  ],
  function (Utils) {
    return function MetadataController() {
      const pluginPatter = new RegExp("[a-zA-Z\\-_]+(\\.[a-zA-Z\\-_]+)*")

      $(":input[name='transtype']").change(transtypeChangeHandler)

      /**
       * Validate transtype value.
       */
      function transtypeChangeHandler(event) {
        const id = $(event.target)
        const val = id.attr('value')
        if (!pluginPatter.test(val)) { //!namePattern.test(val)
          Utils.setError(id, $("<span>Not a valid XML name</span>"),
            "Type ID must be a valid XML name.")
        } else {
          Utils.setOk(id)
        }
      }
    }
  })