/*******************************************************************************
 *  CodeShelfUX
 *  Copyright (c) 2005-2012, Jeffrey B. Williams, All rights reserved
 *  $Id: dataEntryDialog.js,v 1.3 2012/09/18 14:47:57 jeffw Exp $
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


codeshelf.dataentrydialog = function(title, buttonSet) {

	var title_ = title;
	var buttonSet_ = buttonSet;
	var thisDataEntryDialog_;
	var dialog_;
	var dialogContentElement_;
	var dialogFields_ = [];

	thisDataEntryDialog_ = {

		setupDialog: function(dialogContentElement) {
			// Raise a dialog to prompt the user for information about this aisle.
			dialog_ = new goog.ui.Dialog();//null, false);
			dialog_.setTitle(title_);
			dialog_.setButtonSet(buttonSet_);

			dialog_.setContent(dialogContentElement.innerHTML);
			dialog_.setDisposeOnHide(true);
			// Content area is not quite handled by dialogs, so we need to re-get the content area after rendering the dialog.
			dialogContentElement_ = dialog_.getContentElement();
		},

		open: function(dialogCompleteHandler) {

			dialog_.setVisible(true);

			var dialogListener = goog.events.listen(dialog_, goog.ui.Dialog.EventType.SELECT, function(event) {
				dialog_.setVisible(false);
				dialogCompleteHandler(event, thisDataEntryDialog_);

				for (var id in dialogFields_) {
					if (dialogFields_.hasOwnProperty(id)) {
						var component = dialogFields_[id].field;
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
			dialogFields_[fieldId] = { fieldType: fieldType, field: field };
			return field;
		},

		getFieldValue: function(fieldId) {
			var component = dialogFields_[fieldId];
			if (component.fieldType === 'text') {
				return component.field.getValue();
			} else if (component.fieldType = 'checkbox') {
				return component.field.getChecked();
			} else {
				return '';
			}
		}
	}

	return thisDataEntryDialog_;
}