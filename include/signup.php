<?php

	require "../database.php";

	if (isset($_POST["button"])) {

		if (empty($_POST["login"]) || empty($_POST["password"]) || empty($_POST["password-repeat"])) {
			echo "Error, empty parameters";
			exit();
		}

		if (userLoginExists($_POST["login"])) {
			echo "Error, login already exists";
			exit();
		}

		if ($_POST["password"] != $_POST["password-repeat"]) {
			echo "Error, passwords do not match";
			exit();
		}

		$time = round(microtime(true) * 1000);
		$token = bin2hex(random_bytes(32));

		registerNewUser(getNewUserId(), $_POST["login"], hash("sha256", $_POST["password"].$time, false), $time, $token);

		setcookie("token", $token, time()+60*60*24*30, "/", "", false, false);
		header("Location: ../index.php");
	}

	header("Location: ../signup.php");

?>
