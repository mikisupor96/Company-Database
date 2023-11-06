<?php

include("./static/config.php");
include("./static/response.php");

header('Content-Type: application/json; charset=UTF-8');

$executionStartTime = microtime(true);

$type = $_REQUEST["type"];

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port);

if (mysqli_connect_errno()) {
    response($conn, "300", mysqli_connect_errno(), mysqli_connect_error(), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
    exit;
}

if ($type === "personnel") {
    $firstName = $_REQUEST["firstName"];
    $lastName = $_REQUEST["lastName"];
    $email = $_REQUEST["email"];
    $department = $_REQUEST["department"];
    checkPersonnel();
} elseif ($type === "department") {
    $department = $_REQUEST["department"];
    $locationID = $_REQUEST["locationID"];
    checkDepartmentValue();
} elseif ($type === "location") {
    $location = $_REQUEST["location"];
    checkLocation();
}

function getNextID($table)
{
    global $conn, $executionStartTime;

    $query = "
        SELECT MAX(id)
        FROM {$table}
    ";

    $result = $conn->query($query);
    if (!$result) {
        response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
        exit;
    }

    $data = mysqli_fetch_assoc($result);

    return $data["MAX(id)"] + 1;
}

// Checks user`s name and email
function checkPersonnel()
{
    global $conn, $executionStartTime, $firstName, $lastName, $email, $department;


    $query = "
        SELECT count(id) pc
        FROM personnel  
        WHERE 
            firstName='{$firstName}' AND 
            lastName='{$lastName}' AND
            email='{$email}'   
    ";

    $result = $conn->query($query);

    if (!$result) {
        response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
        exit;
    }

    $row = mysqli_fetch_assoc($result);

    if ($row["pc"] === "0") {
        $personnelID = getNextID("personnel");

        $query = "
            INSERT INTO personnel (id, firstName, lastName, jobTitle, email, departmentID)
            VALUES (
                '$personnelID',
                '$firstName',
                '$lastName',
                '',
                '$email',
                '$department'
            )
        ";

        $result = $conn->query($query);

        if (!$result) {
            response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
            exit;
        }

        response($conn, "200", "ok", "success", (microtime(true) - $executionStartTime) / 1000 . " ms", true);
    } else {
        response($conn, "409", "Conflict", "fail", (microtime(true) - $executionStartTime) / 1000 . " ms", false);
    }
}

// Checks that department is unique
function checkLocation()
{
    global $conn, $executionStartTime, $department, $location;


    $query = "
        SELECT count(id) lc
        FROM location
        WHERE 
            name='{$location}'   
    ";


    $result = $conn->query($query);

    if (!$result) {
        response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
        exit;
    }

    $row = mysqli_fetch_assoc($result);


    if ($row["lc"] === "0") {
        // Adds new user department
        $newLocationID = getNextID("location;");

        // Department insert
        $query = "
            INSERT INTO location (id, name)
            VALUES (
                '$newLocationID',
                '$location'
            );
        ";

        $conn->query($query);

        response($conn, "200", "ok", "success", (microtime(true) - $executionStartTime) / 1000 . " ms", true);
    } else {
        response($conn, "409", "Conflict", "fail", (microtime(true) - $executionStartTime) / 1000 . " ms", false);
    }
}

// Checks that department is unique
function checkDepartmentValue()
{
    global $conn, $executionStartTime, $department, $locationID;


    $query = "
        SELECT count(id) dc
        FROM department
        WHERE 
            name='{$department}'   
    ";


    $result = $conn->query($query);

    if (!$result) {
        response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
        exit;
    }

    $row = mysqli_fetch_assoc($result);


    if ($row["dc"] === "0") {
        $newDepartmentID = getNextID("department;");

        // Department insert
        $query = "
            INSERT INTO department (id, name, locationID)
            VALUES (
                '$newDepartmentID',
                '$department',
                '$locationID'
            );
        ";

        $result = $conn->query($query);

        if (!$result) {
            response($conn, "400", mysqli_errno($conn),  mysqli_error($conn), (microtime(true) - $executionStartTime) / 1000 . " ms", []);
            exit;
        }

        response($conn, "200", "ok", "success", (microtime(true) - $executionStartTime) / 1000 . " ms", true);
    } else {
        response($conn, "409", "Conflict", "fail", (microtime(true) - $executionStartTime) / 1000 . " ms", false);
    }
}
