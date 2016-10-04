/** Event handling functions starts here */
/** loading xml */
function loadXml()
{
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
	{
		  readTime(xmlhttp);
	} 
	};
	if(selected_system_index == 0){
		xmlhttp.open("GET", "./xml/polymer_solvent_system.xml", true);
	}
	else{
		xmlhttp.open("GET", "./xml/solvent.xml", true);
	}
	 xmlhttp.send();
}

/** function to get the time of selected polymer or solvent */
function readTime(xml)
{
	var xmlDoc = xml.responseXML;
	if(selected_system_index == 0)
	{
		solvant = xmlDoc.getElementsByTagName("solvent");
	}
	else
	{
		sample = xmlDoc.getElementsByTagName("sample");
		time  = sample[0].getElementsByTagName("time")[0].childNodes[0].nodeValue;
	}
}

/** Function to show labels based on the check box selection */  
function showLabelsFn(scope) {
	var label_visibility = false;
	if (scope.showLabels) {
		label_visibility = true;
	} 
	else{
		label_visibility = false;
	}	
	viscosity_measurement_stage.getChildByName("clabel").visible = label_visibility;
	viscosity_measurement_stage.getChildByName("alabel").visible = label_visibility;
	viscosity_measurement_stage.getChildByName("dlabel").visible = label_visibility;
	viscosity_measurement_stage.getChildByName("blabel").visible = label_visibility;	
	getChild("arrow_right").visible = label_visibility;
	for( var i=1; i<=3; i++ ) 
	{
		getChild("arrow_left"+i).visible = label_visibility;
	}	
}

/** Createjs stage updation happens in every interval */
function updateTimer() {
	viscosity_measurement_stage.update();
}

/** Function for setting controls while changing the system */
function setSystemFn(scope)
{
	selected_system_index = scope.system_Mdl;
	scope.selectSolventArray = [];
	if(selected_system_index == 1)
	{
		viscosity_measurement_stage.getChildByName("tube_solution2").alpha = 0.5;
		viscosity_measurement_stage.getChildByName("tube_solution1").alpha = 0.5;
		viscosity_measurement_stage.getChildByName("tube_solution").alpha = 0.5; 	
		scope.conc_ctrls_show = false;
		scope.polymer_ctrls_show = false;
		scope.solvent_Mdl = 0;
		scope.selectSolventArray = [{optionsSolvent: _('Acetonitrile'),type: 0},
		{optionsSolvent: _('Acetone'),type: 1},{optionsSolvent: _('Water'),type: 2},
		{optionsSolvent: _('Toluene'),type: 3}, {optionsSolvent: _('Benzene'),type: 4}];				
		loadXml();
	}
	else
	{
		resetFn(scope);	
	}
}

/** All the images loading and added to the stage */
function loadImages(image, name, xPos, yPos, cursor, rot) {
    var _bitmap = new createjs.Bitmap(image).set({});
    _bitmap.x = xPos;
    _bitmap.y = yPos;
    _bitmap.scaleX = _bitmap.scaleY = 1;
    _bitmap.name = name;
    _bitmap.rotation = rot;
    _bitmap.cursor = cursor;
    viscosity_measurement_stage.addChild(_bitmap); /** Adding bitmap to the container */
	if ( name == "tube_solution" ) {
        _bitmap.mask = mask_tube_rect_first;
    }
	if ( name == "tube_solution1" ) {
		_bitmap.mask = mask_tube_rect_second;
    }
	if ( name == "tube_solution2" ) {
		_bitmap.mask = soln_pouring_rect;
    }
	if ( name == "pipette_solution" ) {
		_bitmap.mask = pipette_solution_rect;
    } 
	if ( name == "pipette_solution_alpha" ) {
		_bitmap.mask = pipette_solution_rect;
    }  
    blur_image_width = _bitmap.image.width; /**Passing the width of the cell for blur function */
    blur_image_height = _bitmap.image.height; /**Passing the height of the cell for blur function */
}

/** Fill the pipette in the 'fill liquid' button event by tweeting the empty pipette */
function fillLiquidFn(scope) {
	getChild("pipette_still").alpha = 1;
	scope.polymer_ctrls_disable = true;
	scope.solvent_ctrls_disable = true;
	scope.time_flow_ctrls_disable = true;
	scope.fill_liquid_disable = true;
	scope.conc_ctrls_disable = true;
	/** enabling the empty pipette and hand as visible while clicking 'fill liquid' button */
	 getChild("pipette_still").visible = true; 
	/** moving the empty pipette and hand near the bottle */
	emplty_pipettu_tween = createjs.Tween.get(viscosity_measurement_stage.getChildByName('pipette_still'))
	.to({x: 568, y: 250}, 1500).call(function(){at_end_suck_solution(scope)})
}

