<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db();

$location = $con->getData("SELECT lat, lng FROM location WHERE id = ".$_POST['id']);

$location[0]['lat'] = floatval($location[0]['lat']);
$location[0]['lng'] = floatval($location[0]['lng']);
$latlng = $location[0];

echo json_encode($latlng);

?>