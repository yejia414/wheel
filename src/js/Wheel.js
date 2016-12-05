import * as d3 from "d3";
import * as WheelUtil from "./WheelUtil";
import opts  from "./WheelOpts";

const color = d3.scaleOrdinal(d3.schemeCategory20);
const color2 = d3.scaleOrdinal(['#5f9f9f','#a67d3d','#b87333','#2f4f2f','#7093db','#215121','#426f42','#527f76']);

export default class Wheel {

  constructor(svgId) {
    this.svg = d3.select(`#${svgId}`).append("svg").attr('class','wheel_svg');
    this.svg.attr("width", opts.width).attr("height", opts.height);
    WheelUtil.defMarker(this.svg);

    this.nodeList = [];
    this.lineList = [];
  }
  
  initLeftData(data) {
    if (data == null || data.children == null || data.children.length == 0) return;
    const center = opts.leftCenter;
    const root = {x:center.x, y:center.y, name:data.name, root:true, isRight:0, color:color(0) };
    this.nodeList.push(root);
    const size = data.children.length;
    
    for (let i = 0; i < size; i++) {
      const item = data.children[i];
      item.size = size;
      item.index = i;
      item.center = center;
      item.color = color(i+1);
      item.isRight = 0;
      this.nodeList.push(item);
      this.lineList.push({source:root, target:item});
    }
    WheelUtil.appendLine(this.svg, this.lineList, 'left');
    WheelUtil.appendBubble(this.svg, this.nodeList, 'left');
  }
  
  initRightData(data, dataIndex) {
    if (data == null || data.children == null || data.children.length == 0) return;
    const center = opts.rightCenter;
    const size = data.children.length;
    const nodeList = [];
    const lineList = [];
    
    const root = {x:center.x, y:center.y, name:data.name, root:true, color:data.color };
    nodeList.push(root);
    for (let i = 0; i < size; i++) {
      const item = data.children[i];
      item.size = size;
      item.index = i;
      item.color = color2(dataIndex*7);
      item.center = center;
      item.isRight = 1;
      nodeList.push(item);
      lineList.push({source:root, target:item});
    }

    WheelUtil.appendLine(this.svg, lineList, 'right');
    WheelUtil.appendBubble(this.svg, nodeList, 'right');
    //显示虚线
    WheelUtil.displayDashedLine(this.svg, 1);
    
    this.listenerRenderRight();
  }

  initWheel(data) {
    if (data == null || data.children == null || data.children.length == 0) return;
    //虚线
    WheelUtil.drawDashedLine(this.svg);
    //左轮
    this.initLeftData(data);
    //右轮
    this.initRightData(data.children[0], 0);

    //事件渲染
    this.listenerRenderLeft();
    this.listenerRenderRight();
  }
  async actived(d) {
    if( !d || !this.nodeList ) return;
    if(d.index == 0) return;
    const leftChildren = [];
    let activedNode = null;

    const size = this.nodeList.length;
    for(let i = 0; i < size; i++) {
      const node = this.nodeList[i];
      if(node.root) continue;
      if(d.id == node.id) {
        activedNode = node;
      }
      leftChildren.push(node);
    }
    if(!activedNode) return;
    this.isRotate = true;
    if(activedNode.index*2 < activedNode.size) { //逆时针 
      while(activedNode.index >= 0) {
        this.rotate(leftChildren, 0);
        await WheelUtil.sleep(15);
        if(activedNode.index == 0) break;
      }
    } else { //顺时针
      while(true) {
        this.rotate(leftChildren, 1);
        await WheelUtil.sleep(15);
        if(activedNode.index == 0) break;
      }
    }
    this.isRotate = false;
    WheelUtil.layoutBubble(this.svg.selectAll(`.bubble.child.left`), 'left', this.isRotate);
  }
  rotate(leftChildren, clockwise) {
    if(!leftChildren || leftChildren.length==0) return;
    for( let i = 0; i < leftChildren.length; i++) {
      const left = leftChildren[i];
      if(clockwise) left.index += 0.1;
      else left.index -= 0.1;
      left.index = Math.round(left.index*10)/10;
      if(left.index >= left.size) left.index -= left.size;
      if(left.index < 0) left.index += left.size;
    }
    WheelUtil.layoutBubble(this.svg.selectAll(`.bubble.child.left`), 'left', this.isRotate);
    WheelUtil.layoutLine(this.svg.selectAll(`.arrowLine.line.left`));
  }
  listenerRenderLeft() { //注册事件
    const bubblesLeftChild = this.svg.selectAll(".bubble.left.child");
    bubblesLeftChild.on("click",(d, i) => this.leftChildClick(d, i) );
  }
  listenerRenderRight() {
    const bubblesRightChild = this.svg.selectAll(".bubble.right.child");
    bubblesRightChild.on("click",(d, i) => this.rightChildClick(d, i) );
  }
  async leftChildClick(d, i) {
    if(this.isRotate) return;
    WheelUtil.displayDashedLine(this.svg, 0);//隐藏虚线
    this.svg.selectAll('.right').remove();
    await this.actived(d);
    this.initRightData(d, i);
    this.onLeftChildClick(d); //触发外部注入的事件
  }
  rightChildClick(d, i) {
    this.onRightChildClick(d);
  }
  //可外部注入的事件
  onLeftChildClick(d) {} 
  onRightChildClick(d) {}
}