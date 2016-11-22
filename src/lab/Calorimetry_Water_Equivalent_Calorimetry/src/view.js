(function(){
  angular
       .module('users')
	   .directive("experiment",directiveFunction)
})();

var stage, exp_canvas, stage_width, stage_height;

var labels,timer_interval,chart,stirr_clr,RED;

var dataplot_array,dataplot_array_second,dataplot_array_third;

var paused,playing,play_event,mercury, seconds;

var temperature, sample_indx, hot_temp, hot_col_temp;

var HOT_TEMP_CONST, MIX_TEMP_CONST, HOT_SOLU_CONST, MIX_SOLU_CONST;

function directiveFunction(){
	return {
		restrict: "A",
		link: function(scope, element,attrs){
			/** Variable that decides if something should be drawn on mouse move */
			var experiment = true;
			if ( element[0].width > element[0].height ) {
				element[0].width = element[0].height;
				element[0].height = element[0].height;
			} else {
				element[0].width = element[0].width;
				element[0].height = element[0].width;
			}  
			if ( element[0].offsetWidth > element[0].offsetHeight ) {
				element[0].offsetWidth = element[0].offsetHeight;			
			} else {
				element[0].offsetWidth = element[0].offsetWidth;
				element[0].offsetHeight = element[0].offsetWidth;
			}
			/** Array to store name of images and this array used to load images into preloader */
			images_array = ["background","thermometer","stirrer","stand_holder","box_top","box_front","number_popup"];
			exp_canvas=document.getElementById("demoCanvas");
			exp_canvas.width=element[0].width;
			exp_canvas.height=element[0].height; 
			/** Stage initialization */
			stage = new createjs.Stage("demoCanvas");
			queue = new createjs.LoadQueue(true);
			queue.installPlugin(createjs.Sound);
			loadingProgress(queue, stage, exp_canvas.width)
			queue.on("complete", handleComplete, this);
			var queue_obj = [];/** Array to store object of each images */
			for(i = 0; i < images_array.length; i++){/** Creating object of each element */
				queue_obj[i] = {id: images_array[i],src: "././images/"+images_array[i]+".svg",type: createjs.LoadQueue.IMAGE};
			}
			queue.loadManifest(queue_obj);
			
			stage.enableDOMEvents(true);
			stage.enableMouseOver();
             
            
            container = new createjs.Container(); /** Creating the parent  container */
            container.name = "container";
            stage.addChild(container); /** Append it in the stage */
           	
           	popup = new createjs.Container(); /** container for popup of temperature*/
            container.name="popup";
            stage.addChild(popup); /** Append it in the stage */
		                
			function handleComplete(){				
				for(i = 0; i < images_array.length; i++){
					if(i == 1){/** adding mercury solution behind the thermometer */
						mercury  = new createjs.Shape();
		                mercury .graphics.beginFill("#000000");
		                mercury .graphics.drawRect(0, 137, 11, 140);
		                mercury .graphics.endFill();
		                mercury .x = 135;
		                mercury .y = 270;
		                mercury .name = "mercury";
		                container.addChild(mercury);
						loadImages(images_array[i]);
					}else{/** Loading all images into the canvas */
						loadImages(images_array[i]);
					}                     
                }
                /** Position of popup message of temperature in thermometer */           
                popup.x = 35;
				popup.y = 350;
				initialisationOfVariables(); /** Initializing the variables */
                setText("temperature", 10, 28, temperature+" °C", "#000000", 1.2, popup);
				document.getElementById("graphDiv").style.display = "block"; /** Set the display of graph div as block */
				createStopwatch (stage, 430,500,timer_interval);
				translationLabels(); /** Translation of strings using gettext */
               // makeGraph();
                tick = setInterval(function(){updateTimer();}, 10); /** Stage update function in a timer */
                /** Adding startExperiment() function to click event of play button in clock */
                play_event = clockContainer.getChildByName("play").on("click",function(){
                	playing=true;startExperiment(temp_scope);
                });
                /** functionality added to pause button in clock for pause stirrering */
				clockContainer.getChildByName("pause").on("click",function(){paused=true;startExperiment(temp_scope);});
				clockContainer.getChildByName("reset").on("click",function(){/** Things to perform while click on reset button in clock */
					resetExperiment(scope);
				});
				setTimeout(function(){clearInterval(tick)},100);
			}
            
			/** Add all the strings used for the language translation here. '_' is the short cut for calling the gettext function defined in the gettext-definition.js */	
			function translationLabels(){
                /** This help array shows the hints for this experiment */
				helpArray=[_("help1"),_("help2"),_("help3"),_("Next"),_("Close")];
                scope.heading=_("Calorimetry: Water Equivalent Calorimetry");
				scope.variables=_("Variables");                 
				scope.result=_("Result");  
				scope.copyright=_("copyright"); 
				scope.sample_type_lbl=_("Select the sample:"); 
				scope.sample_options = [{type:_("Cold Water"),index:0},{type:_("Hot Water"),index:1},{type:_("Hot Water + Cold Water"),index:2}]
     			scope.disabld = [1,2];
                scope.cross_sec_lbl=_("Cross section");
                scope.hide_graph_lbl=_("Hide graph");
                scope.start_lbl=labels[0];
                scope.reset_lbl=_("Reset");
                scope.sample_dsabld = false;
                scope.btn_dsabld = false;
                scope.$apply();				
			}
		}
	}
}
/** Createjs stage updation happens in every interval */
function updateTimer(){
	stage.update();
	seconds = (parseInt(minute) * 60) + parseInt(second);/** Converting minutes to seconds */
	if(seconds <= 270 || (seconds >= 300 && seconds <= 570)){/** To check whether the seconds is 270 or 570 */
		if(seconds%10==0){
			if(sample_indx == 0){/** To check whether the selected sample is 'cold water' or not */
				dataplot_array.push({
					x: (seconds), /** x time in minute */
					y: (27.1) /** y transition temperatue in degree */
				});
			}else if(sample_indx == 1){/** To check whether the selected sample is Hot water */
				temperature = seconds<180?(hot_temp - ((seconds/10)*HOT_TEMP_CONST)).toFixed(1):47.8;
				dataplot_array_second.push({
					x: (seconds), /** x time in minute */
					y: seconds < 180 ? parseFloat(temperature) : 47.8 /** y transition temperatue in degree */
				});
				/** To adjust the level of mercury and position of popup message of temperature */
				mercury.graphics._instructions[1].y = 30 + (((seconds<180?seconds:270)/10)*HOT_SOLU_CONST);
				mercury.graphics._instructions[1].h = 245 + (((seconds<180?seconds:270)/10)*HOT_SOLU_CONST);
				popup.x = 35;
				popup.y = 245 + (((seconds<180?seconds:270)/10)*HOT_SOLU_CONST);
				popup.getChildByName("temperature").text = temperature+" °C";
			}else{/** This block of code executed when the sample selected is 'hot water + cold water' */
		
				/** To decrease the temperature level in thermometer */
				temperature = seconds<450?(hot_col_temp - (((seconds - 300)/10) * MIX_TEMP_CONST)).toFixed(1):38.7;
				dataplot_array_third.push({
					x: (seconds), /** x time in minute */
					y: seconds < 450 ? parseFloat(temperature) : 38.7 /** y transition temperatue in degree */
				});
				/** To adjust the level of mercury and position of popup message of temperature */
				mercury.graphics._instructions[1].y = 75 + ((((seconds<450?seconds:570) - 300)/10) * HOT_SOLU_CONST);
				mercury.graphics._instructions[1].h = 198 + ((((seconds<450?seconds:570) - 300)/10) * HOT_SOLU_CONST);
				popup.x = 35;
				popup.y = 290 + ((((seconds<450?seconds:570) - 300)/10) * HOT_SOLU_CONST);
				popup.getChildByName("temperature").text = temperature+" °C";
			}
			makeGraph();
		}
	}else if(seconds == 271 || seconds == 571){/** To stop the timer and stirrering */
		temp_scope.sample_dsabld = false;/** To disable the dopdown box */
		if(clockContainer.getChildByName("play").hasEventListener("click")){/** To remove the event listner from play button in clok */
			clockContainer.getChildByName("play").off("click",listner_play);
			clockContainer.getChildByName("play").off("click",play_event);
		}
		temp_scope.start_lbl = labels[0];/** Button label changed to 'Start' */
		temp_scope.btn_dsabld = true;/** Disable button */
		if(sample_indx == 0){/** Enable seconds option(NaOH) in dropdown box */
			temp_scope.disabld = [0,2];
		}else if(sample_indx == 1){/** Enable Third option(NaOH + HCl) in dropdown box*/
			temp_scope.disabld = [0,1];
		}
		temp_scope.$apply();
		createjs.Tween.removeAllTweens();/** stop the stirrering process */
		createjs.Tween.get(getCBN("stirrer")).to({y: 0}, 500);
		setTimeout(function(){clearInterval(tick)},500);
		resetWatch();
	}
}
/** All the texts loading and added to the stage */
function setText(name, textX, textY, value, color, fontSize, container){
    var text = new createjs.Text(value, "bold " + fontSize + "em Tahoma, Geneva, sans-serif", color);
    text.x = textX;
    text.y = textY;
    text.textBaseline = "alphabetic";
    text.name = name;
    text.text = value;
    text.color = color;
    popup.addChild(text); /** Adding text to the container */
    stage.update();
}

