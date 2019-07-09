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
			
			// initialize charts
			
			// temperature
			var temperature_chart = $('#temperature-chart');
			
			if (temperature_chart.length>0) {
				new Chart(temperature_chart, {
					type: 'line',
					data: {
						labels: ["Jul 3, 2019 (Wed)", "Jul 4, 2019 (Thu)", "Jul 5, 2019 (Fri)", "Jul 6, 2019 (Sat)", "Jul 7, 2019 (Sun)", "Jul 8, 2019 (Mon)", "Jul 9, 2019 (Tue)"],
						datasets: [{
							label: 'Users',
							data: [10,20,30,40,50,50,60],
							backgroundColor: 'rgba(156,204,101,.5)',
							borderColor: '#9CCC65',
							borderWidth: 1
						}]
					},
					options: {
						legend: {
							display: false
						},
						scales: {
							yAxes: [{
								ticks: {
									beginAtZero: true
								}
							}]
						}
					}
				});				
			};

			var humidity_chart = $('#humidity-chart');
			
			if (humidity_chart.length>0) {
				new Chart(humidity_chart, {
					type: 'line',
					data: {
						labels: ["Jul 3, 2019 (Wed)", "Jul 4, 2019 (Thu)", "Jul 5, 2019 (Fri)", "Jul 6, 2019 (Sat)", "Jul 7, 2019 (Sun)", "Jul 8, 2019 (Mon)", "Jul 9, 2019 (Tue)"],
						datasets: [{
							label: 'Users',
							data: [10,20,30,40,50,50,60],
							backgroundColor: 'rgba(255,202,40,0.5)',
							borderColor: '#FFCA28',
							borderWidth: 1
						}]
					},
					options: {
						legend: {
							display: false
						},
						scales: {
							yAxes: [{
								ticks: {
									beginAtZero: true
								}
							}]
						}
					}
				});				
			};

			var soil_chart = $('#soil-chart');
			
			if (soil_chart.length>0) {
				new Chart(soil_chart, {
					type: 'line',
					data: {
						labels: ["Jul 3, 2019 (Wed)", "Jul 4, 2019 (Thu)", "Jul 5, 2019 (Fri)", "Jul 6, 2019 (Sat)", "Jul 7, 2019 (Sun)", "Jul 8, 2019 (Mon)", "Jul 9, 2019 (Tue)"],
						datasets: [{
							label: 'Users',
							data: [10,20,30,40,50,50,60],
							backgroundColor: 'rgba(38,198,218,0.5)',
							borderColor: '#26c6da',
							borderWidth: 1
						}]
					},
					options: {
						legend: {
							display: false
						},
						scales: {
							yAxes: [{
								ticks: {
									beginAtZero: true
								}
							}]
						}
					}
				});				
			};

			var moisture_chart = $('#moisture-chart');
			
			if (moisture_chart.length>0) {
				new Chart(moisture_chart, {
					type: 'line',
					data: {
						labels: ["Jul 3, 2019 (Wed)", "Jul 4, 2019 (Thu)", "Jul 5, 2019 (Fri)", "Jul 6, 2019 (Sat)", "Jul 7, 2019 (Sun)", "Jul 8, 2019 (Mon)", "Jul 9, 2019 (Tue)"],
						datasets: [{
							label: 'Users',
							data: [10,20,30,40,50,50,60],
							backgroundColor: 'rgba(66, 165, 245, 0.5)',
							borderColor: '#2196F3',
							borderWidth: 1
						}]
					},
					options: {
						legend: {
							display: false
						},
						scales: {
							yAxes: [{
								ticks: {
									beginAtZero: true
								}
							}]
						}
					}
				});				
			};

			var rain_chart = $('#rain-chart');
			
			if (rain_chart.length>0) {
				new Chart(rain_chart, {
					type: 'line',
					data: {
						labels: ["Jul 3, 2019 (Wed)", "Jul 4, 2019 (Thu)", "Jul 5, 2019 (Fri)", "Jul 6, 2019 (Sat)", "Jul 7, 2019 (Sun)", "Jul 8, 2019 (Mon)", "Jul 9, 2019 (Tue)"],
						datasets: [{
							label: 'Users',
							data: [10,20,30,40,50,50,60],
							backgroundColor: 'rgba(232, 142, 89, 0.5)',
							borderColor: '#e88e59',
							borderWidth: 1
						}]
					},
					options: {
						legend: {
							display: false
						},
						scales: {
							yAxes: [{
								ticks: {
									beginAtZero: true
								}
							}]
						}
					}
				});				
			};
			
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
