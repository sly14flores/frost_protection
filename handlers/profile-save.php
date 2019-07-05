<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db("users");

$_POST['group_id'] = $_POST['group_id']['id'];

$_POST['location_id'] = $_POST['location_id']['id'];

if ($_POST['group_id'] != '1') {
	$_POST['pw'] = "WERYWECNSDKFHOSDHFJKDHSDFHLDU";
}


if ($_POST['id']) { # update
	$con->updateData($_POST,'id');	
} else { # insert
	unset($_POST['id']);
	$con->insertData($_POST);	
}

?>