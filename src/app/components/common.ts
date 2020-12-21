export const nextValue = (value: string, direction: 1 | -1) => {
  const unit = value.replaceAll(/[\d\.]+/g, '');
  const num = Number(unit ? value.substring(0, value.indexOf(unit)) : value);
  if (Number.isNaN(num)) {
    return value;
  }
  let res: number;
  switch (unit) {
    case 'mm':
    case 'pt':
    case 'pc':
    case 'px':
      res = num + direction;
      break;
    case '':
    case 'cm':
    case 'in':
    case 'em':
    default:
      // Hack around floating point number increments
      res = (num * 10 + 1 * direction) / 10;
      break;
  }
  return `${res}${unit}`;
};
