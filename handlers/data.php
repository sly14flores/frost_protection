<?php
$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db("humidities");

$entries_list = $con->getData("SELECT * FROM humidities");


echo json_encode($entries_list);

?>

