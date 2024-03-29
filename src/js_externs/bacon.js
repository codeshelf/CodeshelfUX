/**
 * @fileoverview Externs for Bacon
 *
 * Note that some functions use different return types depending on the number
 * of parameters passed in. In these cases, you may need to annotate the type
 * of the result in your code, so the JSCompiler understands which type you're
 * expecting. For example:
 *    <code>var elt = /** @type {Element} * / (foo.get(0));</code>
 *
 * @externs
 */

var Bacon = {};

jQuery.prototype.fn.asEventStream = function () {};

Bacon.fromPromise = function() {};
Bacon.noMore;
Bacon.more;
Bacon.later = function() {};
Bacon.sequentially = function() {};
Bacon.repeatedly = function() {};
Bacon.fromCallback = function() {};
Bacon.fromPoll = function() {};
Bacon.fromEventTarget = function() {};
Bacon.interval = function() {};
Bacon.constant = function() {};
Bacon.never = function() {};
Bacon.once = function(value) {};
Bacon.fromArray = function() {};
Bacon.combineAll = function() {};
Bacon.mergeAll = function() {};
Bacon.combineAsArray = function() {};
Bacon.combineWith = function() {};
Bacon.combineTemplate = function() {};
Bacon.latestValue = function() {};

Bacon.Observable.prototype.onValue = function() {};
Bacon.Observable.prototype.onValues = function() {};
Bacon.Observable.prototype.onError = function() {};
Bacon.Observable.prototype.onEnd = function() {};
Bacon.Observable.prototype.errors = function() {};
Bacon.Observable.prototype.filter = function() {};
Bacon.Observable.prototype.takeWhile = function() {};
Bacon.Observable.prototype.endOnError = function() {};
Bacon.Observable.prototype.take = function() {};
Bacon.Observable.prototype.map = function() {};
Bacon.Observable.prototype.mapError = function() {};
Bacon.Observable.prototype.doAction = function() {};
Bacon.Observable.prototype.takeUntil = function() {};
Bacon.Observable.prototype.skip = function() {};
Bacon.Observable.prototype.distinctUntilChanged = function() {};
Bacon.Observable.prototype.skipDuplicates = function() {};
Bacon.Observable.prototype.withStateMachine = function() {};
Bacon.Observable.prototype.scan = function() {};
Bacon.Observable.prototype.diff = function() {};
Bacon.Observable.prototype.flatMap = function() {};
Bacon.Observable.prototype.flatMapLatest = function() {};
Bacon.Observable.prototype.not = function() {};
Bacon.Observable.prototype.log = function() {};

Bacon.EventStream.prototype.map = function() {};
Bacon.EventStream.prototype.filter = function() {};
Bacon.EventStream.prototype.delay = function() {};
Bacon.EventStream.prototype.throttle = function() {};
Bacon.EventStream.prototype.bufferWithTime = function() {};
Bacon.EventStream.prototype.bufferWithCount = function() {};
Bacon.EventStream.prototype.merge = function() {};
Bacon.EventStream.prototype.toProperty = function() {};
Bacon.EventStream.prototype.toEventStream = function() {};
Bacon.EventStream.prototype.concat = function() {};
Bacon.EventStream.prototype.startWith = function() {};
Bacon.EventStream.prototype.decorateWith = function() {};
Bacon.EventStream.prototype.mapEnd = function() {};
Bacon.EventStream.prototype.withHandler = function() {};
Bacon.EventStream.prototype.withSubscribe = function() {};

Bacon.Property.prototype.sample = function() {};
Bacon.Property.prototype.sampledBy = function() {};
Bacon.Property.prototype.changes = function() {};
Bacon.Property.prototype.withHandler = function() {};
Bacon.Property.prototype.withSubscribe = function() {};
Bacon.Property.prototype.toProperty = function() {};
Bacon.Property.prototype.toEventStream = function() {};
Bacon.Property.prototype.and = function() {};
Bacon.Property.prototype.or = function() {};
Bacon.Property.prototype.decode = function() {};
Bacon.Property.prototype.delay = function() {};
Bacon.Property.prototype.throttle = function() {};
