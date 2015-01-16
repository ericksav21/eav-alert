//Compatibility code for IE support on setTimeOut function
//See: https://developer.mozilla.org/es/docs/Web/API/Window.setTimeout#Callback_arguments
if (document.all && !window.setTimeout.isPolyfill) {

  var __nativeST__ = window.setTimeout;
  window.setTimeout = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
    var aArgs = Array.prototype.slice.call(arguments, 2);
    return __nativeST__(vCallback instanceof Function ? function () {
      vCallback.apply(null, aArgs);
    } : vCallback, nDelay);
  };
  window.setTimeout.isPolyfill = true;

}

function EAV_Alert(nOBoxes = 5){

	this.nOBoxes = (!isNaN(nOBoxes)) ? nOBoxes : 5;

	this.htmlBoxBase = null;

	this.alertBaseTitle = 		'<div class="eav-alert-header">' +
									'<div class="eav-alert-hTitle">';

	this.alertBaseImg = 		'</div>' +
								'<div class="eav-alert-close"><a href="#">x</a></div>' +
							'</div>' +
							'<div class="eav-alert-main">' +
								'<div class="eav-alert-img" style="background-image: ';

	this.alertBaseText = 		'"></div>' +
						 		'<div class="eav-alert-text">' +
						 			'<div class="eav-alert-main-text">' +
										'<div class="eav-alert-tContents">';

	this.alertBaseClose = 					'</div>' +
										'</div>' +
									'</div>' +
								'</div>';

	this.alerts = [];

	this.findElementEAV = function(eavAlertNode){
		if(eavAlertNode == null || typeof(eavAlertNode) == "function")
			return -1;

		for (var i = 0; i < this.alerts.length; i++) {
			if(this.alerts[i].alertNode == eavAlertNode)
				return i;
		};

		return -1;
	}

	//Div's css top initialy, in percentage
	this.boxBaseTop = 80;

	if(this.nOBoxes <= 0)
		nOBoxes = 1;
}

EAV_Alert.prototype.createBoxBase = function(){
	this.htmlBoxBase = document.createElement("div");
	this.htmlBoxBase.setAttribute("id", "eav-alert-box");

	document.body.appendChild(this.htmlBoxBase);
}

/*
	title = titulo
	text = texto de la alerta
	imgPath = ruta de la imagen (preferente de 38x38px)
	secondsAlive = segundos que la alerta durará antes de desaparecer, poner 0 para indicar que su nivel de vida es indefinido
	animationIn = animación que realizará la alerta al ser creada (Depende de JQuery o Animate.css)
	animationOut = animación que realizará la alerta al ser destruida (Depende de JQuery o Animate.css)
	pauseLTInHover = booleano, detiene el conteo del tiempo de vida de la alerta cuando se hace hover
	URLToRed = (Opcional) URL para redireccionar al usuario dentro de la alerta
 */
