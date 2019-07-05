<?php

	include("../dbconfig.php");

	//function for sms api

	function itexmo($number,$message,$apicode){
	$url = 'https://www.itexmo.com/php_api/api.php';
	$itexmo = array('1' => $number, '2' => $message, '3' => $apicode);
	$param = array(
		'http' => array(
		    'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
		   	'method'  => 'POST',
		    'content' => http_build_query($itexmo),
		),
	);
	$context  = stream_context_create($param);
	return file_get_contents($url, false, $context);
	}

	//---------------------------------------------
	$critical = "SELECT * FROM critical ORDER BY id DESC LIMIT 1";
	$result_critical = mysqli_query($connect, $critical);
	$row_critical = mysqli_fetch_assoc($result_critical);
	$crit_critical = $row_critical['critical'];

	//Query for atok temperature

	$atok = "SELECT * FROM Atok ORDER BY id DESC LIMIT 1";
	$result_atok = mysqli_query($connect, $atok);
	$row_atok = mysqli_fetch_assoc($result_atok);

	$atok_temp = $row_atok['temp'];

	//Query for current temperature

	$current_temp = "SELECT * FROM current_temp ORDER BY id DESC LIMIT 1";
	$result_current = mysqli_query($connect, $current_temp);
	$row_curret_temp = mysqli_fetch_assoc($result_current);

	$current = $row_curret_temp['current_temp'];

	$warning_temp = $crit_critical + 1; // warning temperature
	$atok_current_color = "#2BE31F"; // default color of fonts Atok
	$atok_current_status = "Normal"; // default status of Atok
	//----------------------------------------------------------//

	//condition for sms message

	if($atok_temp != $current)
	{
		$insert_current = "INSERT INTO current_temp(current_temp) VALUES ('$atok_temp')";
		mysqli_query($connect, $insert_current);
		$message = "The temperature at Atok is now " . $atok_temp . " Celcius";
		$api_code = "TR-JASON946918_EWNEQ";
		$sms = "SELECT * FROM farmer_details";
		$sms_result = mysqli_query($connect, $sms);
			if(mysqli_num_rows($sms_result) > 0){
				while($sms_row = mysqli_fetch_assoc($sms_result)){
					itexmo($sms_row['cpnumber'], $message, $api_code);
				}
			}
	}

	//condition for color and status of atok

	if($atok_temp <= $crit_critical)
	{
		$atok_current_color = "#ff0000";
		$atok_current_status = "Critical";
	}
	else if($atok_temp == $warning_temp) {
		$atok_current_color = "#ff6600";
		$atok_current_status = "Warning";
	}

	//------------------------------

	$kibu = "SELECT * FROM kibu_humtemp ORDER BY id DESC LIMIT 1";
	$result_kibu = mysqli_query($connect, $kibu);
	$row_kibu = mysqli_fetch_assoc($result_kibu);

	$sql_kibu_current = "SELECT * FROM kibu_current_temp ORDER BY id DESC LIMIT 1";
	$result_kibu_current = mysqli_query($connect, $sql_kibu_current);
	$row_kibu_current = mysqli_fetch_assoc($result_kibu_current);

	$kibu_temp = $row_kibu['temp'];
	$kibu_current = $row_kibu_current['kibu_current'];

	$kibu_current_color = "#2BE31F";
	$kibu_current_status = "Normal";

	if($kibu_temp != $kibu_current)
	{
		
		$message = "The temperature at Kibu is now " . $kibu_temp;
		$api_code = "TR-JASON946918_EWNEQ";
		$sms = "SELECT * FROM farmer_details";
		$sms_result = mysqli_query($connect, $sms);
			if(mysqli_num_rows($sms_result) > 0){
				while($sms_row = mysqli_fetch_assoc($sms_result)){
					itexmo($sms_row['cpnumber'], $message, $api_code);
				}
			}	
	}

	if($kibu_temp <= $crit_critical)
	{
		$kibu_current_color = "#ff0000";
		$kibu_current_status = "Critical";
	}
	else if($kibu_temp == $warning_temp)
	{
		$kibu_current_color = "#ff6600";
		$kibu_current_status = "Warning";
	}

	//-------------------------------------------

	//Query for kapa temperature

	$kapa = "SELECT * FROM kapa_humtemp ORDER BY id DESC LIMIT 1";
	$result_kapa = mysqli_query($connect, $kapa);
	$row_kapa = mysqli_fetch_assoc($result_kapa);

	$sql_kapa_current = "SELECT * FROM kapa_current_temp ORDER BY id DESC LIMIT 1";
	$result_kapa_current = mysqli_query($connect, $sql_kapa_current);
	$row_kapa_current = mysqli_fetch_assoc($result_kapa_current);

	$kapa_temp = $row_kapa['temp'];
	$kapa_current = $row_kapa_current['kapa_current'];

	$kapa_current_color = "#2BE31F";
	$kapa_current_status = "Normal";

	if($kapa_temp != $kapa_current)
	{
		$message = "The temperature at Kapa is now " . $kapa_temp;
		$api_code = "TR-JASON946918_EWNEQ";
		$sms = "SELECT * FROM farmer_details";
		$sms_result = mysqli_query($connect, $sms);
			if(mysqli_num_rows($sms_result) > 0){
				while($sms_row = mysqli_fetch_assoc($sms_result)){
					itexmo($sms_row['cpnumber'], $message, $api_code);
				}
			}
	}
	if($kapa_temp <= $crit_critical)
	{
		$kapa_current_color = "#ff0000";
		$kapa_current_status = "Critical";
	}
	else if($kapa_temp == $warning_temp)
	{
		$kapa_current_color = "#ff6600";
		$kapa_current_status = "Warning";
	}

	$output = "";
	$colorall = "#2BE31F";
	$statusall = "Normal";
	$warningall = $crit_critical + 1;
	$selectall = "SELECT * FROM locations";
	$queryall = mysqli_query($connect, $selectall);
	//$rowall = mysqli_fetch_assoc($queryall);

	$output .= "<table id='table' class='table bootstrap-datatable'>
				<thead>
					<tr style='font-size: 10px;'>
						<th>Device Name</th>
						<th>Municipal</th>
						<th>Time</th>
						<th>Date</th>
						<th>Temperature</th>
						<th>Humidity</th>
						<th>Option</th>
					</tr>
				</thead>
				<tbody>";

				while($rowall = mysqli_fetch_assoc($queryall))
				{
					if($rowall['temp'] <= $crit_critical){
						$colorall = "#ff0000";
						$statusall = "Critical";
					}elseif($rowall['temp'] == $warningall ){
						$colorall = "#ff6600";
						$statusall = "Warning";
					}

					$lat = $rowall['town'] . "lat";
					$output .= "<tr style='color: ".$colorall."; font-size: 10px;'>
									<td>".$rowall['device_name']."</td>
									<td>".$rowall['town']."</td>
									<td>".$rowall['time']."</td>
									<td>".$rowall['date']."</td>
									<td>".$rowall['temp']."</td>
									<td>".$rowall['hum']."</td>
									<td><input type='button' name='getLoc' id='".$rowall['device_name']."' value='Display' class='btn btn-default btn-xs get_data' /></td>
									
								</tr>
					";
				}

				$output .= "</tbody>
							</table>
				";

				echo $output;
?>