<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db();

$farmers = $con->getData("SELECT users.id, CONCAT(fname, ' ', lname) fullname, (SELECT location.location FROM location WHERE location.id = users.location_id) location FROM users WHERE group_id = 2");

echo json_encode($farmers);

?>