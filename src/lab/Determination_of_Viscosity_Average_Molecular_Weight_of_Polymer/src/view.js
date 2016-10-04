(function() {
    angular
		.module('users')
        .directive("experiment", directiveFunction)
})();
/** Variables declarations */
var timer, animation_counter, exp_canvas, masking_timer, start_flag, solvant;
var selected_polymer_index, selected_solvent_index, selected_system_index;
var time, animation_timer, emplty_pipettu_tween, solution_pouring_tween;
var soln_pouring_rect = new createjs.Shape();
var pipette_solution_rect = new createjs.Shape();
var line_down = new createjs.Shape(); /**Adding line to pour solution */
var mask_tube_rect_first = new createjs.Shape();
var mask_tube_rect_second = new createjs.Shape();
var stop_watch_timer;
var solDroppingFlag;
function directiveFunction() {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            /** Variable that decides if something should be drawn on mouse move */
            var experiment = true;
            if (element[0].width > element[0].height) {
                element[0].width = element[0].height;
                element[0].height = element[0].height;
            } else {
                element[0].width = element[0].width;
                element[0].height = element[0].width;
            }
            if (element[0].offsetWidth > element[0].offsetHeight) {
                element[0].offsetWidth = element[0].offsetHeight;
            } else {
                element[0].offsetWidth = element[0].offsetWidth;
                element[0].offsetHeight = element[0].offsetWidth;
            }
			exp_canvas = document.getElementById("demoCanvas");
			exp_canvas.width = element[0].width;
            exp_canvas.height = element[0].height;
			/** Creating the stage for the experiment. */
			viscosity_measurement_stage  = new createjs.Stage("demoCanvas")
            queue = new createjs.LoadQueue(true);
            queue.installPlugin(createjs.Sound);
			loadingProgress(queue,viscosity_measurement_stage,exp_canvas.width)
            queue.on("complete", handleComplete, this);
            queue.loadManifest([{
                id: "background",
                src: "././images/background.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
				id: "stand_bottle",
                src: "././images/stand_bottle.svg",
                type: createjs.LoadQueue.IMAGE
			}, {
				id: "tube_solution",
                src: "././images/tube_solution.svg",
                type: createjs.LoadQueue.IMAGE
			},{
				id: "pipette_still",
                src: "././images/pipette_still.svg",
                type: createjs.LoadQueue.IMAGE
			}, {
				id: "pipette_ani1",
				src: "././images/pipette_ani1.svg",
				type: createjs.LoadQueue.IMAGE
            }, {
				id: "pipette_ani2",
				src: "././images/pipette_ani2.svg",
				type: createjs.LoadQueue.IMAGE
            }, {
				id: "pipette_ani3",
				src: "././images/pipette_ani3.svg",
				type: createjs.LoadQueue.IMAGE
            },  {
				id: "pipette_ani4",
				src: "././images/pipette_ani4.svg",
				type: createjs.LoadQueue.IMAGE
            } , {
				id: "pipette_ani5",
				src: "././images/pipette_ani5.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "pipette_ani6",
				src: "././images/pipette_ani6.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "pipette_ani7",
				src: "././images/pipette_ani7.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "pipette_ani8",
				src: "././images/pipette_ani8.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "pipette_ani9",
				src: "././images/pipette_ani9.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "pipette_ani10",
				src: "././images/pipette_ani10.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "top_closer",
				src: "././images/top_closer.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "arrow_right",
				src: "././images/arrow_right.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "arrow_left",
				src: "././images/arrow_left.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "pipette_alpha_ani1",
				src: "././images/pipette_alpha_ani1.svg",
				type: createjs.LoadQueue.IMAGE
            }, {
				id: "pipette_alpha_ani2",
				src: "././images/pipette_alpha_ani2.svg",
				type: createjs.LoadQueue.IMAGE
            }, {
				id: "pipette_alpha_ani3",
				src: "././images/pipette_alpha_ani3.svg",
				type: createjs.LoadQueue.IMAGE
            },  {
				id: "pipette_alpha_ani4",
				src: "././images/pipette_alpha_ani4.svg",
				type: createjs.LoadQueue.IMAGE
            } , {
				id: "pipette_alpha_ani5",
				src: "././images/pipette_alpha_ani5.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "pipette_alpha_ani6",
				src: "././images/pipette_alpha_ani6.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "pipette_alpha_ani7",
				src: "././images/pipette_alpha_ani7.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "pipette_alpha_ani8",
				src: "././images/pipette_alpha_ani8.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "pipette_alpha_ani9",
				src: "././images/pipette_alpha_ani9.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "pipette_alpha_ani10",
				src: "././images/pipette_alpha_ani10.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "pipette_solution",
				src: "././images/pipette_solution.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "pipette_empty",
				src: "././images/pipette_empty.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "pipette_solution_alpha",
				src: "././images/pipette_solution_alpha.svg",
				type: createjs.LoadQueue.IMAGE
			}
            ]);
            
			/** Initialisation of stage */
            viscosity_measurement_stage.enableDOMEvents(true);
            viscosity_measurement_stage.enableMouseOver();
            timer = setInterval(updateTimer, 100); /** Stage update function in a timer */          

            function handleComplete() { 
				/** loading Background image */
                loadImages(queue.getResult("background"), "background", 0, 0, "", 0 ); 
                /** Function for setting stopwatch */
				createStopwatch (viscosity_measurement_stage,-20,520,1);
				/** Loading all images in the queue to the stage */				
				loadImages(queue.getResult("tube_solution"), "tube_solution",390, 189, "", 0);
				loadImages(queue.getResult("tube_solution"), "tube_solution1",390, 189, "", 0);
				loadImages(queue.getResult("top_closer"), "top_closer",460, -500, "", 0); //-120
				loadImages(queue.getResult("tube_solution"), "tube_solution2",390, 189, "", 0);
				loadImages(queue.getResult("pipette_still"), "pipette_still", 568, 20, "", 0);
				loadImages(queue.getResult("pipette_empty"), "pipette_empty",390, -130, "", 0);
				loadImages(queue.getResult("pipette_solution"), "pipette_solution",390, -130, "", 0);
				loadImages(queue.getResult("pipette_solution_alpha"), "pipette_solution_alpha",390, -130, "", 0);
				/** Loading all animation images in the queue to the stage */
				for ( var i=1; i<=10; i++ ) {
                    loadImages(queue.getResult("pipette_ani"+i), "pipette_ani"+i, 568, 250, "", 0, viscosity_measurement_stage, 1);
                }
				for ( var i=1; i<=10; i++ ) {
                    loadImages(queue.getResult("pipette_alpha_ani"+i), "pipette_alpha_ani"+i, 568, 250, "", 0, viscosity_measurement_stage, 1);
                }
				loadImages(queue.getResult("stand_bottle"), "stand_bottle", 0, 0, "", 0, 1, 1);
				loadImages(queue.getResult("arrow_right"), "arrow_right", 365, 477, "", 0, 1, 1);
				loadImages(queue.getResult("arrow_left"), "arrow_left1", 500, 242, "", 0, 1, 1);
				loadImages(queue.getResult("arrow_left"), "arrow_left2", 500, 290, "", 0, 1, 1);
				loadImages(queue.getResult("arrow_left"), "arrow_left3", 500, 335, "", 0, 1, 1);
				/** Text loading */
				setText("clabel", 560, 257, _("C"), "#FFFFFF", 1);
				setText("alabel", 560, 305, _("A"), "#FFFFFF", 1);
				setText("dlabel", 560, 350, _("D "), "#FFFFFF", 1);
				setText("blabel", 350, 490, _("B"), "#FFFFFF", 1);
                translationLabels(); /** Translation of strings using gettext */
				/** Adding mask_tube_rect for masking the tube solution */
				drawRectangle(mask_tube_rect_first,450,608,50,425,0);
				drawRectangle(mask_tube_rect_second,392,608,58,425,0);
				drawRectangle(soln_pouring_rect,416,-300,2,480,0);
				drawRectangle(pipette_solution_rect,400,0,50,175,0);
				/** Initializing the variables */
                initialisationOfVariables(scope); 
				initialisationOfImages();
				loadXml();
            }
	
			/** Add all the strings used for the language translation here. '_' is the short cut for 
            calling the gettext function defined in the gettext-definition.js */
			function translationLabels() {
				/** This help array shows the hints for this experiment */
				helpArray = [_("help1"), _("help2"), _("help3"), _("help4"),_("help5"),_("help6"),_("help7"), _("Next"), _("Close")];
				scope.heading = _("Determination of Viscosity Average Molecular Weight of Polymer");
				scope.variables = _("Variables");
				scope.fill_liquid = _("Fill liquid");
				start_btn_var=_("start");
				scope.reset = _("Reset");
				scope.conc_txt = _("conc of polymer(g/dl):")
				scope.show_label = _("Show labels");
				scope.timeFlow_label = _("Find time of flow of :");
				scope.selectPolymer_label = _("Select Polymer :");
				scope.selectSolvent_label = _("Select Solvent :");
				scope.selectsample_label = _("Select sample :");
				scope.copyright = _("copyright");
				scope.selectsystemArray = [{optionsSystem: _('Polymer solvent system'),type: 0}, {optionsSystem: _('Solvent'),type: 1}];
				scope.selectPolymerArray = [{optionsPolymer: _('Polyvinyl acetate'),type: 0}, {optionsPolymer: _('PMMA'),type: 1}, {optionsPolymer: _('Polyvinyl alcohol'),type: 2},{optionsPolymer: _('Polystyrene'),type: 3}];
				scope.selectSolventArray = [{optionsSolvent: _('Acetonitrile'),type: 0}, {optionsSolvent: _('Acetone'),type: 1}, {optionsSolvent: _('Benzene'),type: 2}];
				scope.$apply();
            }
        }
    }
}

