 /** Function for crossectional view */
function showCrossSec(scope){
	getCBN("box_front").alpha = scope.cross_sec ? 0 : 1;
	stage.update();
}
/** Function for show/hide graph */
function hideGraph(scope){
	document.getElementById("graphDiv").style.display = scope.hide_graph ? "none" : "block";
}
/** Function for stirrering */
function stirreringUp(){
	stirr_clr = createjs.Tween.get(getCBN("stirrer")).to({y: -30}, 500).call(stirreringDown);
}
/** Function for stirrering */
function stirreringDown(){
	stirr_clr = createjs.Tween.get(getCBN("stirrer")).to({y: 0}, 500).call(stirreringUp);
}

function startExperiment(scope){
	if(scope.start_lbl == labels[0]){
		scope.start_lbl = labels[1];
		if(playing){scope.$apply();playing=false;}
		stirreringUp();
		startWatch(stage);
		scope.sample_dsabld = true;
		tick = setInterval(function(){updateTimer();}, 100); /** Stage update function in a timer */
	}else{
		scope.start_lbl = labels[0];
		if(paused){scope.$apply();paused=false;}
		createjs.Tween.removeAllTweens();
		createjs.Tween.get(getCBN("stirrer")).to({y: 0}, 500);
		pauseWatch();
		setTimeout(function(){clearInterval(tick)},500);
	}
	RED = 'red';
}
/** Function to select smaples(HCl, NaOH and NaOH + HCl) */
function setSample(scope){	sample_indx = scope.sample_type;
	temp_scope.btn_dsabld = false;
	seconds = 0;
	if(sample_indx == 1){/** Initialisation of position of mercurry, popup and temperature, were selected sample is NaOH*/
		mercury.graphics._instructions[1].y = 30;
		mercury.graphics._instructions[1].h = 245;
		popup.x = 35;
		popup.y = 245;
		temperature = 50.1;
		popup.getChildByName("temperature").text = temperature+" °C";
	}else if(sample_indx == 2){/** Initialisation of position of mercurry, popup and temperature, were selected sample is NaOH+HCl*/
		lapTime = 300000;/** To set starting time of clock to 5second */
		mercury.graphics._instructions[1].y = 75;
		mercury.graphics._instructions[1].h = 298;
		popup.x = 35;
		popup.y = 290;
		temperature = 40.7;
		popup.getChildByName("temperature").text = temperature+" °C";
	}
	stage.update();
	/** To add events to play button if there is no events in play button */
	if(!clockContainer.getChildByName("play").hasEventListener("click")){
		play_event = clockContainer.getChildByName("play").on("click",function(){
        	playing=true;startExperiment(temp_scope);
        });
	}
}
/** Resetting the experiment */
function resetExperiment(scope){
    scope.start_lbl = labels[0];
	seconds = 0;
	scope.disabld = [1,2];
	scope.sample_type = scope.sample_options[0].type;
	initialisationOfVariables();
	resetWatch();
	mercury.graphics._instructions[1].y = 137;
	mercury.graphics._instructions[1].h = 140;
	popup.y = 350;
	temperature = 27.1;
	sample_indx = 0;
	popup.getChildByName("temperature").text = temperature+" °C";
	sample_indx = 0;
	temp_scope.btn_dsabld = false;
	scope.hide_graph = false;
	getCBN("box_front").alpha = 1;
	RED = 'red';
	scope.cross_sec = false;
	document.getElementById("graphDiv").style.display = "block";
	if(!scope.$$phase){
		scope.$apply();
	}	
	dataplot_array = [];/** Array to plot graph of sample of HCl */
	dataplot_array_second = [];/** Array to plot graph of sample of NaOH */
	dataplot_array_third = [];/** Array to plot graph of sample of NaOH + HCl */
	dataplot_array.push({
		x: (0), /** x time in minute */
		y: (27.1) /** y transition temperatue in degree */
	});
	makeGraph();
	stage.update();
	if(!clockContainer.getChildByName("play").hasEventListener("click")){
		play_event = clockContainer.getChildByName("play").on("click",function(){
        	playing=true;startExperiment(temp_scope);
        });
    }
    createjs.Tween.removeAllTweens();
	createjs.Tween.get(getCBN("stirrer")).to({y: 0}, 500);
	setTimeout(function(){clearInterval(tick)},500);
}
/** Draws a chart in canvas js for making graph plotting */
function makeGraph() {
	chart = new CanvasJS.Chart("graphDiv", {
		axisX: {
			title: _("Time (in sec)"),
			titleFontSize: 15,
			minimum: 0
		},
		axisY: {
			title: _("Temperature ")+"(°C)",
			titleFontSize: 15,
			minimum: 0,
			maximum: 60,
			interval: 15
		},
		legend: {
	     horizontalAlign: "center",
	     verticalAlign: "top",
	    },
		data: [{
			type: "spline",
			color: RED,
			type: "line",
			markerType: "circle",
			showInLegend: true,
			legendText: _("Cold water"),
			markerSize: 3,
			lineThickness: 2,
			dataPoints: dataplot_array   /** Array contains the data */
		},
		{
			type: "spline",
			color: "blue",
			type: "line",
			markerType: "circle",
			showInLegend: true,
			legendText: _("Hot water"),
			markerSize: 3,
			lineThickness: 2,
			 /** Array contains data while temperature is 50.1 */
			dataPoints:dataplot_array_second
		},
		{
			type: "spline",
			color: "green",
			type: "line",
			markerType: "circle",
			showInLegend: true,
			legendText: _("Mixture"),
			markerSize: 3,
			lineThickness: 2,
			 /** Array contains data while temperature is 50.1 */
			dataPoints:dataplot_array_third
		}]
	});
	chart.render();  /** Rendering the graph */
}
/** Function to handle borwser visibility(hidden/visible) change.
	When the browser return back to visible state, the function will check 
	whether 'seconds' is greater than 570 and if so it will stop stirrering
	and timer.  */
function handleVisibilityChange() {
	if(temp_scope.start_lbl == labels[1]){
		if (!document.hidden) {
	    	startWatch(stage);
			tick = setInterval(function(){updateTimer();}, 100); /** Stage update function in a timer */
	  	}else{
	  		pauseWatch();
			clearInterval(tick);
	  		}
	}
  
}
/** To add visibilitychange evntlistner to document */
document.addEventListener("visibilitychange", handleVisibilityChange, false);