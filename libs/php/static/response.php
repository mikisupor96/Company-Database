<?php

function response($conn, $errorCode, $errorName, $errorDesc, $elapsedTime, $data)
{
	$output['status']['code'] = $errorCode;
	$output['status']['name'] = $errorName;
	$output['status']['description'] = $errorDesc;
	$output['status']['returnedIn'] = $elapsedTime;
	$output['data'] = $data;

	mysqli_close($conn);

	echo json_encode($output);
}