/** All variables initialising in this function */
function initialisationOfVariables(scope) {
	animation_counter = 0;
	selected_polymer_index = 0;
	selected_solvent_index = 0;
	selected_system_index = 0;	
	scope.conc_ctrls_disable = false;
	scope.conc_ctrls_show = true;
	scope.conc_value = 0.02;
	scope.polymer_ctrls_show = true;
	scope.polymer_ctrls_disable = false;
	scope.solvent_ctrls_disable = false;
	scope.time_flow_ctrls_disable = false;
	scope.system_Mdl = 0;
	scope.Polymer_Mdl = 0;
	scope.solvent_Mdl = 0; 
	solDroppingFlag = true;
	viscosity_measurement_stage.getChildByName("tube_solution2").alpha = 1;
	viscosity_measurement_stage.getChildByName("tube_solution1").alpha = 1;
	viscosity_measurement_stage.getChildByName("tube_solution").alpha = 1; 
	scope.selectSolventArray = [{optionsSolvent: _('Acetonitrile'),type: 0}, {optionsSolvent: _('Acetone'),type: 1}, {optionsSolvent: _('Benzene'),type: 2}];
}

/** Function to draw rectangular mask */
function drawRectangle(rect_name, x, y, width, height, alpha_val) {
    viscosity_measurement_stage.addChild(rect_name);
    rect_name.x = x;
    rect_name.y = y;
    rect_name.graphics.beginFill("").drawRect(0, 0, width, height).command;
    rect_name.alpha = alpha_val;
}

