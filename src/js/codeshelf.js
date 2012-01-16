var $JSCompiler_alias_VOID$$ = void 0, $JSCompiler_alias_TRUE$$ = !0, $JSCompiler_alias_NULL$$ = null, $JSCompiler_alias_FALSE$$ = !1, $JSCompiler_prototypeAlias$$, $goog$global$$ = this;
function $goog$exportPath_$$($name$$53$$, $opt_object$$) {
  var $parts$$ = $name$$53$$.split("."), $cur$$ = $goog$global$$;
  !($parts$$[0] in $cur$$) && $cur$$.execScript && $cur$$.execScript("var " + $parts$$[0]);
  for(var $part$$;$parts$$.length && ($part$$ = $parts$$.shift());) {
    !$parts$$.length && $opt_object$$ !== $JSCompiler_alias_VOID$$ ? $cur$$[$part$$] = $opt_object$$ : $cur$$ = $cur$$[$part$$] ? $cur$$[$part$$] : $cur$$[$part$$] = {}
  }
}
function $goog$typeOf$$($value$$38$$) {
  var $s$$2$$ = typeof $value$$38$$;
  if("object" == $s$$2$$) {
    if($value$$38$$) {
      if($value$$38$$ instanceof Array) {
        return"array"
      }
      if($value$$38$$ instanceof Object) {
        return $s$$2$$
      }
      var $className$$1$$ = Object.prototype.toString.call($value$$38$$);
      if("[object Window]" == $className$$1$$) {
        return"object"
      }
      if("[object Array]" == $className$$1$$ || "number" == typeof $value$$38$$.length && "undefined" != typeof $value$$38$$.splice && "undefined" != typeof $value$$38$$.propertyIsEnumerable && !$value$$38$$.propertyIsEnumerable("splice")) {
        return"array"
      }
      if("[object Function]" == $className$$1$$ || "undefined" != typeof $value$$38$$.call && "undefined" != typeof $value$$38$$.propertyIsEnumerable && !$value$$38$$.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if("function" == $s$$2$$ && "undefined" == typeof $value$$38$$.call) {
      return"object"
    }
  }
  return $s$$2$$
}
function $goog$isString$$($val$$6$$) {
  return"string" == typeof $val$$6$$
}
function $goog$getUid$$($obj$$17$$) {
  return $obj$$17$$[$goog$UID_PROPERTY_$$] || ($obj$$17$$[$goog$UID_PROPERTY_$$] = ++$goog$uidCounter_$$)
}
var $goog$UID_PROPERTY_$$ = "closure_uid_" + Math.floor(2147483648 * Math.random()).toString(36), $goog$uidCounter_$$ = 0;
function $goog$bindNative_$$($fn$$, $selfObj$$1$$, $var_args$$17$$) {
  return $fn$$.call.apply($fn$$.bind, arguments)
}
function $goog$bindJs_$$($fn$$1$$, $selfObj$$2$$, $var_args$$18$$) {
  if(!$fn$$1$$) {
    throw Error();
  }
  if(2 < arguments.length) {
    var $boundArgs$$ = Array.prototype.slice.call(arguments, 2);
    return function() {
      var $newArgs$$ = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply($newArgs$$, $boundArgs$$);
      return $fn$$1$$.apply($selfObj$$2$$, $newArgs$$)
    }
  }
  return function() {
    return $fn$$1$$.apply($selfObj$$2$$, arguments)
  }
}
function $goog$bind$$($fn$$2$$, $selfObj$$3$$, $var_args$$19$$) {
  $goog$bind$$ = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? $goog$bindNative_$$ : $goog$bindJs_$$;
  return $goog$bind$$.apply($JSCompiler_alias_NULL$$, arguments)
}
var $goog$now$$ = Date.now || function() {
  return+new Date
};
function $goog$inherits$$($childCtor$$, $parentCtor$$) {
  function $tempCtor$$() {
  }
  $tempCtor$$.prototype = $parentCtor$$.prototype;
  $childCtor$$.$superClass_$ = $parentCtor$$.prototype;
  $childCtor$$.prototype = new $tempCtor$$;
  $childCtor$$.prototype.constructor = $childCtor$$
}
;function $goog$string$subs$$($str$$12$$, $var_args$$22$$) {
  for(var $i$$5$$ = 1;$i$$5$$ < arguments.length;$i$$5$$++) {
    var $replacement$$ = ("" + arguments[$i$$5$$]).replace(/\$/g, "$$$$"), $str$$12$$ = $str$$12$$.replace(/\%s/, $replacement$$)
  }
  return $str$$12$$
}
function $goog$string$trim$$($str$$25$$) {
  return $str$$25$$.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
}
;var $goog$userAgent$detectedOpera_$$, $goog$userAgent$detectedIe_$$, $goog$userAgent$detectedWebkit_$$, $goog$userAgent$detectedMobile_$$, $goog$userAgent$detectedGecko_$$, $goog$userAgent$detectedMac_$$;
function $goog$userAgent$getUserAgentString$$() {
  return $goog$global$$.navigator ? $goog$global$$.navigator.userAgent : $JSCompiler_alias_NULL$$
}
$goog$userAgent$detectedGecko_$$ = $goog$userAgent$detectedMobile_$$ = $goog$userAgent$detectedWebkit_$$ = $goog$userAgent$detectedIe_$$ = $goog$userAgent$detectedOpera_$$ = $JSCompiler_alias_FALSE$$;
var $ua$$inline_10$$;
if($ua$$inline_10$$ = $goog$userAgent$getUserAgentString$$()) {
  var $navigator$$inline_11$$ = $goog$global$$.navigator;
  $goog$userAgent$detectedOpera_$$ = 0 == $ua$$inline_10$$.indexOf("Opera");
  $goog$userAgent$detectedIe_$$ = !$goog$userAgent$detectedOpera_$$ && -1 != $ua$$inline_10$$.indexOf("MSIE");
  $goog$userAgent$detectedMobile_$$ = ($goog$userAgent$detectedWebkit_$$ = !$goog$userAgent$detectedOpera_$$ && -1 != $ua$$inline_10$$.indexOf("WebKit")) && -1 != $ua$$inline_10$$.indexOf("Mobile");
  $goog$userAgent$detectedGecko_$$ = !$goog$userAgent$detectedOpera_$$ && !$goog$userAgent$detectedWebkit_$$ && "Gecko" == $navigator$$inline_11$$.product
}
var $goog$userAgent$OPERA$$ = $goog$userAgent$detectedOpera_$$, $goog$userAgent$IE$$ = $goog$userAgent$detectedIe_$$, $goog$userAgent$GECKO$$ = $goog$userAgent$detectedGecko_$$, $goog$userAgent$WEBKIT$$ = $goog$userAgent$detectedWebkit_$$, $goog$userAgent$MOBILE$$ = $goog$userAgent$detectedMobile_$$, $goog$userAgent$PLATFORM$$, $navigator$$inline_13$$ = $goog$global$$.navigator;
$goog$userAgent$PLATFORM$$ = $navigator$$inline_13$$ && $navigator$$inline_13$$.platform || "";
$goog$userAgent$detectedMac_$$ = -1 != $goog$userAgent$PLATFORM$$.indexOf("Mac");
var $goog$userAgent$WINDOWS$$ = -1 != $goog$userAgent$PLATFORM$$.indexOf("Win"), $goog$userAgent$VERSION$$;
a: {
  var $version$$inline_16$$ = "", $re$$inline_17$$;
  if($goog$userAgent$OPERA$$ && $goog$global$$.opera) {
    var $operaVersion$$inline_18$$ = $goog$global$$.opera.version, $version$$inline_16$$ = "function" == typeof $operaVersion$$inline_18$$ ? $operaVersion$$inline_18$$() : $operaVersion$$inline_18$$
  }else {
    if($goog$userAgent$GECKO$$ ? $re$$inline_17$$ = /rv\:([^\);]+)(\)|;)/ : $goog$userAgent$IE$$ ? $re$$inline_17$$ = /MSIE\s+([^\);]+)(\)|;)/ : $goog$userAgent$WEBKIT$$ && ($re$$inline_17$$ = /WebKit\/(\S+)/), $re$$inline_17$$) {
      var $arr$$inline_19$$ = $re$$inline_17$$.exec($goog$userAgent$getUserAgentString$$()), $version$$inline_16$$ = $arr$$inline_19$$ ? $arr$$inline_19$$[1] : ""
    }
  }
  if($goog$userAgent$IE$$) {
    var $docMode$$inline_20$$, $doc$$inline_138$$ = $goog$global$$.document;
    $docMode$$inline_20$$ = $doc$$inline_138$$ ? $doc$$inline_138$$.documentMode : $JSCompiler_alias_VOID$$;
    if($docMode$$inline_20$$ > parseFloat($version$$inline_16$$)) {
      $goog$userAgent$VERSION$$ = "" + $docMode$$inline_20$$;
      break a
    }
  }
  $goog$userAgent$VERSION$$ = $version$$inline_16$$
}
var $goog$userAgent$isVersionCache_$$ = {};
function $goog$userAgent$isVersion$$($version$$8$$) {
  var $JSCompiler_temp$$5_order$$inline_24$$;
  if(!($JSCompiler_temp$$5_order$$inline_24$$ = $goog$userAgent$isVersionCache_$$[$version$$8$$])) {
    $JSCompiler_temp$$5_order$$inline_24$$ = 0;
    for(var $v1Subs$$inline_25$$ = $goog$string$trim$$("" + $goog$userAgent$VERSION$$).split("."), $v2Subs$$inline_26$$ = $goog$string$trim$$("" + $version$$8$$).split("."), $subCount$$inline_27$$ = Math.max($v1Subs$$inline_25$$.length, $v2Subs$$inline_26$$.length), $subIdx$$inline_28$$ = 0;0 == $JSCompiler_temp$$5_order$$inline_24$$ && $subIdx$$inline_28$$ < $subCount$$inline_27$$;$subIdx$$inline_28$$++) {
      var $v1Sub$$inline_29$$ = $v1Subs$$inline_25$$[$subIdx$$inline_28$$] || "", $v2Sub$$inline_30$$ = $v2Subs$$inline_26$$[$subIdx$$inline_28$$] || "", $v1CompParser$$inline_31$$ = RegExp("(\\d*)(\\D*)", "g"), $v2CompParser$$inline_32$$ = RegExp("(\\d*)(\\D*)", "g");
      do {
        var $v1Comp$$inline_33$$ = $v1CompParser$$inline_31$$.exec($v1Sub$$inline_29$$) || ["", "", ""], $v2Comp$$inline_34$$ = $v2CompParser$$inline_32$$.exec($v2Sub$$inline_30$$) || ["", "", ""];
        if(0 == $v1Comp$$inline_33$$[0].length && 0 == $v2Comp$$inline_34$$[0].length) {
          break
        }
        $JSCompiler_temp$$5_order$$inline_24$$ = ((0 == $v1Comp$$inline_33$$[1].length ? 0 : parseInt($v1Comp$$inline_33$$[1], 10)) < (0 == $v2Comp$$inline_34$$[1].length ? 0 : parseInt($v2Comp$$inline_34$$[1], 10)) ? -1 : (0 == $v1Comp$$inline_33$$[1].length ? 0 : parseInt($v1Comp$$inline_33$$[1], 10)) > (0 == $v2Comp$$inline_34$$[1].length ? 0 : parseInt($v2Comp$$inline_34$$[1], 10)) ? 1 : 0) || ((0 == $v1Comp$$inline_33$$[2].length) < (0 == $v2Comp$$inline_34$$[2].length) ? -1 : (0 == $v1Comp$$inline_33$$[2].length) > 
        (0 == $v2Comp$$inline_34$$[2].length) ? 1 : 0) || ($v1Comp$$inline_33$$[2] < $v2Comp$$inline_34$$[2] ? -1 : $v1Comp$$inline_33$$[2] > $v2Comp$$inline_34$$[2] ? 1 : 0)
      }while(0 == $JSCompiler_temp$$5_order$$inline_24$$)
    }
    $JSCompiler_temp$$5_order$$inline_24$$ = $goog$userAgent$isVersionCache_$$[$version$$8$$] = 0 <= $JSCompiler_temp$$5_order$$inline_24$$
  }
  return $JSCompiler_temp$$5_order$$inline_24$$
}
var $goog$userAgent$isDocumentModeCache_$$ = {};
function $goog$userAgent$isDocumentMode$$() {
  return $goog$userAgent$isDocumentModeCache_$$[9] || ($goog$userAgent$isDocumentModeCache_$$[9] = $goog$userAgent$IE$$ && document.documentMode && 9 <= document.documentMode)
}
;function $goog$events$Listener$$() {
}
var $goog$events$Listener$counter_$$ = 0;
$JSCompiler_prototypeAlias$$ = $goog$events$Listener$$.prototype;
$JSCompiler_prototypeAlias$$.key = 0;
$JSCompiler_prototypeAlias$$.$removed$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$callOnce$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$init$ = function $$JSCompiler_prototypeAlias$$$$init$$($listener$$26$$, $proxy$$, $src$$4$$, $type$$49$$, $capture$$, $opt_handler$$) {
  if("function" == $goog$typeOf$$($listener$$26$$)) {
    this.$isFunctionListener_$ = $JSCompiler_alias_TRUE$$
  }else {
    if($listener$$26$$ && $listener$$26$$.handleEvent && "function" == $goog$typeOf$$($listener$$26$$.handleEvent)) {
      this.$isFunctionListener_$ = $JSCompiler_alias_FALSE$$
    }else {
      throw Error("Invalid listener argument");
    }
  }
  this.$listener$ = $listener$$26$$;
  this.$proxy$ = $proxy$$;
  this.src = $src$$4$$;
  this.type = $type$$49$$;
  this.capture = !!$capture$$;
  this.$handler$ = $opt_handler$$;
  this.$callOnce$ = $JSCompiler_alias_FALSE$$;
  this.key = ++$goog$events$Listener$counter_$$;
  this.$removed$ = $JSCompiler_alias_FALSE$$
};
$JSCompiler_prototypeAlias$$.handleEvent = function $$JSCompiler_prototypeAlias$$$handleEvent$($eventObject$$) {
  return this.$isFunctionListener_$ ? this.$listener$.call(this.$handler$ || this.src, $eventObject$$) : this.$listener$.handleEvent.call(this.$listener$, $eventObject$$)
};
function $goog$object$forEach$$($f$$) {
  var $obj$$21$$ = $goog$events$sources_$$, $key$$16$$;
  for($key$$16$$ in $obj$$21$$) {
    $f$$.call($JSCompiler_alias_VOID$$, $obj$$21$$[$key$$16$$], $key$$16$$, $obj$$21$$)
  }
}
var $goog$object$PROTOTYPE_FIELDS_$$ = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
function $goog$object$extend$$($target$$35$$, $var_args$$25$$) {
  for(var $key$$39$$, $source$$2$$, $i$$16$$ = 1;$i$$16$$ < arguments.length;$i$$16$$++) {
    $source$$2$$ = arguments[$i$$16$$];
    for($key$$39$$ in $source$$2$$) {
      $target$$35$$[$key$$39$$] = $source$$2$$[$key$$39$$]
    }
    for(var $j$$1$$ = 0;$j$$1$$ < $goog$object$PROTOTYPE_FIELDS_$$.length;$j$$1$$++) {
      $key$$39$$ = $goog$object$PROTOTYPE_FIELDS_$$[$j$$1$$], Object.prototype.hasOwnProperty.call($source$$2$$, $key$$39$$) && ($target$$35$$[$key$$39$$] = $source$$2$$[$key$$39$$])
    }
  }
}
;var $goog$events$BrowserFeature$HAS_W3C_BUTTON$$ = !$goog$userAgent$IE$$ || $goog$userAgent$isDocumentMode$$(), $goog$events$BrowserFeature$HAS_W3C_EVENT_SUPPORT$$ = !$goog$userAgent$IE$$ || $goog$userAgent$isDocumentMode$$(), $goog$events$BrowserFeature$SET_KEY_CODE_TO_PREVENT_DEFAULT$$ = $goog$userAgent$IE$$ && !$goog$userAgent$isVersion$$("8");
!$goog$userAgent$WEBKIT$$ || $goog$userAgent$isVersion$$("528");
$goog$userAgent$GECKO$$ && $goog$userAgent$isVersion$$("1.9b") || $goog$userAgent$IE$$ && $goog$userAgent$isVersion$$("8") || $goog$userAgent$OPERA$$ && $goog$userAgent$isVersion$$("9.5") || $goog$userAgent$WEBKIT$$ && $goog$userAgent$isVersion$$("528");
!$goog$userAgent$GECKO$$ || $goog$userAgent$isVersion$$("8");
function $goog$debug$Error$$($opt_msg$$) {
  this.stack = Error().stack || "";
  if($opt_msg$$) {
    this.message = "" + $opt_msg$$
  }
}
$goog$inherits$$($goog$debug$Error$$, Error);
$goog$debug$Error$$.prototype.name = "CustomError";
function $goog$asserts$AssertionError$$($messagePattern$$, $messageArgs$$) {
  $messageArgs$$.unshift($messagePattern$$);
  $goog$debug$Error$$.call(this, $goog$string$subs$$.apply($JSCompiler_alias_NULL$$, $messageArgs$$));
  $messageArgs$$.shift();
  this.$messagePattern$ = $messagePattern$$
}
$goog$inherits$$($goog$asserts$AssertionError$$, $goog$debug$Error$$);
$goog$asserts$AssertionError$$.prototype.name = "AssertionError";
function $goog$asserts$assert$$($condition$$, $opt_message$$8$$, $var_args$$28$$) {
  if(!$condition$$) {
    var $givenArgs$$inline_37$$ = Array.prototype.slice.call(arguments, 2), $message$$inline_38$$ = "Assertion failed";
    if($opt_message$$8$$) {
      var $message$$inline_38$$ = $message$$inline_38$$ + (": " + $opt_message$$8$$), $args$$inline_39$$ = $givenArgs$$inline_37$$
    }
    throw new $goog$asserts$AssertionError$$("" + $message$$inline_38$$, $args$$inline_39$$ || []);
  }
}
;var $goog$array$ARRAY_PROTOTYPE_$$ = Array.prototype, $goog$array$indexOf$$ = $goog$array$ARRAY_PROTOTYPE_$$.indexOf ? function($arr$$11$$, $obj$$47$$, $opt_fromIndex$$6$$) {
  $goog$asserts$assert$$($arr$$11$$.length != $JSCompiler_alias_NULL$$);
  return $goog$array$ARRAY_PROTOTYPE_$$.indexOf.call($arr$$11$$, $obj$$47$$, $opt_fromIndex$$6$$)
} : function($arr$$12$$, $obj$$48$$, $fromIndex_i$$19_opt_fromIndex$$7$$) {
  $fromIndex_i$$19_opt_fromIndex$$7$$ = $fromIndex_i$$19_opt_fromIndex$$7$$ == $JSCompiler_alias_NULL$$ ? 0 : 0 > $fromIndex_i$$19_opt_fromIndex$$7$$ ? Math.max(0, $arr$$12$$.length + $fromIndex_i$$19_opt_fromIndex$$7$$) : $fromIndex_i$$19_opt_fromIndex$$7$$;
  if($goog$isString$$($arr$$12$$)) {
    return!$goog$isString$$($obj$$48$$) || 1 != $obj$$48$$.length ? -1 : $arr$$12$$.indexOf($obj$$48$$, $fromIndex_i$$19_opt_fromIndex$$7$$)
  }
  for(;$fromIndex_i$$19_opt_fromIndex$$7$$ < $arr$$12$$.length;$fromIndex_i$$19_opt_fromIndex$$7$$++) {
    if($fromIndex_i$$19_opt_fromIndex$$7$$ in $arr$$12$$ && $arr$$12$$[$fromIndex_i$$19_opt_fromIndex$$7$$] === $obj$$48$$) {
      return $fromIndex_i$$19_opt_fromIndex$$7$$
    }
  }
  return-1
}, $goog$array$forEach$$ = $goog$array$ARRAY_PROTOTYPE_$$.forEach ? function($arr$$15$$, $f$$7$$, $opt_obj$$6$$) {
  $goog$asserts$assert$$($arr$$15$$.length != $JSCompiler_alias_NULL$$);
  $goog$array$ARRAY_PROTOTYPE_$$.forEach.call($arr$$15$$, $f$$7$$, $opt_obj$$6$$)
} : function($arr$$16$$, $f$$8$$, $opt_obj$$7$$) {
  for(var $l$$2$$ = $arr$$16$$.length, $arr2$$ = $goog$isString$$($arr$$16$$) ? $arr$$16$$.split("") : $arr$$16$$, $i$$21$$ = 0;$i$$21$$ < $l$$2$$;$i$$21$$++) {
    $i$$21$$ in $arr2$$ && $f$$8$$.call($opt_obj$$7$$, $arr2$$[$i$$21$$], $i$$21$$, $arr$$16$$)
  }
};
function $goog$Disposable$$() {
}
$goog$Disposable$$.prototype.$disposed_$ = $JSCompiler_alias_FALSE$$;
$goog$Disposable$$.prototype.$dispose$ = function $$goog$Disposable$$$$$dispose$$() {
  if(!this.$disposed_$) {
    this.$disposed_$ = $JSCompiler_alias_TRUE$$, this.$disposeInternal$()
  }
};
$goog$Disposable$$.prototype.$disposeInternal$ = function $$goog$Disposable$$$$$disposeInternal$$() {
  this.$dependentDisposables_$ && $goog$disposeAll$$.apply($JSCompiler_alias_NULL$$, this.$dependentDisposables_$)
};
function $goog$disposeAll$$($var_args$$42$$) {
  for(var $i$$50$$ = 0, $len$$1$$ = arguments.length;$i$$50$$ < $len$$1$$;++$i$$50$$) {
    var $disposable$$1$$ = arguments[$i$$50$$], $type$$inline_43$$ = $goog$typeOf$$($disposable$$1$$);
    "array" == $type$$inline_43$$ || "object" == $type$$inline_43$$ && "number" == typeof $disposable$$1$$.length ? $goog$disposeAll$$.apply($JSCompiler_alias_NULL$$, $disposable$$1$$) : $disposable$$1$$ && "function" == typeof $disposable$$1$$.$dispose$ && $disposable$$1$$.$dispose$()
  }
}
;function $goog$events$Event$$($type$$52$$, $opt_target$$1$$) {
  this.type = $type$$52$$;
  this.currentTarget = this.target = $opt_target$$1$$
}
$goog$inherits$$($goog$events$Event$$, $goog$Disposable$$);
$goog$events$Event$$.prototype.$disposeInternal$ = function $$goog$events$Event$$$$$disposeInternal$$() {
  delete this.type;
  delete this.target;
  delete this.currentTarget
};
$goog$events$Event$$.prototype.$propagationStopped_$ = $JSCompiler_alias_FALSE$$;
$goog$events$Event$$.prototype.$returnValue_$ = $JSCompiler_alias_TRUE$$;
$goog$events$Event$$.prototype.preventDefault = function $$goog$events$Event$$$$preventDefault$() {
  this.$returnValue_$ = $JSCompiler_alias_FALSE$$
};
function $goog$events$Event$preventDefault$$($e$$6$$) {
  $e$$6$$.preventDefault()
}
;function $goog$reflect$sinkValue$$($x$$51$$) {
  $goog$reflect$sinkValue$$[" "]($x$$51$$);
  return $x$$51$$
}
$goog$reflect$sinkValue$$[" "] = function $$goog$reflect$sinkValue$$$__0$() {
};
function $goog$events$BrowserEvent$$($opt_e$$, $opt_currentTarget$$) {
  $opt_e$$ && this.$init$($opt_e$$, $opt_currentTarget$$)
}
$goog$inherits$$($goog$events$BrowserEvent$$, $goog$events$Event$$);
var $goog$events$BrowserEvent$IEButtonMap$$ = [1, 4, 2];
$JSCompiler_prototypeAlias$$ = $goog$events$BrowserEvent$$.prototype;
$JSCompiler_prototypeAlias$$.target = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.relatedTarget = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.offsetX = 0;
$JSCompiler_prototypeAlias$$.offsetY = 0;
$JSCompiler_prototypeAlias$$.clientX = 0;
$JSCompiler_prototypeAlias$$.clientY = 0;
$JSCompiler_prototypeAlias$$.screenX = 0;
$JSCompiler_prototypeAlias$$.screenY = 0;
$JSCompiler_prototypeAlias$$.button = 0;
$JSCompiler_prototypeAlias$$.keyCode = 0;
$JSCompiler_prototypeAlias$$.charCode = 0;
$JSCompiler_prototypeAlias$$.ctrlKey = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.altKey = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.shiftKey = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.metaKey = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$platformModifierKey$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$event_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$init$ = function $$JSCompiler_prototypeAlias$$$$init$$($e$$8$$, $opt_currentTarget$$1$$) {
  var $type$$54$$ = this.type = $e$$8$$.type;
  $goog$events$Event$$.call(this, $type$$54$$);
  this.target = $e$$8$$.target || $e$$8$$.srcElement;
  this.currentTarget = $opt_currentTarget$$1$$;
  var $relatedTarget$$ = $e$$8$$.relatedTarget;
  if($relatedTarget$$) {
    if($goog$userAgent$GECKO$$) {
      var $JSCompiler_inline_result$$47$$;
      a: {
        try {
          $goog$reflect$sinkValue$$($relatedTarget$$.nodeName);
          $JSCompiler_inline_result$$47$$ = $JSCompiler_alias_TRUE$$;
          break a
        }catch($e$$inline_49$$) {
        }
        $JSCompiler_inline_result$$47$$ = $JSCompiler_alias_FALSE$$
      }
      $JSCompiler_inline_result$$47$$ || ($relatedTarget$$ = $JSCompiler_alias_NULL$$)
    }
  }else {
    if("mouseover" == $type$$54$$) {
      $relatedTarget$$ = $e$$8$$.fromElement
    }else {
      if("mouseout" == $type$$54$$) {
        $relatedTarget$$ = $e$$8$$.toElement
      }
    }
  }
  this.relatedTarget = $relatedTarget$$;
  this.offsetX = $goog$userAgent$WEBKIT$$ || $e$$8$$.offsetX !== $JSCompiler_alias_VOID$$ ? $e$$8$$.offsetX : $e$$8$$.layerX;
  this.offsetY = $goog$userAgent$WEBKIT$$ || $e$$8$$.offsetY !== $JSCompiler_alias_VOID$$ ? $e$$8$$.offsetY : $e$$8$$.layerY;
  this.clientX = $e$$8$$.clientX !== $JSCompiler_alias_VOID$$ ? $e$$8$$.clientX : $e$$8$$.pageX;
  this.clientY = $e$$8$$.clientY !== $JSCompiler_alias_VOID$$ ? $e$$8$$.clientY : $e$$8$$.pageY;
  this.screenX = $e$$8$$.screenX || 0;
  this.screenY = $e$$8$$.screenY || 0;
  this.button = $e$$8$$.button;
  this.keyCode = $e$$8$$.keyCode || 0;
  this.charCode = $e$$8$$.charCode || ("keypress" == $type$$54$$ ? $e$$8$$.keyCode : 0);
  this.ctrlKey = $e$$8$$.ctrlKey;
  this.altKey = $e$$8$$.altKey;
  this.shiftKey = $e$$8$$.shiftKey;
  this.metaKey = $e$$8$$.metaKey;
  this.$platformModifierKey$ = $goog$userAgent$detectedMac_$$ ? $e$$8$$.metaKey : $e$$8$$.ctrlKey;
  this.state = $e$$8$$.state;
  this.$event_$ = $e$$8$$;
  delete this.$returnValue_$;
  delete this.$propagationStopped_$
};
$JSCompiler_prototypeAlias$$.preventDefault = function $$JSCompiler_prototypeAlias$$$preventDefault$() {
  $goog$events$BrowserEvent$$.$superClass_$.preventDefault.call(this);
  var $be$$ = this.$event_$;
  if($be$$.preventDefault) {
    $be$$.preventDefault()
  }else {
    if($be$$.returnValue = $JSCompiler_alias_FALSE$$, $goog$events$BrowserFeature$SET_KEY_CODE_TO_PREVENT_DEFAULT$$) {
      try {
        if($be$$.ctrlKey || 112 <= $be$$.keyCode && 123 >= $be$$.keyCode) {
          $be$$.keyCode = -1
        }
      }catch($ex$$1$$) {
      }
    }
  }
};
$JSCompiler_prototypeAlias$$.$disposeInternal$ = function $$JSCompiler_prototypeAlias$$$$disposeInternal$$() {
  $goog$events$BrowserEvent$$.$superClass_$.$disposeInternal$.call(this);
  this.relatedTarget = this.currentTarget = this.target = this.$event_$ = $JSCompiler_alias_NULL$$
};
var $goog$events$listeners_$$ = {}, $goog$events$listenerTree_$$ = {}, $goog$events$sources_$$ = {}, $goog$events$onStringMap_$$ = {};
function $goog$events$listen$$($src$$7$$, $type$$55$$, $key$$43_listener$$29$$, $capture$$1_opt_capt$$2$$, $opt_handler$$1$$) {
  if($type$$55$$) {
    if("array" == $goog$typeOf$$($type$$55$$)) {
      for(var $i$$51_proxy$$1$$ = 0;$i$$51_proxy$$1$$ < $type$$55$$.length;$i$$51_proxy$$1$$++) {
        $goog$events$listen$$($src$$7$$, $type$$55$$[$i$$51_proxy$$1$$], $key$$43_listener$$29$$, $capture$$1_opt_capt$$2$$, $opt_handler$$1$$)
      }
      return $JSCompiler_alias_NULL$$
    }
    var $capture$$1_opt_capt$$2$$ = !!$capture$$1_opt_capt$$2$$, $listenerObj_map$$ = $goog$events$listenerTree_$$;
    $type$$55$$ in $listenerObj_map$$ || ($listenerObj_map$$[$type$$55$$] = {$count_$:0, $remaining_$:0});
    $listenerObj_map$$ = $listenerObj_map$$[$type$$55$$];
    $capture$$1_opt_capt$$2$$ in $listenerObj_map$$ || ($listenerObj_map$$[$capture$$1_opt_capt$$2$$] = {$count_$:0, $remaining_$:0}, $listenerObj_map$$.$count_$++);
    var $listenerObj_map$$ = $listenerObj_map$$[$capture$$1_opt_capt$$2$$], $srcUid$$ = $goog$getUid$$($src$$7$$), $listenerArray$$;
    $listenerObj_map$$.$remaining_$++;
    if($listenerObj_map$$[$srcUid$$]) {
      $listenerArray$$ = $listenerObj_map$$[$srcUid$$];
      for($i$$51_proxy$$1$$ = 0;$i$$51_proxy$$1$$ < $listenerArray$$.length;$i$$51_proxy$$1$$++) {
        if($listenerObj_map$$ = $listenerArray$$[$i$$51_proxy$$1$$], $listenerObj_map$$.$listener$ == $key$$43_listener$$29$$ && $listenerObj_map$$.$handler$ == $opt_handler$$1$$) {
          if($listenerObj_map$$.$removed$) {
            break
          }
          return $listenerArray$$[$i$$51_proxy$$1$$].key
        }
      }
    }else {
      $listenerArray$$ = $listenerObj_map$$[$srcUid$$] = [], $listenerObj_map$$.$count_$++
    }
    $i$$51_proxy$$1$$ = $goog$events$getProxy$$();
    $i$$51_proxy$$1$$.src = $src$$7$$;
    $listenerObj_map$$ = new $goog$events$Listener$$;
    $listenerObj_map$$.$init$($key$$43_listener$$29$$, $i$$51_proxy$$1$$, $src$$7$$, $type$$55$$, $capture$$1_opt_capt$$2$$, $opt_handler$$1$$);
    $key$$43_listener$$29$$ = $listenerObj_map$$.key;
    $i$$51_proxy$$1$$.key = $key$$43_listener$$29$$;
    $listenerArray$$.push($listenerObj_map$$);
    $goog$events$listeners_$$[$key$$43_listener$$29$$] = $listenerObj_map$$;
    $goog$events$sources_$$[$srcUid$$] || ($goog$events$sources_$$[$srcUid$$] = []);
    $goog$events$sources_$$[$srcUid$$].push($listenerObj_map$$);
    $src$$7$$.addEventListener ? ($src$$7$$ == $goog$global$$ || !$src$$7$$.$customEvent_$) && $src$$7$$.addEventListener($type$$55$$, $i$$51_proxy$$1$$, $capture$$1_opt_capt$$2$$) : $src$$7$$.attachEvent($type$$55$$ in $goog$events$onStringMap_$$ ? $goog$events$onStringMap_$$[$type$$55$$] : $goog$events$onStringMap_$$[$type$$55$$] = "on" + $type$$55$$, $i$$51_proxy$$1$$);
    return $key$$43_listener$$29$$
  }
  throw Error("Invalid event type");
}
function $goog$events$getProxy$$() {
  var $proxyCallbackFunction$$ = $goog$events$handleBrowserEvent_$$, $f$$25$$ = $goog$events$BrowserFeature$HAS_W3C_EVENT_SUPPORT$$ ? function($eventObject$$1$$) {
    return $proxyCallbackFunction$$.call($f$$25$$.src, $f$$25$$.key, $eventObject$$1$$)
  } : function($eventObject$$2_v$$) {
    $eventObject$$2_v$$ = $proxyCallbackFunction$$.call($f$$25$$.src, $f$$25$$.key, $eventObject$$2_v$$);
    if(!$eventObject$$2_v$$) {
      return $eventObject$$2_v$$
    }
  };
  return $f$$25$$
}
function $goog$events$unlisten$$($listenerArray$$1_objUid$$inline_55_src$$10$$, $type$$57$$, $listener$$32$$, $capture$$2_opt_capt$$5$$, $opt_handler$$4$$) {
  if("array" == $goog$typeOf$$($type$$57$$)) {
    for(var $i$$53_map$$inline_54$$ = 0;$i$$53_map$$inline_54$$ < $type$$57$$.length;$i$$53_map$$inline_54$$++) {
      $goog$events$unlisten$$($listenerArray$$1_objUid$$inline_55_src$$10$$, $type$$57$$[$i$$53_map$$inline_54$$], $listener$$32$$, $capture$$2_opt_capt$$5$$, $opt_handler$$4$$)
    }
  }else {
    $capture$$2_opt_capt$$5$$ = !!$capture$$2_opt_capt$$5$$;
    a: {
      $i$$53_map$$inline_54$$ = $goog$events$listenerTree_$$;
      if($type$$57$$ in $i$$53_map$$inline_54$$ && ($i$$53_map$$inline_54$$ = $i$$53_map$$inline_54$$[$type$$57$$], $capture$$2_opt_capt$$5$$ in $i$$53_map$$inline_54$$ && ($i$$53_map$$inline_54$$ = $i$$53_map$$inline_54$$[$capture$$2_opt_capt$$5$$], $listenerArray$$1_objUid$$inline_55_src$$10$$ = $goog$getUid$$($listenerArray$$1_objUid$$inline_55_src$$10$$), $i$$53_map$$inline_54$$[$listenerArray$$1_objUid$$inline_55_src$$10$$]))) {
        $listenerArray$$1_objUid$$inline_55_src$$10$$ = $i$$53_map$$inline_54$$[$listenerArray$$1_objUid$$inline_55_src$$10$$];
        break a
      }
      $listenerArray$$1_objUid$$inline_55_src$$10$$ = $JSCompiler_alias_NULL$$
    }
    if($listenerArray$$1_objUid$$inline_55_src$$10$$) {
      for($i$$53_map$$inline_54$$ = 0;$i$$53_map$$inline_54$$ < $listenerArray$$1_objUid$$inline_55_src$$10$$.length;$i$$53_map$$inline_54$$++) {
        if($listenerArray$$1_objUid$$inline_55_src$$10$$[$i$$53_map$$inline_54$$].$listener$ == $listener$$32$$ && $listenerArray$$1_objUid$$inline_55_src$$10$$[$i$$53_map$$inline_54$$].capture == $capture$$2_opt_capt$$5$$ && $listenerArray$$1_objUid$$inline_55_src$$10$$[$i$$53_map$$inline_54$$].$handler$ == $opt_handler$$4$$) {
          $goog$events$unlistenByKey$$($listenerArray$$1_objUid$$inline_55_src$$10$$[$i$$53_map$$inline_54$$].key);
          break
        }
      }
    }
  }
}
function $goog$events$unlistenByKey$$($key$$45$$) {
  if(!$goog$events$listeners_$$[$key$$45$$]) {
    return $JSCompiler_alias_FALSE$$
  }
  var $listener$$33$$ = $goog$events$listeners_$$[$key$$45$$];
  if($listener$$33$$.$removed$) {
    return $JSCompiler_alias_FALSE$$
  }
  var $src$$11_srcUid$$1$$ = $listener$$33$$.src, $type$$58$$ = $listener$$33$$.type, $listenerArray$$2_proxy$$2$$ = $listener$$33$$.$proxy$, $capture$$3$$ = $listener$$33$$.capture;
  $src$$11_srcUid$$1$$.removeEventListener ? ($src$$11_srcUid$$1$$ == $goog$global$$ || !$src$$11_srcUid$$1$$.$customEvent_$) && $src$$11_srcUid$$1$$.removeEventListener($type$$58$$, $listenerArray$$2_proxy$$2$$, $capture$$3$$) : $src$$11_srcUid$$1$$.detachEvent && $src$$11_srcUid$$1$$.detachEvent($type$$58$$ in $goog$events$onStringMap_$$ ? $goog$events$onStringMap_$$[$type$$58$$] : $goog$events$onStringMap_$$[$type$$58$$] = "on" + $type$$58$$, $listenerArray$$2_proxy$$2$$);
  $src$$11_srcUid$$1$$ = $goog$getUid$$($src$$11_srcUid$$1$$);
  $listenerArray$$2_proxy$$2$$ = $goog$events$listenerTree_$$[$type$$58$$][$capture$$3$$][$src$$11_srcUid$$1$$];
  if($goog$events$sources_$$[$src$$11_srcUid$$1$$]) {
    var $sourcesArray$$ = $goog$events$sources_$$[$src$$11_srcUid$$1$$], $i$$inline_59$$ = $goog$array$indexOf$$($sourcesArray$$, $listener$$33$$);
    0 <= $i$$inline_59$$ && ($goog$asserts$assert$$($sourcesArray$$.length != $JSCompiler_alias_NULL$$), $goog$array$ARRAY_PROTOTYPE_$$.splice.call($sourcesArray$$, $i$$inline_59$$, 1));
    0 == $sourcesArray$$.length && delete $goog$events$sources_$$[$src$$11_srcUid$$1$$]
  }
  $listener$$33$$.$removed$ = $JSCompiler_alias_TRUE$$;
  $listenerArray$$2_proxy$$2$$.$needsCleanup_$ = $JSCompiler_alias_TRUE$$;
  $goog$events$cleanUp_$$($type$$58$$, $capture$$3$$, $src$$11_srcUid$$1$$, $listenerArray$$2_proxy$$2$$);
  delete $goog$events$listeners_$$[$key$$45$$];
  return $JSCompiler_alias_TRUE$$
}
function $goog$events$cleanUp_$$($type$$59$$, $capture$$4$$, $srcUid$$2$$, $listenerArray$$3$$) {
  if(!$listenerArray$$3$$.$locked_$ && $listenerArray$$3$$.$needsCleanup_$) {
    for(var $oldIndex$$ = 0, $newIndex$$ = 0;$oldIndex$$ < $listenerArray$$3$$.length;$oldIndex$$++) {
      $listenerArray$$3$$[$oldIndex$$].$removed$ ? $listenerArray$$3$$[$oldIndex$$].$proxy$.src = $JSCompiler_alias_NULL$$ : ($oldIndex$$ != $newIndex$$ && ($listenerArray$$3$$[$newIndex$$] = $listenerArray$$3$$[$oldIndex$$]), $newIndex$$++)
    }
    $listenerArray$$3$$.length = $newIndex$$;
    $listenerArray$$3$$.$needsCleanup_$ = $JSCompiler_alias_FALSE$$;
    0 == $newIndex$$ && (delete $goog$events$listenerTree_$$[$type$$59$$][$capture$$4$$][$srcUid$$2$$], $goog$events$listenerTree_$$[$type$$59$$][$capture$$4$$].$count_$--, 0 == $goog$events$listenerTree_$$[$type$$59$$][$capture$$4$$].$count_$ && (delete $goog$events$listenerTree_$$[$type$$59$$][$capture$$4$$], $goog$events$listenerTree_$$[$type$$59$$].$count_$--), 0 == $goog$events$listenerTree_$$[$type$$59$$].$count_$ && delete $goog$events$listenerTree_$$[$type$$59$$])
  }
}
function $goog$events$removeAll$$($opt_obj$$25_sourcesArray$$1_srcUid$$3$$) {
  var $opt_capt$$7$$, $count$$7$$ = 0, $noCapt$$ = $opt_capt$$7$$ == $JSCompiler_alias_NULL$$;
  $opt_capt$$7$$ = !!$opt_capt$$7$$;
  if($opt_obj$$25_sourcesArray$$1_srcUid$$3$$ == $JSCompiler_alias_NULL$$) {
    $goog$object$forEach$$(function($listeners$$) {
      for(var $i$$55$$ = $listeners$$.length - 1;0 <= $i$$55$$;$i$$55$$--) {
        var $listener$$36$$ = $listeners$$[$i$$55$$];
        if($noCapt$$ || $opt_capt$$7$$ == $listener$$36$$.capture) {
          $goog$events$unlistenByKey$$($listener$$36$$.key), $count$$7$$++
        }
      }
    })
  }else {
    if($opt_obj$$25_sourcesArray$$1_srcUid$$3$$ = $goog$getUid$$($opt_obj$$25_sourcesArray$$1_srcUid$$3$$), $goog$events$sources_$$[$opt_obj$$25_sourcesArray$$1_srcUid$$3$$]) {
      for(var $opt_obj$$25_sourcesArray$$1_srcUid$$3$$ = $goog$events$sources_$$[$opt_obj$$25_sourcesArray$$1_srcUid$$3$$], $i$$54$$ = $opt_obj$$25_sourcesArray$$1_srcUid$$3$$.length - 1;0 <= $i$$54$$;$i$$54$$--) {
        var $listener$$35$$ = $opt_obj$$25_sourcesArray$$1_srcUid$$3$$[$i$$54$$];
        if($noCapt$$ || $opt_capt$$7$$ == $listener$$35$$.capture) {
          $goog$events$unlistenByKey$$($listener$$35$$.key), $count$$7$$++
        }
      }
    }
  }
}
function $goog$events$fireListeners_$$($listenerArray$$5_map$$4$$, $obj$$62_objUid$$2$$, $type$$65$$, $capture$$9$$, $eventObject$$4$$) {
  var $retval$$ = 1, $obj$$62_objUid$$2$$ = $goog$getUid$$($obj$$62_objUid$$2$$);
  if($listenerArray$$5_map$$4$$[$obj$$62_objUid$$2$$]) {
    $listenerArray$$5_map$$4$$.$remaining_$--;
    $listenerArray$$5_map$$4$$ = $listenerArray$$5_map$$4$$[$obj$$62_objUid$$2$$];
    $listenerArray$$5_map$$4$$.$locked_$ ? $listenerArray$$5_map$$4$$.$locked_$++ : $listenerArray$$5_map$$4$$.$locked_$ = 1;
    try {
      for(var $length$$16$$ = $listenerArray$$5_map$$4$$.length, $i$$57$$ = 0;$i$$57$$ < $length$$16$$;$i$$57$$++) {
        var $listener$$39$$ = $listenerArray$$5_map$$4$$[$i$$57$$];
        $listener$$39$$ && !$listener$$39$$.$removed$ && ($retval$$ &= $goog$events$fireListener$$($listener$$39$$, $eventObject$$4$$) !== $JSCompiler_alias_FALSE$$)
      }
    }finally {
      $listenerArray$$5_map$$4$$.$locked_$--, $goog$events$cleanUp_$$($type$$65$$, $capture$$9$$, $obj$$62_objUid$$2$$, $listenerArray$$5_map$$4$$)
    }
  }
  return Boolean($retval$$)
}
function $goog$events$fireListener$$($listener$$40$$, $eventObject$$5$$) {
  var $rv$$8$$ = $listener$$40$$.handleEvent($eventObject$$5$$);
  $listener$$40$$.$callOnce$ && $goog$events$unlistenByKey$$($listener$$40$$.key);
  return $rv$$8$$
}
function $goog$events$handleBrowserEvent_$$($key$$47$$, $opt_evt$$) {
  if(!$goog$events$listeners_$$[$key$$47$$]) {
    return $JSCompiler_alias_TRUE$$
  }
  var $listener$$41$$ = $goog$events$listeners_$$[$key$$47$$], $be$$1_type$$67$$ = $listener$$41$$.type, $map$$6$$ = $goog$events$listenerTree_$$;
  if(!($be$$1_type$$67$$ in $map$$6$$)) {
    return $JSCompiler_alias_TRUE$$
  }
  var $map$$6$$ = $map$$6$$[$be$$1_type$$67$$], $ieEvent_part$$inline_63_retval$$1$$, $targetsMap$$1$$;
  if(!$goog$events$BrowserFeature$HAS_W3C_EVENT_SUPPORT$$) {
    var $JSCompiler_temp$$9_hasCapture$$2_parts$$inline_61$$;
    if(!($JSCompiler_temp$$9_hasCapture$$2_parts$$inline_61$$ = $opt_evt$$)) {
      a: {
        $JSCompiler_temp$$9_hasCapture$$2_parts$$inline_61$$ = "window.event".split(".");
        for(var $cur$$inline_62_hasBubble$$1$$ = $goog$global$$;$ieEvent_part$$inline_63_retval$$1$$ = $JSCompiler_temp$$9_hasCapture$$2_parts$$inline_61$$.shift();) {
          if($cur$$inline_62_hasBubble$$1$$[$ieEvent_part$$inline_63_retval$$1$$] != $JSCompiler_alias_NULL$$) {
            $cur$$inline_62_hasBubble$$1$$ = $cur$$inline_62_hasBubble$$1$$[$ieEvent_part$$inline_63_retval$$1$$]
          }else {
            $JSCompiler_temp$$9_hasCapture$$2_parts$$inline_61$$ = $JSCompiler_alias_NULL$$;
            break a
          }
        }
        $JSCompiler_temp$$9_hasCapture$$2_parts$$inline_61$$ = $cur$$inline_62_hasBubble$$1$$
      }
    }
    $ieEvent_part$$inline_63_retval$$1$$ = $JSCompiler_temp$$9_hasCapture$$2_parts$$inline_61$$;
    $JSCompiler_temp$$9_hasCapture$$2_parts$$inline_61$$ = $JSCompiler_alias_TRUE$$ in $map$$6$$;
    $cur$$inline_62_hasBubble$$1$$ = $JSCompiler_alias_FALSE$$ in $map$$6$$;
    if($JSCompiler_temp$$9_hasCapture$$2_parts$$inline_61$$) {
      if(0 > $ieEvent_part$$inline_63_retval$$1$$.keyCode || $ieEvent_part$$inline_63_retval$$1$$.returnValue != $JSCompiler_alias_VOID$$) {
        return $JSCompiler_alias_TRUE$$
      }
      a: {
        var $evt$$14_useReturnValue$$inline_66$$ = $JSCompiler_alias_FALSE$$;
        if(0 == $ieEvent_part$$inline_63_retval$$1$$.keyCode) {
          try {
            $ieEvent_part$$inline_63_retval$$1$$.keyCode = -1;
            break a
          }catch($ex$$inline_67$$) {
            $evt$$14_useReturnValue$$inline_66$$ = $JSCompiler_alias_TRUE$$
          }
        }
        if($evt$$14_useReturnValue$$inline_66$$ || $ieEvent_part$$inline_63_retval$$1$$.returnValue == $JSCompiler_alias_VOID$$) {
          $ieEvent_part$$inline_63_retval$$1$$.returnValue = $JSCompiler_alias_TRUE$$
        }
      }
    }
    $evt$$14_useReturnValue$$inline_66$$ = new $goog$events$BrowserEvent$$;
    $evt$$14_useReturnValue$$inline_66$$.$init$($ieEvent_part$$inline_63_retval$$1$$, this);
    $ieEvent_part$$inline_63_retval$$1$$ = $JSCompiler_alias_TRUE$$;
    try {
      if($JSCompiler_temp$$9_hasCapture$$2_parts$$inline_61$$) {
        for(var $ancestors$$1$$ = [], $parent$$3$$ = $evt$$14_useReturnValue$$inline_66$$.currentTarget;$parent$$3$$;$parent$$3$$ = $parent$$3$$.parentNode) {
          $ancestors$$1$$.push($parent$$3$$)
        }
        $targetsMap$$1$$ = $map$$6$$[$JSCompiler_alias_TRUE$$];
        $targetsMap$$1$$.$remaining_$ = $targetsMap$$1$$.$count_$;
        for(var $i$$59$$ = $ancestors$$1$$.length - 1;!$evt$$14_useReturnValue$$inline_66$$.$propagationStopped_$ && 0 <= $i$$59$$ && $targetsMap$$1$$.$remaining_$;$i$$59$$--) {
          $evt$$14_useReturnValue$$inline_66$$.currentTarget = $ancestors$$1$$[$i$$59$$], $ieEvent_part$$inline_63_retval$$1$$ &= $goog$events$fireListeners_$$($targetsMap$$1$$, $ancestors$$1$$[$i$$59$$], $be$$1_type$$67$$, $JSCompiler_alias_TRUE$$, $evt$$14_useReturnValue$$inline_66$$)
        }
        if($cur$$inline_62_hasBubble$$1$$) {
          $targetsMap$$1$$ = $map$$6$$[$JSCompiler_alias_FALSE$$];
          $targetsMap$$1$$.$remaining_$ = $targetsMap$$1$$.$count_$;
          for($i$$59$$ = 0;!$evt$$14_useReturnValue$$inline_66$$.$propagationStopped_$ && $i$$59$$ < $ancestors$$1$$.length && $targetsMap$$1$$.$remaining_$;$i$$59$$++) {
            $evt$$14_useReturnValue$$inline_66$$.currentTarget = $ancestors$$1$$[$i$$59$$], $ieEvent_part$$inline_63_retval$$1$$ &= $goog$events$fireListeners_$$($targetsMap$$1$$, $ancestors$$1$$[$i$$59$$], $be$$1_type$$67$$, $JSCompiler_alias_FALSE$$, $evt$$14_useReturnValue$$inline_66$$)
          }
        }
      }else {
        $ieEvent_part$$inline_63_retval$$1$$ = $goog$events$fireListener$$($listener$$41$$, $evt$$14_useReturnValue$$inline_66$$)
      }
    }finally {
      if($ancestors$$1$$) {
        $ancestors$$1$$.length = 0
      }
      $evt$$14_useReturnValue$$inline_66$$.$dispose$()
    }
    return $ieEvent_part$$inline_63_retval$$1$$
  }
  $be$$1_type$$67$$ = new $goog$events$BrowserEvent$$($opt_evt$$, this);
  try {
    $ieEvent_part$$inline_63_retval$$1$$ = $goog$events$fireListener$$($listener$$41$$, $be$$1_type$$67$$)
  }finally {
    $be$$1_type$$67$$.$dispose$()
  }
  return $ieEvent_part$$inline_63_retval$$1$$
}
;function $goog$events$EventHandler$$($opt_handler$$7$$) {
  this.$handler_$ = $opt_handler$$7$$;
  this.$keys_$ = []
}
$goog$inherits$$($goog$events$EventHandler$$, $goog$Disposable$$);
var $goog$events$EventHandler$typeArray_$$ = [];
function $JSCompiler_StaticMethods_listen$$($JSCompiler_StaticMethods_listen$self$$, $src$$15$$, $type$$68$$, $opt_fn$$, $opt_capture$$1$$) {
  "array" != $goog$typeOf$$($type$$68$$) && ($goog$events$EventHandler$typeArray_$$[0] = $type$$68$$, $type$$68$$ = $goog$events$EventHandler$typeArray_$$);
  for(var $i$$60$$ = 0;$i$$60$$ < $type$$68$$.length;$i$$60$$++) {
    $JSCompiler_StaticMethods_listen$self$$.$keys_$.push($goog$events$listen$$($src$$15$$, $type$$68$$[$i$$60$$], $opt_fn$$ || $JSCompiler_StaticMethods_listen$self$$, $opt_capture$$1$$ || $JSCompiler_alias_FALSE$$, $JSCompiler_StaticMethods_listen$self$$.$handler_$ || $JSCompiler_StaticMethods_listen$self$$))
  }
}
$goog$events$EventHandler$$.prototype.$disposeInternal$ = function $$goog$events$EventHandler$$$$$disposeInternal$$() {
  $goog$events$EventHandler$$.$superClass_$.$disposeInternal$.call(this);
  $goog$array$forEach$$(this.$keys_$, $goog$events$unlistenByKey$$);
  this.$keys_$.length = 0
};
$goog$events$EventHandler$$.prototype.handleEvent = function $$goog$events$EventHandler$$$$handleEvent$() {
  throw Error("EventHandler.handleEvent not implemented");
};
function $goog$math$Size$$($width$$10$$, $height$$9$$) {
  this.width = $width$$10$$;
  this.height = $height$$9$$
}
$goog$math$Size$$.prototype.$clone$ = function $$goog$math$Size$$$$$clone$$() {
  return new $goog$math$Size$$(this.width, this.height)
};
$goog$math$Size$$.prototype.toString = function $$goog$math$Size$$$$toString$() {
  return"(" + this.width + " x " + this.height + ")"
};
$goog$math$Size$$.prototype.floor = function $$goog$math$Size$$$$floor$() {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this
};
function $goog$math$Coordinate$$($opt_x$$, $opt_y$$) {
  this.x = $opt_x$$ !== $JSCompiler_alias_VOID$$ ? $opt_x$$ : 0;
  this.y = $opt_y$$ !== $JSCompiler_alias_VOID$$ ? $opt_y$$ : 0
}
$goog$math$Coordinate$$.prototype.$clone$ = function $$goog$math$Coordinate$$$$$clone$$() {
  return new $goog$math$Coordinate$$(this.x, this.y)
};
$goog$math$Coordinate$$.prototype.toString = function $$goog$math$Coordinate$$$$toString$() {
  return"(" + this.x + ", " + this.y + ")"
};
function $goog$math$Rect$$($x$$52$$, $y$$32$$, $w$$4$$, $h$$4$$) {
  this.left = $x$$52$$;
  this.top = $y$$32$$;
  this.width = $w$$4$$;
  this.height = $h$$4$$
}
$goog$math$Rect$$.prototype.$clone$ = function $$goog$math$Rect$$$$$clone$$() {
  return new $goog$math$Rect$$(this.left, this.top, this.width, this.height)
};
$goog$math$Rect$$.prototype.toString = function $$goog$math$Rect$$$$toString$() {
  return"(" + this.left + ", " + this.top + " - " + this.width + "w x " + this.height + "h)"
};
$goog$math$Rect$$.prototype.$getSize$ = function $$goog$math$Rect$$$$$getSize$$() {
  return new $goog$math$Size$$(this.width, this.height)
};
var $goog$dom$defaultDomHelper_$$;
!$goog$userAgent$IE$$ || $goog$userAgent$isDocumentMode$$();
!$goog$userAgent$GECKO$$ && !$goog$userAgent$IE$$ || $goog$userAgent$IE$$ && $goog$userAgent$isDocumentMode$$() || $goog$userAgent$GECKO$$ && $goog$userAgent$isVersion$$("1.9.1");
$goog$userAgent$IE$$ && $goog$userAgent$isVersion$$("9");
function $goog$dom$getDomHelper$$($opt_element$$) {
  return $opt_element$$ ? new $goog$dom$DomHelper$$(9 == $opt_element$$.nodeType ? $opt_element$$ : $opt_element$$.ownerDocument || $opt_element$$.document) : $goog$dom$defaultDomHelper_$$ || ($goog$dom$defaultDomHelper_$$ = new $goog$dom$DomHelper$$)
}
function $goog$dom$getElement$$($element$$17$$) {
  return $goog$isString$$($element$$17$$) ? document.getElementById($element$$17$$) : $element$$17$$
}
function $goog$dom$getViewportSize_$$($el$$2_win$$) {
  var $doc$$6_innerHeight$$ = $el$$2_win$$.document;
  if($goog$userAgent$WEBKIT$$ && !$goog$userAgent$isVersion$$("500") && !$goog$userAgent$MOBILE$$) {
    "undefined" == typeof $el$$2_win$$.innerHeight && ($el$$2_win$$ = window);
    var $doc$$6_innerHeight$$ = $el$$2_win$$.innerHeight, $scrollHeight$$ = $el$$2_win$$.document.documentElement.scrollHeight;
    $el$$2_win$$ == $el$$2_win$$.top && $scrollHeight$$ < $doc$$6_innerHeight$$ && ($doc$$6_innerHeight$$ -= 15);
    return new $goog$math$Size$$($el$$2_win$$.innerWidth, $doc$$6_innerHeight$$)
  }
  $el$$2_win$$ = "CSS1Compat" == $doc$$6_innerHeight$$.compatMode ? $doc$$6_innerHeight$$.documentElement : $doc$$6_innerHeight$$.body;
  return new $goog$math$Size$$($el$$2_win$$.clientWidth, $el$$2_win$$.clientHeight)
}
function $goog$dom$getDocumentScroll_$$($doc$$8_win$$3$$) {
  var $el$$3$$ = !$goog$userAgent$WEBKIT$$ && "CSS1Compat" == $doc$$8_win$$3$$.compatMode ? $doc$$8_win$$3$$.documentElement : $doc$$8_win$$3$$.body, $doc$$8_win$$3$$ = $doc$$8_win$$3$$.parentWindow || $doc$$8_win$$3$$.defaultView;
  return new $goog$math$Coordinate$$($doc$$8_win$$3$$.pageXOffset || $el$$3$$.scrollLeft, $doc$$8_win$$3$$.pageYOffset || $el$$3$$.scrollTop)
}
function $goog$dom$DomHelper$$($opt_document$$) {
  this.$document_$ = $opt_document$$ || $goog$global$$.document || document
}
;function $goog$events$EventTarget$$() {
}
$goog$inherits$$($goog$events$EventTarget$$, $goog$Disposable$$);
$JSCompiler_prototypeAlias$$ = $goog$events$EventTarget$$.prototype;
$JSCompiler_prototypeAlias$$.$customEvent_$ = $JSCompiler_alias_TRUE$$;
$JSCompiler_prototypeAlias$$.$parentEventTarget_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.addEventListener = function $$JSCompiler_prototypeAlias$$$addEventListener$($type$$71$$, $handler$$3$$, $opt_capture$$4$$, $opt_handlerScope$$) {
  $goog$events$listen$$(this, $type$$71$$, $handler$$3$$, $opt_capture$$4$$, $opt_handlerScope$$)
};
$JSCompiler_prototypeAlias$$.removeEventListener = function $$JSCompiler_prototypeAlias$$$removeEventListener$($type$$72$$, $handler$$4$$, $opt_capture$$5$$, $opt_handlerScope$$1$$) {
  $goog$events$unlisten$$(this, $type$$72$$, $handler$$4$$, $opt_capture$$5$$, $opt_handlerScope$$1$$)
};
$JSCompiler_prototypeAlias$$.dispatchEvent = function $$JSCompiler_prototypeAlias$$$dispatchEvent$($JSCompiler_inline_result$$72_e$$15_e$$inline_74$$) {
  var $hasCapture$$inline_80_type$$inline_75$$ = $JSCompiler_inline_result$$72_e$$15_e$$inline_74$$.type || $JSCompiler_inline_result$$72_e$$15_e$$inline_74$$, $map$$inline_76$$ = $goog$events$listenerTree_$$;
  if($hasCapture$$inline_80_type$$inline_75$$ in $map$$inline_76$$) {
    if($goog$isString$$($JSCompiler_inline_result$$72_e$$15_e$$inline_74$$)) {
      $JSCompiler_inline_result$$72_e$$15_e$$inline_74$$ = new $goog$events$Event$$($JSCompiler_inline_result$$72_e$$15_e$$inline_74$$, this)
    }else {
      if($JSCompiler_inline_result$$72_e$$15_e$$inline_74$$ instanceof $goog$events$Event$$) {
        $JSCompiler_inline_result$$72_e$$15_e$$inline_74$$.target = $JSCompiler_inline_result$$72_e$$15_e$$inline_74$$.target || this
      }else {
        var $oldEvent$$inline_77_rv$$inline_78$$ = $JSCompiler_inline_result$$72_e$$15_e$$inline_74$$, $JSCompiler_inline_result$$72_e$$15_e$$inline_74$$ = new $goog$events$Event$$($hasCapture$$inline_80_type$$inline_75$$, this);
        $goog$object$extend$$($JSCompiler_inline_result$$72_e$$15_e$$inline_74$$, $oldEvent$$inline_77_rv$$inline_78$$)
      }
    }
    var $oldEvent$$inline_77_rv$$inline_78$$ = 1, $ancestors$$inline_79_current$$inline_84$$, $map$$inline_76$$ = $map$$inline_76$$[$hasCapture$$inline_80_type$$inline_75$$], $hasCapture$$inline_80_type$$inline_75$$ = $JSCompiler_alias_TRUE$$ in $map$$inline_76$$, $parent$$inline_82_targetsMap$$inline_81$$;
    if($hasCapture$$inline_80_type$$inline_75$$) {
      $ancestors$$inline_79_current$$inline_84$$ = [];
      for($parent$$inline_82_targetsMap$$inline_81$$ = this;$parent$$inline_82_targetsMap$$inline_81$$;$parent$$inline_82_targetsMap$$inline_81$$ = $parent$$inline_82_targetsMap$$inline_81$$.$parentEventTarget_$) {
        $ancestors$$inline_79_current$$inline_84$$.push($parent$$inline_82_targetsMap$$inline_81$$)
      }
      $parent$$inline_82_targetsMap$$inline_81$$ = $map$$inline_76$$[$JSCompiler_alias_TRUE$$];
      $parent$$inline_82_targetsMap$$inline_81$$.$remaining_$ = $parent$$inline_82_targetsMap$$inline_81$$.$count_$;
      for(var $i$$inline_83$$ = $ancestors$$inline_79_current$$inline_84$$.length - 1;!$JSCompiler_inline_result$$72_e$$15_e$$inline_74$$.$propagationStopped_$ && 0 <= $i$$inline_83$$ && $parent$$inline_82_targetsMap$$inline_81$$.$remaining_$;$i$$inline_83$$--) {
        $JSCompiler_inline_result$$72_e$$15_e$$inline_74$$.currentTarget = $ancestors$$inline_79_current$$inline_84$$[$i$$inline_83$$], $oldEvent$$inline_77_rv$$inline_78$$ &= $goog$events$fireListeners_$$($parent$$inline_82_targetsMap$$inline_81$$, $ancestors$$inline_79_current$$inline_84$$[$i$$inline_83$$], $JSCompiler_inline_result$$72_e$$15_e$$inline_74$$.type, $JSCompiler_alias_TRUE$$, $JSCompiler_inline_result$$72_e$$15_e$$inline_74$$) && $JSCompiler_inline_result$$72_e$$15_e$$inline_74$$.$returnValue_$ != 
        $JSCompiler_alias_FALSE$$
      }
    }
    if($JSCompiler_alias_FALSE$$ in $map$$inline_76$$) {
      if($parent$$inline_82_targetsMap$$inline_81$$ = $map$$inline_76$$[$JSCompiler_alias_FALSE$$], $parent$$inline_82_targetsMap$$inline_81$$.$remaining_$ = $parent$$inline_82_targetsMap$$inline_81$$.$count_$, $hasCapture$$inline_80_type$$inline_75$$) {
        for($i$$inline_83$$ = 0;!$JSCompiler_inline_result$$72_e$$15_e$$inline_74$$.$propagationStopped_$ && $i$$inline_83$$ < $ancestors$$inline_79_current$$inline_84$$.length && $parent$$inline_82_targetsMap$$inline_81$$.$remaining_$;$i$$inline_83$$++) {
          $JSCompiler_inline_result$$72_e$$15_e$$inline_74$$.currentTarget = $ancestors$$inline_79_current$$inline_84$$[$i$$inline_83$$], $oldEvent$$inline_77_rv$$inline_78$$ &= $goog$events$fireListeners_$$($parent$$inline_82_targetsMap$$inline_81$$, $ancestors$$inline_79_current$$inline_84$$[$i$$inline_83$$], $JSCompiler_inline_result$$72_e$$15_e$$inline_74$$.type, $JSCompiler_alias_FALSE$$, $JSCompiler_inline_result$$72_e$$15_e$$inline_74$$) && $JSCompiler_inline_result$$72_e$$15_e$$inline_74$$.$returnValue_$ != 
          $JSCompiler_alias_FALSE$$
        }
      }else {
        for($ancestors$$inline_79_current$$inline_84$$ = this;!$JSCompiler_inline_result$$72_e$$15_e$$inline_74$$.$propagationStopped_$ && $ancestors$$inline_79_current$$inline_84$$ && $parent$$inline_82_targetsMap$$inline_81$$.$remaining_$;$ancestors$$inline_79_current$$inline_84$$ = $ancestors$$inline_79_current$$inline_84$$.$parentEventTarget_$) {
          $JSCompiler_inline_result$$72_e$$15_e$$inline_74$$.currentTarget = $ancestors$$inline_79_current$$inline_84$$, $oldEvent$$inline_77_rv$$inline_78$$ &= $goog$events$fireListeners_$$($parent$$inline_82_targetsMap$$inline_81$$, $ancestors$$inline_79_current$$inline_84$$, $JSCompiler_inline_result$$72_e$$15_e$$inline_74$$.type, $JSCompiler_alias_FALSE$$, $JSCompiler_inline_result$$72_e$$15_e$$inline_74$$) && $JSCompiler_inline_result$$72_e$$15_e$$inline_74$$.$returnValue_$ != $JSCompiler_alias_FALSE$$
        }
      }
    }
    $JSCompiler_inline_result$$72_e$$15_e$$inline_74$$ = Boolean($oldEvent$$inline_77_rv$$inline_78$$)
  }else {
    $JSCompiler_inline_result$$72_e$$15_e$$inline_74$$ = $JSCompiler_alias_TRUE$$
  }
  return $JSCompiler_inline_result$$72_e$$15_e$$inline_74$$
};
$JSCompiler_prototypeAlias$$.$disposeInternal$ = function $$JSCompiler_prototypeAlias$$$$disposeInternal$$() {
  $goog$events$EventTarget$$.$superClass_$.$disposeInternal$.call(this);
  $goog$events$removeAll$$(this);
  this.$parentEventTarget_$ = $JSCompiler_alias_NULL$$
};
function $goog$fx$Dragger$$($target$$39$$, $opt_handle$$, $opt_limits$$) {
  this.target = $target$$39$$;
  this.handle = $opt_handle$$ || $target$$39$$;
  this.$limits$ = $opt_limits$$ || new $goog$math$Rect$$(NaN, NaN, NaN, NaN);
  this.$document_$ = 9 == $target$$39$$.nodeType ? $target$$39$$ : $target$$39$$.ownerDocument || $target$$39$$.document;
  this.$eventHandler_$ = new $goog$events$EventHandler$$(this);
  $goog$events$listen$$(this.handle, ["touchstart", "mousedown"], this.$startDrag$, $JSCompiler_alias_FALSE$$, this)
}
$goog$inherits$$($goog$fx$Dragger$$, $goog$events$EventTarget$$);
var $goog$fx$Dragger$HAS_SET_CAPTURE_$$ = $goog$userAgent$IE$$ || $goog$userAgent$GECKO$$ && $goog$userAgent$isVersion$$("1.9.3");
$JSCompiler_prototypeAlias$$ = $goog$fx$Dragger$$.prototype;
$JSCompiler_prototypeAlias$$.clientX = 0;
$JSCompiler_prototypeAlias$$.clientY = 0;
$JSCompiler_prototypeAlias$$.screenX = 0;
$JSCompiler_prototypeAlias$$.screenY = 0;
$JSCompiler_prototypeAlias$$.$startX$ = 0;
$JSCompiler_prototypeAlias$$.$startY$ = 0;
$JSCompiler_prototypeAlias$$.$deltaX$ = 0;
$JSCompiler_prototypeAlias$$.$deltaY$ = 0;
$JSCompiler_prototypeAlias$$.$enabled_$ = $JSCompiler_alias_TRUE$$;
$JSCompiler_prototypeAlias$$.$dragging_$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$hysteresisDistanceSquared_$ = 0;
$JSCompiler_prototypeAlias$$.$mouseDownTime_$ = 0;
$JSCompiler_prototypeAlias$$.$ieDragStartCancellingOn_$ = $JSCompiler_alias_FALSE$$;
$JSCompiler_prototypeAlias$$.$disposeInternal$ = function $$JSCompiler_prototypeAlias$$$$disposeInternal$$() {
  $goog$fx$Dragger$$.$superClass_$.$disposeInternal$.call(this);
  $goog$events$unlisten$$(this.handle, ["touchstart", "mousedown"], this.$startDrag$, $JSCompiler_alias_FALSE$$, this);
  this.$eventHandler_$.$dispose$();
  delete this.target;
  delete this.handle;
  delete this.$eventHandler_$
};
$JSCompiler_prototypeAlias$$.$startDrag$ = function $$JSCompiler_prototypeAlias$$$$startDrag$$($JSCompiler_StaticMethods_getDocumentScroll$self$$inline_93_e$$16$$) {
  var $doc$$inline_88_isMouseDown$$ = "mousedown" == $JSCompiler_StaticMethods_getDocumentScroll$self$$inline_93_e$$16$$.type;
  if(this.$enabled_$ && !this.$dragging_$ && (!$doc$$inline_88_isMouseDown$$ || ($goog$events$BrowserFeature$HAS_W3C_BUTTON$$ ? 0 == $JSCompiler_StaticMethods_getDocumentScroll$self$$inline_93_e$$16$$.$event_$.button : "click" == $JSCompiler_StaticMethods_getDocumentScroll$self$$inline_93_e$$16$$.type || $JSCompiler_StaticMethods_getDocumentScroll$self$$inline_93_e$$16$$.$event_$.button & $goog$events$BrowserEvent$IEButtonMap$$[0]) && (!$goog$userAgent$WEBKIT$$ || !$goog$userAgent$detectedMac_$$ || 
  !$JSCompiler_StaticMethods_getDocumentScroll$self$$inline_93_e$$16$$.ctrlKey))) {
    $JSCompiler_StaticMethods_maybeReinitTouchEvent_$$($JSCompiler_StaticMethods_getDocumentScroll$self$$inline_93_e$$16$$);
    if(0 == this.$hysteresisDistanceSquared_$) {
      if($JSCompiler_StaticMethods_initializeDrag_$$(this, $JSCompiler_StaticMethods_getDocumentScroll$self$$inline_93_e$$16$$), this.$dragging_$) {
        $JSCompiler_StaticMethods_getDocumentScroll$self$$inline_93_e$$16$$.preventDefault()
      }else {
        return
      }
    }else {
      $JSCompiler_StaticMethods_getDocumentScroll$self$$inline_93_e$$16$$.preventDefault()
    }
    var $doc$$inline_88_isMouseDown$$ = this.$document_$, $docEl$$inline_89$$ = $doc$$inline_88_isMouseDown$$.documentElement, $useCapture$$inline_90$$ = !$goog$fx$Dragger$HAS_SET_CAPTURE_$$;
    $JSCompiler_StaticMethods_listen$$(this.$eventHandler_$, $doc$$inline_88_isMouseDown$$, ["touchmove", "mousemove"], this.$handleMove_$, $useCapture$$inline_90$$);
    $JSCompiler_StaticMethods_listen$$(this.$eventHandler_$, $doc$$inline_88_isMouseDown$$, ["touchend", "mouseup"], this.$endDrag$, $useCapture$$inline_90$$);
    $goog$fx$Dragger$HAS_SET_CAPTURE_$$ ? ($docEl$$inline_89$$.setCapture($JSCompiler_alias_FALSE$$), $JSCompiler_StaticMethods_listen$$(this.$eventHandler_$, $docEl$$inline_89$$, "losecapture", this.$endDrag$)) : $JSCompiler_StaticMethods_listen$$(this.$eventHandler_$, $doc$$inline_88_isMouseDown$$ ? $doc$$inline_88_isMouseDown$$.parentWindow || $doc$$inline_88_isMouseDown$$.defaultView : window, "blur", this.$endDrag$);
    $goog$userAgent$IE$$ && this.$ieDragStartCancellingOn_$ && $JSCompiler_StaticMethods_listen$$(this.$eventHandler_$, $doc$$inline_88_isMouseDown$$, "dragstart", $goog$events$Event$preventDefault$$);
    this.$scrollTarget_$ && $JSCompiler_StaticMethods_listen$$(this.$eventHandler_$, this.$scrollTarget_$, "scroll", this.$onScroll_$, $useCapture$$inline_90$$);
    this.clientX = this.$startX$ = $JSCompiler_StaticMethods_getDocumentScroll$self$$inline_93_e$$16$$.clientX;
    this.clientY = this.$startY$ = $JSCompiler_StaticMethods_getDocumentScroll$self$$inline_93_e$$16$$.clientY;
    this.screenX = $JSCompiler_StaticMethods_getDocumentScroll$self$$inline_93_e$$16$$.screenX;
    this.screenY = $JSCompiler_StaticMethods_getDocumentScroll$self$$inline_93_e$$16$$.screenY;
    this.$deltaX$ = this.target.offsetLeft;
    this.$deltaY$ = this.target.offsetTop;
    $JSCompiler_StaticMethods_getDocumentScroll$self$$inline_93_e$$16$$ = $goog$dom$getDomHelper$$(this.$document_$);
    this.$pageScroll$ = $goog$dom$getDocumentScroll_$$($JSCompiler_StaticMethods_getDocumentScroll$self$$inline_93_e$$16$$.$document_$);
    this.$mouseDownTime_$ = $goog$now$$()
  }else {
    this.dispatchEvent("earlycancel")
  }
};
function $JSCompiler_StaticMethods_initializeDrag_$$($JSCompiler_StaticMethods_initializeDrag_$self$$, $e$$17$$) {
  if($JSCompiler_StaticMethods_initializeDrag_$self$$.dispatchEvent(new $goog$fx$DragEvent$$("start", $JSCompiler_StaticMethods_initializeDrag_$self$$, $e$$17$$.clientX, $e$$17$$.clientY, $e$$17$$)) !== $JSCompiler_alias_FALSE$$) {
    $JSCompiler_StaticMethods_initializeDrag_$self$$.$dragging_$ = $JSCompiler_alias_TRUE$$
  }
}
$JSCompiler_prototypeAlias$$.$endDrag$ = function $$JSCompiler_prototypeAlias$$$$endDrag$$($e$$18$$, $opt_dragCanceled$$) {
  var $JSCompiler_StaticMethods_removeAll$self$$inline_95_x$$53$$ = this.$eventHandler_$;
  $goog$array$forEach$$($JSCompiler_StaticMethods_removeAll$self$$inline_95_x$$53$$.$keys_$, $goog$events$unlistenByKey$$);
  $JSCompiler_StaticMethods_removeAll$self$$inline_95_x$$53$$.$keys_$.length = 0;
  $goog$fx$Dragger$HAS_SET_CAPTURE_$$ && this.$document_$.releaseCapture();
  var $JSCompiler_StaticMethods_removeAll$self$$inline_95_x$$53$$ = $JSCompiler_StaticMethods_limitX$$(this, this.$deltaX$), $y$$33$$ = $JSCompiler_StaticMethods_limitY$$(this, this.$deltaY$);
  this.$dragging_$ ? ($JSCompiler_StaticMethods_maybeReinitTouchEvent_$$($e$$18$$), this.$dragging_$ = $JSCompiler_alias_FALSE$$, this.dispatchEvent(new $goog$fx$DragEvent$$("end", this, $e$$18$$.clientX, $e$$18$$.clientY, $e$$18$$, $JSCompiler_StaticMethods_removeAll$self$$inline_95_x$$53$$, $y$$33$$, $opt_dragCanceled$$ || "touchcancel" == $e$$18$$.type))) : this.dispatchEvent("earlycancel");
  ("touchend" == $e$$18$$.type || "touchcancel" == $e$$18$$.type) && $e$$18$$.preventDefault()
};
function $JSCompiler_StaticMethods_maybeReinitTouchEvent_$$($e$$20$$) {
  var $type$$73$$ = $e$$20$$.type;
  "touchstart" == $type$$73$$ || "touchmove" == $type$$73$$ ? $e$$20$$.$init$($e$$20$$.$event_$.targetTouches[0], $e$$20$$.currentTarget) : ("touchend" == $type$$73$$ || "touchcancel" == $type$$73$$) && $e$$20$$.$init$($e$$20$$.$event_$.changedTouches[0], $e$$20$$.currentTarget)
}
$JSCompiler_prototypeAlias$$.$handleMove_$ = function $$JSCompiler_prototypeAlias$$$$handleMove_$$($e$$21$$) {
  if(this.$enabled_$) {
    $JSCompiler_StaticMethods_maybeReinitTouchEvent_$$($e$$21$$);
    var $dx$$6_x$$54$$ = $e$$21$$.clientX - this.clientX, $dy$$6_pos$$1_y$$34$$ = $e$$21$$.clientY - this.clientY;
    this.clientX = $e$$21$$.clientX;
    this.clientY = $e$$21$$.clientY;
    this.screenX = $e$$21$$.screenX;
    this.screenY = $e$$21$$.screenY;
    if(!this.$dragging_$) {
      var $diffX$$ = this.$startX$ - this.clientX, $diffY$$ = this.$startY$ - this.clientY;
      if($diffX$$ * $diffX$$ + $diffY$$ * $diffY$$ > this.$hysteresisDistanceSquared_$ && ($JSCompiler_StaticMethods_initializeDrag_$$(this, $e$$21$$), !this.$dragging_$)) {
        this.$endDrag$($e$$21$$);
        return
      }
    }
    $dy$$6_pos$$1_y$$34$$ = $JSCompiler_StaticMethods_calculatePosition_$$(this, $dx$$6_x$$54$$, $dy$$6_pos$$1_y$$34$$);
    $dx$$6_x$$54$$ = $dy$$6_pos$$1_y$$34$$.x;
    $dy$$6_pos$$1_y$$34$$ = $dy$$6_pos$$1_y$$34$$.y;
    this.$dragging_$ && this.dispatchEvent(new $goog$fx$DragEvent$$("beforedrag", this, $e$$21$$.clientX, $e$$21$$.clientY, $e$$21$$, $dx$$6_x$$54$$, $dy$$6_pos$$1_y$$34$$)) !== $JSCompiler_alias_FALSE$$ && ($JSCompiler_StaticMethods_doDrag$$(this, $e$$21$$, $dx$$6_x$$54$$, $dy$$6_pos$$1_y$$34$$), $e$$21$$.preventDefault())
  }
};
function $JSCompiler_StaticMethods_calculatePosition_$$($JSCompiler_StaticMethods_calculatePosition_$self_y$$35$$, $dx$$7_x$$55$$, $dy$$7$$) {
  var $JSCompiler_StaticMethods_getDocumentScroll$self$$inline_97_pageScroll$$;
  $JSCompiler_StaticMethods_getDocumentScroll$self$$inline_97_pageScroll$$ = $goog$dom$getDomHelper$$($JSCompiler_StaticMethods_calculatePosition_$self_y$$35$$.$document_$);
  $JSCompiler_StaticMethods_getDocumentScroll$self$$inline_97_pageScroll$$ = $goog$dom$getDocumentScroll_$$($JSCompiler_StaticMethods_getDocumentScroll$self$$inline_97_pageScroll$$.$document_$);
  $dx$$7_x$$55$$ += $JSCompiler_StaticMethods_getDocumentScroll$self$$inline_97_pageScroll$$.x - $JSCompiler_StaticMethods_calculatePosition_$self_y$$35$$.$pageScroll$.x;
  $dy$$7$$ += $JSCompiler_StaticMethods_getDocumentScroll$self$$inline_97_pageScroll$$.y - $JSCompiler_StaticMethods_calculatePosition_$self_y$$35$$.$pageScroll$.y;
  $JSCompiler_StaticMethods_calculatePosition_$self_y$$35$$.$pageScroll$ = $JSCompiler_StaticMethods_getDocumentScroll$self$$inline_97_pageScroll$$;
  $JSCompiler_StaticMethods_calculatePosition_$self_y$$35$$.$deltaX$ += $dx$$7_x$$55$$;
  $JSCompiler_StaticMethods_calculatePosition_$self_y$$35$$.$deltaY$ += $dy$$7$$;
  $dx$$7_x$$55$$ = $JSCompiler_StaticMethods_limitX$$($JSCompiler_StaticMethods_calculatePosition_$self_y$$35$$, $JSCompiler_StaticMethods_calculatePosition_$self_y$$35$$.$deltaX$);
  $JSCompiler_StaticMethods_calculatePosition_$self_y$$35$$ = $JSCompiler_StaticMethods_limitY$$($JSCompiler_StaticMethods_calculatePosition_$self_y$$35$$, $JSCompiler_StaticMethods_calculatePosition_$self_y$$35$$.$deltaY$);
  return new $goog$math$Coordinate$$($dx$$7_x$$55$$, $JSCompiler_StaticMethods_calculatePosition_$self_y$$35$$)
}
$JSCompiler_prototypeAlias$$.$onScroll_$ = function $$JSCompiler_prototypeAlias$$$$onScroll_$$($e$$22$$) {
  var $pos$$2$$ = $JSCompiler_StaticMethods_calculatePosition_$$(this, 0, 0);
  $e$$22$$.clientX = this.clientX;
  $e$$22$$.clientY = this.clientY;
  $JSCompiler_StaticMethods_doDrag$$(this, $e$$22$$, $pos$$2$$.x, $pos$$2$$.y)
};
function $JSCompiler_StaticMethods_doDrag$$($JSCompiler_StaticMethods_doDrag$self$$, $e$$23$$, $x$$56$$, $y$$36$$) {
  $JSCompiler_StaticMethods_doDrag$self$$.target.style.left = $x$$56$$ + "px";
  $JSCompiler_StaticMethods_doDrag$self$$.target.style.top = $y$$36$$ + "px";
  $JSCompiler_StaticMethods_doDrag$self$$.dispatchEvent(new $goog$fx$DragEvent$$("drag", $JSCompiler_StaticMethods_doDrag$self$$, $e$$23$$.clientX, $e$$23$$.clientY, $e$$23$$, $x$$56$$, $y$$36$$))
}
function $JSCompiler_StaticMethods_limitX$$($JSCompiler_StaticMethods_limitX$self$$, $x$$57$$) {
  var $rect$$4_width$$11$$ = $JSCompiler_StaticMethods_limitX$self$$.$limits$, $left$$6$$ = !isNaN($rect$$4_width$$11$$.left) ? $rect$$4_width$$11$$.left : $JSCompiler_alias_NULL$$, $rect$$4_width$$11$$ = !isNaN($rect$$4_width$$11$$.width) ? $rect$$4_width$$11$$.width : 0;
  return Math.min($left$$6$$ != $JSCompiler_alias_NULL$$ ? $left$$6$$ + $rect$$4_width$$11$$ : Infinity, Math.max($left$$6$$ != $JSCompiler_alias_NULL$$ ? $left$$6$$ : -Infinity, $x$$57$$))
}
function $JSCompiler_StaticMethods_limitY$$($JSCompiler_StaticMethods_limitY$self$$, $y$$37$$) {
  var $height$$12_rect$$5$$ = $JSCompiler_StaticMethods_limitY$self$$.$limits$, $top$$5$$ = !isNaN($height$$12_rect$$5$$.top) ? $height$$12_rect$$5$$.top : $JSCompiler_alias_NULL$$, $height$$12_rect$$5$$ = !isNaN($height$$12_rect$$5$$.height) ? $height$$12_rect$$5$$.height : 0;
  return Math.min($top$$5$$ != $JSCompiler_alias_NULL$$ ? $top$$5$$ + $height$$12_rect$$5$$ : Infinity, Math.max($top$$5$$ != $JSCompiler_alias_NULL$$ ? $top$$5$$ : -Infinity, $y$$37$$))
}
function $goog$fx$DragEvent$$($type$$74$$, $dragobj$$, $clientX$$1$$, $clientY$$1$$, $browserEvent$$, $opt_actX$$, $opt_actY$$, $opt_dragCanceled$$1$$) {
  $goog$events$Event$$.call(this, $type$$74$$);
  this.clientX = $clientX$$1$$;
  this.clientY = $clientY$$1$$;
  this.$browserEvent$ = $browserEvent$$;
  this.left = $opt_actX$$ !== $JSCompiler_alias_VOID$$ ? $opt_actX$$ : $dragobj$$.$deltaX$;
  this.top = $opt_actY$$ !== $JSCompiler_alias_VOID$$ ? $opt_actY$$ : $dragobj$$.$deltaY$;
  this.$dragger$ = $dragobj$$;
  this.$dragCanceled$ = !!$opt_dragCanceled$$1$$
}
$goog$inherits$$($goog$fx$DragEvent$$, $goog$events$Event$$);
function $goog$style$setOpacity$$($el$$15$$, $alpha$$3$$) {
  var $style$$6$$ = $el$$15$$.style;
  if("opacity" in $style$$6$$) {
    $style$$6$$.opacity = $alpha$$3$$
  }else {
    if("MozOpacity" in $style$$6$$) {
      $style$$6$$.MozOpacity = $alpha$$3$$
    }else {
      if("filter" in $style$$6$$) {
        $style$$6$$.filter = "" === $alpha$$3$$ ? "" : "alpha(opacity=" + 100 * $alpha$$3$$ + ")"
      }
    }
  }
}
;function $goog$dom$ViewportSizeMonitor$$($opt_window$$3$$) {
  this.$window_$ = $opt_window$$3$$ || window;
  this.$listenerKey_$ = $goog$events$listen$$(this.$window_$, "resize", this.$handleResize_$, $JSCompiler_alias_FALSE$$, this);
  this.$size_$ = $goog$dom$getViewportSize_$$(this.$window_$ || window);
  if($goog$userAgent$WEBKIT$$ && $goog$userAgent$WINDOWS$$ || $goog$userAgent$OPERA$$ && this.$window_$.self != this.$window_$.top) {
    this.$windowSizePollInterval_$ = window.setInterval($goog$bind$$(this.$checkForSizeChange_$, this), $goog$dom$ViewportSizeMonitor$WINDOW_SIZE_POLL_RATE$$)
  }
}
$goog$inherits$$($goog$dom$ViewportSizeMonitor$$, $goog$events$EventTarget$$);
var $goog$dom$ViewportSizeMonitor$WINDOW_SIZE_POLL_RATE$$ = 500;
$JSCompiler_prototypeAlias$$ = $goog$dom$ViewportSizeMonitor$$.prototype;
$JSCompiler_prototypeAlias$$.$listenerKey_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$window_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$size_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$windowSizePollInterval_$ = $JSCompiler_alias_NULL$$;
$JSCompiler_prototypeAlias$$.$getSize$ = function $$JSCompiler_prototypeAlias$$$$getSize$$() {
  return this.$size_$ ? this.$size_$.$clone$() : $JSCompiler_alias_NULL$$
};
$JSCompiler_prototypeAlias$$.$disposeInternal$ = function $$JSCompiler_prototypeAlias$$$$disposeInternal$$() {
  $goog$dom$ViewportSizeMonitor$$.$superClass_$.$disposeInternal$.call(this);
  if(this.$listenerKey_$) {
    $goog$events$unlistenByKey$$(this.$listenerKey_$), this.$listenerKey_$ = $JSCompiler_alias_NULL$$
  }
  if(this.$windowSizePollInterval_$) {
    window.clearInterval(this.$windowSizePollInterval_$), this.$windowSizePollInterval_$ = $JSCompiler_alias_NULL$$
  }
  this.$size_$ = this.$window_$ = $JSCompiler_alias_NULL$$
};
$JSCompiler_prototypeAlias$$.$handleResize_$ = function $$JSCompiler_prototypeAlias$$$$handleResize_$$() {
  this.$checkForSizeChange_$()
};
$JSCompiler_prototypeAlias$$.$checkForSizeChange_$ = function $$JSCompiler_prototypeAlias$$$$checkForSizeChange_$$() {
  var $size$$14$$ = $goog$dom$getViewportSize_$$(this.$window_$ || window);
  if(!($size$$14$$ == this.$size_$ || (!$size$$14$$ || !this.$size_$ ? 0 : $size$$14$$.width == this.$size_$.width && $size$$14$$.height == this.$size_$.height))) {
    this.$size_$ = $size$$14$$, this.dispatchEvent("resize")
  }
};
function $goog$functions$TRUE$$() {
  return $JSCompiler_alias_TRUE$$
}
;/*
 Portions of this code are from the Dojo Toolkit, received by
 The Closure Library Authors under the BSD license. All other code is
 Copyright 2005-2009 The Closure Library Authors. All Rights Reserved.

 The "New" BSD License:

 Copyright (c) 2005-2009, The Dojo Foundation
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.
 Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.
 Neither the name of the Dojo Foundation nor the names of its contributors
 may be used to endorse or promote products derived from this software
 without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
var $goog$dom$query$$ = function() {
  function $query$$3$$($query$$9$$, $root$$17$$) {
    if(!$query$$9$$) {
      return[]
    }
    if($query$$9$$.constructor == Array) {
      return $query$$9$$
    }
    if(!$goog$isString$$($query$$9$$)) {
      return[$query$$9$$]
    }
    if($goog$isString$$($root$$17$$) && ($root$$17$$ = $goog$dom$getElement$$($root$$17$$), !$root$$17$$)) {
      return[]
    }
    var $root$$17$$ = $root$$17$$ || document, $od_r$$3$$ = $root$$17$$.ownerDocument || $root$$17$$.documentElement;
    $caseSensitive$$ = $root$$17$$.contentType && "application/xml" == $root$$17$$.contentType || $goog$userAgent$OPERA$$ && ($root$$17$$.doctype || "[object XMLDocument]" == $od_r$$3$$.toString()) || !!$od_r$$3$$ && ($goog$userAgent$IE$$ ? $od_r$$3$$.xml : $root$$17$$.xmlVersion || $od_r$$3$$.xmlVersion);
    return($od_r$$3$$ = $getQueryFunc$$($query$$9$$)($root$$17$$)) && $od_r$$3$$.$nozip$ ? $od_r$$3$$ : $_zip$$($od_r$$3$$)
  }
  function $_zip$$($arr$$60$$) {
    if($arr$$60$$ && $arr$$60$$.$nozip$) {
      return $arr$$60$$
    }
    var $ret$$9$$ = [];
    if(!$arr$$60$$ || !$arr$$60$$.length) {
      return $ret$$9$$
    }
    $arr$$60$$[0] && $ret$$9$$.push($arr$$60$$[0]);
    if(2 > $arr$$60$$.length) {
      return $ret$$9$$
    }
    $_zipIdx$$++;
    if($goog$userAgent$IE$$ && $caseSensitive$$) {
      var $szidx$$ = $_zipIdx$$ + "";
      $arr$$60$$[0].setAttribute("_zipIdx", $szidx$$);
      for(var $x$$68$$ = 1, $te$$8$$;$te$$8$$ = $arr$$60$$[$x$$68$$];$x$$68$$++) {
        $arr$$60$$[$x$$68$$].getAttribute("_zipIdx") != $szidx$$ && $ret$$9$$.push($te$$8$$), $te$$8$$.setAttribute("_zipIdx", $szidx$$)
      }
    }else {
      if($goog$userAgent$IE$$ && $arr$$60$$.$commentStrip$) {
        try {
          for($x$$68$$ = 1;$te$$8$$ = $arr$$60$$[$x$$68$$];$x$$68$$++) {
            $isElement$$($te$$8$$) && $ret$$9$$.push($te$$8$$)
          }
        }catch($e$$27$$) {
        }
      }else {
        $arr$$60$$[0] && ($arr$$60$$[0]._zipIdx = $_zipIdx$$);
        for($x$$68$$ = 1;$te$$8$$ = $arr$$60$$[$x$$68$$];$x$$68$$++) {
          $arr$$60$$[$x$$68$$]._zipIdx != $_zipIdx$$ && $ret$$9$$.push($te$$8$$), $te$$8$$._zipIdx = $_zipIdx$$
        }
      }
    }
    return $ret$$9$$
  }
  function $_isUnique$$($node$$31$$, $bag$$4$$) {
    if(!$bag$$4$$) {
      return 1
    }
    var $id$$2$$ = $_nodeUID$$($node$$31$$);
    return!$bag$$4$$[$id$$2$$] ? $bag$$4$$[$id$$2$$] = 1 : 0
  }
  function $getQueryFunc$$($query$$8$$, $opt_forceDOM$$) {
    if($qsaAvail$$) {
      var $domCached_qcz_qsaCached$$ = $_queryFuncCacheQSA$$[$query$$8$$];
      if($domCached_qcz_qsaCached$$ && !$opt_forceDOM$$) {
        return $domCached_qcz_qsaCached$$
      }
    }
    if($domCached_qcz_qsaCached$$ = $_queryFuncCacheDOM$$[$query$$8$$]) {
      return $domCached_qcz_qsaCached$$
    }
    var $domCached_qcz_qsaCached$$ = $query$$8$$.charAt(0), $nospace$$ = -1 == $query$$8$$.indexOf(" ");
    0 <= $query$$8$$.indexOf("#") && $nospace$$ && ($opt_forceDOM$$ = $JSCompiler_alias_TRUE$$);
    if($qsaAvail$$ && !$opt_forceDOM$$ && -1 == ">~+".indexOf($domCached_qcz_qsaCached$$) && (!$goog$userAgent$IE$$ || -1 == $query$$8$$.indexOf(":")) && !($cssCaseBug$$ && 0 <= $query$$8$$.indexOf(".")) && -1 == $query$$8$$.indexOf(":contains") && -1 == $query$$8$$.indexOf("|=")) {
      var $tq$$ = 0 <= ">~+".indexOf($query$$8$$.charAt($query$$8$$.length - 1)) ? $query$$8$$ + " *" : $query$$8$$;
      return $_queryFuncCacheQSA$$[$query$$8$$] = function $$_queryFuncCacheQSA$$$$query$$8$$$($root$$15$$) {
        try {
          if(!(9 == $root$$15$$.nodeType || $nospace$$)) {
            throw"";
          }
          var $r$$2$$ = $root$$15$$.querySelectorAll($tq$$);
          $goog$userAgent$IE$$ ? $r$$2$$.$commentStrip$ = $JSCompiler_alias_TRUE$$ : $r$$2$$.$nozip$ = $JSCompiler_alias_TRUE$$;
          return $r$$2$$
        }catch($e$$26$$) {
          return $getQueryFunc$$($query$$8$$, $JSCompiler_alias_TRUE$$)($root$$15$$)
        }
      }
    }
    var $parts$$3$$ = $query$$8$$.split(/\s*,\s*/);
    return $_queryFuncCacheDOM$$[$query$$8$$] = 2 > $parts$$3$$.length ? $getStepQueryFunc$$($query$$8$$) : function($root$$16$$) {
      for(var $pindex$$ = 0, $ret$$8$$ = [], $tp$$;$tp$$ = $parts$$3$$[$pindex$$++];) {
        $ret$$8$$ = $ret$$8$$.concat($getStepQueryFunc$$($tp$$)($root$$16$$))
      }
      return $ret$$8$$
    }
  }
  function $getStepQueryFunc$$($query$$7$$) {
    var $qparts$$ = $getQueryParts$$($goog$string$trim$$($query$$7$$));
    if(1 == $qparts$$.length) {
      var $tef$$ = $getElementsFunc$$($qparts$$[0]);
      return function($r$$1_root$$13$$) {
        if($r$$1_root$$13$$ = $tef$$($r$$1_root$$13$$, [])) {
          $r$$1_root$$13$$.$nozip$ = $JSCompiler_alias_TRUE$$
        }
        return $r$$1_root$$13$$
      }
    }
    return function($candidates$$inline_119_root$$14$$) {
      for(var $candidates$$inline_119_root$$14$$ = $getArr$$($candidates$$inline_119_root$$14$$), $qp$$inline_120_te$$inline_122$$, $gef$$inline_127_x$$inline_121$$, $qpl$$inline_123$$ = $qparts$$.length, $bag$$inline_124$$, $ret$$inline_125$$, $i$$inline_126$$ = 0;$i$$inline_126$$ < $qpl$$inline_123$$;$i$$inline_126$$++) {
        $ret$$inline_125$$ = [];
        $qp$$inline_120_te$$inline_122$$ = $qparts$$[$i$$inline_126$$];
        $gef$$inline_127_x$$inline_121$$ = $candidates$$inline_119_root$$14$$.length - 1;
        if(0 < $gef$$inline_127_x$$inline_121$$) {
          $bag$$inline_124$$ = {}, $ret$$inline_125$$.$nozip$ = $JSCompiler_alias_TRUE$$
        }
        $gef$$inline_127_x$$inline_121$$ = $getElementsFunc$$($qp$$inline_120_te$$inline_122$$);
        for(var $j$$inline_128$$ = 0;$qp$$inline_120_te$$inline_122$$ = $candidates$$inline_119_root$$14$$[$j$$inline_128$$];$j$$inline_128$$++) {
          $gef$$inline_127_x$$inline_121$$($qp$$inline_120_te$$inline_122$$, $ret$$inline_125$$, $bag$$inline_124$$)
        }
        if(!$ret$$inline_125$$.length) {
          break
        }
        $candidates$$inline_119_root$$14$$ = $ret$$inline_125$$
      }
      return $ret$$inline_125$$
    }
  }
  function $getElementsFunc$$($query$$6$$) {
    var $retFunc$$ = $_getElementsFuncCache$$[$query$$6$$.$query$];
    if($retFunc$$) {
      return $retFunc$$
    }
    var $io_oper$$ = $query$$6$$.$infixOper$, $io_oper$$ = $io_oper$$ ? $io_oper$$.$oper$ : "", $filterFunc$$3$$ = $getSimpleFilterFunc$$($query$$6$$, {$el$:1}), $wildcardTag$$ = "*" == $query$$6$$.$tag$, $ecs_skipFilters$$ = document.getElementsByClassName;
    if($io_oper$$) {
      $ecs_skipFilters$$ = {$el$:1};
      if($wildcardTag$$) {
        $ecs_skipFilters$$.$tag$ = 1
      }
      $filterFunc$$3$$ = $getSimpleFilterFunc$$($query$$6$$, $ecs_skipFilters$$);
      "+" == $io_oper$$ ? $retFunc$$ = $nextSiblingIterator$$($filterFunc$$3$$) : "~" == $io_oper$$ ? $retFunc$$ = $nextSiblingsIterator$$($filterFunc$$3$$) : ">" == $io_oper$$ && ($retFunc$$ = $_childElements$$($filterFunc$$3$$))
    }else {
      if($query$$6$$.id) {
        $filterFunc$$3$$ = !$query$$6$$.$loops$ && $wildcardTag$$ ? $goog$functions$TRUE$$ : $getSimpleFilterFunc$$($query$$6$$, {$el$:1, id:1}), $retFunc$$ = function $$retFunc$$$($root$$8$$, $arr$$56$$) {
          var $JSCompiler_StaticMethods_getElement$self$$inline_109_te$$3$$;
          $JSCompiler_StaticMethods_getElement$self$$inline_109_te$$3$$ = $goog$dom$getDomHelper$$($root$$8$$);
          var $JSCompiler_temp$$0_JSCompiler_temp$$1_element$$inline_110_pn$$inline_114$$ = $query$$6$$.id;
          if($JSCompiler_temp$$0_JSCompiler_temp$$1_element$$inline_110_pn$$inline_114$$ = ($JSCompiler_StaticMethods_getElement$self$$inline_109_te$$3$$ = $goog$isString$$($JSCompiler_temp$$0_JSCompiler_temp$$1_element$$inline_110_pn$$inline_114$$) ? $JSCompiler_StaticMethods_getElement$self$$inline_109_te$$3$$.$document_$.getElementById($JSCompiler_temp$$0_JSCompiler_temp$$1_element$$inline_110_pn$$inline_114$$) : $JSCompiler_temp$$0_JSCompiler_temp$$1_element$$inline_110_pn$$inline_114$$) && $filterFunc$$3$$($JSCompiler_StaticMethods_getElement$self$$inline_109_te$$3$$)) {
            if(!($JSCompiler_temp$$0_JSCompiler_temp$$1_element$$inline_110_pn$$inline_114$$ = 9 == $root$$8$$.nodeType)) {
              for($JSCompiler_temp$$0_JSCompiler_temp$$1_element$$inline_110_pn$$inline_114$$ = $JSCompiler_StaticMethods_getElement$self$$inline_109_te$$3$$.parentNode;$JSCompiler_temp$$0_JSCompiler_temp$$1_element$$inline_110_pn$$inline_114$$ && !($JSCompiler_temp$$0_JSCompiler_temp$$1_element$$inline_110_pn$$inline_114$$ == $root$$8$$);) {
                $JSCompiler_temp$$0_JSCompiler_temp$$1_element$$inline_110_pn$$inline_114$$ = $JSCompiler_temp$$0_JSCompiler_temp$$1_element$$inline_110_pn$$inline_114$$.parentNode
              }
              $JSCompiler_temp$$0_JSCompiler_temp$$1_element$$inline_110_pn$$inline_114$$ = !!$JSCompiler_temp$$0_JSCompiler_temp$$1_element$$inline_110_pn$$inline_114$$
            }
          }
          if($JSCompiler_temp$$0_JSCompiler_temp$$1_element$$inline_110_pn$$inline_114$$) {
            return $getArr$$($JSCompiler_StaticMethods_getElement$self$$inline_109_te$$3$$, $arr$$56$$)
          }
        }
      }else {
        if($ecs_skipFilters$$ && /\{\s*\[native code\]\s*\}/.test("" + $ecs_skipFilters$$) && $query$$6$$.$classes$.length && !$cssCaseBug$$) {
          var $filterFunc$$3$$ = $getSimpleFilterFunc$$($query$$6$$, {$el$:1, $classes$:1, id:1}), $classesString$$ = $query$$6$$.$classes$.join(" "), $retFunc$$ = function $$retFunc$$$($root$$9$$, $arr$$57$$) {
            for(var $ret$$4$$ = $getArr$$(0, $arr$$57$$), $te$$4$$, $x$$64$$ = 0, $tret$$2$$ = $root$$9$$.getElementsByClassName($classesString$$);$te$$4$$ = $tret$$2$$[$x$$64$$++];) {
              $filterFunc$$3$$($te$$4$$, $root$$9$$) && $ret$$4$$.push($te$$4$$)
            }
            return $ret$$4$$
          }
        }else {
          !$wildcardTag$$ && !$query$$6$$.$loops$ ? $retFunc$$ = function $$retFunc$$$($root$$10$$, $arr$$58$$) {
            for(var $ret$$5$$ = $getArr$$(0, $arr$$58$$), $te$$5$$, $x$$65$$ = 0, $tret$$3$$ = $root$$10$$.getElementsByTagName($query$$6$$.$getTag$());$te$$5$$ = $tret$$3$$[$x$$65$$++];) {
              $ret$$5$$.push($te$$5$$)
            }
            return $ret$$5$$
          } : ($filterFunc$$3$$ = $getSimpleFilterFunc$$($query$$6$$, {$el$:1, $tag$:1, id:1}), $retFunc$$ = function $$retFunc$$$($root$$11$$, $arr$$59$$) {
            for(var $ret$$6$$ = $getArr$$(0, $arr$$59$$), $te$$6$$, $x$$66$$ = 0, $tret$$4$$ = $root$$11$$.getElementsByTagName($query$$6$$.$getTag$());$te$$6$$ = $tret$$4$$[$x$$66$$++];) {
              $filterFunc$$3$$($te$$6$$, $root$$11$$) && $ret$$6$$.push($te$$6$$)
            }
            return $ret$$6$$
          })
        }
      }
    }
    return $_getElementsFuncCache$$[$query$$6$$.$query$] = $retFunc$$
  }
  function $_childElements$$($filterFunc$$2$$) {
    $filterFunc$$2$$ = $filterFunc$$2$$ || $goog$functions$TRUE$$;
    return function($root$$6_te$$2$$, $ret$$3$$, $bag$$2$$) {
      for(var $x$$63$$ = 0, $tret$$1$$ = $root$$6_te$$2$$[$childNodesName$$];$root$$6_te$$2$$ = $tret$$1$$[$x$$63$$++];) {
        $simpleNodeTest$$($root$$6_te$$2$$) && (!$bag$$2$$ || $_isUnique$$($root$$6_te$$2$$, $bag$$2$$)) && $filterFunc$$2$$($root$$6_te$$2$$, $x$$63$$) && $ret$$3$$.push($root$$6_te$$2$$)
      }
      return $ret$$3$$
    }
  }
  function $nextSiblingsIterator$$($filterFunc$$1$$) {
    return function($root$$5_te$$1$$, $ret$$2$$, $bag$$1$$) {
      for($root$$5_te$$1$$ = $root$$5_te$$1$$[$nSibling$$];$root$$5_te$$1$$;) {
        if($simpleNodeTest$$($root$$5_te$$1$$)) {
          if($bag$$1$$ && !$_isUnique$$($root$$5_te$$1$$, $bag$$1$$)) {
            break
          }
          $filterFunc$$1$$($root$$5_te$$1$$) && $ret$$2$$.push($root$$5_te$$1$$)
        }
        $root$$5_te$$1$$ = $root$$5_te$$1$$[$nSibling$$]
      }
      return $ret$$2$$
    }
  }
  function $nextSiblingIterator$$($filterFunc$$) {
    return function($node$$27$$, $ret$$1$$, $bag$$) {
      for(;$node$$27$$ = $node$$27$$[$nSibling$$];) {
        if(!$noNextElementSibling$$ || $isElement$$($node$$27$$)) {
          (!$bag$$ || $_isUnique$$($node$$27$$, $bag$$)) && $filterFunc$$($node$$27$$) && $ret$$1$$.push($node$$27$$);
          break
        }
      }
      return $ret$$1$$
    }
  }
  function $getSimpleFilterFunc$$($query$$5$$, $ignores$$1$$) {
    if(!$query$$5$$) {
      return $goog$functions$TRUE$$
    }
    var $ignores$$1$$ = $ignores$$1$$ || {}, $ff$$ = $JSCompiler_alias_NULL$$;
    $ignores$$1$$.$el$ || ($ff$$ = $agree$$($ff$$, $isElement$$));
    $ignores$$1$$.$tag$ || "*" != $query$$5$$.$tag$ && ($ff$$ = $agree$$($ff$$, function($elem$$19$$) {
      return $elem$$19$$ && $elem$$19$$.tagName == $query$$5$$.$getTag$()
    }));
    $ignores$$1$$.$classes$ || $goog$array$forEach$$($query$$5$$.$classes$, function($cname$$, $idx$$1$$) {
      var $re$$3$$ = RegExp("(?:^|\\s)" + $cname$$ + "(?:\\s|$)");
      $ff$$ = $agree$$($ff$$, function($elem$$20$$) {
        return $re$$3$$.test($elem$$20$$.className)
      });
      $ff$$.$count$ = $idx$$1$$
    });
    $ignores$$1$$.$pseudos$ || $goog$array$forEach$$($query$$5$$.$pseudos$, function($pseudo$$) {
      var $pn$$ = $pseudo$$.name;
      $pseudos$$[$pn$$] && ($ff$$ = $agree$$($ff$$, $pseudos$$[$pn$$]($pn$$, $pseudo$$.value)))
    });
    $ignores$$1$$.$attrs$ || $goog$array$forEach$$($query$$5$$.$attrs$, function($attr$$7$$) {
      var $matcher$$1$$, $a$$20$$ = $attr$$7$$.$attr$;
      $attr$$7$$.type && $attrs$$[$attr$$7$$.type] ? $matcher$$1$$ = $attrs$$[$attr$$7$$.type]($a$$20$$, $attr$$7$$.$matchFor$) : $a$$20$$.length && ($matcher$$1$$ = $defaultGetter$$($a$$20$$));
      $matcher$$1$$ && ($ff$$ = $agree$$($ff$$, $matcher$$1$$))
    });
    $ignores$$1$$.id || $query$$5$$.id && ($ff$$ = $agree$$($ff$$, function($elem$$21$$) {
      return!!$elem$$21$$ && $elem$$21$$.id == $query$$5$$.id
    }));
    $ff$$ || "default" in $ignores$$1$$ || ($ff$$ = $goog$functions$TRUE$$);
    return $ff$$
  }
  function $isOdd$$($elem$$10$$) {
    return $getNodeIndex$$($elem$$10$$) % 2
  }
  function $isEven$$($elem$$9$$) {
    return!($getNodeIndex$$($elem$$9$$) % 2)
  }
  function $getNodeIndex$$($node$$25$$) {
    var $root$$4_te$$ = $node$$25$$.parentNode, $i$$78$$ = 0, $l$$12_tret$$ = $root$$4_te$$[$childNodesName$$], $ci$$ = $node$$25$$._i || -1, $cl$$ = $root$$4_te$$._l || -1;
    if(!$l$$12_tret$$) {
      return-1
    }
    $l$$12_tret$$ = $l$$12_tret$$.length;
    if($cl$$ == $l$$12_tret$$ && 0 <= $ci$$ && 0 <= $cl$$) {
      return $ci$$
    }
    $root$$4_te$$._l = $l$$12_tret$$;
    $ci$$ = -1;
    for($root$$4_te$$ = $root$$4_te$$.firstElementChild || $root$$4_te$$.firstChild;$root$$4_te$$;$root$$4_te$$ = $root$$4_te$$[$nSibling$$]) {
      if($simpleNodeTest$$($root$$4_te$$)) {
        $root$$4_te$$._i = ++$i$$78$$, $node$$25$$ === $root$$4_te$$ && ($ci$$ = $i$$78$$)
      }
    }
    return $ci$$
  }
  function $_lookRight$$($node$$24$$) {
    for(;$node$$24$$ = $node$$24$$[$nSibling$$];) {
      if($simpleNodeTest$$($node$$24$$)) {
        return $JSCompiler_alias_FALSE$$
      }
    }
    return $JSCompiler_alias_TRUE$$
  }
  function $_lookLeft$$($node$$23$$) {
    for(;$node$$23$$ = $node$$23$$[$pSibling$$];) {
      if($simpleNodeTest$$($node$$23$$)) {
        return $JSCompiler_alias_FALSE$$
      }
    }
    return $JSCompiler_alias_TRUE$$
  }
  function $getAttr$$($elem$$2$$, $attr$$) {
    return!$elem$$2$$ ? "" : "class" == $attr$$ ? $elem$$2$$.className || "" : "for" == $attr$$ ? $elem$$2$$.htmlFor || "" : "style" == $attr$$ ? $elem$$2$$.style.cssText || "" : ($caseSensitive$$ ? $elem$$2$$.getAttribute($attr$$) : $elem$$2$$.getAttribute($attr$$, 2)) || ""
  }
  function $isElement$$($n$$5$$) {
    return 1 == $n$$5$$.nodeType
  }
  function $agree$$($first$$2$$, $second$$) {
    return!$first$$2$$ ? $second$$ : !$second$$ ? $first$$2$$ : function() {
      return $first$$2$$.apply(window, arguments) && $second$$.apply(window, arguments)
    }
  }
  function $getQueryParts$$($query$$4$$) {
    function $endAll$$() {
      if(0 <= $inId$$) {
        $currentPart$$.id = $ts$$($inId$$, $x$$61$$).replace(/\\/g, ""), $inId$$ = -1
      }
      if(0 <= $inTag$$) {
        var $tv$$inline_105$$ = $inTag$$ == $x$$61$$ ? $JSCompiler_alias_NULL$$ : $ts$$($inTag$$, $x$$61$$);
        0 > ">~+".indexOf($tv$$inline_105$$) ? $currentPart$$.$tag$ = $tv$$inline_105$$ : $currentPart$$.$oper$ = $tv$$inline_105$$;
        $inTag$$ = -1
      }
      0 <= $inClass$$ && ($currentPart$$.$classes$.push($ts$$($inClass$$ + 1, $x$$61$$).replace(/\\/g, "")), $inClass$$ = -1)
    }
    function $ts$$($s$$18$$, $e$$25$$) {
      return $goog$string$trim$$($query$$4$$.slice($s$$18$$, $e$$25$$))
    }
    for(var $query$$4$$ = 0 <= ">~+".indexOf($query$$4$$.slice(-1)) ? $query$$4$$ + " * " : $query$$4$$ + " ", $queryParts$$ = [], $cmf_inBrackets$$ = -1, $inParens$$ = -1, $addToCc_inMatchFor$$ = -1, $inPseudo$$ = -1, $inClass$$ = -1, $inId$$ = -1, $inTag$$ = -1, $lc$$ = "", $cc$$2$$ = "", $pStart$$, $x$$61$$ = 0, $ql$$ = $query$$4$$.length, $currentPart$$ = $JSCompiler_alias_NULL$$, $cp$$ = $JSCompiler_alias_NULL$$;$lc$$ = $cc$$2$$, $cc$$2$$ = $query$$4$$.charAt($x$$61$$), $x$$61$$ < $ql$$;$x$$61$$++) {
      if("\\" != $lc$$) {
        if($currentPart$$ || ($pStart$$ = $x$$61$$, $currentPart$$ = {$query$:$JSCompiler_alias_NULL$$, $pseudos$:[], $attrs$:[], $classes$:[], $tag$:$JSCompiler_alias_NULL$$, $oper$:$JSCompiler_alias_NULL$$, id:$JSCompiler_alias_NULL$$, $getTag$:function $$currentPart$$$$getTag$$() {
          return $caseSensitive$$ ? this.$otag$ : this.$tag$
        }}, $inTag$$ = $x$$61$$), 0 <= $cmf_inBrackets$$) {
          if("]" == $cc$$2$$) {
            $cp$$.$attr$ ? $cp$$.$matchFor$ = $ts$$($addToCc_inMatchFor$$ || $cmf_inBrackets$$ + 1, $x$$61$$) : $cp$$.$attr$ = $ts$$($cmf_inBrackets$$ + 1, $x$$61$$);
            if(($cmf_inBrackets$$ = $cp$$.$matchFor$) && ('"' == $cmf_inBrackets$$.charAt(0) || "'" == $cmf_inBrackets$$.charAt(0))) {
              $cp$$.$matchFor$ = $cmf_inBrackets$$.slice(1, -1)
            }
            $currentPart$$.$attrs$.push($cp$$);
            $cp$$ = $JSCompiler_alias_NULL$$;
            $cmf_inBrackets$$ = $addToCc_inMatchFor$$ = -1
          }else {
            if("=" == $cc$$2$$) {
              $addToCc_inMatchFor$$ = 0 <= "|~^$*".indexOf($lc$$) ? $lc$$ : "", $cp$$.type = $addToCc_inMatchFor$$ + $cc$$2$$, $cp$$.$attr$ = $ts$$($cmf_inBrackets$$ + 1, $x$$61$$ - $addToCc_inMatchFor$$.length), $addToCc_inMatchFor$$ = $x$$61$$ + 1
            }
          }
        }else {
          if(0 <= $inParens$$) {
            if(")" == $cc$$2$$) {
              if(0 <= $inPseudo$$) {
                $cp$$.value = $ts$$($inParens$$ + 1, $x$$61$$)
              }
              $inPseudo$$ = $inParens$$ = -1
            }
          }else {
            if("#" == $cc$$2$$) {
              $endAll$$(), $inId$$ = $x$$61$$ + 1
            }else {
              if("." == $cc$$2$$) {
                $endAll$$(), $inClass$$ = $x$$61$$
              }else {
                if(":" == $cc$$2$$) {
                  $endAll$$(), $inPseudo$$ = $x$$61$$
                }else {
                  if("[" == $cc$$2$$) {
                    $endAll$$(), $cmf_inBrackets$$ = $x$$61$$, $cp$$ = {}
                  }else {
                    if("(" == $cc$$2$$) {
                      0 <= $inPseudo$$ && ($cp$$ = {name:$ts$$($inPseudo$$ + 1, $x$$61$$), value:$JSCompiler_alias_NULL$$}, $currentPart$$.$pseudos$.push($cp$$)), $inParens$$ = $x$$61$$
                    }else {
                      if(" " == $cc$$2$$ && $lc$$ != $cc$$2$$) {
                        $endAll$$();
                        0 <= $inPseudo$$ && $currentPart$$.$pseudos$.push({name:$ts$$($inPseudo$$ + 1, $x$$61$$)});
                        $currentPart$$.$loops$ = $currentPart$$.$pseudos$.length || $currentPart$$.$attrs$.length || $currentPart$$.$classes$.length;
                        $currentPart$$.$oquery$ = $currentPart$$.$query$ = $ts$$($pStart$$, $x$$61$$);
                        $currentPart$$.$otag$ = $currentPart$$.$tag$ = $currentPart$$.$oper$ ? $JSCompiler_alias_NULL$$ : $currentPart$$.$tag$ || "*";
                        if($currentPart$$.$tag$) {
                          $currentPart$$.$tag$ = $currentPart$$.$tag$.toUpperCase()
                        }
                        if($queryParts$$.length && $queryParts$$[$queryParts$$.length - 1].$oper$) {
                          $currentPart$$.$infixOper$ = $queryParts$$.pop(), $currentPart$$.$query$ = $currentPart$$.$infixOper$.$query$ + " " + $currentPart$$.$query$
                        }
                        $queryParts$$.push($currentPart$$);
                        $currentPart$$ = $JSCompiler_alias_NULL$$
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return $queryParts$$
  }
  function $getArr$$($i$$77$$, $opt_arr$$) {
    var $r$$ = $opt_arr$$ || [];
    $i$$77$$ && $r$$.push($i$$77$$);
    return $r$$
  }
  var $cssCaseBug$$ = $goog$userAgent$WEBKIT$$ && "BackCompat" == document.compatMode, $childNodesName$$ = document.firstChild.children ? "children" : "childNodes", $caseSensitive$$ = $JSCompiler_alias_FALSE$$, $attrs$$ = {"*=":function($attr$$1$$, $value$$63$$) {
    return function($elem$$3$$) {
      return 0 <= $getAttr$$($elem$$3$$, $attr$$1$$).indexOf($value$$63$$)
    }
  }, "^=":function($attr$$2$$, $value$$64$$) {
    return function($elem$$4$$) {
      return 0 == $getAttr$$($elem$$4$$, $attr$$2$$).indexOf($value$$64$$)
    }
  }, "$=":function($attr$$3$$, $value$$65$$) {
    return function($ea_elem$$5$$) {
      $ea_elem$$5$$ = " " + $getAttr$$($ea_elem$$5$$, $attr$$3$$);
      return $ea_elem$$5$$.lastIndexOf($value$$65$$) == $ea_elem$$5$$.length - $value$$65$$.length
    }
  }, "~=":function($attr$$4$$, $value$$66$$) {
    var $tval$$1$$ = " " + $value$$66$$ + " ";
    return function($elem$$6$$) {
      return 0 <= (" " + $getAttr$$($elem$$6$$, $attr$$4$$) + " ").indexOf($tval$$1$$)
    }
  }, "|=":function($attr$$5$$, $value$$67$$) {
    $value$$67$$ = " " + $value$$67$$;
    return function($ea$$2_elem$$7$$) {
      $ea$$2_elem$$7$$ = " " + $getAttr$$($ea$$2_elem$$7$$, $attr$$5$$);
      return $ea$$2_elem$$7$$ == $value$$67$$ || 0 == $ea$$2_elem$$7$$.indexOf($value$$67$$ + "-")
    }
  }, "=":function($attr$$6$$, $value$$68$$) {
    return function($elem$$8$$) {
      return $getAttr$$($elem$$8$$, $attr$$6$$) == $value$$68$$
    }
  }}, $noNextElementSibling$$ = "undefined" == typeof document.firstChild.nextElementSibling, $nSibling$$ = !$noNextElementSibling$$ ? "nextElementSibling" : "nextSibling", $pSibling$$ = !$noNextElementSibling$$ ? "previousElementSibling" : "previousSibling", $simpleNodeTest$$ = $noNextElementSibling$$ ? $isElement$$ : $goog$functions$TRUE$$, $pseudos$$ = {checked:function() {
    return function($elem$$11$$) {
      return $elem$$11$$.checked || $elem$$11$$.attributes.checked
    }
  }, "first-child":function() {
    return $_lookLeft$$
  }, "last-child":function() {
    return $_lookRight$$
  }, "only-child":function() {
    return function($node$$26$$) {
      return!$_lookLeft$$($node$$26$$) || !$_lookRight$$($node$$26$$) ? $JSCompiler_alias_FALSE$$ : $JSCompiler_alias_TRUE$$
    }
  }, empty:function() {
    return function($elem$$12_x$$62$$) {
      for(var $cn$$ = $elem$$12_x$$62$$.childNodes, $elem$$12_x$$62$$ = $elem$$12_x$$62$$.childNodes.length - 1;0 <= $elem$$12_x$$62$$;$elem$$12_x$$62$$--) {
        var $nt$$ = $cn$$[$elem$$12_x$$62$$].nodeType;
        if(1 === $nt$$ || 3 == $nt$$) {
          return $JSCompiler_alias_FALSE$$
        }
      }
      return $JSCompiler_alias_TRUE$$
    }
  }, contains:function($name$$63$$, $condition$$4$$) {
    var $cz$$ = $condition$$4$$.charAt(0);
    if('"' == $cz$$ || "'" == $cz$$) {
      $condition$$4$$ = $condition$$4$$.slice(1, -1)
    }
    return function($elem$$13$$) {
      return 0 <= $elem$$13$$.innerHTML.indexOf($condition$$4$$)
    }
  }, not:function($name$$64$$, $condition$$5$$) {
    var $p$$3$$ = $getQueryParts$$($condition$$5$$)[0], $ignores$$ = {$el$:1};
    if("*" != $p$$3$$.$tag$) {
      $ignores$$.$tag$ = 1
    }
    if(!$p$$3$$.$classes$.length) {
      $ignores$$.$classes$ = 1
    }
    var $ntf$$ = $getSimpleFilterFunc$$($p$$3$$, $ignores$$);
    return function($elem$$14$$) {
      return!$ntf$$($elem$$14$$)
    }
  }, "nth-child":function($name$$65$$, $condition$$6$$) {
    if("odd" == $condition$$6$$) {
      return $isOdd$$
    }
    if("even" == $condition$$6$$) {
      return $isEven$$
    }
    if(-1 != $condition$$6$$.indexOf("n")) {
      var $tparts$$ = $condition$$6$$.split("n", 2), $pred$$ = $tparts$$[0] ? "-" == $tparts$$[0] ? -1 : parseInt($tparts$$[0], 10) : 1, $idx$$ = $tparts$$[1] ? parseInt($tparts$$[1], 10) : 0, $lb$$ = 0, $ub$$ = -1;
      0 < $pred$$ ? 0 > $idx$$ ? $idx$$ = $idx$$ % $pred$$ && $pred$$ + $idx$$ % $pred$$ : 0 < $idx$$ && ($idx$$ >= $pred$$ && ($lb$$ = $idx$$ - $idx$$ % $pred$$), $idx$$ %= $pred$$) : 0 > $pred$$ && ($pred$$ *= -1, 0 < $idx$$ && ($ub$$ = $idx$$, $idx$$ %= $pred$$));
      if(0 < $pred$$) {
        return function($elem$$15_i$$79$$) {
          $elem$$15_i$$79$$ = $getNodeIndex$$($elem$$15_i$$79$$);
          return $elem$$15_i$$79$$ >= $lb$$ && (0 > $ub$$ || $elem$$15_i$$79$$ <= $ub$$) && $elem$$15_i$$79$$ % $pred$$ == $idx$$
        }
      }
      $condition$$6$$ = $idx$$
    }
    var $ncount$$ = parseInt($condition$$6$$, 10);
    return function($elem$$16$$) {
      return $getNodeIndex$$($elem$$16$$) == $ncount$$
    }
  }}, $defaultGetter$$ = $goog$userAgent$IE$$ ? function($cond$$) {
    var $clc$$ = $cond$$.toLowerCase();
    "class" == $clc$$ && ($cond$$ = "className");
    return function($elem$$17$$) {
      return $caseSensitive$$ ? $elem$$17$$.getAttribute($cond$$) : $elem$$17$$[$cond$$] || $elem$$17$$[$clc$$]
    }
  } : function($cond$$1$$) {
    return function($elem$$18$$) {
      return $elem$$18$$ && $elem$$18$$.getAttribute && $elem$$18$$.hasAttribute($cond$$1$$)
    }
  }, $_getElementsFuncCache$$ = {}, $_queryFuncCacheDOM$$ = {}, $_queryFuncCacheQSA$$ = {}, $qsaAvail$$ = !!document.querySelectorAll && (!$goog$userAgent$WEBKIT$$ || $goog$userAgent$isVersion$$("526")), $_zipIdx$$ = 0, $_nodeUID$$ = $goog$userAgent$IE$$ ? function($node$$29$$) {
    return $caseSensitive$$ ? $node$$29$$.getAttribute("_uid") || $node$$29$$.setAttribute("_uid", ++$_zipIdx$$) || $_zipIdx$$ : $node$$29$$.uniqueID
  } : function($node$$30$$) {
    return $node$$30$$._uid || ($node$$30$$._uid = ++$_zipIdx$$)
  };
  $query$$3$$.$pseudos$ = $pseudos$$;
  return $query$$3$$
}();
$goog$exportPath_$$("goog.dom.query", $goog$dom$query$$);
$goog$exportPath_$$("goog.dom.query.pseudos", $goog$dom$query$$.$pseudos$);
var $Z$$ = 5, $limits$$ = new $goog$math$Rect$$(50, 50, 750, 600), $window1$$ = $goog$dom$getElement$$("win1"), $window2$$ = $goog$dom$getElement$$("win2"), $window3$$ = $goog$dom$getElement$$("win3"), $dragger1$$ = new $goog$fx$Dragger$$($window1$$, $goog$dom$query$$("#win1 .bar")[0], $limits$$), $dragger2$$ = new $goog$fx$Dragger$$($goog$dom$getElement$$("win2"), $goog$dom$query$$("#win2 .bar")[0], $limits$$), $resizer2$$ = new $goog$fx$Dragger$$($goog$dom$getElement$$("pager"), $goog$dom$query$$("#pager")[0], 
$limits$$), $dragger3$$ = new $goog$fx$Dragger$$($goog$dom$getElement$$("win3"), $goog$dom$query$$("#win3 .bar")[0], $limits$$);
$goog$dom$getElement$$("win2");
$dragger3$$.$hysteresisDistanceSquared_$ = Math.pow(6, 2);
function $createMoverStart$$($mover$$) {
  return function moveWindowSetZ() {
    $mover$$.style.zIndex = $Z$$++;
    $goog$style$setOpacity$$($mover$$, 0.5)
  }
}
function $createMoverEnd$$($mover$$1$$) {
  return function moveWindowEnd() {
    $goog$style$setOpacity$$($mover$$1$$, 1)
  }
}
$goog$events$listen$$($dragger1$$, "start", $createMoverStart$$($window1$$));
$goog$events$listen$$($dragger2$$, "start", $createMoverStart$$($window2$$));
$goog$events$listen$$($resizer2$$, "start", $createMoverStart$$($window2$$));
$goog$events$listen$$($dragger3$$, "start", $createMoverStart$$($window3$$));
$goog$events$listen$$($dragger1$$, "end", $createMoverEnd$$($window1$$));
$goog$events$listen$$($dragger2$$, "end", $createMoverEnd$$($window2$$));
$goog$events$listen$$($resizer2$$, "end", $createMoverEnd$$($window2$$));
$goog$events$listen$$($dragger3$$, "end", $createMoverEnd$$($window3$$));
$goog$events$listen$$(window, "unload", function() {
  $dragger1$$.$dispose$();
  $dragger2$$.$dispose$();
  $resizer2$$.$dispose$();
  $dragger3$$.$dispose$()
});
var $frame$$ = $goog$dom$getElement$$("frame");
$frame$$.style.top = "20px";
$frame$$.style.left = "20px";
function $updateFrameSize$$($size$$15$$) {
  $frame$$.style.width = $size$$15$$.width - 40 + "px";
  $frame$$.style.height = $size$$15$$.height - 30 + "px"
}
$updateFrameSize$$($goog$dom$getViewportSize_$$(window));
var $vsm$$ = new $goog$dom$ViewportSizeMonitor$$;
$goog$events$listen$$($vsm$$, "resize", function() {
  size = $vsm$$.$getSize$();
  size.height -= 10;
  $updateFrameSize$$(size)
});

