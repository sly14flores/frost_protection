<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db("location");

$loc = $con->getData("SELECT * FROM location WHERE id = ".$_POST['id']);

echo json_encode($loc[0]);

?>