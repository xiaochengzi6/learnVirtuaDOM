class Element {
    constructor(type, props, children) {
        this.type = type;
        this.props = props;
        this.children = children;
    }
}
function createElement(type, props, children) {
    return new Element(type, props, children);
}

// render 方法可以将虚拟dom转换成真实dom
/**
 *接收一个对象三个值
 *
 * @param {*} type 元素类型
 * @param {*} props 元素的参数 对象
 * @param {*} children 子节点 
 */
function render(domObj) {
    // 根据（父元素）type类型来创建对应的元素
    let el = document.createElement(domObj.type);

    // 再去遍历props属性对象，然后给创建的元素el设置属性
    for (let key in domObj.props) {
        // 设置属性的方法
        setAttr(el, key, domObj.props[key]);
    }
    // 遍历子节点
    // 如果是虚拟DOM，就继续递归渲染
    // 不是就代表是文本节点，直接创建
    domObj.children.forEach(child => {
        child = (child instanceof Element) ?
            render(child) : document.createTextNode(child);
        //添加到对应的元素内
        el.appendChild(child);
    })
    return el;
}
function setAttr(node, key, value) {
    switch (key) {
        case 'value':
            // node是一个input或者textarea就直接设置其value即可 node.tagName = 'DIV' toLowerCase() 转换为小写
            if (node.tagName.toLowerCase() === 'input' ||
                node.tagName.toLowerCase() === 'textarea') {
                node.value = value;
            } else {
                node.setAttribute(key, value);
            }
            break
        case 'style':
            // 直接赋值行内样式
            node.style.cssText = value;
            break;
        default:
            node.setAttribute(key, value);
            break;
    }
}
function renderDom(el, target) {
    target.appendChild(el)
}
export {
    Element,
    createElement,
    render,
    setAttr,
    renderDom
};

