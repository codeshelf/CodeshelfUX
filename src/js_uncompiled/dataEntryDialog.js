/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: dataEntryDialog.js,v 1.1 2012/06/10 03:13:31 jeffw Exp $
 *******************************************************************************/

goog.provide('codeshelf.dataentrydialog');
goog.require('goog.array');
goog.require('goog.debug');
goog.require('goog.debug.Logger');
goog.require('goog.Disposable');
goog.require('goog.ui.Checkbox');
goog.require('goog.ui.Checkbox.State');
goog.require('goog.ui.Dialog');
goog.require('goog.ui.LabelInput');


codeshelf.dataentrydialog = function() {

	var thisDataEntryDialog_;
	var dialog_;
	var dialogContentElement_;
	var dialogComponents_ = [];

	thisDataEntryDialog_ = {

		setupDialog: function(dialogContentElement) {
			// Raise a dialog to prompt the user for information about this aisle.
			dialog_ = new goog.ui.Dialog();//null, false);
			dialog_.setTitle('Create Aisle');
			var buttonSet = new goog.ui.Dialog.ButtonSet().
				addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.SAVE).
				addButton(goog.ui.Dialog.ButtonSet.DefaultButtons.CANCEL, true, true);
			dialog_.setButtonSet(buttonSet);

			dialog_.setContent(dialogContentElement.innerHTML);
			dialog_.setDisposeOnHide(true);
			// Content area is not quite handled by dialogs, so we need to re-get the content area after rendering the dialog.
			dialogContentElement_ = dialog_.getContentElement();

//			thisDataEntryDialog_.createField(dialogContentElement, 'bayHeight', 'text');
//			thisDataEntryDialog_.createField(dialogContentElement, 'bayWidth', 'text');
//			thisDataEntryDialog_.createField(dialogContentElement, 'bayDepth', 'text');
//			thisDataEntryDialog_.createField(dialogContentElement, 'baysHigh', 'text');
//			thisDataEntryDialog_.createField(dialogContentElement, 'baysLong', 'text');
//			thisDataEntryDialog_.createField(dialogContentElement, 'backToBack', 'checkbox');

		},

		open: function(dialogCompleteHandler) {

			dialog_.setVisible(true);

			var dialogListener = goog.events.listen(dialog_, goog.ui.Dialog.EventType.SELECT, function(event) {
				dialog_.setVisible(false);
				dialogCompleteHandler(event, thisDataEntryDialog_);

				for (var id in dialogComponents_) {
					if (dialogComponents_.hasOwnProperty(id)) {
						var component = dialogComponents_[id];
						component.dispose();
					}
				}

				if (codeshelf.debug) {
					var theLogger = goog.debug.Logger.getLogger('codeshelf');
					var objects = goog.Disposable.getUndisposedObjects();
					goog.array.forEach(objects, function(object) {
						theLogger.info('undisposed: ' + goog.debug.expose(object));
					});
				}

				dialog_.dispose();
				goog.events.unlistenByKey(dialogListener);
			});

		},

		createField: function(fieldId, fieldType) {

			var field;
			var editFields = goog.dom.query('.dialogFields', dialogContentElement_)[0];
			var fieldElement = goog.dom.query('.' + fieldId, editFields)[0];
			if (fieldElement !== undefined) {
				switch (fieldType) {
					case 'text':
						field = new goog.ui.LabelInput(fieldElement.innerHTML);
						field.decorate(fieldElement);
						break;
					case 'checkbox':
						field = new goog.ui.Checkbox();
						field.setLabel(fieldElement.parentNode);
						field.decorate(fieldElement);
						field.setEnabled(true);
						break;
				}
			}
			dialogComponents_[fieldId] = field;
			return field;
		},

		getFieldValue: function(fieldId) {

		}

	}

	return thisDataEntryDialog_;
}