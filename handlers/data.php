<?php
$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db("humidities");

$list = $con->getData("SELECT * FROM humidities");


echo json_encode($list);

?>

