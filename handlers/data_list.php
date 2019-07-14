
<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db();

$locations = $con->getData("SELECT * FROM location");

foreach ($locations as $i => $location) {

	$location_id = $location['id'];

	// temperature
	$temperatures = $con->getData("SELECT * FROM temperatures WHERE location_id = $location_id");
	if (count($temperatures)) { 
		foreach ($temperatures as $k => $temperature) {
			
			$locations[$i]["data"][] = array(
				"id"=>$temperature['id'],
				"factor"=>"Temperature",
				"value"=>$temperature['sensor_value'],
				"datetime"=>date("F j, Y h:i A",strtotime($temperature['system_log']))
			);
		
		};
	};
	
 	// humidity
	$humidities = $con->getData("SELECT * FROM humidities WHERE location_id = $location_id");
	if (count($humidities)) { 
		foreach ($humidities as $k => $humidity) {
			
			$locations[$i]["data"][] = array(
				"id"=>$humidity['id'],
				"factor"=>"Humidity",
				"value"=>$humidity['sensor_value'],
				"datetime"=>date("F j, Y h:i A",strtotime($humidity['system_log']))
			);
		
		};
	};

	// soil
	$soils = $con->getData("SELECT * FROM soils WHERE location_id = $location_id");
	if (count($soils)) { 
		foreach ($soils as $k => $soil) {
			
			$locations[$i]["data"][] = array(
				"id"=>$soil['id'],
				"factor"=>"Soil",
				"value"=>$soil['sensor_value'],
				"datetime"=>date("F j, Y h:i A",strtotime($soil['system_log']))
			);
		
		};
	};

	// moisture_dew
	$moisture_dews = $con->getData("SELECT * FROM moisture_dews WHERE location_id = $location_id");
	if (count($moisture_dews)) { 
		foreach ($moisture_dews as $k => $moisture_dew) {
			
			$locations[$i]["data"][] = array(
				"id"=>$moisture_dew['id'],
				"factor"=>"Moisture Dew",
				"value"=>$moisture_dew['sensor_value'],
				"datetime"=>date("F j, Y h:i A",strtotime($moisture_dew['system_log']))
			);
		
		};
	};

	// moisture_rain
	$moisture_rains = $con->getData("SELECT * FROM moisture_rains WHERE location_id = $location_id");
	if (count($moisture_rains)) { 
		foreach ($moisture_rains as $k => $moisture_rain) {
			
			$locations[$i]["data"][] = array(
				"id"=>$moisture_rain['id'],
				"factor"=>"Moisture Rain",
				"value"=>$moisture_rain['sensor_value'],
				"datetime"=>date("F j, Y h:i A",strtotime($moisture_rain['system_log']))
			);
		
		};
	};

};

echo json_encode($locations);

?>