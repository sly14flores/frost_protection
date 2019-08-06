<?php

$_POST = json_decode(file_get_contents('php://input'), true);

$location_id = $_POST['location_id'];

require_once '../db.php';

$con = new pdo_db();

$break = "%0a";
$status = "";

$temperatures = $con->getData("SELECT * FROM temperatures WHERE location_id = $location_id ORDER BY id DESC LIMIT 1");
if (count($temperatures)) {
	$temperature = $temperatures[0]['sensor_value'];
	$status.="Temperature: $temperature";
}

$moisture_rains = $con->getData("SELECT * FROM moisture_rains WHERE location_id = $location_id ORDER BY id DESC LIMIT 1");
if (count($moisture_rains)) {
	$moisture_rain = $moisture_rains[0]['sensor_value'];	
	$status.="{$break}Rain: $moisture_rain";	
}

$humidities = $con->getData("SELECT * FROM humidities WHERE location_id = $location_id ORDER BY id DESC LIMIT 1");
if (count($humidities)) {
	$humidity = $humidities[0]['sensor_value'];	
	$status.="{$break}Humidity: $humidity";	
}

$moisture_dews = $con->getData("SELECT * FROM moisture_dews WHERE location_id = $location_id ORDER BY id DESC LIMIT 1");
if (count($moisture_dews)) {
	$moisture_dew = $moisture_dews[0]['sensor_value'];	
	$status.="{$break}Moisture: $moisture_dew";	
}

$soils = $con->getData("SELECT * FROM soils WHERE location_id = $location_id ORDER BY id DESC LIMIT 1");
if (count($soils)) {
	$soil = $soils[0]['sensor_value'];	
	$status.="{$break}Soil: $soil";	
}

echo $status;

?>