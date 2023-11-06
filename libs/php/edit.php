<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);


include("./static/config.php");
include("./static/response.php");

$type = $_REQUEST["type"];
$id = $_REQUEST["id"];

if ($type === "personnel") {
    $newFirstName = $_REQUEST["newFirstName"];
    $newLastName = $_REQUEST["newLastName"];
    $newEmail = $_REQUEST["newEmail"];
    $newDepartment = $_REQUEST["newDepartment"];
    $query = "
        UPDATE personnel 
            SET firstName='{$newFirstName}',
                lastName='{$newLastName}',
                email='{$newEmail}',
                departmentID='{$newDepartment}'
            WHERE 
                id='{$id}' 
    ";
} elseif ($type === "department") {
    $newDepartment = $_REQUEST["newDepartment"];
    $newLocation = $_REQUEST["newLocation"];
    $query = "
        UPDATE department 
            SET 
                name='{$newDepartment}',
                locationID='{$newLocation}'
            WHERE 
                id='{$id}'         
    ";
} elseif ($type === "location") {
    $newLocation = $_REQUEST["newLocation"];
    $query = "
        UPDATE location 
            SET name='{$newLocation}'
            WHERE 
                id='{$id}'      
    ";
}


$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port);

if (mysqli_connect_errno()) {
    response($conn, "300", mysqli_connect_errno(), mysqli_connect_error(), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
    exit;
}


$result = $conn->query($query);

if (!$result) {
    response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", true);
    exit;
}


response($conn, "200", "ok", "success", (microtime(true) - $executionStartTime) / 1000 . " ms", []);
