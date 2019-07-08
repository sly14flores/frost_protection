angular.module('dashboard-module', ['ngSanitize','ui.bootstrap','bootstrap-modal','block-ui','anguFixedHeaderTable']).factory('dashboard', function($http,$timeout,$compile,$window,bootstrapModal,bui) {
	
	function dashboard() {
		
		var self = this;
		
		self.data = function(scope) {
		
			scope.farmers = [];
		
			mqtt_connect(scope);
			locations(scope);
			locations_select(scope);
			
			farmers(scope);
			
			scope.locations = [];
			
			scope.select = {};
			scope.select.location = {id: 1, location: "Location 1"};
			self.location_selected(scope);
		
		};

		function locations_select(scope) {
			
			$http({
				url: 'handlers/locations.php',
				method: 'GET',			
			}).then(function success(response) {
				
				scope.locations = angular.copy(response.data);
				
			}, function error(response) {
				
			});			
		};

		function farmers(scope) {
			
			$http({
				url: 'handlers/farmers.php',
				method: 'POST',				
			}).then(function success(response) {
				
				scope.farmers = response.data;
				
			}, function error(response) {
				
			});			
		};

		self.location_selected = function(scope) {
			
			$http({
				url: 'handlers/select-location.php',
				method: 'POST',
				data: {id: scope.select.location.id}
			}).then(function success(response) {
				

				
			}, function error(response) {
				
			});			
			
		};

		function locations(scope) {
			
			$http({
				url: 'handlers/dashboard.php',
				method: 'POST',				
			}).then(function success(response) {
				
				scope.data = response.data;
				
			}, function error(response) {
				
			});
			
		};

		 // mqtt
		function mqtt_connect(scope) {
			
			console.log("Connecting...");
			
			scope.mqtt_client = new Paho.MQTT.Client("broker.mqttdashboard.com", 8000, "");
			
			// set callback handlers
			scope.mqtt_client.onConnectionLost = onConnectionLost;
			scope.mqtt_client.onMessageArrived = onMessageArrived;

			// connect the client
			scope.mqtt_client.connect({onSuccess:onConnect, onFailure: onNotConnect});

			// called when the client connects
			function onConnect() {
			  // Once a connection has been made, make a subscription and send a message.
			  console.log("Mqtt client connected");
			  
			  scope.mqtt_client.subscribe("benguet/data");
			  scope.mqtt_client.subscribe("benguet/location/1");
			  scope.mqtt_client.subscribe("benguet/location/2");
			  scope.mqtt_client.subscribe("benguet/location/3");
			  scope.mqtt_client.subscribe("benguet/location/4");
			  scope.mqtt_client.subscribe("benguet/location/5");
			  scope.mqtt_client.subscribe("benguet/location/6");
				  
			};
			
			function onNotConnect(responseObject) {
				
				console.log("Mqtt client not connected.. Please try again");
				
			};

			// called when the client loses its connection
			function onConnectionLost(responseObject) {
				
				if (responseObject.errorCode !== 0) {
					
					console.log("onConnectionLost:"+responseObject.errorMessage);
					
				};
				
			};

			// called when a message arrives
			function onMessageArrived(message) {
				
				var payload = message.payloadString;
				var topic = message.destinationName;
				
				switch (topic) {
					
					case "benguet/data":

						console.log("Data received");
						log_location_values(payload);						
						
					break;        
					
				};
			  
			};

			function log_location_values(payload) {
				
				$http({
					url: 'handlers/location-values.php',
					method: 'POST',
					data: {data: payload}
				}).then(function success(response) {
					
					locations(scope);
					
				}, function error(response) {
					
					
					
				});
				
			};
			
		};		
		
		// self.textAdmin = function(scope) {
		// 	$.ajax({
		// 		url: 'https://www.itexmo.com/php_api/api.php',
		// 		type: 'POST',
		// 		data: {1:"09301598842",
		// 			   2:"1 Container Empty.",
		// 			   3:"TR-MCGLE598842_JIW1S"},
		// 		success: function(result){

		// 		}
		// 	});
		// }

		
		
	};
	
	return new dashboard();
	
});
