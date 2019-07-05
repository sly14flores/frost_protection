<?php
$_POST = json_decode(file_get_contents('php://input'), true);

require_once '../db.php';

$con = new pdo_db("users");

$users = $con->getData("SELECT *,  (SELECT groups.group_name FROM groups WHERE groups.id = users.group_id) group_name, (SELECT location.location FROM location WHERE location.id = users.location_id) location_name FROM users ORDER BY users.group_id DESC, users.lname ASC");

foreach ($users as $i => $user) {
	
	unset($users[$i]['pw']);
	
};

echo json_encode($users);

?>

