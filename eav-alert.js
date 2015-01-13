function EAV_Alert(nOBoxes = 5){

	this.nOBoxes = (!isNaN(nOBoxes)) ? nOBoxes : 5;

	this.alertBaseTitle = 		'<div class="eav-alert">' +
									'<div class="eav-alert-header">' +
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
								'</div>' +
							'</div>';

	var boxes = boxes || [];

	if(this.nOBoxes <= 0)
		nOBoxes = 1;
}

EAV_Alert.prototype.createBoxBase = function(){
	var htmlBoxBase = document.createElement("div");
	htmlBoxBase.setAttribute("id", "eav-alert-box");

	document.body.appendChild(htmlBoxBase);
}

/*
	title = titulo
	text = texto de la alerta
	imgPath = ruta de la imagen (preferente de 38x38px)
	secondsAlive = segundos que la alerta durará antes de desaparecer, poner 0 para indicar que su nivel de vida es indefinido
	animationIn = animación que realizará la alerta al ser creada (Depende de JQuery o Animate.css)
	animationOut = animación que realizará la alerta al ser destruida (Depende de JQuery o Animate.css)
 */
EAV_Alert.prototype.createAlert = function(title,
										   text,
										   imgPath,
										   secondsAlive,
										   animationIn,
										   animationOut){

	var eavAlert = alertBaseTitle +
						((typeof title === 'string' || title instanceof String)) ? title : '' +
				   alertBaseImg +
				   		((typeof imgPath === 'string' || imgPath instanceof String)) ? 'url('+imgPath+');' : 'url(Blue_Alert.png);' +
				   alertBaseText +
				   		((typeof text === 'string' || text instanceof String)) ? text : '' +
				   alertBaseClose;

	var jQAnimationIn = false, ACssAnimationIn = false;
	var regJQ = new RegExp("^([jJ][qQ])"), regACss = new RegExp("^([aA][cC]ss)");

}
