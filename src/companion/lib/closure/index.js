/*eslint-disable */
(function(){var g=[[],[]],h=0,k=!1,l=0;function m(e,f){var b=l++,c={id:b,c:e.h,b:f},d={id:b,c:e.f,b:f},a={e:c,g:d,state:{},a:void 0,d:!1};return function(){f||(c.b=this,d.b=this);0<arguments.length?(a.a||(a.a=[]),a.a.length=0,a.a.push.apply(a.a,arguments),a.a.push(a.state)):a.a&&0!=a.a.length?(a.a[0]=a.state,a.a.length=1):a.a=[a.state];a.d||(a.d=!0,g[h].push(a));k||(k=!0,window.requestAnimationFrame(n))}}
function n(){k=!1;var e=g[h],f=e.length;h=(h+1)%2;for(var b,c=0;c<f;++c){b=e[c];var d=b.e;b.d=!1;d.c&&d.c.apply(d.b,b.a)}for(c=0;c<f;++c)b=e[c],d=b.g,b.d=!1,d.c&&d.c.apply(d.b,b.a),b.state={};e.length=0};exports.createAnimationFrameTask=function(e,f){return m({f:e},f)};})();