/** Function to call animation frames for taking solution in a pipette */
function at_end_suck_solution(scope){
	animation_timer = setInterval(function() {
		animation_counter++;
		takeSolution(scope);
		/**clearing the timer after animation */
		if ( animation_counter >= 10 ) {
			clearInterval(animation_timer);
		} 
    },100);
}

/** Loading animation for sucking solution from bottle to fill the pipette  */	  
function takeSolution(scope)
{	
	/** disabling the hand still frame */
	viscosity_measurement_stage.getChildByName("pipette_still").alpha = 0;
	for ( var i=1; i<=10; i++ ) 
	{  
		/** disabling all frame */
		getChild("pipette_ani"+i).visible = false;
		getChild("pipette_alpha_ani"+i).visible = false;
		/**To check whether the user selected 'solvent system' or 'polymer system'*/
		if(selected_system_index == 1)
		{
		/** enabling one frame at a time */
		getChild("pipette_alpha_ani"+animation_counter).alpha =1;
		getChild("pipette_alpha_ani"+animation_counter).visible = true;
		}
		else
		{
		/** enabling one frame at a time */
		getChild("pipette_ani"+animation_counter).alpha =1;
		getChild("pipette_ani"+animation_counter).visible = true;
		}	
	}
	/** check whether animation ended */
	if(animation_counter == 10)
	{
		/** moving the filled pipette to the viscometer after taking the liquid from bottle */
		if(selected_system_index == 0)
		{
			var filled_pipettu_tween = createjs.Tween.get(getChild("pipette_ani10")).to({
			x: 390, y: -150}, 1500).call(function(){at_end_pour_solution(scope)})
		}
		else
		{
			var filled_pipettu_tween = createjs.Tween.get(getChild("pipette_alpha_ani10")).to({
			x: 390, y: -150}, 1500).call(function(){at_end_pour_solution(scope)}) 
		}
	}	
}

/** pouring the solution from filled pipette to the viscometer */	
function at_end_pour_solution(scope)
{
	viscosity_measurement_stage.getChildByName("pipette_ani10").visible = false;
	viscosity_measurement_stage.getChildByName("pipette_alpha_ani10").visible = false;
	viscosity_measurement_stage.getChildByName("pipette_empty").visible = true;
	if(selected_system_index == 0)
	{
		viscosity_measurement_stage.getChildByName("pipette_solution").visible = true;
	}
	else
	{
		viscosity_measurement_stage.getChildByName("pipette_solution_alpha").visible = true;
	}
	animation_timer = setInterval(function() {
	var pipette_solution_tween = createjs.Tween.get(pipette_solution_rect).to({
	y: 200}, 5000)
	/** pouring the solution to the viscometer */
	if(solDroppingFlag == true)
	{
			solution_pouring_tween = createjs.Tween.get(soln_pouring_rect).to({
			y: 131}, 100).call(function(){
			solDroppingFlag = false;
			fillSolution(scope);
			}) 
	}
	},100);
}

/** Function to display the rising of solution in the viscometer after pouring the liquid from the pipette*/
function fillSolution(scope)
{ 
	/** increasing the liquid level in the left side of viscometer */
	var solution_increaseing_tween_second = createjs.Tween.get(mask_tube_rect_second).to({
	y:368}, 5000).call(function(){at_end_remove_pipette(scope)});
	/** increasing the liquid level in the right side of viscometer */
	var solution_increaseing_tween_first = createjs.Tween.get(mask_tube_rect_first).to({
	y: 516}, 5000).call(function(){at_end_remove_pipette(scope)});
	/** tweening the solution in reverse order while filling viscometer */
	solution_pouring_tween = createjs.Tween.get(soln_pouring_rect).to({
	y: -116}, 5000)	
} 

/** Function to remove pipette after the solution reach a level and tweening the sucker  */
function at_end_remove_pipette(scope)
{ 
	/** loading the sucker in a time interval */
	viscosity_measurement_stage.getChildByName("tube_solution2").visible = false;
	viscosity_measurement_stage.getChildByName("pipette_empty").visible = false;
	getChild("top_closer").visible = true;
	createjs.Tween.get(viscosity_measurement_stage.getChildByName('top_closer')) /** To move the pipette to the bottle */
	.to({x: 460, y: 100}, 2000).call(function(){at_end_suck_liquid(scope)});
}

/** Function to display the flow of liquid when sucking using sucker */
function at_end_suck_liquid(scope)
{
	/** increasing the liquid level in the right side of viscometer */
	var solution_increasing_tween = createjs.Tween.get(mask_tube_rect_first).to({
	y: 251.5}, 5000).call(function(){at_end_remove_closer(scope)});
	/** decreasing the liquid level in the left side of viscometer */		
	var solution_falling_tween = createjs.Tween.get(mask_tube_rect_second).to({
	y: 483}, 5000).call(function(){at_end_remove_closer(scope)});
}