/** Set the initial status of the bitmap and text depends on its visibility and initial values */
function initialisationOfImages() {
	getChild("top_closer").visible = false;
	viscosity_measurement_stage.getChildByName("pipette_still").alpha = 0;
	/** Make all text visibility to false  */
	viscosity_measurement_stage.getChildByName("clabel").visible = false;
	viscosity_measurement_stage.getChildByName("alabel").visible = false;
	viscosity_measurement_stage.getChildByName("dlabel").visible = false;
	viscosity_measurement_stage.getChildByName("blabel").visible = false;
	/** Make all arrow images visibility to false  */
	for( var i=1; i<=3; i++ ) 
	{
	 getChild("arrow_left"+i).visible = false;
	}
	getChild("arrow_right").visible = false;  
	getChild("pipette_still").visible = false;
	for ( var i=1; i<=10; i++ ) {
		getChild("pipette_ani"+i).visible = false;
		getChild("pipette_ani"+i).x =568;
		getChild("pipette_ani"+i).y =250;
    } 
	for ( var i=1; i<=10; i++ ) {
		getChild("pipette_alpha_ani"+i).visible = false;
		getChild("pipette_alpha_ani"+i).x =568;
		getChild("pipette_alpha_ani"+i).y =250; 
    } 
	viscosity_measurement_stage.getChildByName("tube_solution1").visible = true;
	viscosity_measurement_stage.getChildByName("tube_solution").visible = true;
	viscosity_measurement_stage.getChildByName("tube_solution2").visible = true;
	viscosity_measurement_stage.getChildByName("pipette_solution").visible = false;
	viscosity_measurement_stage.getChildByName("pipette_empty").visible = false;
	viscosity_measurement_stage.getChildByName("pipette_solution_alpha").visible = false; 
}

/** All the texts loading and added to the stage */
function setText(name, textX, textY, value, color, fontSize) {
    var _text = new createjs.Text(value, "bold " + fontSize + "em Tahoma, Geneva, sans-serif", color);
    _text.x = textX;
    _text.y = textY;
    _text.textBaseline = "alphabetic";
    _text.name = name;
    _text.text = value;
    _text.color = color;
    viscosity_measurement_stage.addChild(_text); /** Adding text to the container */
}
