<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db("humidities");

$entries_list = $con->getData("SELECT soils.id, soils.location_id location, humidities.sensor_value humidity, soils.sensor_value soil, temperatures.sensor_value temperature, moisture_dews.sensor_value dew, moisture_rains.sensor_value rain, soils.system_log system_log
FROM soils
INNER JOIN humidities ON soils.system_log=humidities.system_log
INNER JOIN temperatures ON soils.system_log=temperatures.system_log
INNER JOIN moisture_dews ON soils.system_log=moisture_dews.system_log
INNER JOIN moisture_rains ON soils.system_log=moisture_rains.system_log
 WHERE soils.location_id = 1
ORDER by soils.id DESC
LIMIT 50;");

echo json_encode($entries_list);

?>

