/*******************************************************************************
 * CodeShelfUX Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 * $Id: dataObjectField.js,v 1.19 2012/11/08 03:35:10 jeffw Exp $
 ******************************************************************************/

goog.provide('codeshelf.dataobjectfield');
goog.provide('codeshelf.objectUpdater');
goog.require('codeshelf.templates');
goog.require('codeshelf.websession');
goog.require('goog.editor.SeamlessField');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.ui.LabelInput');
goog.require('codeshelf.sessionGlobals');

/**
 * Implements an input field backed by a remote data object. It handles
 * getting/setting remote persistence values for the object without any need to
 * manage this by the class user.
 *
 * @param {object}
 *            websession the websession used to communicate with the backend.
 * @param {HTMLBodyElement}
 *            parentElement the HTML body element that contains this
 *            objectDataField.
 * @param {string}
 *            className the name of the remote data class that this field edits.
 * @param {string}
 *            classProperty the name of the remote data class property that this
 *            field edits.
 * @param {string}
 *            classPersistenceId the GUID of the class object instance that this
 *            field edits.
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
	var uniqueIdFunc_ = goog.events.getUniqueId;

	thisDataObjectField_ = {

		start: function() {
			/*
			var data = {
				'className':     className_,
				'objectIds':     [ classPersistenceId_ ],
				'propertyNames': [ classProperty_ ]
			};
			var fieldListenerCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_LISTENER_REQ, data);
			*/
			var fieldListenerCmd = websession_.createObjectListenerRequest(className_,[ classPersistenceId_ ],[ classProperty_ ]);
			websession_.sendCommand(fieldListenerCmd, thisDataObjectField_.websocketCmdCallback(kWebSessionCommandType.OBJECT_LISTENER_RESP), true);

			// Put the HTML markup in the parent element.
			var fieldId = uniqueIdFunc_('field');
			var fieldElement = soy.renderAsElement(codeshelf.templates.dataObjectField, {
				id:       fieldId,
				cssClass: cssClass_,
				label:    titleLabel_
			});
			goog.dom.appendChild(parentElement_, fieldElement);
			inputElement_ = goog.dom.getElement(fieldId);
			googleField_ = new goog.ui.LabelInput(titleLabel_);
			googleField_.decorate(inputElement_);

			goog.events.listen(inputElement_, goog.editor.Field.EventType.BLUR, thisDataObjectField_.updateFieldContents);
		},

		websocketCmdCallback: function(expectedResponseType) {
			var callback = {
				exec: function(type, message) {
					if (message.results==undefined) {
						alert('response has no result');
					} else if (type === kWebSessionCommandType.OBJECT_LISTENER_RESP) {
						for (var i = 0; i < command['results'].length; i++) {
							var object = command['results'][i];

							// Make sure the class name and persistent ID match.
							if ((object['className'] === className_) && (object['persistentId'] == classPersistenceId_)) {
								// var html = googleField_.getCleanContents();
								var text = googleField_.getValue();
								if (text !== object[classProperty_]) {
									// googleField_.setHtml(false,
									// object[classProperty_], true);
									googleField_.setValue(object[classProperty_]);
								}
							}
						}
					}
				}
			};

			return callback;
		},

		updateFieldContents: function() {
			if (googleField_.hasChanged()) {
				var text = googleField_.getValue();

				/*
				var data = {
					'className':    className_,
					'persistentId': classPersistenceId_,
					'properties':   [
						{
							'name':  'description',
							'value': text
						}
					]
				};
				var fieldUpdateCmd = websession_.createCommand(kWebSessionCommandType.OBJECT_UPDATE_REQ, data);
				*/

				var properties =  [{'name':  'description','value': text}];
				var fieldUpdateCmd = websession_.createObjectUpdateRequest(className_,classPersistenceId_,properties);
				websession_.sendCommand(fieldUpdateCmd, thisDataObjectField_.websocketCmdCallback(kWebSessionCommandType.OBJECT_UPDATE_RESP), false);
			}
		}

	};

	return thisDataObjectField_;
};

/**
 * Implements an arbitrary field update on existing database object
 * @param {string}
 *            className the name of the remote data class that this field edits.
 * @param {string}
 *            classProperty the name of the remote data class property that this
 *            field edits.
 * @param {string}
 *            classPersistenceId the GUID of the class object instance that this
 *            field edits.
 */
codeshelf.objectUpdater = (function() {
	// pseudo private
	var singleObjectSelections = [];

	return {
		// This is a trivial single field update. Works for things like CHE description field
		updateOne: function(inChangingObject, inClassName, inFieldName, inFieldValue, inFieldJavaType){
			if (!inChangingObject || !inChangingObject.hasOwnProperty('persistentId')){
				var theLogger = goog.debug.Logger.getLogger('objectUpdater');
				theLogger.info("null object or object that does not have persistentId implemented");

				return;
			}

			var properties = {};
			properties[inFieldName] = inFieldValue;

			theWebSession = codeshelf.sessionGlobals.getWebsession();
			if (theWebSession) {
				var fieldUpdateCmd = theWebSession.createObjectUpdateRequest(inClassName,inChangingObject.persistentId,properties);
				// Do we need a callback? Ideally not. General updating mechanism should work for success.
				// As for errors returned, would be nice to see something
				var emptyCallback = {
					'exec': function (response) {
					}
				};
				theWebSession.sendCommand(fieldUpdateCmd, emptyCallback, true);
			}
			else {
				var theLogger = goog.debug.Logger.getLogger('objectUpdater');
				theLogger.info("no webSession: failed to update");
			}
		},

		// This is a trivial single field update. Works for things like CHE description field
		callMethod: function(inDomainObject, inClassName, inMethodName, inMethodArgs){
			if (!inDomainObject || !inDomainObject.hasOwnProperty('persistentId')){
				var theLogger = goog.debug.Logger.getLogger('objectUpdater');
				theLogger.info("null object or object that does not have persistentId implemented");

				return;
			}

			theWebSession = codeshelf.sessionGlobals.getWebsession();
			if (theWebSession) {
				
				/*
				var data = {
						'className':    inClassName,
						'persistentId': inDomainObject['persistentId'],
						'methodName': inMethodName,
						'methodArgs': inMethodArgs
					};
				var methodCallCmd = theWebSession.createCommand(kWebSessionCommandType.OBJECT_METHOD_REQ, data);
				*/
				
				var methodCallCmd = theWebSession.createObjectMethodRequest(inClassName,inDomainObject['persistentId'], inMethodName, inMethodArgs);
				
				// Do we need a callback? Ideally not. General updating mechanism should workl for success.
				// As for errors returned, would be nice to see something
				var emptyCallback = {
					'exec': function (response) {
					}
				};
				theWebSession.sendCommand(methodCallCmd, emptyCallback, true);
			}
			else {
				var theLogger = goog.debug.Logger.getLogger('objectUpdater');
				theLogger.info("no webSession: failed to update");
			}
		},

		// super-primitive "selection" manager
		getFirstObjectInSelectionList: function(){
			return singleObjectSelections[0];
		},
		setObjectInSelectionList: function(inObject){
			singleObjectSelections.length = 0; // for loop and popping is reported to be faster, but this works.
			singleObjectSelections.push(inObject);
		},
		addObjectToSelectionList: function(inObject){
			singleObjectSelections.push(inObject);
		}

	};
})();
