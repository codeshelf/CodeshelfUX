/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: dataObjectField.js,v 1.9 2012/04/22 04:03:28 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.dataobjectfield');
goog.require('codeshelf.templates');
goog.require('codeshelf.websession');
goog.require('goog.events.EventType');
goog.require('goog.events.EventHandler');
goog.require('goog.editor.SeamlessField');


/**
 * Implements an input field backed by a remote data object.
 * It handles getting/setting remote persistence values for the object without any need to manage this by the class user.
 * @param {object} the application (to glue together the round-trip with the server.)
 * @param {HTMLBodyElement} parentElement the HTML body element that contains this objectDataField
 * @param {string} className the name of the remote data class that this field edits.
 * @param {string} classProperty the name of the remote data class property that this field edits.
 * @param {stting} classPersistenceId the GUID of the class object instance that this field edits.
 */
codeshelf.dataobjectfield = function (websession, parentElement, className, classProperty, classPersistenceId) {

	var thisDataObjectField_;
	var websession_ = websession;
	var parentElement_ = parentElement;
	var className_ = className;
	var classProperty_ = classProperty;
	var classPersistenceId_ = classPersistenceId;
	var inputElement_;
	var googleField_;

	thisDataObjectField_ = {

		start:function () {
			var data = {
				className:    className_,
				objectIds:    [ classPersistenceId_ ],
				propertyNames:[ classProperty_ ]
			}

			var fieldListenerCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_LISTENER_REQ, data);
			websession_.sendCommand(fieldListenerCmd, thisDataObjectField_.websocketCmdCallback(kWebSessionCommandType.OBJECT_LISTENER_RESP), true);


			// Put the HTML markup in the parent element.
			var fieldId = goog.events.getUniqueId('field');
			inputElement_ = soy.renderAsElement(codeshelf.templates.dataObjectField, {name:'name', id:fieldId, title:'title'});
			goog.dom.appendChild(parentElement_, inputElement_);
			googleField_ = new goog.editor.SeamlessField(fieldId);
			googleField_.makeEditable();

			goog.events.listen(googleField_, goog.editor.Field.EventType.BLUR, thisDataObjectField_.updateFieldContents);
		},

		websocketCmdCallback:function (expectedResponseType) {
			var expectedResponseType_ = expectedResponseType;
			var callback = {
				exec:                   function (command) {
					if (!command.data.hasOwnProperty('result')) {
						alert('response has no result');
					} else if (command.type == kWebSessionCommandType.OBJECT_LISTENER_RESP) {
						for (var i = 0; i < command.data.result.length; i++) {
							var object = command.data.result[i];

							// Make sure the class name and persistent ID match.
							if ((object.className === className_) && (object.persistentId == classPersistenceId_)) {
								var html = googleField_.getCleanContents();
								if (html !== object[classProperty_]) {
									googleField_.setHtml(false, object[classProperty_], true);
								}
							}
						}
					}
				},
				getExpectedResponseType:function () {
					return expectedResponseType_;
				}
			}

			return callback;
		},

		updateFieldContents:function () {
			var html = googleField_.getCleanContents();

			var data = {
				className:   className_,
				persistentId:classPersistenceId_,
				properties:        [
					{name:'Description', value:html}
				]
			}

			var fieldUpdateCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_UPDATE_REQ, data);
			websession_.sendCommand(fieldUpdateCmd, thisDataObjectField_.websocketCmdCallback(kWebSessionCommandType.OBJECT_UPDATE_RESP), false);
		}

	}

	return thisDataObjectField_;
}
