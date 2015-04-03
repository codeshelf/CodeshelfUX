/**
 * @fileoverview Compile out Closure Library goodness.
 */

goog.provide('index')

goog.require('goog.dom.animationFrame')

exports['createAnimationFrameTask'] = function(mutate, opt_context) {
    return goog.dom.animationFrame.createTask({
        mutate: mutate
    }, opt_context);
}
