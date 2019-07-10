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
			
			scope.gauges = {};
			scope.gauges.data = {};			
			initGauges(scope);			
			
			self.location_selected(scope,1);
		
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

		self.location_selected = function(scope,id) {
			
			$http({
				url: 'handlers/select-location.php',
				method: 'POST',
				data: {id: id}
			}).then(function success(response) {
				
				initCharts(response.data.charts);
				
			}, function error(response) {
				
			});			
			
			function initCharts(charts) {
				
				// initialize charts
				
				// temperature
				var temperature_chart = $('#temperature-chart');
				
				if (temperature_chart.length>0) {
					new Chart(temperature_chart, {
						type: 'line',
						data: {
							labels: charts.temperature.dates,
							datasets: [{
								label: 'Temperature',
								data: charts.temperature.data,
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
							labels: charts.humidity.dates,
							datasets: [{
								label: 'Humidity',
								data: charts.humidity.data,
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
							labels: charts.soil.dates,
							datasets: [{
								label: 'Soil Moisture',
								data: charts.soil.data,
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
							labels: charts.dew.dates,
							datasets: [{
								label: 'Dew Moisture',
								data: charts.dew.data,
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
							labels: charts.rain.dates,
							datasets: [{
								label: 'Rain',
								data: charts.rain.data,
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
				
			};
			
			update_gauges(scope,scope.select.location.id);
			
		};

		function initGauges(scope) {

			// temperature				
			var opt_temperature = {
			  angle: 0.08, // The span of the gauge arc
			  lineWidth: 0.44, // The line thickness
			  radiusScale: 1, // Relative radius
			  pointer: {
				length: 0.6, // // Relative to gauge radius
				strokeWidth: 0.035, // The thickness
				color: '#000000' // Fill color
			  },
			  staticZones: [
				 {strokeStyle: "#F03E3E", min: 1, max: 7},
				 {strokeStyle: "#FFDD00", min: 7, max: 9},
				 {strokeStyle: "#30B32D", min: 9, max: 20}, 
			  ],
			  staticLabels: {
				font: "10px sans-serif",
				labels: [1, 7, 9, 20],
				fractionDigits: 0
			  },			  
			  limitMax: false,     // If false, max value increases automatically if value > maxValue
			  limitMin: false,     // If true, the min value of the gauge will be fixed
			  colorStart: '#6FADCF',   // Colors
			  colorStop: '#8FC0DA',    // just experiment with them
			  strokeColor: '#E0E0E0',  // to see which ones work best for you
			  generateGradient: true,
			  highDpiSupport: true,     // High resolution support
			  
			};

			var opt_moisture = {
			  angle: 0.08, // The span of the gauge arc
			  lineWidth: 0.44, // The line thickness
			  radiusScale: 1, // Relative radius
			  pointer: {
				length: 0.6, // // Relative to gauge radius
				strokeWidth: 0.035, // The thickness
				color: '#000000' // Fill color
			  },
			  staticZones: [
				 {strokeStyle: "#30B32D", min: 1, max:80},
				 {strokeStyle: "#FFDD00", min: 80, max: 90},
				 {strokeStyle: "#F03E3E", min: 90, max: 100}, 
			  ],
			  staticLabels: {
				font: "10px sans-serif",
				labels: [1,80,90, 100],
				fractionDigits: 0.5
			  },			  
			  limitMax: false,     // If false, max value increases automatically if value > maxValue
			  limitMin: false,     // If true, the min value of the gauge will be fixed
			  colorStart: '#6FADCF',   // Colors
			  colorStop: '#8FC0DA',    // just experiment with them
			  strokeColor: '#E0E0E0',  // to see which ones work best for you
			  generateGradient: true,
			  highDpiSupport: true,     // High resolution support
			  
			};

			var opt_rain = {
			  angle: 0.08, // The span of the gauge arc
			  lineWidth: 0.44, // The line thickness
			  radiusScale: 1, // Relative radius
			  pointer: {
				length: 0.6, // // Relative to gauge radius
				strokeWidth: 0.035, // The thickness
				color: '#000000' // Fill color
			  },
			  staticZones: [
				 {strokeStyle: "#F03E3E", min: 1, max: 30},
				 {strokeStyle: "#FFDD00", min: 30, max: 50},
				 {strokeStyle: "#30B32D", min: 50, max: 100}, 
			  ],
			  staticLabels: {
				font: "10px sans-serif",
				labels: [1, 30, 50, 100],
				fractionDigits: 0
			  },

			  limitMax: false,     // If false, max value increases automatically if value > maxValue
			  limitMin: false,     // If true, the min value of the gauge will be fixed
			  colorStart: '#6FADCF',   // Colors
			  colorStop: '#8FC0DA',    // just experiment with them
			  strokeColor: '#E0E0E0',  // to see which ones work best for you
			  generateGradient: true,
			  highDpiSupport: true,     // High resolution support
			  
			};

			var gauge_temperature = document.getElementById('temperature-gauge'); // your canvas element
			scope.gauges.temperature = new Gauge(gauge_temperature).setOptions(opt_temperature); // create sexy gauge!
			scope.gauges.temperature.maxValue = 20; // set max gauge value
			scope.gauges.temperature.setMinValue(0);  // Prefer setter over gauge.minValue = 0
			scope.gauges.temperature.animationSpeed = 32; // set animation speed (32 is default value)
			// end gauge

			var gauge_humidity = document.getElementById('humidity-gauge'); // your canvas element
			scope.gauges.humidity = new Gauge(gauge_humidity).setOptions(opt_moisture); // create sexy gauge!
			scope.gauges.humidity.maxValue = 100; // set max gauge value
			scope.gauges.humidity.setMinValue(0);  // Prefer setter over gauge.minValue = 0
			scope.gauges.humidity.animationSpeed = 32; // set animation speed (32 is default value)
			// end gauge

			var gauge_soil = document.getElementById('soil-gauge'); // your canvas element
			scope.gauges.soil = new Gauge(gauge_soil).setOptions(opt_moisture); // create sexy gauge!
			scope.gauges.soil.maxValue = 100; // set max gauge value
			scope.gauges.soil.setMinValue(0);  // Prefer setter over gauge.minValue = 0
			scope.gauges.soil.animationSpeed = 32; // set animation speed (32 is default value)
			// end gauge

			var gauge_moisture = document.getElementById('moisture-gauge'); // your canvas element
			scope.gauges.moisture = new Gauge(gauge_moisture).setOptions(opt_moisture); // create sexy gauge!
			scope.gauges.moisture.maxValue = 100; // set max gauge value
			scope.gauges.moisture.setMinValue(0);  // Prefer setter over gauge.minValue = 0
			scope.gauges.moisture.animationSpeed = 32; // set animation speed (32 is default value)
			// end gauge

			var gauge_rain = document.getElementById('rain-gauge'); // your canvas element
			scope.gauges.rain = new Gauge(gauge_rain).setOptions(opt_rain); // create sexy gauge!
			scope.gauges.rain.maxValue = 100; // set max gauge value
			scope.gauges.rain.setMinValue(0);  // Prefer setter over gauge.minValue = 0
			scope.gauges.rain.animationSpeed = 32; // set animation speed (32 is default value)
			// end gauge
			
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

						// update gauges
						
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
					update_gauges(scope,scope.select.location.id);
					
				}, function error(response) {
					
					
					
				});
				
			};			
			
		};		
		
		function update_gauges(scope,id) {
			
			$http({
				url: 'handlers/gauges.php',
				method: 'POST',
				data: {id: id}
			}).then(function success(response) {
				
				scope.gauges.data = response.data;
				scope.gauges.temperature.set(scope.gauges.data.temperature); // set actual value	
				scope.gauges.humidity.set(scope.gauges.data.humidity); // set actual value	
				scope.gauges.soil.set(scope.gauges.data.soil); // set actual value	
				scope.gauges.moisture.set(scope.gauges.data.moisture); // set actual value	
				scope.gauges.rain.set(scope.gauges.data.rain); // set actual value	
				
			}, function error(response) {
				
				
				
			});				
			
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
