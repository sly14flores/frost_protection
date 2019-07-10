<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db();

$data = $_POST['data'];

$locations = explode("/",$data);

if (count($locations)) {
	
	foreach ($locations as $location) {
	
		$values = explode("_",$location);
		
		if (count($values)) {

			$id = intval(substr($values[0],strlen($values[0])-1,1));

			// temperature
			$con->table = "temperatures";
			$con->insertData(array("location_id"=>$id,"sensor_value"=>$values[1]));
			
			// humidity
			$con->table = "humidities";
			$con->insertData(array("location_id"=>$id,"sensor_value"=>$values[2]));
			
			// soil
			$con->table = "soils";
			$con->insertData(array("location_id"=>$id,"sensor_value"=>$values[3]));
			
			// moisture_dew
			$con->table = "moisture_dews";
			$con->insertData(array("location_id"=>$id,"sensor_value"=>$values[4]));
			
			// moisture_rain
			$con->table = "moisture_rains";
			$con->insertData(array("location_id"=>$id,"sensor_value"=>$values[5]));

		};
	
	};
	
};

?>