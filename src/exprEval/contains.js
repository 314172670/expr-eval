export default function contains(value, obj) {  //匹配数组包含
  if (value instanceof Array) {
    for (var i = 0; i < value.length; i++) {
      if (value[i] === obj) {
        return true;
      }
    }

  } else if (typeof (value) === "string") {  //匹配字符串包含
    return value.includes(obj)
  }
  return false;
}
