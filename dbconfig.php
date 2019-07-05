<?php



$databaseUser = "root";

$databasePass = "root";

$database = "id7115800_frostprotection";

$server = "localhost";





$connect = mysqli_connect($server, $databaseUser, $databasePass, $database);


if (!$connect) {
    die("Connection failed: " . mysqli_connect_error());
}
?>