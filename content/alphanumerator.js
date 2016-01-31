// Copyright Dave Kahler. Do not copy without permission.

window.addEventListener("load",anInit,false);
window.addEventListener("unload", anUnload, false);

var gInThunderbird = false;


function anInit() {

	//uninstallObserver.register();

	if (navigator.userAgent.search(/Thunderbird/gi) != -1) {
		gInThunderbird = true;
		document.getElementById("messagePaneContext").addEventListener("popupshowing",anHide,false);
		//document.getElementById("msgComposeContext").addEventListener("popupshowing",tpHide,false); // doesn't work in thunderbird 1.5
	}
	else {
		document.getElementById("contentAreaContextMenu").addEventListener("popupshowing",anHide,false);
	}

}

function anUnload()
{
	uninstallObserver.deregister();
}

function anHide()
{
	var showItem = (anConvertText()!="") && gContextMenu.isTextSelected;
	gContextMenu.showItem("alphanumerator", showItem );
}

String.prototype.trim = function ()
{
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
}

function anSearchSelected()
{
	var focusedWindow = document.commandDispatcher.focusedWindow;
	var searchStr = focusedWindow.getSelection();
	searchStr = searchStr.toString();
	searchStr = searchStr.replace( /^\s+/, "" );
	searchStr = searchStr.replace(/(\n|\r|\t)+/g, " ");
	searchStr = searchStr.replace(/\s+$/,"");
	return searchStr;
}

function anConvertText()
{
	phoneString=anSearchSelected().trim();
	
	var regexABC = new RegExp("[ABC]","gi");
	var regexDEF = new RegExp("[DEF]","gi");
	var regexGHI = new RegExp("[GHI]","gi");
	var regexJKL = new RegExp("[JKL]","gi");
	var regexMNO = new RegExp("[MNO]","gi");
	var regexPQRS = new RegExp("[PQRS]","gi");
	var regexTUV = new RegExp("[TUV]","gi");
	var regexWXYZ = new RegExp("[WXYZ]","gi");
	
	phoneString = phoneString.replace(regexABC,"2");
	phoneString = phoneString.replace(regexDEF,"3");
	phoneString = phoneString.replace(regexGHI,"4");
	phoneString = phoneString.replace(regexJKL,"5");
	phoneString = phoneString.replace(regexMNO,"6");
	phoneString = phoneString.replace(regexPQRS,"7");
	phoneString = phoneString.replace(regexTUV,"8");
	phoneString = phoneString.replace(regexWXYZ,"9");
	
	//alert(phoneString);
	
	return (phoneString);
}

function anAlphanumerate()
{
	var workingHTML;
	
	if (!gInThunderbird)
	{
		workingHTML = content.document.getElementsByTagName("body").item(0).innerHTML;
	}
	else
	{
	
		var windowManager = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(nsIWindowMediator);
		var messengerWindowList = windowManager.getEnumerator("mail:3pane");
		var messageWindowList = windowManager.getEnumerator("mail:messageWindow");
		var messageURI = GetFirstSelectedMessage();
		var messageBody="";
		if (messageURI != null && messageURI != "") {
		 while (true) {
		  if (messengerWindowList.hasMoreElements()) {
		   win = messengerWindowList.getNext();
		  } else if (messageWindowList.hasMoreElements()) {
		   win = messageWindowList.getNext();
		  } else {
		   break;
		  }
		  loadedMessageURI = win.GetLoadedMessage();
		  if (loadedMessageURI != messageURI) continue;
		  brwsr = win.getMessageBrowser();
		  if (!brwsr) continue;
		  messageBody = brwsr.docShell.contentViewer.DOMDocument.body.textContent; break;
		 }
		} 

		if (messageBody.length>0)
			workingHTML = brwsr.docShell.contentViewer.DOMDocument.body.innerHTML;
	}
	

	var phoneString=anSearchSelected().trim();
	var convertedPhoneString = anConvertText();

	var regex = new RegExp(phoneString,"gi");
	workingHTML = workingHTML.replace(regex,convertedPhoneString);
	
	if (!gInThunderbird)
	{
		content.document.getElementsByTagName("body").item(0).innerHTML = workingHTML;
	}
	else
	{
		brwsr = win.getMessageBrowser();
		if (brwsr)
			brwsr.docShell.contentViewer.DOMDocument.body.innerHTML = workingHTML;
	}
}












