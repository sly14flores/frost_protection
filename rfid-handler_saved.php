<?php
header("content-type: application/json; charset=utf-8");
header("access-control-allow-origin: *");
include_once 'db.php';
$con = new pdo_db("users"); 
// $today = time();
// $time = date('h:i:s A', time()+25200);
// $ifif="0";
$q = $con->getData("SELECT * FROM users WHERE rfid = '".$_GET['rfid']."'");
if (count($q)) {
	if ($q[0]['credit']>10) {
		$data = array(
			"id" => $q[0]['id'],
			"fname" =>$q[0]['fname'],
			"mname" =>$q[0]['mname'],
			"lname" =>$q[0]['lname'],
			"uname" =>$q[0]['uname'],
			"pw" =>$q[0]['pw'],
			"student_id" =>$q[0]['student_id'],
			"group_id" =>$q[0]['group_id'],
			"rfid" =>$q[0]['rfid'],
			"credit" =>$q[0]['credit'] - 10
			);
		$log = $con->updateData($data,'rfid');
		echo ("#start".$q[0]['fname']."#space".$data['credit']."#end");

	}
	else {
		echo ("#start".$q[0]['fname']."#space".$q[0]['credit']."#end");
	}
	
}
	
?>