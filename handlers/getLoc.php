<?php

	include('../api/dbconfig.php');

	if(isset($_POST['device_name']))
	{
		$query = "SELECT * FROM locations WHERE device_name = '".$_POST['device_name']."'";
		$result = mysqli_query($connect, $query);
		$row = mysqli_fetch_row($result);
		echo json_encode($row);
	}

?>