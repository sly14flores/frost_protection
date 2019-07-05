<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db();

$id = $_POST['id'];
$data = $_POST['data'];

$values = explode("_",$data);

if (count($values)) {

	// temperature
	$con->table = "temperatures";
	$con->insertData(array("location_id"=>$id,"sensor_value"=>$values[0]));
	
	// humidity
	$con->table = "humidities";
	$con->insertData(array("location_id"=>$id,"sensor_value"=>$values[1]));
	
	// soil
	$con->table = "soils";
	$con->insertData(array("location_id"=>$id,"sensor_value"=>$values[2]));
	
	// moisture_dew
	$con->table = "moisture_dews";
	$con->insertData(array("location_id"=>$id,"sensor_value"=>$values[3]));
	
	// moisture_rain
	$con->table = "moisture_rains";
	$con->insertData(array("location_id"=>$id,"sensor_value"=>$values[4]));

};

?>