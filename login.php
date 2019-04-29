<?php

require "./database.php";

if (isset($_COOKIE["token"]) && isValidToken($_COOKIE["token"])) {
	header("Location: ../index.php");
	exit();
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width" />
	<meta http-equiv="X-UA-Compatible" content="ie=edge" />
	<meta name="description" content="Chat" />
	<meta name="theme-color" content="#36393F" />
	<link rel="manifest" href="/manifest.json">

	<link rel="stylesheet" type="text/css" href="/resource/css/common.css" />
	<link rel="stylesheet" type="text/css" href="/resource/css/scroll.css" />
	<link rel="stylesheet" type="text/css" href="/resource/css/login/login.css" />
	<title>Login</title>
</head>

<body>
	<main>
		<form action="/include/login.php" method="POST">
			<label for="login">Login:</label>
			<input id="login" type="text" name="login" autocomplete="nickname" required />
			<label for="password">Password:</label>
			<input id="password" type="password" name="password" autocomplete="current-password" required />
			<input type="submit" name="button" value="Log in" class="blue" />
			<a href="/signup.php">Sign up</a>
		</form>
	</main>
</body>

</html>
