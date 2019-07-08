<?php
$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db("temperature");

$entries_list = $con->getData("SELECT temperature.id temperature, temperature.location_id, temperature.sensor_value value, FROM temperature ORDER BY temperature.system_log ASC");


echo json_encode($entries_list);

?>

