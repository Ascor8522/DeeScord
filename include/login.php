<?php

	require "../database.php";

	if (empty($_POST["login"]) || empty($_POST["password"])) {
		echo "Error, empty parameters";
		exit();
	}

	if (!userLoginExists($_POST["login"])) {
		echo "Error, doesn't exists";
		exit();
	}

	if (hash("sha256", $_POST["password"].getUserTimestamp($_POST["login"]), false) != getUserPassword($_POST["login"])) {
		echo "Error, wrong password";
		exit();
	}

	$token = bin2hex(random_bytes(32));

	setUserToken($token, $_POST["login"]);

	$past = time() - 3600;
	foreach ( $_COOKIE as $key => $value ) {
		setcookie( $key, $value, $past, '/' );
	}

	setcookie("token", $token, time()+60*60*24*30, "/", "", false, false);
	header("Location: ../index.php");
?>
