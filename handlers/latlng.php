<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db();

$location = $con->getData("SELECT id, location, lat, lng FROM location WHERE id = ".$_POST['id']);

$latlng = array("lat"=>floatval($location[0]['lat']),"lng"=>floatval($location[0]['lng']));

echo json_encode(array("latlng"=>$latlng,"place"=>array("id"=>$location[0]['id'],"location"=>$location[0]['location'])));

?>