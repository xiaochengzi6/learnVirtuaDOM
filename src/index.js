import { createElement,render, renderDom } from './element'
// +++ 引入diff和patch方法
import diff from './diff'
import patch from './patch'

let virtualDom = createElement('ul', { class: 'list' }, [
  createElement('li', { class: 'item' }, ['1']),
  createElement('li', { class: 'item' }, ['2']),
  createElement('li', { class: 'item' }, ['3'])
])
console.log("转js对象",virtualDom);
let el = render(virtualDom);
console.log("js的对象转 DOM",el)

renderDom(el,document.getElementById('root'));

// +++
// 创建另一个新的虚拟DOM
let virtualDom2 = createElement('ul', {class: 'list-group'}, [
  createElement('li', { class: 'item' }, ['9']),
  createElement('li', { class: 'item' }, ['10']),
  // createElement('li', { class: 'item' }, ['11'])
])
// diff一下两个不同的虚拟DOM
let patches = diff(virtualDom, virtualDom2);
console.log("不同点",patches);

/*优化的地方： 传入 virtualDOM 对象而不是 dom */
patch(el, patches);