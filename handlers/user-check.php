<?php
$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db("users");

if ($_POST['id']) { # update

	$user = $con->getData("SELECT count(student_id) count FROM users WHERE student_id = '$_POST[student_id]' AND id != '$_POST[id]'");

} else { 	

	$user = $con->getData("SELECT count(student_id) count FROM users WHERE student_id = '$_POST[student_id]'");

}

echo json_encode($user[0]);

?>
