angular.module('sms-module',[]).factory('sms', function($http) {
	
	function sms() {
		
		var self = this;

		var timestamp = Number(new Date());
		
		const date = new Date(timestamp).toDateString();

		const time = new Date(timestamp).toLocaleTimeString();

		self.init = function(scope) {
			
			scope.notified = [
				{ // location 1
					near_critical: {
						temperature: false, humidity: false, soil: false, dew: false, rain: false
					},
					critical: {
						temperature: false, humidity: false, soil: false, dew: false, rain: false
					}
				},
				{ // location 2
					near_critical: {
						temperature: false, humidity: false, soil: false, dew: false, rain: false
					},
					critical: {
						temperature: false, humidity: false, soil: false, dew: false, rain: false
					}
				},
				{ // location 3
					near_critical: {
						temperature: false, humidity: false, soil: false, dew: false, rain: false
					},
					critical: {
						temperature: false, humidity: false, soil: false, dew: false, rain: false
					}
				},				
			];
			
			scope.sms = {};
			scope.sms.location = {1:0,2:1,3:2};
			
			mqtt_connect(scope);
			
		};
		
		function mqtt_connect(scope) {
			
			console.log("SMS: Connecting...");
			
			self.mqtt_client = new Paho.MQTT.Client("broker.mqttdashboard.com", 8000, "");
			
			// set callback handlers
			self.mqtt_client.onConnectionLost = onConnectionLost;
			self.mqtt_client.onMessageArrived = onMessageArrived;

			// connect the client
			self.mqtt_client.connect({onSuccess:onConnect, onFailure: onNotConnect});

			// called when the client connects
			function onConnect() {
			  // Once a connection has been made, make a subscription and send a message.
			  console.log("SMS: Mqtt client connected");
			  
			  self.mqtt_client.subscribe("benguet/data");
			  self.mqtt_client.subscribe("benguet/sms/test");
				  
			};
			
			function onNotConnect(responseObject) {
				
				console.log("SMS: Mqtt client not connected.. Please try again");
				
			};

			// called when the client loses its connection
			function onConnectionLost(responseObject) {
				
				if (responseObject.errorCode !== 0) {
					
					console.log("SMS: onConnectionLost:"+responseObject.errorMessage);
					
				};
				
			};

			// called when a message arrives
			function onMessageArrived(message) {
				
				var payload = message.payloadString;
				var topic = message.destinationName;
				
				switch (topic) {
					
					case "benguet/data":

						console.log("SMS: Data received");
						smsNotifications(scope,payload);
						
					break;

					case "benguet/sms/test":
					
						console.log(payload);
						
						var sms_data = payload.split("-");
						console.log(sms_data);
						
						var params = {
							un: "mcglenntangalin07",
							pwd: "returnednaako12314",
							dstno: sms_data[0],
							msg: sms_data[1],
							type: 1,
							agreedterm: "YES"
						};
						
						$.ajax({
							url: 'https://www.isms.com.my/isms_send.php',
							type: 'GET',
							data: params,					
							success: function(result,status,xhr) {

								// console.log(result);
							
							},
							error: function(xhr,status,error) {

								// console.log(status);
								
							}
						});				
					
					break;
					
				};
			  
			};

			function smsNotifications(scope,payload) {				
				
				// console.log(payload);
				
				var locations = payload.split("/");
				
				// var cp_no = "639208946918";	

				var cp_no = "639177790394";			
				
				if (locations[0]) { // location 1
					
					console.log(locations[0]);					
					
					var	one = locations[0].split("_");
					var location_one_id = parseInt(one[0].substring(1));
					
					console.log(location_one_id);
					
					// temperature
					// reset notified if above near critical/critical
					if ((parseFloat(one[1])>7)&&(parseFloat(one[1])<=9)) scope.notified[scope.sms.location[location_one_id]].critical.temperature = false;		
					if (parseFloat(one[1])>9) scope.notified[scope.sms.location[location_one_id]].near_critical.temperature = false;
					
					// if near critical
					if ((parseFloat(one[1])<=9)&&(parseFloat(one[1])>7)) {

						if (!scope.notified[scope.sms.location[location_one_id]].near_critical.temperature) {
							
							console.log("Notified")
							
							sms(cp_no,"Temperature in "+scope.locations[scope.sms.location[location_one_id]].location+" is at near critical level. "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_one_id]].near_critical.temperature = true;

						};

					};
						
					// if critical
					if (parseFloat(one[1])<=7) {
						
						if (!scope.notified[scope.sms.location[location_one_id]].critical.temperature) {
							
							sms(cp_no,"Temperature in "+scope.locations[scope.sms.location[location_one_id]].location+" is at critical level. "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_one_id]].critical.temperature = true;
							
						};
							
					};
					
					// humidity
					if ((parseFloat(one[2])<90) && (parseFloat(one[2])>=80)) scope.notified[scope.sms.location[location_one_id]].critical.humidity = false;		
					if (parseFloat(one[2])<80) scope.notified[scope.sms.location[location_one_id]].near_critical.humidity = false;
					
					// if near critical
					if ((parseFloat(one[2])>=80)&&(parseFloat(one[2])<90)) {

						if (!scope.notified[scope.sms.location[location_one_id]].near_critical.humidity) {
							
							console.log("Notified")
							
							sms(cp_no,"Humidity in "+scope.locations[scope.sms.location[location_one_id]].location+" is at near critical level. "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_one_id]].near_critical.humidity = true;

						};

					};
						
					// if critical
					if (parseFloat(one[2])>=90) {
						
						if (!scope.notified[scope.sms.location[location_one_id]].critical.humidity) {
							
							sms(cp_no,"Humidity in "+scope.locations[scope.sms.location[location_one_id]].location+" is at critical level. "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_one_id]].critical.humidity = true;
							
						};
							
					};					
					
					// soil
					if ((parseFloat(one[3])<90) && (parseFloat(one[3])>=80)) scope.notified[scope.sms.location[location_one_id]].critical.soil = false;		
					if (parseFloat(one[3])<80) scope.notified[scope.sms.location[location_one_id]].near_critical.soil = false;
					
					// if near critical
					if ((parseFloat(one[3])>=80)&&(parseFloat(one[3])<90)) {

						if (!scope.notified[scope.sms.location[location_one_id]].near_critical.soil) {
							
							console.log("Notified")
							
							sms(cp_no,"Soil Moisture in "+scope.locations[scope.sms.location[location_one_id]].location+" is at near critical level. "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_one_id]].near_critical.soil = true;

						};

					};
						
					// if critical
					if (parseFloat(one[3])>=90) {
						
						if (!scope.notified[scope.sms.location[location_one_id]].critical.soil) {
							
							sms(cp_no,"Soil Moisture in "+scope.locations[scope.sms.location[location_one_id]].location+" is at critical level. "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_one_id]].critical.soil = true;
							
						};
							
					};		
					
					// dew
					if ((parseFloat(one[4])<90) && (parseFloat(one[4])>=80)) scope.notified[scope.sms.location[location_one_id]].critical.dew = false;		
					if (parseFloat(one[4])<80) scope.notified[scope.sms.location[location_one_id]].near_critical.dew = false;
					
					// if near critical
					if ((parseFloat(one[4])>=80)&&(parseFloat(one[3])<90)) {

						if (!scope.notified[scope.sms.location[location_one_id]].near_critical.dew) {
							
							console.log("Notified")
							
							sms(cp_no,"Dew Moisture in "+scope.locations[scope.sms.location[location_one_id]].location+" is at near critical level. "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_one_id]].near_critical.dew = true;

						};

					};
						
					// if critical
					if (parseFloat(one[4])>=90) {
						
						if (!scope.notified[scope.sms.location[location_one_id]].critical.dew) {
							
							sms(cp_no,"Dew Moisture in "+scope.locations[scope.sms.location[location_one_id]].location+" is at critical level. "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_one_id]].critical.dew = true;
							
						};
							
					};		
					
					// rain

					if ((parseFloat(one[5])<500) && (parseFloat(one[5])>=300)) scope.notified[scope.sms.location[location_one_id]].near_critical.rain = false;		
					if (parseFloat(one[5])<300) scope.notified[scope.sms.location[location_one_id]].critical.rain = false;
					
					// if near critical
					if ((parseFloat(one[5])>=300)&&(parseFloat(one[5])<500)) {

						if (!scope.notified[scope.sms.location[location_one_id]].near_critical.rain) {
							
							console.log("Notified")
							
							sms(cp_no,"Moderate rain is happening in "+scope.locations[scope.sms.location[location_one_id]].location+". "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_one_id]].near_critical.rain = true;

						};

					};
						
					// if critical
					if (parseFloat(one[5])<300) {
						
						if (!scope.notified[scope.sms.location[location_one_id]].critical.rain) {
							
							sms(cp_no,"Heavy rain is happening in "+scope.locations[scope.sms.location[location_one_id]].location+". "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_one_id]].critical.rain = true;
							
						};
							
					};		
				
				};
				
				if (locations[1]) { // location 2

					console.log(locations[1]);
					
					var	two = locations[1].split("_");
					var location_two_id = parseInt(two[0].substring(1));
					
					console.log(location_two_id);

					// temperature
					// reset notified if above near critical/critical
					if ((parseFloat(two[1])>7)&&(parseFloat(two[1])<=9)) scope.notified[scope.sms.location[location_two_id]].critical.temperature = false;		
					if (parseFloat(two[1])>9) scope.notified[scope.sms.location[location_two_id]].near_critical.temperature = false;
					
					// if near critical
					if ((parseFloat(two[1])<=9)&&(parseFloat(two[1])>7)) {

						if (!scope.notified[scope.sms.location[location_two_id]].near_critical.temperature) {
							
							console.log("Notified")
							
							sms(cp_no,"Temperature in "+scope.locations[scope.sms.location[location_two_id]].location+" is at near critical level. "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_two_id]].near_critical.temperature = true;

						};

					};
						
					// if critical
					if (parseFloat(two[1])<=7) {
						
						if (!scope.notified[scope.sms.location[location_two_id]].critical.temperature) {
							
							sms(cp_no,"Temperature in "+scope.locations[scope.sms.location[location_two_id]].location+" is at critical level. "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_two_id]].critical.temperature = true;
							
						};
							
					};
					
					// humidity
					if ((parseFloat(two[2])<90) && (parseFloat(two[2])>=80)) scope.notified[scope.sms.location[location_two_id]].critical.humidity = false;		
					if (parseFloat(two[2])<80) scope.notified[scope.sms.location[location_two_id]].near_critical.humidity = false;
					
					// if near critical
					if ((parseFloat(two[2])>=80)&&(parseFloat(two[2])<90)) {

						if (!scope.notified[scope.sms.location[location_two_id]].near_critical.humidity) {
							
							console.log("Notified")
							
							sms(cp_no,"Humidity in "+scope.locations[scope.sms.location[location_two_id]].location+" is at near critical level. "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_two_id]].near_critical.humidity = true;

						};

					};
						
					// if critical
					if (parseFloat(two[2])>90) {
						
						if (!scope.notified[scope.sms.location[location_two_id]].critical.humidity) {
							
							sms(cp_no,"Humidity in "+scope.locations[scope.sms.location[location_two_id]].location+" is at critical level. "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_two_id]].critical.humidity = true;
							
						};
							
					};					
					
					// soil
					if ((parseFloat(two[3])<90) && (parseFloat(two[3])>=80)) scope.notified[scope.sms.location[location_two_id]].critical.soil = false;		
					if (parseFloat(two[3])<80) scope.notified[scope.sms.location[location_two_id]].near_critical.soil = false;
					
					// if near critical
					if ((parseFloat(two[3])>=80)&&(parseFloat(two[3])<90)) {

						if (!scope.notified[scope.sms.location[location_two_id]].near_critical.soil) {
							
							console.log("Notified")
							
							sms(cp_no,"Soil Moisture in "+scope.locations[scope.sms.location[location_two_id]].location+" is at near critical level. "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_two_id]].near_critical.soil = true;

						};

					};
						
					// if critical
					if (parseFloat(two[3])>=90) {
						
						if (!scope.notified[scope.sms.location[location_two_id]].critical.soil) {
							
							sms(cp_no,"Soil Moisture in "+scope.locations[scope.sms.location[location_two_id]].location+" is at critical level. "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_two_id]].critical.soil = true;
							
						};
							
					};		
					
					// dew
					if ((parseFloat(two[4])<90) && (parseFloat(two[4])>=80)) scope.notified[scope.sms.location[location_two_id]].critical.dew = false;		
					if (parseFloat(two[4])<80) scope.notified[scope.sms.location[location_two_id]].near_critical.dew = false;
					
					// if near critical
					if ((parseFloat(two[4])>=80)&&(parseFloat(two[3])<90)) {

						if (!scope.notified[scope.sms.location[location_two_id]].near_critical.dew) {
							
							console.log("Notified")
							
							sms(cp_no,"Dew Moisture in "+scope.locations[scope.sms.location[location_two_id]].location+" is at near critical level. "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_two_id]].near_critical.dew = true;

						};

					};
						
					// if critical
					if (parseFloat(two[4])>=90) {
						
						if (!scope.notified[scope.sms.location[location_two_id]].critical.dew) {
							
							sms(cp_no,"Dew Moisture in "+scope.locations[scope.sms.location[location_two_id]].location+" is at critical level. "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_two_id]].critical.dew = true;
							
						};
							
					};	
					
					// rain	
					if ((parseFloat(two[5])<500) && (parseFloat(two[5])>=300)) scope.notified[scope.sms.location[location_two_id]].near_critical.rain = false;		
					if (parseFloat(two[5])<300) scope.notified[scope.sms.location[location_two_id]].critical.rain = false;
					
					// if near critical
					if ((parseFloat(two[5])>=300)&&(parseFloat(two[5])<500)) {

						if (!scope.notified[scope.sms.location[location_two_id]].near_critical.rain) {
							
							console.log("Notified")
							
							sms(cp_no,"Moderate rain is happening in "+scope.locations[scope.sms.location[location_two_id]].location+". "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_two_id]].near_critical.rain = true;

						};

					};
						
					// if critical
					if (parseFloat(two[5])<300) {
						
						if (!scope.notified[scope.sms.location[location_two_id]].critical.rain) {
							
							sms(cp_no,"Heavy rain is happening in "+scope.locations[scope.sms.location[location_two_id]].location+". "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_two_id]].critical.rain = true;
							
						};
							
					};						
					
				};
				
				if (locations[2]) { // location 3
					
					console.log(locations[2]);

					var	three = locations[2].split("_");
					var location_three_id = parseInt(three[0].substring(1));
					
					console.log(location_three_id);						
					
					// temperature
					// reset notified if above near critical/critical
					if ((parseFloat(three[1])>7)&&(parseFloat(three[1])<=9)) scope.notified[scope.sms.location[location_three_id]].critical.temperature = false;		
					if (parseFloat(three[1])>9) scope.notified[scope.sms.location[location_three_id]].near_critical.temperature = false;
					
					// if near critical
					if ((parseFloat(three[1])<=9)&&(parseFloat(three[1])>7)) {

						if (!scope.notified[scope.sms.location[location_three_id]].near_critical.temperature) {
							
							console.log("Notified")
							
							sms(cp_no,"Temperature in "+scope.locations[scope.sms.location[location_three_id]].location+" is at near critical level. "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_three_id]].near_critical.temperature = true;

						};

					};
						
					// if critical
					if (parseFloat(three[1])<=7) {
						
						if (!scope.notified[scope.sms.location[location_three_id]].critical.temperature) {
							
							sms(cp_no,"Temperature in "+scope.locations[scope.sms.location[location_three_id]].location+" is at critical level. "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_three_id]].critical.temperature = true;
							
						};
							
					};
					
					// humidity
					if ((parseFloat(three[2])<90) && (parseFloat(three[2])>=80)) scope.notified[scope.sms.location[location_three_id]].critical.humidity = false;		
					if (parseFloat(three[2])<80) scope.notified[scope.sms.location[location_three_id]].near_critical.humidity = false;
					
					// if near critical
					if ((parseFloat(three[2])>=80)&&(parseFloat(three[2])<90)) {

						if (!scope.notified[scope.sms.location[location_three_id]].near_critical.humidity) {
							
							console.log("Notified")
							
							sms(cp_no,"Humidity in "+scope.locations[scope.sms.location[location_three_id]].location+" is at near critical level. "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_three_id]].near_critical.humidity = true;

						};

					};
						
					// if critical
					if (parseFloat(three[2])>90) {
						
						if (!scope.notified[scope.sms.location[location_three_id]].critical.humidity) {
							
							sms(cp_no,"Humidity in "+scope.locations[scope.sms.location[location_three_id]].location+" is at critical level. "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_three_id]].critical.humidity = true;
							
						};
							
					};					
					
					// soil
					if ((parseFloat(three[3])<90) && (parseFloat(three[3])>=80)) scope.notified[scope.sms.location[location_three_id]].critical.soil = false;		
					if (parseFloat(three[3])<80) scope.notified[scope.sms.location[location_three_id]].near_critical.soil = false;
					
					// if near critical
					if ((parseFloat(three[3])>=80)&&(parseFloat(three[3])<90)) {

						if (!scope.notified[scope.sms.location[location_three_id]].near_critical.soil) {
							
							console.log("Notified")
							
							sms(cp_no,"Soil Moisture in "+scope.locations[scope.sms.location[location_three_id]].location+" is at near critical level. "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_three_id]].near_critical.soil = true;

						};

					};
						
					// if critical
					if (parseFloat(three[3])>=90) {
						
						if (!scope.notified[scope.sms.location[location_three_id]].critical.soil) {
							
							sms(cp_no,"Soil Moisture in "+scope.locations[scope.sms.location[location_three_id]].location+" is at critical level. "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_three_id]].critical.soil = true;
							
						};
							
					};		
					
					// dew
					if ((parseFloat(three[4])<90) && (parseFloat(three[4])>=80)) scope.notified[scope.sms.location[location_three_id]].critical.dew = false;		
					if (parseFloat(three[4])<80) scope.notified[scope.sms.location[location_three_id]].near_critical.dew = false;
					
					// if near critical
					if ((parseFloat(three[4])>=80)&&(parseFloat(three[3])<90)) {

						if (!scope.notified[scope.sms.location[location_three_id]].near_critical.dew) {
							
							console.log("Notified")
							
							sms(cp_no,"Dew Moisture in "+scope.locations[scope.sms.location[location_three_id]].location+" is at near critical level. "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_three_id]].near_critical.dew = true;

						};

					};
						
					// if critical
					if (parseFloat(three[4])>=90) {
						
						if (!scope.notified[scope.sms.location[location_three_id]].critical.dew) {
							
							sms(cp_no,"Dew Moisture in "+scope.locations[scope.sms.location[location_three_id]].location+" is at critical level. "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_three_id]].critical.dew = true;
							
						};
							
					};	
					
					// rain						
					
					if ((parseFloat(three[5])<500) && (parseFloat(three[5])>=300)) scope.notified[scope.sms.location[location_three_id]].near_critical.rain = false;		
					if (parseFloat(three[5])<300) scope.notified[scope.sms.location[location_three_id]].critical.rain = false;
					
					// if near critical
					if ((parseFloat(three[5])>=300)&&(parseFloat(three[5])<500)) {

						if (!scope.notified[scope.sms.location[location_three_id]].near_critical.rain) {
							
							console.log("Notified")
							
							sms(cp_no,"Moderate rain is happening in "+scope.locations[scope.sms.location[location_three_id]].location+". "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_three_id]].near_critical.rain = true;

						};

					};
						
					// if critical
					if (parseFloat(three[5])<300) {
						
						if (!scope.notified[scope.sms.location[location_three_id]].critical.rain) {
							
							sms(cp_no,"Heavy rain is happening in "+scope.locations[scope.sms.location[location_three_id]].location+". "+time+", "+date);
							// mark notified
							scope.notified[scope.sms.location[location_three_id]].critical.rain = true;
							
						};
							
					};		
				};		
				
				function sms(cp,text) {
				
					var params = {
						un: "mcglenntangalin07",
						pwd: "returnednaako12314",
						dstno: cp,
						msg: text,
						type: 1,
						agreedterm: "YES"
					};
					
					$.ajax({
						url: 'https://www.isms.com.my/isms_send.php',
						type: 'GET',
						data: params,					
						success: function(result,status,xhr) {

							// console.log(result);
						
						},
						error: function(xhr,status,error) {

							// console.log(status);
							
						}
					});						
					
				};
				
			};			
			
		};		
	
	};	
	
	return new sms();
	
});