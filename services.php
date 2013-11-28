<?php
require_once('data.php');
require_once('json_response.php');
$service = preg_split("/&/", $_SERVER["QUERY_STRING"]);
$service = $service[0];
$method = $_SERVER['REQUEST_METHOD'];
$response = 400;
switch($service){
    case "login":
        require_once('login.php');
        break;
    case "story":
        require_once('story.php');
        break;
}
json_response( $response );
?>