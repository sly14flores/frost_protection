<?php

$params = json_decode($_POST['params'],true);

$content_types = array(
	"pdf"=>"application/pdf",
	"png"=>"image/png",
	"jpg"=>"image/jpeg"
);

$filename = $params['path'];

header("Content-type: ".$content_types[$params['type']]);
header("Content-Length: " . filesize($filename));
readfile($filename);

?>