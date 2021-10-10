export function getParamsCallback(func: Function): string | undefined {
  const stateKey = String(func).match(/\.((\w\.?)*);?/);
  if (stateKey && stateKey.length >= 2) {
    return stateKey[1];
  }

  return undefined;
}

export function isObject(item: object) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export function update(target: any, source: any) {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = update(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}
