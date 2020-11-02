import $ from 'jquery';

export default {
  setError: setError,
  setWarning: setWarning,
  setOk: setOk,
  helpHandler: helpHandler,
  closeHandler: closeHandler,
};

export type Action = { type: 'SET'; value: string };

export function setAction(value: any): Action {
  return {
    type: 'SET',
    value,
  };
}

function setError(input: JQuery, text: string, tip?: string) {
  setMessage(input, 'err', text, tip);
  input.addClass('invalid');
}

function setWarning(input: JQuery, text: string, tip?: string) {
  setMessage(input, 'warn', text, tip);
  input.removeClass('invalid');
}

function setOk(input: JQuery) {
  setMessage(input, 'ok');
  input.removeClass('invalid');
}

function setMessage(
  input: JQuery,
  level: 'warn' | 'err' | 'ok',
  text?: string,
  tip?: string
) {
  let msg = input.nextAll('.msg');
  if (msg.length === 0) {
    msg = $("<span class='msg'></span>");
    input.after(msg);
  }
  msg.removeClass().addClass('msg ' + level);
  if (text !== undefined) {
    msg.html(text);
  } else {
    msg.empty();
  }
  if (tip !== undefined) {
    msg.attr('title', tip);
  } else {
    msg.removeAttr('title');
  }
}

function helpHandler(event: Event) {
  $(event.target!).parents('fieldset:first').find('.help').show('fast');
  event.stopPropagation();
  event.preventDefault();
  return false;
}

function closeHandler(event: Event) {
  $(event.target!).parents('.help').hide('fast');
  event.stopPropagation();
  event.preventDefault();
  return false;
}
