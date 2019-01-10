//TODO:是否需要区分大小写
export default function like(value, obj) {
  if (value.startsWith("%") && value.endsWith("%")) {  //包含
    let v = value.substring(1, value.length - 1)
    return obj.includes(v)
  }
  else if (value.startsWith("%")) {  //以xx结尾
    let v = value.substring(1)
    return obj.endsWith(v)
  } else if (value.endsWith("%")) {  //以xx开头
    let v = value.substring(0, value.length - 1)
    return obj.startsWith(v)
  }
}