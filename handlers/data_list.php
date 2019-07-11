
<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db();

$locations = $con->getData("SELECT * FROM location");

foreach ($locations as $i => $location) {

	$location_id = $location['id'];
	$locations[$i]['temperature'][] = 0;
	$locations[$i]['humidity'][] = 0;
	$locations[$i]['soil'][] = 0;
	$locations[$i]['moisture_dew'][] = 0;
	$locations[$i]['moisture_rain'][] = 0;


	// temperature
	$temperatures = $con->getData("SELECT * FROM temperatures");

	foreach ($temperatures as $t => $temperature) {

		$temperature = $con->getData("SELECT * FROM temperatures WHERE location_id = $location_id");
		if (count($temperature)) {
			
			$locations[$i]['temperature']['value'][$t] = $temperature[count($temperature)-1]['sensor_value'];
			$locations[$i]['temperature']['datetime'][$t] = $temperature[count($temperature)-1]['system_log'];
			
		};
	};
	// humidity
	$humidities = $con->getData("SELECT * FROM humidities");

	foreach ($humidities as $h => $humidity) {


		$humidity = $con->getData("SELECT * FROM humidities WHERE location_id = $location_id");
		if (count($humidity)) {
			
			$locations[$i]['humidity']['value'][$h] = $humidity[count($humidity)-1]['sensor_value'];
			$locations[$i]['humidity']['datetime'][$h] = $humidity[count($humidity)-1]['system_log'];
			
		};

	};

		// soil

	$soils = $con->getData("SELECT * FROM soils");

	foreach ($soils as $s => $soil) {


		$soil = $con->getData("SELECT * FROM soils WHERE location_id = $location_id");
		if (count($soil)) {
			
			$locations[$i]['soil']['value'][$s] = $soil[count($soil)-1]['sensor_value'];	
			$locations[$i]['soil']['datetime'][$s] = $soil[count($soil)-1]['sensor_value'];	
			
			
		};

	};

		// moisture_dew

	$moisture_dews = $con->getData("SELECT * FROM moisture_dews");

	foreach ($moisture_dews as $d => $moisture_dew) {
		
		$moisture_dew = $con->getData("SELECT * FROM moisture_dews WHERE location_id = $location_id");
		if (count($moisture_dew)) {
			
			$locations[$i]['moisture_dew']['value'][$d] = $moisture_dew[count($moisture_dew)-1]['sensor_value'];
			$locations[$i]['moisture_dew']['datetime'][$d] = $moisture_dew[count($moisture_dew)-1]['system_log'];
			
		};

	};


		// moisture_rain

	$moisture_rains = $con->getData("SELECT * FROM moisture_rains");

	foreach ($moisture_rains as $r => $moisture_rain) {

		$moisture_rain = $con->getData("SELECT * FROM moisture_rains WHERE location_id = $location_id");
		if (count($moisture_rain)) {
			
			$locations[$i]['moisture_rain']['value'][$r] = $moisture_rain[count($moisture_rain)-1]['sensor_value'];	
			$locations[$i]['moisture_rain']['datetime'][$r] = $moisture_rain[count($moisture_rain)-1]['system_log'];	

				
		};

	};


};

$data = array(
	"locations"=>$locations
);

echo json_encode($data);

?>