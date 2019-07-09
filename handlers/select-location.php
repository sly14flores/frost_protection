<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db();

$id = $_POST['id'];

$first = date("Y-m-d",strtotime("-7 Day",strtotime(date("Y-m-d"))));
$now = date("Y-m-d",strtotime("-1 Day",strtotime(date("Y-m-d"))));

$charts = array(
	"temperature"=>[],
	"humidity"=>[],
	"soil"=>[],
	"dew"=>[],
	"rain"=>[],
);

for ( $day=$first; strtotime($day)<=strtotime($now); $day=date("Y-m-d",strtotime("+1 Day",strtotime(date($day)))) ) {

	// temperature | temperatures
	$charts['temperature']['dates'][] = date("n/j/Y (D)",strtotime($day));
	$q_temperature = $con->getData("SELECT IFNULL(AVG(sensor_value),0) sensor_value FROM temperatures WHERE system_log LIKE '$day%'");
	$temperature = 0;
	if (count($q_temperature)) {
		$temperature = $q_temperature[0]['sensor_value'];	
	};
	$charts['temperature']['data'][] = abs(ceil($temperature));
	
	// humidity | humidities
	$q_humidity = $con->getData("SELECT IFNULL(AVG(sensor_value),0) sensor_value FROM humidities WHERE system_log LIKE '$day%'");	
	$charts['humidity']['dates'][] = date("n/j/Y (D)",strtotime($day));	
	$humidity = 0;
	if (count($q_humidity)) {
		$humidity = $q_humidity[0]['sensor_value'];
	};
	$charts['humidity']['data'][] = abs(ceil($humidity));	
	
	// soil | soils
	$q_soil = $con->getData("SELECT IFNULL(AVG(sensor_value),0) sensor_value FROM soils WHERE system_log LIKE '$day%'");
	$charts['soil']['dates'][] = date("n/j/Y (D)",strtotime($day));	
	$soil = 0;
	if (count($q_soil)) {
		$soil = $q_soil[0]['sensor_value'];		
	};
	$charts['soil']['data'][] = abs(ceil($soil));		
	
	// moisture dew | moisture_dews
	$q_moisture_dew = $con->getData("SELECT IFNULL(AVG(sensor_value),0) sensor_value FROM moisture_dews WHERE system_log LIKE '$day%'");	
	$charts['dew']['dates'][] = date("n/j/Y (D)",strtotime($day));	
	$moisture_dew = 0;
	if (count($q_moisture_dew)) {
		$moisture_dew = $q_moisture_dew[0]['sensor_value'];		
	};
	$charts['dew']['data'][] = abs(ceil($moisture_dew));	
	
	// moisture rain | moisture_rains
	$q_moisture_rain = $con->getData("SELECT IFNULL(AVG(sensor_value),0) sensor_value FROM moisture_rains WHERE system_log LIKE '$day%'");	
	$charts['rain']['dates'][] = date("n/j/Y (D)",strtotime($day));	
	$moisture_rain = 0;
	if (count($q_moisture_rain)) {
		$moisture_rain = $q_moisture_rain[0]['sensor_value'];		
	};
	$charts['rain']['data'][] = abs(ceil($moisture_rain));		
	
};

echo json_encode(array("charts"=>$charts));

?>