<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db("users");

$_POST['id'] = $_POST['id'];

$credit = $_POST['credit'];

$add_credit = $_POST['add_credit'];

unset($_POST['add_credit']);

$_POST['credit'] = $credit + $add_credit;

$con->updateData($_POST,'id');	

?>