EAV_Alert.prototype.createAlert = function(title,
										   text,
										   imgPath,
										   secondsAlive,
										   animationIn,
										   animationOut,
										   pauseLTInHover,
										   URLToRed){

	if(this.htmlBoxBase === null)
		return;

	var eavAlert = {};
	var sEavAlert = this.alertBaseTitle +
						((typeof title === 'string') ? title : '') +
				   this.alertBaseImg +
				   		((typeof imgPath === 'string') ? ((imgPath.length > 0) ? 'url(\'' + imgPath + '\');' : 'none;') : 'none;') +
				   this.alertBaseText +
				   		((typeof text === 'string') ? text : '') +
				   this.alertBaseClose;

	var eavAlertNode = document.createElement("div");
	eavAlertNode.setAttribute("class", "eav-alert");
	eavAlertNode.innerHTML = sEavAlert;

	//Image
	if(typeof imgPath === 'string'){
		if(imgPath.length == 0){
			//Let's change the styles for no image support
			eavAlertNode.style.width = "190px";

			//Set the width and height of the img div to 0
			var imageNode = eavAlertNode.firstChild
									.nextSibling
									.firstChild;

			imageNode.style.width = "0px";
			imageNode.style.height = "0px";

			//Make a margin for the main text
			eavAlertNode.firstChild		//eav-alert-header
						.nextSibling	//eav-alert-main
						.firstChild		//eav-alert-img
						.nextSibling	//eav-alert-text
						.firstChild		//eav-alert-main-text
						.firstChild		//eav-alert-tContents
							.style.marginLeft = "15px";
		}
	}

	//Check the URL
	if(typeof URLToRed === 'string'){
		if(URLToRed.length > 0){
			//Create an "a" node and we add it
			var URLNode = document.createElement("a");
			URLNode.setAttribute("href", URLToRed);
			URLNode.setAttribute("class", "eav-alert-main-url");
			URLNode.setAttribute("target", "_blank");

			//We have to move the alert main node into the new a node and
			//add that node into the alert
			var alertMainNode = eavAlertNode.firstChild.nextSibling;
			alertMainNode.parentNode.removeChild(alertMainNode);
			URLNode.appendChild(alertMainNode);

			eavAlertNode.appendChild(URLNode);
		}
	}

	//Animations
	var sAnimationIn = (typeof animationIn === 'string') ? animationIn : '';
	var sAnimationOut = (typeof animationIn === 'string') ? animationOut : '';

	var jQAnimationIn = false, ACssAnimationIn = false;
	var jQAnimationOut = false, ACssAnimationOut = false;
	var animationInType = [], animationOutType = [];
	var regJQ = /^([jJ][qQ]-)/, regACss = /^([aA][cC]ss-)/;

	//Animation In
	if(regJQ.test(sAnimationIn)) jQAnimationIn = true;
	else if(regACss.test(sAnimationIn)) ACssAnimationIn = true;
	//Animation Out
	if(regJQ.test(sAnimationOut)) jQAnimationOut = true;
	else if(regACss.test(sAnimationOut)) ACssAnimationOut = true;

	if(jQAnimationIn || ACssAnimationIn){
		animationInType = sAnimationIn.match(/(\w{1,})$/g);
	}
	if(jQAnimationOut || ACssAnimationOut){
		animationOutType = sAnimationOut.match(/(\w{1,})$/g);
	}

	//If the alert has animations, we prepare it with the necessary classes or styles
	if(jQAnimationIn)
		eavAlertNode.style.display = "none";
	else if(ACssAnimationIn){
		eavAlertNode.setAttribute("class", "eav-alert animated " + animationInType)
	}

	//Add the new alert to the DOM
	this.htmlBoxBase.appendChild(eavAlertNode);

	if(jQAnimationIn){
		//Must have JQuery included before of this script to use this
		if(animationInType == 'fadeIn')
			$(eavAlertNode).fadeIn("slow");
		else if(animationInType == 'slideDown')
			$(eavAlertNode).slideDown("slow");
	}

	if(this.alerts.length + 1 > 1){
		this.htmlBoxBase.style.top = (this.boxBaseTop - 15) + "%";
		this.boxBaseTop -= 15;
	}

	//Populate the eavAlert object with necesary resources
	eavAlert.alertNode = eavAlertNode;
	eavAlert.secondsAlive = ((secondsAlive === +secondsAlive && isFinite(secondsAlive) && !(secondsAlive % 1)) ?
																							((secondsAlive >= 0) ?
																									secondsAlive : 0)
																							: 10);
	eavAlert.jQAnimationOut = jQAnimationOut;
	eavAlert.ACssAnimationOut = ACssAnimationOut;
	eavAlert.animationOut = ((jQAnimationOut || ACssAnimationOut) ?
												animationOutType[0]
												: null);

	//Add the eavAlert object to the array for better control
	this.alerts.push(eavAlert);

	//Create a listener when "X" button will be clicked
	var closeAlertListener = function(eavAlertNode, eavAlertObj){
		eavAlertNode.addEventListener("click", function(e){
			//Remove the listener for this node event
		    e.target.removeEventListener(e.type, arguments.callee);

			eavAlertObj.closeAlert(eavAlertNode);
		});
	};

	closeAlertListener(eavAlertNode, this);

	//Let's create a timer if the lifetime of the alert is > than 0
	var closeAlertCall = function(eavAlertNode, eavAlertObj){
		eavAlertObj.closeAlert(eavAlertNode);
	}
	var timerHandler = null;

	if(secondsAlive === +secondsAlive && isFinite(secondsAlive) && !(secondsAlive % 1)){
		if(secondsAlive > 0)
			timerHandler = setTimeout(closeAlertCall, secondsAlive * 1000, eavAlertNode, this);
	}

	//Create 2 listeners if pauseLTInHover is true
	if(pauseLTInHover && timerHandler != null){
		var mouseOverAlertListener = function(eavAlertNode, timerHandler){
			eavAlertNode.addEventListener("mouseover", function(e){
				clearTimeout(timerHandler);
				console.log("MouseOver");
			});
		}

		var mouseOutAlertListener = function(eavAlertNode, secondsAlive, timerHandler, eavAlertObj){
			eavAlertNode.addEventListener("mouseout", function(e){
				timerHandler = setTimeout(closeAlertCall, secondsAlive * 1000, eavAlertNode, eavAlertObj);
				console.log("MouseOut");
			});
		}

		mouseOverAlertListener(eavAlertNode, timerHandler);
		mouseOutAlertListener(eavAlertNode, secondsAlive, timerHandler, this);
	}

}


EAV_Alert.prototype.closeAlert = function(eavAlertNode){
	//Remove the node from the DOM
	var indexToRemove = this.findElementEAV(eavAlertNode);
	if(indexToRemove == -1)
		return;

	var eavAlert = this.alerts[indexToRemove];
	var animationOutType = eavAlert.animationOut;

	this.alerts.splice(indexToRemove, 1);

	//Check for animations OUT
	if(eavAlert.jQAnimationOut){
		//Must have JQuery included before of this script to use this
		if(animationOutType == 'fadeOut')
			$(eavAlertNode).fadeOut("slow", function(){
				this.htmlBoxBase.removeChild(eavAlertNode);
			});
		else if(animationInType == 'slideUp')
			$(eavAlertNode).slideUp("slow", function(){
				this.htmlBoxBase.removeChild(eavAlertNode);
			});
	}
	else if(eavAlert.ACssAnimationOut){
		//We have to listen when the CSS animation ends
		var pfx = ["webkitAnimationEnd", "mozAnimationEnd",
					"MSAnimationEnd", "oanimationend", "animationend"];

		function animationEndListener(eavAlertNode, pfx, htmlBoxBase){

			for (var p = 0; p < pfx.length; p++) {
		        eavAlertNode.addEventListener(pfx[p], function(e){
		        	//Remove the listener for this node event
		        	e.target.removeEventListener(e.type, arguments.callee);

		        	htmlBoxBase.removeChild(eavAlertNode);
		        }, false);
		    }

	    }

	    animationEndListener(eavAlertNode, pfx, this.htmlBoxBase);
		eavAlertNode.setAttribute("class", "eav-alert animated " + animationOutType);
	}
	else{
		//No animation
		this.htmlBoxBase.removeChild(eavAlertNode);
	}

	if(this.alerts.length >= 1){
		this.boxBaseTop += 15;
		this.htmlBoxBase.style.top = this.boxBaseTop + "%";
	}
}
