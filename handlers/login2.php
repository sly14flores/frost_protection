<?php

$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db();

$conversion = strtoupper(dechex($_POST['rfid']));

$a = strlen((string)$conversion);
if ($a == 8) {
	$_POST['rfid'] = substr($conversion,6,2).":".substr($conversion,4,2).":".substr($conversion,2,2).":".substr($conversion,0,2);
}
else {
	$_POST['rfid'] = substr($conversion,5,2).":".substr($conversion,3,2).":".substr($conversion,1,2).":0".substr($conversion,0,1);
}

$sql = "SELECT id, group_id FROM users WHERE rfid = '$_POST[rfid]' AND pw = '$_POST[pw]'";
$account = $con->getData($sql);
if (($con->rows) > 0) {
	session_start();
	$_SESSION['id'] = $account[0]['id'];
	$_SESSION['group'] = $account[0]['group_id'];
	echo json_encode(array("login"=>true));
} else {
	echo json_encode(array("login"=>false));
}

?>