/** Function to remove the sucker and displaying the start button */
function at_end_remove_closer(scope)
{
	getChild("top_closer").visible = false;
	/** Changing the text of "fill liquid" button */
	scope.fill_liquid = start_btn_var;
	start_flag = true;
	/** enabling the start button */
	scope.fill_liquid_disable = false;
	scope.$apply();
}

/** Function to change the polymer */	
function changePolymerFn(scope)
{
	selected_polymer_index = scope.Polymer_Mdl;
	/** changing the solvent list based on polymer selection */	
	if(selected_polymer_index == 1)
	{
		scope.solvent_Mdl = 3;
		scope.selectSolventArray = [{optionsSolvent: _('Acetone'),type: 3}, {optionsSolvent: _('Toluene'),type:4 }, {optionsSolvent: _('Benzene'),type: 5}];
		selected_solvent_index = 3;
	}
	else if(selected_polymer_index == 2)
	{
		scope.solvent_Mdl = 6;
		scope.selectSolventArray = [{optionsSolvent: _('Water'),type: 6}];
		selected_solvent_index = 6;
	}
	else if(selected_polymer_index == 3)
	{
		scope.solvent_Mdl = 7;
		scope.selectSolventArray = [{optionsSolvent: _('Toluene'),type: 7}, {optionsSolvent: _('Benzene'),type: 8}];
		selected_solvent_index = 7;
	}
	else{
		scope.solvent_Mdl = 0;
		scope.selectSolventArray = [{optionsSolvent: _('Acetonitrile'),type: 0}, {optionsSolvent: _('Acetone'),type: 1}, {optionsSolvent: _('Benzene'),type: 2}];
	}
}

/** Function to change the solvent */	
function changeSolventFn(scope)
{
	selected_solvent_index = scope.solvent_Mdl;
}

/** Function to start experiment, calculate concentration, retrieving time 
from the excel and moving the solution to reach the point within the delay time */
function startExperiment(scope) {
	/** disabling the start button after starting the experiment */
	scope.fill_liquid_disable = true;
	/** To check whether the user selected the 'polymer solvent system' and retrieving time from excel */ 
	if(selected_system_index == 0)
	{
		var concentration=((scope.conc_value*100)/2)-1;
		time = solvant[selected_solvent_index].getElementsByTagName("time")[concentration].childNodes[0].nodeValue;
	}
	/** calculating the time of solvent system */
	else
	{
		time  = sample[selected_solvent_index].getElementsByTagName("time")[0].childNodes[0].nodeValue;
	}
	/** calculating the delay time of solution to reach the level  */
	delay_time = 	time * 1000;
	/** starting the stop watch */	
	resetWatch();
	stop_watch_timer = setInterval(expWatch,0.5);	
	pause_flag = false;
	/** increasing the liquid level in the left side of viscometer */
	var soln_falling_tween_second = createjs.Tween.get(mask_tube_rect_second).to({
    y: 454}, delay_time) 
	/** decreasing the liquid level in the right side of viscometer*/
	var soln_falling_tween_first = createjs.Tween.get(mask_tube_rect_first).to({
	y: 342}, delay_time)
}

/** Function for running the stopwatch in a timer */
function expWatch() {
    if ( !pause_flag ) {
        showWatch(viscosity_measurement_stage);
    }
}

/** Reset the experiment in the reset button event */
function resetFn(scope) {
	createjs.Tween.removeAllTweens();
	mask_tube_rect_first.y = 608;
	mask_tube_rect_second.y = 608;
	pipette_solution_rect.y = 0;
	soln_pouring_rect.y = -300;
	getChild("pipette_still").y = 20;
	getChild("top_closer").y = -120;
	viscosity_measurement_stage.getChildByName("tube_solution2").visible = false;
	viscosity_measurement_stage.getChildByName("tube_solution1").visible = false;
	viscosity_measurement_stage.getChildByName("tube_solution").visible = false; 
	clearInterval(animation_timer);
	scope.fill_liquid_disable = false;
	scope.fill_liquid = _("Fill liquid");
	start_flag = false;
	clearInterval(stop_watch_timer);
	pause_flag = true;
	pauseWatch();
	initializeText("00","00","00","000",viscosity_measurement_stage); 
	resetWatch();
	viscosity_measurement_stage.update();	
	scope.showLabels = false;
	initialisationOfVariables(scope);
	initialisationOfImages();
}

/** Function to return child element of stage */
function getChild(child_name) {
    return viscosity_measurement_stage.getChildByName(child_name);
}