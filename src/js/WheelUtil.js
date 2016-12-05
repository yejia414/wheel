
import opts  from "./WheelOpts";


const defMarker = svg => { //定义箭头
  const marker = svg.append('marker');
  marker.attr('id', 'markerArrow');
  marker.attr('markerWidth', 8);
  marker.attr('markerHeight', 8);
  marker.attr('refX', 4);
  marker.attr('refY', 4);
  marker.attr('orient', 'auto');
  const path = marker.append('path');
  path.attr('d', 'M0,0 L8,4 L0,8 L3,4 L0,0');
  path.attr('style', 'fill: rgb(99,99,99);');
}
const appendBubble = (svg, nodeList, clazz) => {
  const bubbles = svg.selectAll(`.bubble.${clazz}`)
    .data(nodeList)
    .enter().append("g");
    
  const circle = bubbles.append("circle");
  circle.attr("r", opts.itemRadius);
  // circle.style("fill", (d, i) => d.color );
  bubbles.append("text").text(function (d, i) {
      return d.name;
  });
  layoutBubble(bubbles, clazz);
}
const layoutBubble = (bubble, clazz, isRotate) => {
  bubble.attr("class", d => {
    if(d.root) return `bubble root ${clazz}`;
    if(d.index==0 && !isRotate) return `bubble child ${clazz} actived`;
    return `bubble child ${clazz}`;
  } );
  const circle = bubble.select('circle');
  circle.attr('cx', d => {
    if(d.root) return d.x;
    return d.center.x + Math.cos(getAngle(d)) * opts.wheelRadius;
  } );
  circle.attr('cy', d => {
    if(d.root) return d.y;
    return d.center.y + Math.sin(getAngle(d)) * opts.wheelRadius;
  } );
  const text = bubble.select('text');
  text.attr("x", d => {
    if(d.root) return d.x;
    return d.center.x + Math.cos(getAngle(d)) * opts.wheelRadius;
  } );
  text.attr("y", d => {
    if(d.root) return d.y+3;
    return d.center.y + Math.sin(getAngle(d)) * opts.wheelRadius+3;
  } );
}

const appendLine = (svg, lineList, clazz) => {
  const line = svg.selectAll(`.arrowLine.line.${clazz}`).data(lineList).enter().append('line');
  line.attr("class", d => `arrowLine line ${clazz}` );
  line.attr('marker-end', "url(#markerArrow)");
  layoutLine(line);
}
const layoutLine = line => {
  line.attr('x1', (d, i) => (d.target.center.x + Math.cos(getAngle(d.target)) * opts.itemRadius));
  line.attr('y1', (d, i) => (d.target.center.y + Math.sin(getAngle(d.target)) * opts.itemRadius));
  //若加上箭头，则应再减5
  line.attr('x2', (d, i) => (d.target.center.x + Math.cos(getAngle(d.target)) * (opts.wheelRadius - opts.itemRadius - 5)));
  line.attr('y2', (d, i) => (d.target.center.y + Math.sin(getAngle(d.target)) * (opts.wheelRadius - opts.itemRadius - 5)));
}
const getAngle = d => {
  const avgAngle = 2 * Math.PI / d.size;
  let angle = avgAngle * d.index;
  if(d.isRight && d.size%2==0) angle += avgAngle/2;
  return angle;
}
const drawDashedLine = (svg) => {
  const x1 = opts.leftCenter.x + opts.wheelRadius + opts.itemRadius;
  const y1 = opts.leftCenter.y;
  const x2 = opts.rightCenter.x - opts.itemRadius;
  const y2 = opts.rightCenter.y;
  const line = svg.append('line').attr('class','dashedLine').style('display','none');
  line.attr('x1', x1);
  line.attr('y1', y1);
  line.attr('x2', x2);
  line.attr('y2', y2);
  line.attr('stroke-dasharray', '8,8');
}
const displayDashedLine = (svg, isDisplay) => {
  svg.select('.dashedLine').style('display',isDisplay?'block':'none');
}
const sleep =  time => {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    })
};

export { defMarker, appendBubble, layoutBubble, appendLine, layoutLine, drawDashedLine, displayDashedLine, sleep };