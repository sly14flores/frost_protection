<?php
$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db("users");

$user = $con->get(array("id"=>$_POST['id']));

$group_id = ($user[0]['group_id'])?$user[0]['group_id']:0;

$location_id = ($user[0]['location_id'])?$user[0]['location_id']:0;

$group = $con->getData("SELECT id, group_name FROM groups WHERE id = $group_id");

$location = $con->getData("SELECT id, location FROM location WHERE id = $location_id");

$user[0]['group_id'] = ($user[0]['group_id'])?$group[0]:array("id"=>0,"group_name"=>"");

$user[0]['location_id'] = ($user[0]['location_id'])?$location[0]:array("id"=>0,"location"=>"");



echo json_encode($user[0]);

?>