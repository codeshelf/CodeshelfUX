// Copyright 2013 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Type-safe wrappers for unsafe DOM APIs.
 *
 * This file provides type-safe wrappers for DOM APIs that can result in
 * cross-site scripting (XSS) vulnerabilities, if the API is supplied with
 * untrusted (attacker-controlled) input.  Instead of plain strings, the type
 * safe wrappers consume values of types from the goog.html package whose
 * contract promises that values are safe to use in the corresponding context.
 *
 * Hence, a program that exclusively uses the wrappers in this file (i.e., whose
 * only reference to security-sensitive raw DOM APIs are in this file) is
 * guaranteed to be free of XSS due to incorrect use of such DOM APIs (modulo
 * correctness of code that produces values of the respective goog.html types,
 * and absent code that violates type safety).
 *
 * For example, assigning to an element's .innerHTML property a string that is
 * derived (even partially) from untrusted input typically results in an XSS
 * vulnerability. The type-safe wrapper goog.html.setInnerHtml consumes a value
 * of type goog.html.SafeHtml, whose contract states that using its values in a
 * HTML context will not result in XSS. Hence a program that is free of direct
 * assignments to any element's innerHTML property (with the exception of the
 * assignment to .innerHTML in this file) is guaranteed to be free of XSS due to
 * assignment of untrusted strings to the innerHTML property.
 */

goog.provide('goog.dom.safe');

goog.require('goog.html.SafeHtml');


/**
 * Assigns known-safe HTML to an element's innerHTML property.
 * @param {!Element} elem The element whose innerHTML is to be assigned to.
 * @param {!goog.html.SafeHtml} html The known-safe HTML to assign.
 */
goog.dom.safe.setInnerHtml = function(elem, html) {
  elem.innerHTML = goog.html.SafeHtml.unwrap(html);
};