/** All the images loading and added to the stage */
function loadImages(name){
    var _bitmap = new createjs.Bitmap(queue.getResult(name)).set({});
    _bitmap.x = 0;
    _bitmap.y = 0;
    _bitmap.name = name;
    _bitmap.alpha = 1;   
    _bitmap.cursor = "";    
    name != "number_popup" && container.addChild(_bitmap) || popup.addChild(_bitmap); /** Adding bitmap to the container */ 
    stage.update();
}

/** function to return chiled element of container */
function getCBN(chldName){
    return container.getChildByName(chldName);
}
/** All variables initialising in this function */
function initialisationOfVariables() {
	labels = [_("Start"),_("Stop")];
	dataplot_array = [];/** Array to plot graph of sample of HCl */
	dataplot_array_second = [];/** Array to plot graph of sample of NaOH */
	dataplot_array_third = [];/** Array to plot graph of sample of NaOH + HCl */
	paused = false;
	playing = false;
    timer_interval = 0.5; /** Interval of the timer and clock to be execute */
    temperature = 27.1;/** Initial temperature of cold water */
    sample_indx = 0;
    RED = 'red';
    hot_temp = 50.1;/** Initial temperature of hot water */
    hot_col_temp = 40.7;/** Initial temperature of hot water + cold water */
    HOT_TEMP_CONST = 0.1277777777777778; /** The difference between initial temperature and final temperature is devided by 18(180second/10) */
    MIX_TEMP_CONST = 0.1333333333333333; /** The difference between initial temperature and final temperature is devided by 15(150second/10) */
    HOT_SOLU_CONST = 0.3703703703703704; /** The pixel difference of mercury solution while it decrease is divided by 27 */
}