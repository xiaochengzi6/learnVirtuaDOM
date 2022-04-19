import { Element, render, setAttr } from './element';

let allPatches;
let index = 0; // 默认哪个需要打补丁
// patches 是当初给每个节点都创建了一个 {} 且都保存了一个数组中
function patch(node, patches) {
    allPatches = patches;
    // 给某个元素打补丁
    walk(node);
}
function walk(node) {
    let current = allPatches[index++];
    let childNodes = node.childNodes;

    // 先序深度，继续遍历递归子节点 多次执行 知道结束 每一个节点都会和之前的节点创建的 {} 做一次 如果判断语法 先从最后一个子节点开始判断。从最后一个往前遍历
    // 这里
    childNodes.forEach(child => { walk(child); })
    /*这里出现的问题就是 当节点删除的时候这个也会继续遍历删除节点的子节点导致出现问题。*/
    if (current) {
        doPatch(node, current);// 打上补丁
    }
}
function doPatch(node, patches) {
    // 遍历所有打过的补丁
    patches.forEach(patch => {
        switch (patch.type) {
            case 'ATTR':
                for (let key in patch.attr) {
                    let value = patch.attr[key];
                    if (value) {
                        setAttr(node, key, value);
                    } else {
                        node.removeAttribute(key);
                    }
                }
                break;
            case 'TEXT':
                node.textContent = patch.text;
                break;
            case 'REPLACE':
                let newNode = patch.newNode;
                // 如果是虚拟DOM，就继续递归渲染 // 不是就代表是文本节点，直接创建
                newNode = (newNode instanceof Element) ? render(newNode) : document.createTextNnode(newNode);
                // 调用父级parentNode的replaceChild方法替换为新的节点
                node.parentNode.replacechild(newNode, node);
                break;
            case 'REMOVE':
                // 这里还是有些问题主要在于遍历的时候是遍历的dom 节点而不是 js 的dom对象所以会出现一些 text的节点的问题导致不对劲
                // 这里是简单的实现
                console.log('到这里',node, patch.oldNode)
                let i = patch.index
                let curentNode = patch.oldNode
                console.log(node.parentNode.parentNode)
                let name = '.'+ curentNode.props.class 
                let removeNode = document.querySelectorAll(name)
                console.log(removeNode)
                node.parentNode.parentNode.removeChild(removeNode[i-2])
                break

            default:
                break;
        }
    })
}
export default patch;