goog.provide('codeshelf.launch');
goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.window');
goog.require('goog.style');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.RoundedPanel');
goog.require('goog.math.Size');
goog.require('goog.dom.ViewportSizeMonitor');

function enterLaunchWindow() {
//	var doc = goog.dom.getDocument();
//	doc.write('<img id="background_image" class="background_image" src="../src/images/STS-125.jpg" alt=""/>');
//	doc.write('<div id="launchCodePanel"></div>');
//	var launchDiv = goog.dom.getElement('launchCodePanel');
//	launchDiv.write('<div class="goog-roundedpanel-content"></div>');

	var backgroundImageElement = goog.dom.createDom('img', {'id':'background_image', 'class':'background_image', 'src':'../src/images/STS-125.jpg', 'alt':''}, null);
	goog.dom.appendChild(goog.dom.getDocument().body, backgroundImageElement);

	// Create DOM structure to represent the launch code.
	//var launchCode = goog.dom.createDom('div', {'id':'launchCodeLabel'}, launchCodePanelContent);
	var launchCodeInput = goog.dom.createDom('input', {'type':'text', 'id':'launchCodeInput', 'class':'dataEntry'}, null);
	var launchCodeLabel = goog.dom.createDom('div', {'id':'launchCodeLabel', 'class':'dataEntry'}, 'Launch Code:', launchCodeInput);
	var launchCodePanelContent = goog.dom.createDom('div', {'class':'goog-roundedpanel-content'}, launchCodeLabel);
	launchCodeLabel.style.marginTop = '15px';
	launchCodeLabel.style.marginLeft = '15px';

	var launchCodePanel = goog.dom.createDom('div', {'id':'launchCodePanel'}, launchCodePanelContent);
	goog.dom.appendChild(goog.dom.getDocument().body, launchCodePanel);

	// Set the dimensions of the panel and decorate roundedPanel.
	var radius = 25;
	var borderWidth = 5;
	var borderColor = '#a0a0a0';//goog.style.getCascadedStyle(launchCodePanel, 'border-color');
	var backgroundColor = '#d0d0d0';//goog.style.getCascadedStyle(launchCodePanel, 'background-color');
	var corners = 15;
	var roundedLaunchCodePanel = goog.ui.RoundedPanel.create(radius, borderWidth, borderColor, backgroundColor, corners);
	roundedLaunchCodePanel.decorate(launchCodePanel);
}


function exitLaunchWindow() {

}


enterLaunchWindow();
