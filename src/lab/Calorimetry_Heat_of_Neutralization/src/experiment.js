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
/** Function to start/stop stirrering, to start/pause clock */
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
}
/** Function to select smaples(HCl, NaOH and NaOH + HCl) */
function setSample(scope){
	sample_indx = scope.sample_type;
	temp_scope.btn_dsabld = false;
	if(sample_indx == 1){ /** Initialisation of position of mercurry, popup and temperature, were selected sample is NaOH*/
		mercury.graphics._instructions[1].y = 122;
		mercury.graphics._instructions[1].h = 158;
		popup.x = 35;
		popup.y = 335;
		popup.getChildByName("temperature").text = hot_temp+"°C";
	}else if(sample_indx == 2){/** Initialisation of position of mercurry, popup and temperature, were selected sample is NaOH+HCl*/
		lapTime = 300000; /** To set starting time of clock to 5seconds */
		mercury.graphics._instructions[1].y = 95;
		mercury.graphics._instructions[1].h = 185;
		popup.x = 35;
		popup.y = 305;
		temperature = hot_col_temp;
		popup.getChildByName("temperature").text = temperature+"°C";
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
	secondss = 0;
	scope.disabld = [1,2];
	scope.sample_type = scope.sample_options[0].type;
	initialisationOfVariables();
	resetWatch();
	mercury.graphics._instructions[1].y = 127;
	mercury.graphics._instructions[1].h = 150;
	popup.y = 340;
	temperature = 29;
	sample_indx = 0;
	popup.getChildByName("temperature").text = temperature+" °C";
	sample_indx = 0;
	temp_scope.btn_dsabld = false;
	scope.hide_graph = false;
	getCBN("box_front").alpha = 1;
	scope.cross_sec = false;
	document.getElementById("graphDiv").style.display = "block";
	if(!scope.$$phase){
		scope.$apply();
	}	
	dataplot_array = [];/** Array to plot graph of sample of HCl */
	dataplot_array_seconds = [];/** Array to plot graph of sample of NaOH */
	dataplot_array_third = [];/** Array to plot graph of sample of NaOH + HCl */
	dataplot_array.push({
		x: (0), /** x time in minute */
		y: (29) /** y transition temperatue in degree */
	});
	makeGraph();
	stage.update();
	if(!clockContainer.getChildByName("play").hasEventListener("click")){
		play_event = clockContainer.getChildByName("play").on("click",function(){
        	playing=true;startExperiment(temp_scope);
        });
    }
    createjs.Tween.removeAllTweens();
	createjs.Tween.get(getCBN("stirrer")).to({y: 0}, 500).call(function(){
		clearInterval(tick);
	});
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
			color: "red",
			type: "line",
			markerType: "circle",
			showInLegend: true,
			legendText: _("HCl"),
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
			legendText: _("NaOH"),
			markerSize: 3,
			lineThickness: 2,
			 /** Array contains data while temperature is 50.1 */
			dataPoints:dataplot_array_seconds
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
/** Graph drawing */
function plotGraph(xAxis,yAxis) {
	dataplot_array.push({
		x: (xAxis), /** x time in minute */
		y: (yAxis) /** y transition temperatue in degree */
	});
	chart.render(); /** Rendering the canvasjs chart */
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