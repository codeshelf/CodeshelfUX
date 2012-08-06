/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: dataObjectField.js,v 1.14 2012/08/06 00:50:48 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.dataobjectfield');
goog.require('codeshelf.templates');
goog.require('codeshelf.websession');
goog.require('goog.events.EventType');
goog.require('goog.events.EventHandler');
goog.require('goog.editor.SeamlessField');
goog.require('goog.ui.LabelInput');


/**
 * Implements an input field backed by a remote data object.
 * It handles getting/setting remote persistence values for the object without any need to manage this by the class user.
 * @param {object} websession  the websession used to communicate with the backend.
 * @param {HTMLBodyElement} parentElement the HTML body element that contains this objectDataField.
 * @param {string} className the name of the remote data class that this field edits.
 * @param {string} classProperty the name of the remote data class property that this field edits.
 * @param {stting} classPersistenceId the GUID of the class object instance that this field edits.
 */
codeshelf.dataobjectfield = function(websession, parentElement, className, classProperty, classPersistenceId, cssClass, titleLabel) {

	var thisDataObjectField_;
	var websession_ = websession;
	var parentElement_ = parentElement;
	var className_ = className;
	var classProperty_ = classProperty;
	var classPersistenceId_ = classPersistenceId;
	var cssClass_ = cssClass;
	var titleLabel_ = titleLabel;
	var inputElement_;
	var googleField_;

	thisDataObjectField_ = {

		start: function() {
			var data = {
				'className':     className_,
				'objectIds':     [ classPersistenceId_ ],
				'propertyNames': [ classProperty_ ]
			};

			var fieldListenerCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_LISTENER_REQ, data);
			websession_.sendCommand(fieldListenerCmd, thisDataObjectField_.websocketCmdCallback(kWebSessionCommandType.OBJECT_LISTENER_RESP), true);


			// Put the HTML markup in the parent element.
			var fieldId = goog.events.getUniqueId('field');
			var fieldElement = soy.renderAsElement(codeshelf.templates.dataObjectField, {id: fieldId, cssClass: cssClass_, label: titleLabel_});
			goog.dom.appendChild(parentElement_, fieldElement);
			inputElement_ = goog.dom.getElement(fieldId);
			googleField_ = new goog.ui.LabelInput(titleLabel_);
			googleField_.decorate(inputElement_);

			goog.events.listen(inputElement_, goog.editor.Field.EventType.BLUR, thisDataObjectField_.updateFieldContents);
		},

		websocketCmdCallback: function(expectedResponseType) {
			var expectedResponseType_ = expectedResponseType;
			var callback = {
				exec:                    function(command) {
					if (!command.d.hasOwnProperty('r')) {
						alert('response has no result');
					} else if (command.t === kWebSessionCommandType.OBJECT_LISTENER_RESP) {
						for (var i = 0; i < command.d.r.length; i++) {
							var object = command.d.r[i];

							// Make sure the class name and persistent ID match.
							if ((object['className'] === className_) && (object['persistentId'] == classPersistenceId_)) {
								//var html = googleField_.getCleanContents();
								var text = googleField_.getValue();
								if (text !== object[classProperty_]) {
									//googleField_.setHtml(false, object[classProperty_], true);
									googleField_.setValue(object[classProperty_]);
								}
							}
						}
					}
				},
				getExpectedResponseType: function() {
					return expectedResponseType_;
				}
			};

			return callback;
		},

		updateFieldContents: function() {
			if (googleField_.hasChanged()) {
				var text = googleField_.getValue();

				var data = {
					'className':    className_,
					'persistentId': classPersistenceId_,
					'properties':   [
						{'name': 'Description', 'value': text}
					]
				};

				var fieldUpdateCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_UPDATE_REQ, data);
				websession_.sendCommand(fieldUpdateCmd, thisDataObjectField_.websocketCmdCallback(kWebSessionCommandType.OBJECT_UPDATE_RESP), false);
			}
		}

	};

	return thisDataObjectField_;
};
