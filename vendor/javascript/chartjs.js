// chartjs@0.3.24 downloaded from https://ga.jspm.io/npm:chartjs@0.3.24/chart.js

var t={};Math.log2=Math.log2||function(t){return Math.log(t)/Math.LN2};Math.log10=Math.log10||function(t){return Math.log(t)/Math.LN10};(function(){var e={avg:function(t){var e=0;for(var a=0;a<t.length;++a)e+=t[a];return e/t.length},min:function(t){if(0===t.length)return 0;var a=t[0];for(var r=1;r<t.length;++r){var l=t[r];Array.isArray(l)&&(l=e.avg(l));l<a&&(a=l)}return Math.max(0,a)},max:function(t){var a=0;for(var r=0;r<t.length;++r){var l=t[r];Array.isArray(l)&&(l=e.avg(l));l>a&&(a=l)}return Math.max(0,a)},upperMax:function(t){var a=0;for(var r=0;r<t.length;++r){var l=t[r];Array.isArray(l)&&(l=e.max(l));l>a&&(a=l)}return Math.max(0,a)},lowerMin:function(t){if(0===t.length)return 0;var a=t[0]||Infinity;Array.isArray(a)&&(a=e.lowerMin(a));for(var r=1;r<t.length;++r){var l=t[r];if(null!=l){Array.isArray(l)&&(l=e.lowerMin(l));l<a&&(a=l)}}!isNaN(a)&&isFinite(a)||(a=0);return Math.max(0,a)},niceNumbers:function(t,e){var a=Math.floor(Math.log10(t));var r=t/Math.pow(10,a);var l;l=e?r<1.5?1:r<3?2:r<7?5:10:r<=1?1:r<=2?2:r<=5?5:10;return l*Math.pow(10,a)},getLinearTicks:function(t,a,r){var l=e.niceNumbers(a-t,false);var i=e.niceNumbers(l/(r-1),true);return[Math.floor(t/i)*i,Math.ceil(a/i)*i,i]},getFont:function(t){t.style=t.style||"normal";t.variant=t.variant||"normal";t.weight=t.weight||"lighter";t.size=t.size||"12";t.family=t.family||"Arial";return[t.style,t.variant,t.weight,t.size+"px",t.family].join(" ")},getAxisRatio:function(t,e,a){return(a-t)/(e-t)}};var a=function(){function BarChart(t,e){this.mouseListeners=[];this.currentHint=null;this.fillRegions=[];this.options={font:"Helvetica",fontWeight:"normal",fontSizeTitle:24,fontSizeAxes:20,fontSizeTicks:18,fontSizeLabels:18,fontDataTags:18,fontSizeLegend:18,fontSizeHint:18,paddingPercentBars:.1,paddingPercentTicks:.15,paddingPixelsVertical:10,paddingPixelsHorizontal:10,paddingPixelsTicks:10,maxWidthBars:0,fillColorBackground:"rgb(255, 255, 255)",strokeColorBars:"rgb(0, 0, 0)",fillColorBars:"rgba(180, 180, 180, 0.25)",scaleStyle:"linear",barStyle:"none",stackedBarPadding:3,defaultMaxTick:0,pixelsLegendSquare:10,radiusDot:5,fillColorLegend:"rgb(230, 230, 230)",tickFormatter:null,tickFormatterMeasure:null,fillRegion:"normal"};e=e||{};for(var a in this.options)e.hasOwnProperty(a)&&(this.options[a]=e[a]);this.ctx=t;this.content={};this.labelPositions={}}BarChart.prototype.update=function(t){if("object"!==typeof t)throw new Error("Collections must be objects.");if(!t.hasOwnProperty("labels")||!t.hasOwnProperty("data"))throw new Error("Collection must specify labels and data.");if(!Array.isArray(t.labels)||!Array.isArray(t.data))throw new Error("Labels and data must be arrays.");if(t.labels.length!==t.data.length)throw new Error("Labels and data length must match.");t._data_standard_deviation=[];t._data_standard_error=[];for(var a=0;a<t.data.length;++a){var r=Array.isArray(t.data[a]);if("log2"===this.options.scaleStyle)if(r)for(var l=0;l<t.data[a].length;++l)t.data[a][l]=Math.log2(t.data[a][l]);else t.data[a]=Math.log2(t.data[a]);if(r){var i=e.avg(t.data[a]);var n=0;for(var o=0;o<t.data[a].length;++o)n+=Math.pow(i-t.data[a][o],2);n=Math.sqrt(n/(t.data[a].length-1));t._data_standard_deviation.push(n);t._data_standard_error.push(n/Math.sqrt(t.data[a].length))}else{t._data_standard_deviation.push(0);t._data_standard_error.push(0)}}this.content=t;this.redraw()};BarChart.prototype.redraw=function(){setTimeout(function(){this._draw()}.bind(this),0)};BarChart.prototype.mousemove=function(t,e){var a=null;for(var r=0;r<this.mouseListeners.length;++r)if(a=this.mouseListeners[r](t,e))break;if(a&&"object"===typeof a&&a.hasOwnProperty("index")&&a.hasOwnProperty("drawIndex")){var l=this.currentHint;if(null==l||l.index!=a.index||l.drawIndex!=a.drawIndex){this.currentHint=a;this.redraw()}}else if(null!==this.currentHint){this.currentHint=null;this.redraw()}};BarChart.prototype._draw=function(){var t={};this.mouseListeners=[];this.fillRegions=[];var a=this.options;var r=this.ctx,l=this.content;var i=r.canvas.width,n=r.canvas.height;r.clearRect(0,0,i,n);r.translate(-.5,-.5);var o=i,s=n;var f;if(null!=a.fillColorBackground){r.save();r.fillStyle=a.fillColorBackground;r.fillRect(0,0,i,n);r.restore()}var h=a.paddingPixelsHorizontal;s-=a.paddingPixelsHorizontal;r.fillStyle="rgb(0, 0, 0)";if(null!=l.title){r.save();r.font=e.getFont({weight:a.fontWeight,size:a.fontSizeTitle,family:a.font});r.textAlign="center";r.fillText(l.title,i/2,h+a.fontSizeTitle);r.restore();s-=1.25*a.fontSizeTitle;h+=1.25*a.fontSizeTitle}var g=a.paddingPixelsVertical;o-=a.paddingPixelsVertical;var d=null;if(null!=l.yAxis){d=g+.5*a.fontSizeAxes;o-=1.25*a.fontSizeAxes;g+=1.25*a.fontSizeAxes}r.save();r.font=e.getFont({weight:a.fontWeight,size:a.fontSizeTicks,family:a.font});var v,u;if("stacked"===a.barStyle){v=0;u=Infinity;for(var y=0;y<l.data.length;++y){var x;if(Array.isArray(x=l.data[y])){var c=0;for(var b=0;b<x.length;++b)c+=x[b];v=Math.max(v,c);u=Math.min(u,c)}else{v=Math.max(v,l.data[y]);u=Math.min(u,l.data[y])}}}else{v=e.upperMax(l.data);u=e.lowerMin(l.data)}if(0===a.scaleStyle.indexOf("adaptive")){if(-1!==a.scaleStyle.indexOf(":")){var S=parseFloat(a.scaleStyle.split(/[:]/)[1]);u*=S;v*=1+(1-S)/2}}else u=0;a.defaultMaxTick>v&&(v=a.defaultMaxTick);if(null!=l.bars&&Array.isArray(l.bars))for(f=0;f<l.bars.length;++f){var m=l.bars[f].value;if(!isNaN(m)){v=Math.max(v,m);u=Math.min(u,m)}}var T="log2"==a.scaleStyle?Math.ceil(Math.pow(2,v)):Math.ceil(v)+".00";null!=a.tickFormatterMeasure&&(T=a.tickFormatterMeasure);T=r.measureText(T).width;T=Math.ceil(T)+a.paddingPixelsTicks;o-=T;g+=T;r.restore();var A=a.paddingPixelsVertical;o-=a.paddingPixelsVertical;if(null!=l.legend&&Array.isArray(l.legend)){r.save();r.font=e.getFont({weight:a.fontWeight,size:a.fontSizeLegend,family:a.font});var M=0;for(var p=0;p<l.legend.length;++p)M=Math.max(M,r.measureText(l.legend[p].label).width);M=Math.ceil(M);M+=a.pixelsLegendSquare+8;var k=Math.floor((o-2*a.paddingPixelsHorizontal)/M);var z=Math.ceil(l.legend.length/k)*a.fontSizeLegend*1.5;s-=z;_+=z;r.strokeStyle="rgb(0, 0, 0)";r.fillStyle=a.fillColorLegend;var w,L;r.beginPath();r.moveTo(w=g,L=h+s);r.lineTo(w+o,L);r.lineTo(w+o,L+z);r.lineTo(w,L+z);r.lineTo(w,L);r.stroke();r.fill();for(p=0;p<l.legend.length;++p){var P=Math.floor(p/k);var C=p%k;r.fillStyle=l.legend[p].color;var B=w+C*M+3,F=L+P*a.fontSizeLegend*1.5+.5*a.fontSizeLegend;r.beginPath();r.moveTo(B,F);r.lineTo(B+a.pixelsLegendSquare,F);r.lineTo(B+a.pixelsLegendSquare,F+a.pixelsLegendSquare);r.lineTo(B,F+a.pixelsLegendSquare);r.lineTo(B,F);r.fill();r.stroke();r.textAlign="left";r.fillStyle="rgb(0, 0, 0)";r.fillText(l.legend[p].label,B+3+a.pixelsLegendSquare,F+.5*a.fontSizeLegend)}r.restore()}var _=a.paddingPixelsHorizontal;s-=a.paddingPixelsHorizontal;if(null!=l.xAxis){r.save();r.font=e.getFont({weight:a.fontWeight,size:a.fontSizeAxes,family:a.font});r.fillStyle="rgb(0, 0, 0)";r.textAlign="center";r.fillText(l.xAxis,i-o+o/2,h+s-_);s-=1.5*a.fontSizeAxes;_+=1.5*a.fontSizeAxes;r.restore()}var R=o/l.data.length;if(null!=l.topLabels){r.save();r.textAlign="center";r.font=e.getFont({weight:a.fontWeight,size:a.fontSizeLabels,family:a.font});s-=1.5*a.fontSizeLabels;h+=1.5*a.fontSizeLabels;for(f=0;f<l.topLabels.length;++f)r.fillText(l.topLabels[f],g+f*R+R/2,h-a.fontSizeLabels/2);r.restore()}r.save();var H=0;if(null!=l.dataTags){r.font=e.getFont({weight:a.fontWeight,size:a.fontDataTags,family:a.font});var W=l.dataTags;for(f=0;f<W.length;++f)if(Array.isArray(W[f]))for(var I=0;I<W[f].length;++I)H=Math.max(H,Math.ceil(r.measureText(W[f][I]).width+5));else H=Math.max(H,Math.ceil(r.measureText(W[f]).width+5))}r.font=e.getFont({weight:a.fontWeight,size:a.fontSizeLabels,family:a.font});var q=Math.floor(R*a.paddingPercentBars/2);var N=R-2*q;if(N<H){q-=Math.ceil((H-N)/2);q=Math.max(0,q)}else a.maxWidthBars>0&&N>a.maxWidthBars&&(q=Math.floor((R-a.maxWidthBars)/2));var D=0,O=1;for(f=0;f<l.labels.length;++f){var E=l.labels[f];if(Array.isArray(E)){O=Math.max(O,E.length);for(I=0;I<E.length;++I)D=Math.max(D,r.measureText(E[I]).width)}else D=Math.max(D,r.measureText(E).width)}var V=false;if(D>R-q){r.textAlign="right";r.rotate(1.5*Math.PI);V=true}else r.textAlign="center";var j=-a.fontSizeLabels;for(f=0;f<l.labels.length;++f){var G=l.labels[f];var J=g+f*R+R/2,K=h+s-a.fontSizeLabels/2;if(V){K=h+s-D+5;K=[J,J=-K][0];if(K<j+a.fontSizeLabels)continue;j=K}var Q=a.fontSizeLabels*(O-1);if(Array.isArray(G)){if(V){Q=a.fontSizeLabels*(G.length-1.5);Q/=2}for(I=0;I<G.length;++I){r.fillText(G[I],J,K-Q);Q-=a.fontSizeLabels}}else{V&&(Q=.25*-a.fontSizeLabels);r.fillText(G,J,K-Q)}}if(V){s-=D+5;_+=D+5}else{var U=a.fontSizeLabels*O;U+=.5*a.fontSizeLabels;s-=U;_+=U}r.restore();var X=g,Y=g+o;var Z=h,$=h+s;for(f=0;f<l.labels.length;++f)t[f]={xStart:g+f*R,xEnd:g+(1+f)*R,yStart:Z,yEnd:$};r.save();r.strokeStyle="rgb(0, 0, 0)";r.beginPath();if(null!=l.topLabels){r.moveTo(Y,Z);r.lineTo(X,Z)}else r.moveTo(X,Z);r.lineTo(X,$);r.lineTo(Y,$);null!=l.topLabels&&r.lineTo(g+o,h);r.stroke();r.restore();if(null!=l.topLabel){r.save();r.textAlign="right";r.font=e.getFont({weight:a.fontWeight,size:a.fontSizeLabels,family:a.font});r.fillText(l.topLabel,g-3,h-a.fontSizeLabels/2);r.restore()}if(null!=l.yAxis){r.save();r.rotate(1.5*Math.PI);r.font=e.getFont({weight:a.fontWeight,size:a.fontSizeAxes,family:a.font});r.fillStyle="rgb(0, 0, 0)";r.textAlign="center";r.fillText(l.yAxis,-(h+s/2),d);r.restore()}r.save();r.fillStyle="rgb(0, 0, 0)";r.strokeStyle="rgba(0, 0, 0, 0.20)";r.font=e.getFont({weight:a.fontWeight,size:a.fontSizeTicks,family:a.font});r.textAlign="right";var tt=e.getLinearTicks(0,v,Math.max(2,s/(a.fontSizeTicks*(1+a.paddingPercentTicks))));var et=v/a.fontSizeTicks;v=tt[1];v+=v>1?Math.ceil(et):et;var at=[];while(tt[0]<=tt[1]){at.push(tt[0]);tt[0]+=tt[2]}for(f=0;f<at.length;++f){var rt=Math.round(s*e.getAxisRatio(u,v,at[f]));if(!(rt<0)){"log2"==a.scaleStyle&&0!==at[f]?at[f]=Math.round(Math.pow(2,at[f])):at[f]=Math.floor(100*at[f])/100;null!=a.tickFormatter&&"function"===typeof a.tickFormatter?r.fillText(a.tickFormatter(at[f]).toString(),g-a.paddingPixelsTicks,h+s-rt):r.fillText(at[f].toString(),g-a.paddingPixelsTicks,h+s-rt);if(0!=f){r.beginPath();r.moveTo(g,h+s-rt);r.lineTo(g+o,h+s-rt);r.stroke()}}}r.restore();if(null!=l.bars&&Array.isArray(l.bars)){r.save();for(f=0;f<l.bars.length;++f){var lt=l.bars[f];if(!(lt.value>v)){var it=h+s-Math.round(s*e.getAxisRatio(u,v,lt.value));r.strokeStyle=lt.style;r.fillStyle=lt.style;r.beginPath();r.moveTo(X,it);r.lineTo(Y,it);r.stroke();r.fill()}}r.restore()}r.save();var nt=null;for(f=0;f<l.data.length;++f){var ot=null;var st=null;null!=l.fillColor?Array.isArray(l.fillColor)?ot=r.fillStyle=l.fillColor[f]:r.fillStyle=l.fillColor:r.fillStyle=a.fillColorBars;null!=l.strokeColor?Array.isArray(l.strokeColor)?st=r.strokeStyle=l.strokeColor[f]:r.strokeStyle=l.strokeColor:r.strokeStyle=a.strokeColorBars;var ft=l.data[f];var ht=Array.isArray(ft);var gt=g+R*f;if(ht&&"stacked"===a.barStyle){var dt=0,vt=0;for(var ut=0;ut<ft.length;++ut){null!=ot&&Array.isArray(ot)&&(r.fillStyle=ot[ut]||a.fillColorBars);null!=st&&Array.isArray(st)&&(r.strokeStyle=st[ut]||a.strokeColorBars);dt+=ft[ut];var yt=Math.floor(s*e.getAxisRatio(u,v,dt));var xt=h+s-yt;if(Math.abs(yt-vt)<a.stackedBarPadding+2)vt=yt;else{var ct=ut>0?a.stackedBarPadding:0;var bt,St;var mt,Tt;r.beginPath();r.moveTo(bt=gt+q,St=h+s-vt-ct);r.lineTo(gt+q,xt);r.lineTo(mt=gt+(R-1)-q,Tt=xt);r.lineTo(gt+(R-1)-q,h+s-vt-ct);ut>0&&r.lineTo(bt,St);r.stroke();r.fill();var At;null!=l.hints&&null!=l.hints[f]&&null!=(At=l.hints[f][ut])&&this.mouseListeners.push(function(t,e,a,r,l,i,n,o,s){var f=Math.min(r,i),h=Math.max(r,i);var g=Math.min(l,n),d=Math.max(l,n);return o<f||o>h||s<g||s>d?null:{index:t,drawIndex:e,rect:{left:f,right:h,top:g,bottom:d},text:a.split("\n")}}.bind(this,f,ut,At,bt,St,mt,Tt));var Mt;if(St-xt>1.25*a.fontDataTags&&null!=l.dataTags&&null!=(Mt=l.dataTags[f])&&null!=(Mt=Mt[ut])){var pt=r.fillStyle;r.fillStyle="rgb(0, 0, 0)";r.font=e.getFont({weight:a.fontWeight,size:a.fontDataTags,family:a.font});r.textAlign="center";r.fillText(Mt,gt+R/2,St-.25*a.fontDataTags);r.fillStyle=pt}vt=yt}}if(null!=l.barTooltips){r.fillStyle="rgb(0, 0, 0)";r.font=e.getFont({weight:a.fontWeight,size:a.fontSizeLabels,family:a.font});r.textAlign="center";r.fillText(l.barTooltips[f]||"",gt+R/2,xt-3)}}else if("line"===a.barStyle){if(ht){var kt=gt+R/2;var zt;if("background"===a.fillRegion){zt=nt;Array.isArray(zt)&&(zt=zt[0]);if(null!=zt){var wt=r.fillStyle;r.fillStyle=zt.color;r.fillRect(zt.x,Z,kt-zt.x,$-Z);r.fillStyle=wt}}var Lt=[];for(var ut=0;ut<ft.length;++ut){var Pt=Math.round(s*e.getAxisRatio(u,v,ft[ut]));var Ct=h+s-Pt;var Bt=Ct;if(null!=nt){var Ft,_t;if(Array.isArray(nt)){Ft=(nt[ut]||{}).x;_t=(nt[ut]||{}).y}else{Ft=nt.x;_t=nt.y}if(Ft&&_t){Array.isArray(st)?r.strokeStyle=st[ut]||a.strokeColorBars:r.strokeStyle=st||"rgb(0, 0, 0)";r.beginPath();r.moveTo(Ft,_t);r.lineTo(kt,Bt);r.stroke()}}Array.isArray(ot)&&(r.fillStyle=ot[ut]||a.fillColorBars);Array.isArray(st)&&(r.strokeStyle=st[ut]||a.strokeColorBars);r.beginPath();r.arc(kt,Bt,a.radiusDot,0,2*Math.PI);r.stroke();r.fill();Lt[ut]={x:kt,y:Bt,color:r.fillStyle}}nt=Lt;null!=zt&&zt.color!=nt[0].color&&this.fillRegions.push({x:nt[0].x,y:nt[0].y,prev:zt.color,next:nt[0].color});if(null!=l.balls&&Array.isArray(l.balls)&&f<l.balls.length){var Rt=l.balls[f];if(null!=Rt){r.beginPath();r.fillStyle=Rt.fill;r.strokeStyle=Rt.stroke;r.arc(kt,h+s-s*e.getAxisRatio(u,v,u+Rt.value),Rt.radius,0,2*Math.PI);r.stroke();r.fill()}}}else{var Pt=Math.round(s*e.getAxisRatio(u,v,ft));var Ct=h+s-Pt;var kt=gt+R/2,Bt=Ct;var zt;if("background"===a.fillRegion&&null!=nt){zt=nt;Array.isArray(zt)&&(zt=zt[0]);var wt=r.fillStyle;r.fillStyle=zt.color;r.fillRect(zt.x,Z,kt-zt.x,$-Z);r.fillStyle=wt}r.beginPath();r.arc(kt,Bt,a.radiusDot,0,2*Math.PI);r.stroke();r.fill();if(null!=nt)if(Array.isArray(nt)){var Ft,_t;for(var Ht in nt)if(nt.hasOwnProperty(Ht)){Ft=nt[Ht].x;_t=nt[Ht].y;if(Ft&&_t){r.strokeStyle=st||"rgb(0, 0, 0)";r.beginPath();r.moveTo(Ft,_t);r.lineTo(kt,Bt);r.stroke()}}}else{var Ft=nt.x,_t=nt.y;if(Ft&&_t){r.strokeStyle=st||"rgb(0, 0, 0)";r.beginPath();r.moveTo(Ft,_t);r.lineTo(kt,Bt);r.stroke()}}nt={x:kt,y:Bt,color:r.fillStyle};null!=zt&&zt.color!=nt.color&&this.fillRegions.push({x:nt.x,y:nt.y,prev:zt.color,next:nt.color});if(null!=l.balls&&Array.isArray(l.balls)&&f<l.balls.length){var Rt=l.balls[f];if(null!=Rt){r.beginPath();r.fillStyle=Rt.fill;r.strokeStyle=Rt.stroke;r.arc(kt,h+s-s*e.getAxisRatio(u,v,u+Rt.value),Rt.radius,0,2*Math.PI);r.stroke();r.fill()}}}var At;null!=l.hints&&null!=(At=l.hints[f])&&this.mouseListeners.push(function(t,e,a,r,l,i,n,o){var s=Math.min(a,l),f=Math.max(a,l);var h=Math.min(r,i),g=Math.max(r,i);return n<s||n>f||o<h||o>g?null:{index:t,drawIndex:ut,rect:{left:s,right:f,top:h,bottom:g},text:e.split("\n")}}.bind(this,f,At,kt-1,h,kt+1,h+s))}else{ht&&(ft=e.avg(ft));var Wt=Math.round(s*e.getAxisRatio(u,v,ft));var It=h+s-Wt;r.beginPath();r.moveTo(gt+q,h+s);r.lineTo(gt+q,It);r.lineTo(gt+(R-1)-q,It);r.lineTo(gt+(R-1)-q,h+s);r.stroke();r.fill();if("error"===a.barStyle){var qt;if(0!=(qt=l._data_standard_error[f])){var Nt=Math.round(s*e.getAxisRatio(u,v,qt));r.beginPath();var Dt=Math.round((R-2*q)/8);var Ot=g+R*f+R/2;r.moveTo(Ot-Dt,It+Nt);r.lineTo(Ot+Dt,It+Nt);r.moveTo(Ot,It+Nt);r.lineTo(Ot,It-Nt);r.moveTo(Ot-Dt,It-Nt);r.lineTo(Ot+Dt,It-Nt);r.stroke()}}if(null!=l.barTooltips){r.fillStyle="rgb(0, 0, 0)";r.font=e.getFont({weight:a.fontWeight,size:a.fontSizeLabels,family:a.font});r.textAlign="center";r.fillText(l.barTooltips[f]||"",gt+R/2,It-3)}}}r.restore();if(null!=this.currentHint){r.save();var Et=this.currentHint.rect,Vt=this.currentHint.text;r.fillStyle="rgb(0, 0, 0)";r.font=e.getFont({weight:a.fontWeight,size:a.fontSizeHint,family:a.font});r.textAlign="left";var jt=0;for(f=0;f<Vt.length;++f)jt=Math.max(jt,Math.ceil(r.measureText(Vt[f]).width));var Gt=5;var Jt=1.5*a.fontSizeHint;var Kt=Vt.length*Jt;var Qt=Et.right+10,Ut=(Et.top+Et.bottom)/2;jt+=2*Gt;Qt+jt>i&&(Qt=Et.left-jt-10);Ut-Kt/2<0?Ut=Math.ceil(Kt/2)+1:Ut+Kt/2>n&&(Ut=n-Kt/2-1);r.clearRect(Qt,Ut-Kt/2,jt,Kt);r.beginPath();r.rect(Qt,Ut-Kt/2,jt,Kt);r.stroke();for(f=0;f<Vt.length;++f)r.fillText(Vt[f],Qt+Gt,Ut-Kt/2+a.fontSizeHint+f*Jt);r.restore()}r.translate(.5,.5);this.labelPositions=t};return BarChart}();t=a})();var e=t;export default e;

