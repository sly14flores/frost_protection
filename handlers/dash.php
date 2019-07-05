<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db("users");

$dash = $con->getData("SELECT count(id) AS info,(SELECT container FROM `logs` WHERE `activity` = 'Dispensed Water' ORDER BY `id` DESC LIMIT 1) container,(SELECT count(id) FROM `users` WHERE credit < 5 ) zero_balance FROM `users`");


echo json_encode($dash[0]);

?>