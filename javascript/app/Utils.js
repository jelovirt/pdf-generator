define([], function () {
  return {
    setError: setError,
    setWarning: setWarning,
    setOk: setOk,
    helpHandler: helpHandler,
    closeHandler: closeHandler
  }


  function setError(input, text, tip) {
    setMessage(input, "err", text, tip);
    input.addClass("invalid");
  }

  function setWarning(input, text, tip) {
    setMessage(input, "warn", text, tip);
    input.removeClass("invalid");
  }

  function setOk(input) {
    setMessage(input, "ok");
    input.removeClass("invalid");
  }

  function setMessage(input, level, text, tip) {
    var msg = input.nextAll(".msg");
    if (msg.length == 0) {
      msg = $("<span class='msg'></span>");
      input.after(msg);
    }
    msg.removeClass().addClass("msg " + level);
    if (text != undefined) {
      msg.html(text);
    } else {
      msg.empty();
    }
    if (tip != undefined) {
      msg.attr("title", tip);
    } else {
      msg.removeAttr("title");
    }
  }

  function helpHandler(event) {
    $(event.target).parents("fieldset:first").find(".help").show("fast");
    event.stopPropagation()
    event.preventDefault()
    return false
  }

  function closeHandler(event) {
    $(event.target).parents(".help").hide("fast");
    event.stopPropagation()
    event.preventDefault()
    return false
  }
})