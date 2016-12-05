# wheel
#### 基于d3框架实现的车轮控件
***
## 使用方法
#### 首次运行，需要安装npm依赖包
```npm install```
#### 开发阶段，webpack编译
```webpack --display-error-details```

#### js代码
```js
var wheelTemp = window.wheel("wheel");
var root = {
  id:'430002',
  name:'中科软',
  children:[{
    name:'节点1',
    children:[{
      name:'节点1的子'
    }]
  }]
};
wheelTemp.initWheel(root);
wheelTemp.onLeftChildClick = function(d) {
  //左车轮点击事件
  // console.log('left');
  // console.log(d);
}
wheelTemp.onRightChildClick = function(d) {
  //右车轮点击事件
  // console.log('right');
  // console.log(d);
}
``` 