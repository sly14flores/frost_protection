<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db();

$id = $_POST['id'];
$day = date("Y-m-d");

$q_temperature = $con->getData("SELECT IFNULL(AVG(sensor_value),0) sensor_value FROM temperatures WHERE location_id = $id AND system_log LIKE '$day%'");
$temperature = 0;
if (count($q_temperature)) {
	$temperature = $q_temperature[0]['sensor_value'];	
};

$q_humidity = $con->getData("SELECT IFNULL(AVG(sensor_value),0) sensor_value FROM humidities WHERE location_id = $id AND system_log LIKE '$day%'");	
$humidity = 0;
if (count($q_humidity)) {
	$humidity = $q_humidity[0]['sensor_value'];
};

$q_soil = $con->getData("SELECT IFNULL(AVG(sensor_value),0) sensor_value FROM soils WHERE location_id = $id AND system_log LIKE '$day%'");
$soil = 0;
if (count($q_soil)) {
	$soil = $q_soil[0]['sensor_value'];		
};

$q_moisture_dew = $con->getData("SELECT IFNULL(AVG(sensor_value),0) sensor_value FROM moisture_dews WHERE location_id = $id AND system_log LIKE '$day%'");	
$moisture = 0;
if (count($q_moisture_dew)) {
	$moisture = $q_moisture_dew[0]['sensor_value'];		
};

$q_moisture_rain = $con->getData("SELECT IFNULL(AVG(sensor_value),0) sensor_value FROM moisture_rains WHERE location_id = $id AND system_log LIKE '$day%'");
$rain = 0;
if (count($q_moisture_rain)) {
	if ($q_moisture_rain[0]['sensor_value']>1000) $q_moisture_rain[0]['sensor_value'] = 1000;
	$rain = $q_moisture_rain[0]['sensor_value']*100/1000;
};

$gauges = array(
	"temperature"=>$temperature,
	"humidity"=>$humidity,
	"soil"=>$soil,
	"moisture"=>$moisture,
	"rain"=>$rain,
);

echo json_encode($gauges);

?>