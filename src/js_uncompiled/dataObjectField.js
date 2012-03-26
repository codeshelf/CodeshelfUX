/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: dataObjectField.js,v 1.3 2012/03/26 03:32:42 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.dataobjectfield');
goog.require('codeshelf.templates');
goog.require('codeshelf.websession');
goog.require('goog.events.EventType');
goog.require('goog.events.EventHandler');

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

	thisDataObjectField_ = {

		start:function () {
			var data = {
				className:    className_,
				objectIds:    [ classPersistenceId_ ],
				propertyNames:[ classProperty_ ]
			}

			var fieldListenerCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_LISTENER_REQ, data);
			websession_.sendCommand(fieldListenerCmd, thisDataObjectField_.getCallback(kWebSessionCommandType.OBJECT_LISTENER_RESP), true);


			// Put the HTML markup in the parent element.
			inputElement_ = soy.renderAsElement(codeshelf.templates.dataObjectField, {name:'name', id:'id', title:'title'});
			goog.dom.appendChild(parentElement_, inputElement_);
		},

		getCallback:function (expectedResponseType) {
			var expectedResponseType_ = expectedResponseType;
			var callback = {
				exec:                   function (command) {
					if (!command.data.hasOwnProperty('result')) {
						alert('response has no result');
					} else {
						for (var i = 0; i < command.data.result.length; i++) {
							var object = command.data.result[i];

						}
					}
				},
				getExpectedResponseType:function () {
					return expectedResponseType_;
				}
			}

			return callback;
		}

	}

	return thisDataObjectField_;
}
