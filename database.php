<?php

/**
 * Connects to the database
 * @return the open database
 */
function connectDB() {
	if (!file_exists(dirname(__FILE__)."/database.sqlite3")) {
		$pdo =  new PDO('sqlite:'.dirname(__FILE__).'/database.sqlite3', null, null, array(
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
		));
        $stmt = $pdo->prepare(file_get_contents(dirname(__FILE__)."/create.sql"));
        $stmt->execute();
    } else {
		$pdo =  new PDO('sqlite:'.dirname(__FILE__).'/database.sqlite3', null, null, array(
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
	));
	}

	return $pdo;
}

/**
 * Returns all the users from the database
 * @return an array with all the user objects
 */
function getUsers() {
	$pdo = connectDB();
	return ($pdo->query(
		"SELECT userId, userName, userStatus, userIcon
		FROM users
		WHERE userDeleted != 'true'
		ORDER BY userName")->fetchAll(PDO::FETCH_ASSOC));
}

/**
 * Returns all the channels from the database
 * @return an array with all the channel objects
 */
function getChannels() {
	$pdo = connectDB();
	return ($pdo->query(
		"SELECT channelId, channelName, channelTopic
		FROM channels
		WHERE channelDeleted != 'true'
		ORDER BY channelId")->fetchAll(PDO::FETCH_ASSOC));
}

/**
 * Returns all messsages in a chennel
 * @param channelId the id of the channel to get all the mesages from
 * @return an array with all the message objects
 */
function getMessages($channelId) {
	$pdo = connectDB();
	$stmt = $pdo->prepare(
		"SELECT messageId, messageAuthorId, messageTimestamp, messageContent
		FROM messages
		WHERE messageChannelId = ?
		AND messageDeleted != 'true'
		ORDER BY messageTimestamp");
	$stmt->execute([$channelId]);
	return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

/**
 * Checks if a login already exists
 * @param userLogin the login to check
 * @return true if the login already exists
 */
function userLoginExists($userLogin) {
	$pdo = connectDB();
	$stmt = $pdo->prepare(
		"SELECT userLogin
		FROM users
		WHERE userLogin = ?");
	$stmt->execute([$userLogin]);
	return sizeof($stmt->fetchAll(PDO::FETCH_ASSOC)) != 0;
}

/**
 * Returns the timestamp of a user
 * @param userLogin the user to get the timestamp from
 * @return the timestamp when the user joined
 */
function getUserTimestamp($userLogin) {
	$pdo = connectDB();
	$stmt = $pdo->prepare(
		"SELECT userJoinTimestamp
		FROM users
		WHERE userLogin = ?");
	$stmt->execute([$userLogin]);
	return $stmt->fetch()[0];
}

/**
 * Returns the password of an user
 * @param userLogin the login of the user to get the password from
 * @return the password the user
 */
function getUserPassword($userLogin) {
	$pdo = connectDB();
	$stmt = $pdo->prepare(
		"SELECT userPassword
		FROM users
		WHERE userLogin = ?");
	$stmt->execute([$userLogin]);
	return $stmt->fetch()[0];
}

/**
 * Adds a new user in the database
 * @param userId the id of the new user
 * @param userLogin the login of the new user
 * @param userPassword the new password of the user
 * @param userJoinTimestamp the timestamps when the new user joined
 * @param userToken the token of the user
 * @param username the name of the new user
 */
function registerNewUser($userId, $userLogin, $userPassword, $userJoinTimestamp, $userToken) {
	$pdo = connectDB();
	$stmt = $pdo->prepare(
		"INSERT INTO users (userId, userLogin, userJoinTimestamp, userPassword, userToken, userName, userStatus, userIcon, userDeleted)
		VALUES (:userId, :userLogin, :userJoinTimestamp, :userPassword, :userToken, :userName, 'offline', '', 'false')");
	$stmt->bindParam(":userId", $userId);
	$stmt->bindParam(":userLogin", $userLogin);
	$stmt->bindParam(":userJoinTimestamp", $userJoinTimestamp);
	$stmt->bindParam(":userPassword", $userPassword);
	$stmt->bindParam(":userToken", $userToken);
	$stmt->bindParam(":userName", $userLogin);
	$stmt->execute();
}

/**
 * Gets an id for a new user
 * @return the id of the next new user
 */
function getNewUserId() {
	$pdo = connectDB();
	return ($pdo->query(
		"SELECT MAX(userId)
		FROM users"))->fetch()[0] + 1;
}

/**
 * Sets the token for a user
 * @param userToken the new token for th user
 * @param userlogin the user to put the token to
 */
function setUserToken($userToken, $userLogin) {
	$pdo = connectDB();
	$stmt = $pdo->prepare(
		"UPDATE users
		SET userToken = :userToken
		WHERE userLogin = :userLogin");
	$stmt->bindParam(":userToken", $userToken);
	$stmt->bindParam(":userLogin", $userLogin);
	$stmt->execute();
}

/**
 * Checks if the token is valid for one user
 * @param userToken the token to check
 * @return true if one user has this token
 */
function isValidToken($userToken) {
	$pdo = connectDB();
	$stmt = $pdo->prepare(
		"SELECT userToken
		FROM users
		WHERE usertoken = ?");
	$stmt->execute([$userToken]);
	return sizeof($stmt->fetchAll(PDO::FETCH_ASSOC)) == 1;
}

/**
 * Changes the username of the user
 * @param userId the user to change to change the username
 * @param userName the new username of the user
 */
function userNameChange($userId, $userName) {
	$pdo = connectDB();
	$stmt = $pdo->prepare(
		"UPDATE users
		SET userName = :userName
		WHERE userId = :userId");
	$stmt->bindParam(":userName", $userName);
	$stmt->bindParam(":userId", $userId);
	$stmt->execute();
}

/**
 * Creates a new channel in the database
 * @param channelId the id of the new channel
 * @param channelName the name of the new channel
 * @param channelTopic the topic of the new channel
 * @param channelTimestamp the timestamp when the channel has been created
 */
function createNewChannel($channelId, $channelName, $channelTopic, $channelTimestamp) {
	$pdo = connectDB();
	$stmt = $pdo->prepare(
		"INSERT INTO channels (channelId, channelName, channelTopic, channelTimestamp, channelDeleted)
		VALUES (:channelId, :channelName, :channelTopic, :channelTimestamp,'false')");
	$stmt->bindParam(":channelId", $channelId);
	$stmt->bindParam(":channelName", $channelName);
	$stmt->bindParam(":channelTopic", $channelTopic);
	$stmt->bindParam(":channelTimestamp", $channelTimestamp);
	$stmt->execute();
}

/**
 * Gets the new channel id
 * @return the next channel id
 */
function getNewChannelId() {
	$pdo = connectDB();
	return ($pdo->query(
		"SELECT MAX(channelId)
		FROM channels"))->fetch()[0] + 1;
}

/**
 * Changes the name of a channel
 * @param channelId the id of the channel to change the name of
 * @param channelName the new name of the channel
 */
function changeChannelName($channelId, $channelName) {
	$pdo = connectDB();
	$stmt = $pdo->prepare(
		"UPDATE channels
		SET channelName = :channelName
		WHERE channelId = :channelId");
	$stmt->bindParam(":channelId", $channelId);
	$stmt->bindParam(":channelName", $channelName);
	$stmt->execute();
}

/**
 * Changes the topic of a channel
 * @param channelId the id of the channel to change the topic of
 * @param channelTopic the new topic of the channel
 */
function changeChannelTopic($channelId, $channelTopic) {
	$pdo = connectDB();
	$stmt = $pdo->prepare(
		"UPDATE channels
		SET channelTopic = :channelTopic
		WHERE channelId = :channelId");
	$stmt->bindParam(":channelId", $channelId);
	$stmt->bindParam(":channelTopic", $channelTopic);
	$stmt->execute();
}

/**
 * Deletes a channel
 * @param channelId the id of the channel to delete
 */
function deleteChannel($channelId) {
	$pdo = connectDB();
	$stmt = $pdo->prepare(
		"UPDATE channels
		SET channelDeleted = 'true'
		WHERE channelId = :channelId");
	$stmt->bindParam(":channelId", $channelId);
	$stmt->execute();
}

/**
 * Undeletes a channel
 * @param channelId the id of the channel to undelete
 */
function undeleteChannel($channelId) {
	$pdo = connectDB();
	$stmt = $pdo->prepare(
		"UPDATE channels
		SET channelDeleted = 'false'
		WHERE channelId = :channelId");
	$stmt->bindParam(":channelId", $channelId);
	$stmt->execute();
}

/**
 * Adds a new message to the database
 * @param messageId the id of the new message
 * @param messageChannelId the id of the channel the message is sent in
 * @param messageAuthorId the id of the author of the mesage
 * @param messageTimestamp the timestamp the message was sent
 * @param messageContent the content of the new message
 */
function createMessage($messageId, $messageChannelId, $messageAuthorId, $messageTimestamp, $messageContent) {
	$pdo = connectDB();
	$stmt = $pdo->prepare(
		"INSERT INTO messages (messageId, messageChannelId, messageAuthorId, messageContent, messageTimestamp, messageDeleted)
		VALUES (:messageId, :messageChannelId, :messageAuthorId, :messageContent, :messageTimestamp,'false')");
	$stmt->bindParam(":messageId", $messageId);
	$stmt->bindParam(":messageChannelId", $messageChannelId);
	$stmt->bindParam(":messageAuthorId", $messageAuthorId);
	$stmt->bindParam(":messageContent", $messageContent);
	$stmt->bindParam(":messageTimestamp", $messageTimestamp);
	$stmt->execute();
}

?>
