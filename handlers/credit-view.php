<?php
$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db("users");

$user = $con->getData("SELECT * FROM users WHERE id = ".$_POST['id']);

$user[0]['add_credit'] = "";

echo json_encode($user[0]);

?>