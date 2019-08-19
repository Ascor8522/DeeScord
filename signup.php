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
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<meta name="description" content="Chat">
	<meta name="theme-color" content="#36393F">
	<link rel="manifest" href="/manifest.json">

	<link rel="stylesheet" type="text/css" href="/resource/css/common.css" />
	<link rel="stylesheet" type="text/css" href="/resource/css/scroll.css" />
	<link rel="stylesheet" type="text/css" href="/resource/css/login/login.css" />
	<title>Deescord - Sign up</title>
	<link rel="icon" type="image/ico" href="/resource/img/favicon/favicon.ico">

	<link rel="apple-touch-startup-image" href="/resource/img/favicon/favicon-256.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" />
	<link rel="apple-touch-startup-image" href="/resource/img/favicon/favicon-256.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" />
	<link rel="apple-touch-startup-image" href="/resource/img/favicon/favicon-512.png" media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)" />
	<link rel="apple-touch-startup-image" href="/resource/img/favicon/favicon-512.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />
	<link rel="apple-touch-startup-image" href="/resource/img/favicon/favicon-512.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" />
	<link rel="apple-touch-startup-image" href="/resource/img/favicon/favicon-512.png" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)" />
	<link rel="apple-touch-startup-image" href="/resource/img/favicon/favicon-512.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" />
</head>

<body>
	<main>
		<form action="/include/signup.php" method="POST">
			<img src="/resource/img/favicon/favicon.svg" title="Deescord" alt="Deescord logo"/>
			<label for="login">Login:</label>
			<input id="login" type="text" name="login" autocomplete="nickname" title="Login" required />
			<label for="password">Password:</label>
			<input id="password" type="password" name="password" autocomplete="new-password" title="Password" required />
			<label for="password-repeat">Confirm Password:</label>
			<input id="password-repeat" type="password" name="password-repeat" autocomplete="new-password" title="Confirm password" required />
			<input type="submit" name="button" value="Sign up" class="blue" title="Sign up" />
			<a href="/login.php" title="Log in">Log in</a>
		</form>
	</main>
</body>

</html>
