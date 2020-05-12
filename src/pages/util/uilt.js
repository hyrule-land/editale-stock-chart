// function isArrayAndNotEmpty(obj, key) {
//   return !!(_get(obj, key) && obj[key] && _isArray(obj[key]) && obj[key].length > 0);
// }

function isArrayAndNotEmpty(arr) {
  return Array.isArray(arr) && arr.length > 0;
}

export { isArrayAndNotEmpty };
