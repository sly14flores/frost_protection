<?php

require_once '../db.php';

$con = new pdo_db("location");

$locations = $con->all(['id','location']);

echo json_encode($locations);

?>