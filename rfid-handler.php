<?php
header("content-type: application/json; charset=utf-8");
header("access-control-allow-origin: *");
include_once 'db.php';
$con = new pdo_db("users"); 
$time = date('D- M d Y')."/".date('h:i:s A', time()+25200);

$q = $con->getData("SELECT * FROM users WHERE rfid = '".$_GET['rfid']."'");
if (count($q)) {
  if($_GET['stat'] == "initial") {
       echo ("#start".$q[0]['fname']."#space".$q[0]['credit']."#plus".$q[0]['rfid']."#end");
    
    $data2 = array(
      "fullname" =>$q[0]['fname']." ".$q[0]['lname'],
      "student_id" =>$q[0]['student_id'],
      "balance" =>$q[0]['credit'],
      "expense" => 0,
      "date"=>$time,
      "activity" =>"Tapped ID",
      "container" => 0,
      "dispensed" => 0
      );
    $con->table="logs";
    $log= $con->insertData($data2);
  }
	else {
    $q = $con->getData("SELECT * FROM users WHERE rfid = '".$_GET['rfid']."'");
    $data = array(
      "id" => $q[0]['id'],
      "fname" =>$q[0]['fname'],
      "mname" =>$q[0]['mname'],
      "lname" =>$q[0]['lname'],
      "pw" =>$q[0]['pw'],
      "student_id" =>$q[0]['student_id'],
      "group_id" =>$q[0]['group_id'],
      "rfid" =>$q[0]['rfid'],
      "credit" =>$_GET['stat']
      );
    $log = $con->updateData($data,'rfid');
    $data2 = array(
      "fullname" =>$q[0]['fname']." ".$q[0]['lname'],
      "student_id" =>$q[0]['student_id'],
      "balance" => $_GET['stat'],
      "expense" => ($q[0]['credit']-$_GET['stat']),
      "date"=>$time,
      "activity" =>"Dispensed Water",
      "container" => $_GET['cont'],
      "dispensed" => $_GET['mL']
      );
    $con->table="logs";
    $log= $con->insertData($data2);

    
    echo "updated successfully";
  }
	
}
else {
  if($_GET['rfid'] == "SYSTEM") {
    $data2 = array(
    "fullname" =>"SYSTEM",
    "student_id" =>000000,
    "balance" =>0.00,
    "expense" =>0.00,
    "date"=>$time,
    "activity" =>"Dispensed Water",
    "container" => $_GET['cont'],
    "dispensed" => 0
    );
    if ($_GET['cont']<2){
      $url = "https://www.itexmo.com/php_api/api.php";
      $number = "09198406926";
      $message = "A Container is Empty";
      $apicode = "TR-HARVE717847_PKN3C";
      $itexmo = array('1' => $number, '2' => $message, '3' => $apicode);
      $options = array(
          'http'=>array(
              'header'=>"Content-type: application/x-www-form-urlencoded\r\n",
              'method'=>'POST',
              'content'=>http_build_query($itexmo)
          )
      );
      $context  = stream_context_create($options);
      $result = file_get_contents($url, false, $context);
    }
    $con->table="logs";
    $log= $con->insertData($data2);
  echo ("#startUnknown#end");
  }
  else{
    $data2 = array(
    "fullname" =>"Mr. Unknown",
    "student_id" =>$_GET['rfid'],
    "balance" =>0.00,
    "expense" =>0.00,
    "date"=>$time,
    "activity" =>"Attempted",
    "container" => 0,
    "dispensed" => 0
    );
    $con->table="logs";
    $log= $con->insertData($data2);
  echo ("#startUnknown#end");
  }
}
?>