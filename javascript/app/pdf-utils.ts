import $ from 'jquery';

export function getVal(input: $): string {
  return input.val() !== '' ? input.val() : input.attr('placeholder');
}

/**
 * Convert length value to millimetres.
 *
 * @param val length with CSS unit
 * @return Number
 */
export function toMm(val: string): number | undefined {
  if (val === undefined) {
    return undefined;
  }
  const unit = val.substring(val.length - 2);
  const value = stripUnit(val);
  if (unit === 'cm') {
    return value * 10;
  } else if (unit === 'in') {
    return value * 25.4;
  } else if (unit === 'pt' || unit === 'px') {
    return (value * 25.4) / 72;
  } else if (unit === 'pc') {
    return ((value * 25.4) / 72) * 12;
  } else if (unit === 'mm') {
    return value;
  } else {
    return undefined;
  }

  function stripUnit(val: string): number {
    return Number(val.substring(0, val.length - 2));
  }
}

/**
 * Convert length value to points.
 *
 * @param val length with CSS unit
 * @return Number
 */
export function toPt(val: string): number | undefined {
  if (val === undefined) {
    return undefined;
  }
  const unit = val.substring(val.length - 2);
  const value = Number(val.substring(0, val.length - 2));
  if (unit === 'cm') {
    return (value / 2.54) * 72;
  } else if (unit === 'mm') {
    return (value / 25.4) * 72;
  } else if (unit === 'in') {
    return value * 72;
  } else if (unit === 'pc') {
    return value * 12;
  } else if (unit === 'em') {
    let v = $(":input[name='font-size.body']").val();
    return v.substring(0, v.length - 2) * value;
  } else if (unit === 'pt') {
    return value;
  } else {
    return undefined;
  }
}
