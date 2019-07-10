<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db();

$locations = $con->getData("SELECT * FROM location");

foreach ($locations as $i => $location) {

$location_id = $location['id'];
$locations[$i]['temperature'] = 0;
$locations[$i]['humidity'] = 0;
$locations[$i]['soil'] = 0;
$locations[$i]['moisture_dew'] = 0;
$locations[$i]['moisture_rain'] = 0;

$last_update = "";

// temperature
$temperature = $con->getData("SELECT * FROM temperatures WHERE location_id = $location_id");
if (count($temperature)) {
	
	$last_update = last_update("",$temperature[count($temperature)-1]['system_log']);
	$locations[$i]['temperature'] = $temperature[count($temperature)-1]['sensor_value'];
	
	if ($locations[$i]['temperature']<0) {
		# code...
		$locations[$i]['temperature'] = "OFFLINE";
	}
};

// humidity
$humidity = $con->getData("SELECT * FROM humidities WHERE location_id = $location_id");
if (count($humidity)) {
	
	$last_update = last_update($last_update,$humidity[count($humidity)-1]['system_log']);
	$locations[$i]['humidity'] = $humidity[count($humidity)-1]['sensor_value'];
	
	if ($locations[$i]['humidity']<0) {
		# code...
		$locations[$i]['humidity'] = "OFFLINE";
	}
};

// soil
$soil = $con->getData("SELECT * FROM soils WHERE location_id = $location_id");
if (count($soil)) {
	
	$last_update = last_update($last_update,$soil[count($soil)-1]['system_log']);
	$locations[$i]['soil'] = $soil[count($soil)-1]['sensor_value'];	
	
	if ($locations[$i]['soil']<0) {
		# code...
		$locations[$i]['soil'] = "OFFLINE";
	}
};

// moisture_dew
$moisture_dew = $con->getData("SELECT * FROM moisture_dews WHERE location_id = $location_id");
if (count($moisture_dew)) {
	
	$last_update = last_update($last_update,$moisture_dew[count($moisture_dew)-1]['system_log']);
	$locations[$i]['moisture_dew'] = $moisture_dew[count($moisture_dew)-1]['sensor_value'];
	
	if ($locations[$i]['moisture_dew']<0) {
		# code...
		$locations[$i]['moisture_dew'] = "OFFLINE";
	}
};

// moisture_rain
$moisture_rain = $con->getData("SELECT * FROM moisture_rains WHERE location_id = $location_id");
if (count($moisture_rain)) {
	
	$last_update = last_update($last_update,$moisture_rain[count($moisture_rain)-1]['system_log']);
	$locations[$i]['moisture_rain'] = $moisture_rain[count($moisture_rain)-1]['sensor_value'];	

	if ($locations[$i]['moisture_rain']<300 && $locations[$i]['moisture_rain']>0) {
		# code...
		$locations[$i]['moisture_rain'] = "Heavy Rain";
	}
	elseif ($locations[$i]['moisture_rain']>=300 && $locations[$i]['moisture_rain']<500) {
		# code...
		$locations[$i]['moisture_rain'] = "Moderate Rain";
	}
	elseif ($locations[$i]['moisture_rain']>=500) {
		# code...
		$locations[$i]['moisture_rain'] = "No Rain";
	}
	elseif ($locations[$i]['moisture_rain']<0) {
		# code...
		$locations[$i]['moisture_rain'] = "OFFLINE";
	}
	
};

if ($last_update != "") $locations[$i]['last_update'] = date("F j, Y",strtotime($last_update))."<br><br><strong>".date("h:i A",strtotime($last_update))."</strong>";
else $locations[$i]['last_update'] = "";

};

function last_update($old,$new) {
	
	$update = $old;
	
	if ($old == "") {
		$update = $new;	
	} else {
		if (strtotime($new)>strtotime($old)) $update = $new;
	};
	
	return $update;
	
};

$data = array(
	"locations"=>$locations
);

echo json_encode($data);

?>