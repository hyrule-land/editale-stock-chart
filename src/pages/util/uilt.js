function isArrayAndNotEmpty(arr) {
  return Array.isArray(arr) && arr.length > 0;
}

// 获取字符串长度，区分半角字符和全角字符
function getStringLength(str) {
  let totalLength = 0;
  let list = str.split('');
  for (let i = 0; i < list.length; i++) {
    let s = list[i];
    if (s.match(/[\u0000-\u00ff]/g)) {
      //半角
      totalLength += 1;
    } else if (s.match(/[\u4e00-\u9fa5]/g)) {
      //中文
      totalLength += 2;
    } else if (s.match(/[\uff00-\uffff]/g)) {
      //全角
      totalLength += 2;
    }
  }
  return totalLength;
}

function ellipsisString(str, limit = 10) {
  let totalLength = 0;
  const list = str.split('');
  for (let i = 0; i < list.length; i++) {
    const s = list[i];
    if (s.match(/[\u0000-\u00ff]/g)) {
      //半角
      totalLength += 1;
    } else if (s.match(/[\u4e00-\u9fa5]/g)) {
      //中文
      totalLength += 2;
    } else if (s.match(/[\uff00-\uffff]/g)) {
      //全角
      totalLength += 2;
    }
    if (totalLength > limit * 2) {
      return `${str.substr(0, i)}...`;
    }
  }
  return str;
}

export { isArrayAndNotEmpty, getStringLength, ellipsisString };
