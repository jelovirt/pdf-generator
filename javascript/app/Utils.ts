import $ from 'jquery';

export type Action = { type: 'SET'; value: string };

export function setAction(value: any): Action {
  return {
    type: 'SET',
    value,
  };
}

export function setError(input: JQuery, text: string | JQuery, tip?: string) {
  setMessage(input, 'err', text, tip);
  input.addClass('invalid');
}

export function setWarning(input: JQuery, text: string | JQuery, tip?: string) {
  setMessage(input, 'warn', text, tip);
  input.removeClass('invalid');
}

export function setOk(input: JQuery) {
  setMessage(input, 'ok');
  input.removeClass('invalid');
}

function setMessage(
  input: JQuery,
  level: 'warn' | 'err' | 'ok',
  text?: string | JQuery,
  tip?: string
) {
  let msg = input.nextAll('.msg');
  if (msg.length === 0) {
    msg = $("<span class='msg'></span>");
    input.after(msg);
  }
  msg.removeClass().addClass('msg ' + level);
  if (text !== undefined) {
    msg.html(text.toString());
  } else {
    msg.empty();
  }
  if (tip !== undefined) {
    msg.attr('title', tip);
  } else {
    msg.removeAttr('title');
  }
}

export function helpHandler(event: Event) {
  $(event.target!).parents('fieldset:first').find('.help').show('fast');
  event.stopPropagation();
  event.preventDefault();
  return false;
}

export function closeHandler(event: Event) {
  $(event.target!).parents('.help').hide('fast');
  event.stopPropagation();
  event.preventDefault();
  return false;
}
