<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);


include("./static/config.php");
include("./static/response.php");

header('Content-Type: application/json; charset=UTF-8');

$id = $_REQUEST["id"];
$type = $_REQUEST["type"];

// CONNECT TO DB
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port);

if (mysqli_connect_errno()) {
    response($conn, "300", mysqli_connect_errno(), mysqli_connect_error(), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
    exit;
}

if ($type === "location") {
    $query = "
        SELECT count(id) as dc 
        FROM department 
        WHERE 
            locationID = '{$id}'
    ";
} elseif ($type === "department") {
    $query = "
        SELECT count(id) as pc 
        FROM personnel 
        WHERE 
            departmentID = '{$id}'
    ";
}

$result = $conn->query($query);

$row = mysqli_fetch_assoc($result);

$data = $row;

if (!$result) {
    response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
    exit;
}

response($conn, "200", "ok", "success", (microtime(true) - $executionStartTime) / 1000 . " ms", $data);
