<?php

require "./database.php";

if (!isset($_COOKIE["token"]) || !isValidToken($_COOKIE["token"])) {
	setcookie("token", null, -1, "/");
	header("Location: ../login.php");
	exit();
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width" />
	<!--<base href="https://test.ascor.ml/">-->
	<meta http-equiv="X-UA-Compatible" content="ie=edge" />
	<meta name="description" content="Chat">
	<meta name="theme-color" content="#36393F">
	<link rel="manifest" href="/manifest.json">

	<link rel="stylesheet" type="text/css" href="/resource/css/common.css" />
	<link rel="stylesheet" type="text/css" href="/resource/css/index/index.css" />
	<link rel="stylesheet" type="text/css" href="/resource/css/index/channel.css" />
	<link rel="stylesheet" type="text/css" href="/resource/css/index/message.css" />
	<link rel="stylesheet" type="text/css" href="/resource/css/index/user.css" />
	<link rel="stylesheet" type="text/css" href="/resource/css/scroll.css" />
	<link rel="stylesheet" type="text/css" href="/resource/css/popup.css" />
	<title>Chat</title>
	<link rel="icon" type="image/ico" href="/favicon.ico">

	<link rel="apple-touch-startup-image" href="/resource/icon/favicon-256.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" />
	<link rel="apple-touch-startup-image" href="/resource/icon/favicon-256.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" />
	<link rel="apple-touch-startup-image" href="/resource/icon/favicon-512.png" media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)" />
	<link rel="apple-touch-startup-image" href="/resource/icon/favicon-512.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />
	<link rel="apple-touch-startup-image" href="/resource/icon/favicon-512.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" />
	<link rel="apple-touch-startup-image" href="/resource/icon/favicon-512.png" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)" />
	<link rel="apple-touch-startup-image" href="/resource/icon/favicon-512.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" />
</head>

<body>
	<main>
		<!-- <div id="popup"></div> -->
		<div class="side column">
			<div class="columnInfo">Available channels</div>
			<div id="channelsList">
				<button id="channelCreate" class="blue" title="Create new channel" disabled>Create new channel</button>
			</div>
			<div id="options">
				<button id="disconnect" class="green" title="Disconnect">Disconnect</button>
				<button id="userNameChange" class="blue" title="Chnage username" disabled>Change username</button>
			</div>
		</div>
		<div class="center column">
			<div class="columnInfo">
				<span class="channelIcon"></span>
				<input id="channelName" type="text" value="" placeholder="Unnamed channel" title="Channel Name" disabled>
				<span class="nameTopicDivider">-</span>
				<input id="channelTopic" type="text" value="" placeholder="No topic for his channel" title="Channel Topic" disabled>
				<button id="channelDelete" title="Delete channel" disabled><img src="/resource/icon/delete.svg" alt="delete channel"></button>
			</div>
			<div id="messagesList">
				<noscript><span class="noscript">Your browser does not support JavaScript!<br>Please enable Javascript or switch to a different browser.<span></noscript>
			</div>
			<textarea rows="1" placeholder="Message #" maxlength="2000" id="messageInput" disabled></textarea>
		</div>
		<div class="side column">
			<div class="columnInfo">All users</div>
			<div id="usersList"></div>
			<div class="empty"></div>
		</div>
	</main>
</body>
<script type="module" src="/client/out/index.js"></script>

</html>
