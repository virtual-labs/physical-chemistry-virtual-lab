(function(){
    angular
    .module('users',['FBAngular'])
    .controller('UserController', [
        '$mdSidenav', '$mdBottomSheet', '$log', '$q','$scope','$element','Fullscreen','$mdToast','$animate',
        UserController
    ]);
       
    /**
    * Main Controller for the Angular Material Starter App
    * @param $scope
    * @param $mdSidenav
    * @param avatarsService
    * @constructor
    */
    function UserController( $mdSidenav, $mdBottomSheet, $log, $q,$scope,$element,Fullscreen,$mdToast, $animate) {
        $scope.toastPosition = {
            bottom: true,
            top: false,
            left: true,
            right: false
        };
        $scope.toggleSidenav = function(ev) {
            $mdSidenav('right').toggle();
        };
        $scope.getToastPosition = function() {
            return Object.keys($scope.toastPosition)
            .filter(function(pos) { return $scope.toastPosition[pos]; })
            .join(' ');
        };
        $scope.showActionToast = function() {        
            var toast = $mdToast.simple()
            .content(helpArray[0])
            .action(helpArray[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
        
            var toast1 = $mdToast.simple()
            .content(helpArray[1])
            .action(helpArray[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
          
            var toast2 = $mdToast.simple()
            .content(helpArray[2])
            .action(helpArray[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
            
            var toast3 = $mdToast.simple()
            .content(helpArray[3])
            .action(helpArray[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
			
			var toast4 = $mdToast.simple()
            .content(helpArray[4])
            .action(helpArray[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
			
			var toast5 = $mdToast.simple()
            .content(helpArray[5])
            .action(helpArray[7])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
            
			var toast6 = $mdToast.simple()
            .content(helpArray[6])
            .action(helpArray[8])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());      

            $mdToast.show(toast).then(function() {
                $mdToast.show(toast1).then(function() {
                    $mdToast.show(toast2).then(function() {
                        $mdToast.show(toast3).then(function() {
							$mdToast.show(toast4).then(function() {
								$mdToast.show(toast5).then(function() {
									$mdToast.show(toast6).then(function() {
									});
								});
							}); 
                        });
                    });
                });
            });     
        };
  
        var self = this;
        self.selected     = null;
        self.users        = [ ];
        self.toggleList   = toggleUsersList;    
		$scope.conc_ctrls_show = true; /** It show the 'concentration' slider */
		$scope.polymer_ctrls_show = true;  /** It show the 'polymer' drop down */
		$scope.polymer_ctrls_disable = false; /** It hide the disable property of 'polymer' drop down */
		$scope.solvent_ctrls_disable = false; /** It hide the the disable property of 'solvent' drop down */
		$scope.time_flow_ctrls_disable = false; /** It hide the the disable property of 'time of flow' drop down */
		$scope.conc_ctrls_disable = false; /** It hide the the disable property of 'concentration' slider */
		$scope.conc_value=0.02; /** Initial value of concentration slider */
        $scope.goFullscreen = function () {
            /** Full screen */
            if (Fullscreen.isEnabled())
                Fullscreen.cancel();
            else
                Fullscreen.all();
            /** Set Full screen to a specific element (bad practice) */
            /** Full screen.enable( document.getElementById('img') ) */
        };
 
        /** Click event function of the Reset button */
        $scope.resetBtn = function() {
            resetFn($scope); /** Function defined in experiment.js file */
        };
		
		/** Click event function of the fill liquid button */
		$scope.fillLiquid = function() {
			if(start_flag)
			{
				startExperiment($scope);
			}
			else{
				fillLiquidFn($scope);
			}
        };
		
		/** Change event function of polymer drop down */
        $scope.changePolymer =function(){
                changePolymerFn($scope);
        };
		
		/** Change event function of solvent drop down */
        $scope.changeSolvent =function(){
                changeSolventFn($scope);
        } 
		/** Change event function of time of flow drop down */
		$scope.setSystem =function(){
                setSystemFn($scope);
        }
       /*  $scope.changeSample =function(){
                changeSampleFn($scope);
        } */
		/** Change event function of the show label*/
        $scope.displayLabel = function() {
            showLabelsFn($scope); /** Function defined in experiment.js file */
        }
        /**
        * First hide the bottom sheet IF visible, then
        * hide or Show the 'left' sideNav area
        */
        function toggleUsersList() {
            $mdSidenav('right').toggle();
        }
    }
})();