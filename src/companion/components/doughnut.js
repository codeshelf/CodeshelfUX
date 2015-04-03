var $ = require("jquery");
var Chart = require('bower_components/chartjs/Chart.js');
/** Monkey Patch ChartJs when turning off animation but enabling reactive resizing */
var Type, cancelAnimFrame, name, _ref;

cancelAnimFrame = (function() {
    return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || function(callback) {
        return window.clearTimeout(callback, 1000 / 60);
    };
})();

_ref = Chart.types;
for (name in _ref) {
    Type = _ref[name];
    Type.prototype.stop = function() {
        return cancelAnimFrame(this.animationFrame);
    };
}
/** End Monkey Patch */

function Doughnut(selector, initialSegments, chartOptions) {
    var drawContext = $(selector).get(0).getContext("2d");
    this.chart = new Chart(drawContext).Doughnut(initialSegments, chartOptions);

}

Doughnut.prototype.updateDataValues = function(newSegments) {
    var segments = this.chart.segments;
    for(var i = 0; i < segments.length; i++) {
        var segment = segments[i];
        $.extend(segment, newSegments[i]);
    }
};

Doughnut.prototype.render = function() {
    this.chart.update();
};

Doughnut.prototype.destroy = function() {
    this.chart.destroy();
};


module.exports = Doughnut;
