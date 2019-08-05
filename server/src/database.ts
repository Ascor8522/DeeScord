import * as sqlite3 from "sqlite3";
import { Channel } from "./interfaces/channel";
import { Message } from "./interfaces/message";
import { User } from "./interfaces/user";
import { UserStatus } from "./interfaces/userStatus";

import { ChannelCreated } from "./messages/channel/channelCreated";
import { ChannelDeleted } from "./messages/channel/channelDeleted";
import { ChannelRenamed } from "./messages/channel/channelRenamed";
import { ChannelTopic } from "./messages/channel/channelTopic";
import { MessageDeleted } from "./messages/message/messageDeleted";
import { MessageEdited } from "./messages/message/messageEdited";
import { MessageSent } from "./messages/message/messageSent";
import { UserIconChanged } from "./messages/user/userIconChanged";
import { UserNameChanged } from "./messages/user/userNameChanged";
import { UserStatusChanged } from "./messages/user/userStatusChanged";

/**
 * Returns all the users from the database
 * @param database the database to make the operation to
 * @return an array with all the user objects
 */
export async function getUsers(database: sqlite3.Database): Promise<User[]> {
	return new Promise<User[]>((resolve, reject): void => {
		database.all(
		`SELECT userId, userName, userStatus, userIcon
		FROM users
		WHERE userDeleted != 'true'
		ORDER BY userName`,
		(err: Error, row: any[]): void => {
			if (err) {
				reject(err);
			}

			const users: User[] = [];
			for (const el of row) {
				users.push(new User(el["userIcon"], el["userId"], el["userName"], el["userStatus"]));
			}
			resolve(users);
		});
	});
}

/**
 * Returns all the channels from the database
 * @param database the database to make the operation to
 * @return an array with all the channel objects
 */
export async function getChannels(database: sqlite3.Database): Promise<Channel[]> {
	return new Promise<Channel[]>((resolve, reject) => {
		database.all(
		`SELECT channelId, channelName, channelTopic
		FROM channels
		WHERE channelDeleted != 'true'
		ORDER BY channelName`,
		(err: Error, row: any[]): void => {
			if (err) {
				reject(err);
			}

			const channels: Channel[] = [];
			for (const el of row) {
				channels.push(new Channel(el["channelId"], el["channelName"], el["channelTopic"]));
			}
			resolve(channels);
		});
	});
}

/**
 * Returns all messsages in a chennel
 * @param database the database to make the operation to
 * @param channelId the id of the channel to get all the mesages from
 * @return an array with all the message objects
 */
export async function getMessages(database: sqlite3.Database, channelId: number): Promise<Message[]> {
	return new Promise<Message[]>((resolve, reject): void => {
		database.all(
		`SELECT messageId, messageAuthorId, messageTimestamp, messageContent
		FROM messages
		WHERE messageChannelId = $channelId
		ORDER BY messageTimestamp`,
		{
			$channelId: channelId,
		},
		(err: Error, row: any[]): void => {
			if (err) {
				reject(err);
			}

			const messages: Message[] = [];
			for (const el of row) {
				messages.push(new Message(el["messageAuthorId"], el["messageChannelId"], el["messageContent"], el["messageId"], el["messageTimestamp"]));
			}
			resolve(messages);
		});
	});
}

/**
 * Checks if a login already exists
 * @param database the database to make the operation to
 * @param userLogin the login to check
 * @return true if the login already exists
 */
export async function userLoginExists(database: sqlite3.Database, userLogin: string): Promise<boolean> {
	return new Promise<boolean>((resolve, reject): void => {
		database.all(
		`SELECT userLogin
		FROM users
		WHERE userLogin = $userLogin`,
		{
			$userLogin: userLogin,
		},
		(err: Error, row: any[]): void => {
			if (err) {
				reject(err);
			}

			resolve(row.length >= 1);
		});
	});
}

/**
 * Returns the timestamp of a user
 * @param database the database to make the operation to
 * @param userLogin the user to get the timestamp from
 * @return the timestamp when the user joined
 */
export async function getUserTimestamp(database: sqlite3.Database, userLogin: string): Promise<number> {
	return new Promise<number>((resolve, reject): void => {
		database.get(
		`SELECT userJoinTimestamp
		FROM users
		WHERE userLogin = $userLogin`,
		{
			$userLogin: userLogin,
		},
		(err: Error, row: any): void => {
			if (err) {
				reject(err);
			}

			resolve(Number.parseInt(row["userJoinTimestamp"], 10));
		});
	});
}

/**
 * Returns the password of an user
 * @param database the database to make the operation to
 * @param userLogin the login of the user to get the password from
 * @return the password the user
 */
export async function getUserPassword(database: sqlite3.Database, userLogin: string): Promise<string> {
	return new Promise<string>((resolve, reject): void => {
		database.get(
		`SELECT userPassword
		FROM users
		WHERE userLogin = $userLogin`,
		{
			$userLogin: userLogin,
		},
		(err: Error, row: any): void => {
			if (err) {
				reject(err);
			}

			resolve(row["userPassword"]);
		});
	});
}

/**
 * Adds a new user in the database
 * @param database the database to make the operation to
 * @param userId the id of the new user
 * @param userLogin the login of the new user
 * @param userPassword the new password of the user
 * @param userJoinTimestamp the timestamps when the new user joined
 * @param userToken the token of the user
 * @param userName the name of the new user
 */
export async function registerNewUser(database: sqlite3.Database, userId: number, userLogin: string, userJoinTimestamp: number, userPassword: string, userToken: string, userName: string): Promise<void> {
	return new Promise<void>((resolve, reject): void => {
		database.run(
		`INSERT INTO users (userId, userLogin, userJoinTimestamp, userPassword, userToken, userName, userStatus, userIcon, userDeleted)
		VALUES ($userId, $userLogin, $userJoinTimestamp, $userPassword, $userToken, $userName, 'offline', '', 'false')`,
		{
			$userId: userId,
			$userJoinTimestamp: userJoinTimestamp,
			$userLogin: userLogin,
			$userName: userName,
			$userPassword: userPassword,
			$userToken: userToken,
		},
		(err: Error): void => {
			if (err) {
				reject(err);
			}

			resolve();
		});
	});
}

/**
 * Gets an id for a new user
 * @param database the database to make the operation to
 * @return the id of the next new user
 */
export async function getNewUserId(database: sqlite3.Database): Promise<number> {
	return new Promise<number>((resolve, reject): void => {
		database.get(
		`SELECT MAX(userId) as m
		FROM users`,
		(err: Error, row: any): void => {
			if (err) {
				reject(err);
			}

			resolve((Number.parseInt(row["m"], 10) || 0) + 1);
		});
	});
}

/**
 * Sets the token for a user
 * @param database the database to make the operation to
 * @param userToken the new token for th user
 * @param userlogin the user to put the token to
 */
export async function setUserToken(database: sqlite3.Database, userToken: string, userLogin: string): Promise<void> {
	return new Promise<void>((resolve, reject): void => {
		database.run(
		`UPDATE users
		SET userToken = $userToken
		WHERE userLogin = $userLogin`,
		{
			$userLogin: userLogin,
			$userToken: userToken,
		},
		(err: Error, row: any): void => {
			if (err) {
				reject(err);
			}

			resolve();
		});
	});
}

/**
 * Checks if the token is valid for one user
 * @param database the database to make the operation to
 * @param userToken the token to check
 * @return true if one user has this token
 */
export async function isValidToken(database: sqlite3.Database, userToken: string): Promise<boolean> {
	return new Promise<boolean>((resolve, reject): void => {
		database.get(
		`SELECT count(userToken) as c
		FROM users
		WHERE usertoken = $userToken`,
		{
			$userToken: userToken,
		},
		(err: Error, row: any): void => {
			if (err) {
				reject(err);
			}

			resolve(row === undefined ? false : Number.parseInt(row["c"], 10) === 1);
		});
	});
}

export async function changeUserIcon(database: sqlite3.Database, userId: number, userIcon: string): Promise<UserIconChanged> {
	return new Promise<UserIconChanged>((resolve, reject): void => {
		database.run(
			`UPDATE users
			SET userIcon = $userIcon
			WHERE userId = $userId`,
			{
				$userIcon: userIcon,
				$userId: userId,
			},
			(err: Error): void => {
			if (err) {
				reject(err);
			}

			resolve(new UserIconChanged(userIcon, userId));
		});
	});
}

/**
 * Changes the username of the user
 * @param database the database to make the operation to
 * @param userId the user to change to change the username
 * @param userName the new username of the user
 */
export async function userNameChange(database: sqlite3.Database, userId: number, userName: string): Promise<UserNameChanged> {
	return new Promise<UserNameChanged>((resolve, reject): void => {
		database.run(
		`UPDATE users
		SET userName = $userName
		WHERE userId = $userId`,
		{
			$userId: userId,
			$userName: userName,
		},
		(err: Error): void => {
			if (err) {
				reject(err);
			}

			resolve(new UserNameChanged(userId, userName));
		});
	});
}

export async function changeUserStatus(database: sqlite3.Database, userId: number, userStatus: UserStatus): Promise<UserStatusChanged> {
	return new Promise<UserStatusChanged>((resolve, reject): void => {
		database.run(
		`UPDATE users
		SET userStatus = $userStatus
		WHERE userId = $userId`,
		{
			$userId: userId,
			$userStatus: userStatus.toString(),
		},
		(err: Error): void => {
			if (err) {
				reject();
			}

			resolve(new UserStatusChanged(userId, userStatus));
		});
	});
}

/**
 * Creates a new channel in the database
 * @param database the database to make the operation to
 * @param channelId the id of the new channel
 * @param channelName the name of the new channel
 * @param channelTopic the topic of the new channel
 * @param channelTimestamp the timestamp when the channel has been created
 */
export async function createNewChannel(database: sqlite3.Database, channelId: number, channelName: string, channelTopic: string, channelTimestamp: number): Promise<ChannelCreated> {
	return new Promise<ChannelCreated>((resolve, reject): void => {
		database.run(
		`INSERT INTO channels (channelId, channelName, channelTopic, channelTimestamp, channelDeleted)
		VALUES ($channelId, $channelName, $channelTopic, $channelTimestamp,'false')`,
		{
			$channelId: channelId,
			$channelName: channelName,
			$channelTimestamp: channelTimestamp,
			$channelTopic: channelTopic,
		},
		(err: Error): void => {
			if (err) {
				reject(err);
			}

			resolve(new ChannelCreated(channelId, channelName, channelTopic));
		});
	});
}

/**
 * Gets the new channel id
 * @param database the database to make the operation to
 * @return the next channel id
 */
export async function getNewChannelId(database: sqlite3.Database): Promise<number> {
	return new Promise<number>((resolve, reject): void => {
		database.get(
		`SELECT MAX(channelId) as m
		FROM channels`,
		(err: Error, row: any): void => {
			if (err) {
				reject(err);
			}

			resolve((Number.parseInt(row["m"], 10) || 0) + 1);
		});
	});
}

/**
 * Changes the name of a channel
 * @param database the database to make the operation to
 * @param channelId the id of the channel to change the name of
 * @param channelName the new name of the channel
 */
export async function changeChannelName(database: sqlite3.Database, channelId: number, channelName: string): Promise<ChannelRenamed> {
	return new Promise<ChannelRenamed>((resolve, reject): void => {
		database.run(
		`UPDATE channels
		SET channelName = $channelName
		WHERE channelId = $channelId`,
		{
			$channelId: channelId,
			$channelName: channelName,
		},
		(err: Error): void => {
			if (err) {
				reject(err);
			}

			resolve(new ChannelRenamed(channelId, channelName));
		});
	});
}

/**
 * Changes the topic of a channel
 * @param database the database to make the operation to
 * @param channelId the id of the channel to change the topic of
 * @param channelTopic the new topic of the channel
 */
export async function changeChannelTopic(database: sqlite3.Database, channelId: number, channelTopic: string): Promise<ChannelTopic> {
	return new Promise<ChannelTopic>((resolve, reject): void => {
		database.run(
		`UPDATE channels
		SET channelTopic = $channelTopic
		WHERE channelId = $channelId`,
		{
			$channelId: channelId,
			$channelTopic: channelTopic,
		},
		(err: Error): void => {
			if (err) {
				reject(err);
			}

			resolve(new ChannelTopic(channelId, channelTopic));
		});
	});
}

/**
 * Deletes a channel
 * @param database the database to make the operation to
 * @param channelId the id of the channel to delete
 */
export async function deleteChannel(database: sqlite3.Database, channelId: number): Promise<ChannelDeleted> {
	return new Promise<ChannelDeleted>((resolve, reject): void => {
		database.run(
		`UPDATE channels
		SET channelDeleted = 'true'
		WHERE channelId = $channelId`,
		{
			$channelId: channelId,
		},
		(err: Error): void => {
			if (err) {
				reject(err);
			}

			resolve(new ChannelDeleted(channelId));
		});
	});
}

/**
 * Undeletes a channel
 * @param database the database to make the operation to
 * @param channelId the id of the channel to undelete
 */
export async function undeleteChannel(database: sqlite3.Database, channelId: number): Promise<void> {
	return new Promise<void>((resolve, reject): void => {
		database.run(
		`UPDATE channels
		SET channelDeleted = 'false'
		WHERE channelId = $channelId`,
		{
			$channelId: channelId,
		},
		(err: Error): void => {
			if (err) {
				reject(err);
			}

			resolve();
		});
	});
}

/**
 * Gets an id for a new message
 * @param database the database to make the operation to
 * @return the id of the next new message
 */
export async function getNewMessageId(database: sqlite3.Database): Promise<number> {
	return new Promise<number>((resolve, reject): void => {
		database.get(
		`SELECT MAX(messageId) as m
		FROM messages`,
		(err: Error, row: any): void => {
			if (err) {
				reject(err);
			}

			resolve((Number.parseInt(row["m"], 10) || 0) + 1);
		});
	});
}

/**
 * Adds a new message to the database
 * @param database the database to make the operation to
 * @param messageId the id of the new message
 * @param messageChannelId the id of the channel the message is sent in
 * @param messageAuthorId the id of the author of the mesage
 * @param messageTimestamp the timestamp the message was sent
 * @param messageContent the content of the new message
 */
export async function createMessage(database: sqlite3.Database, messageId: number, messageChannelId: number, messageAuthorId: number, messageTimestamp: number, messageContent: string): Promise<MessageSent> {
	return new Promise<MessageSent>((resolve, reject): void => {
		database.run(
		`INSERT INTO messages (messageId, messageChannelId, messageAuthorId, messageContent, messageTimestamp, messageDeleted)
		VALUES ($messageId, $messageChannelId, $messageAuthorId, $messageContent, $messageTimestamp,'false')`,
		{
			$messageAuthorId: messageAuthorId,
			$messageChannelId: messageChannelId,
			$messageContent: messageContent,
			$messageId: messageId,
			$messageTimestamp: messageTimestamp,
		},
		(err: Error): void => {
			if (err) {
				reject(err);
			}

			resolve(new MessageSent(messageAuthorId, messageChannelId, messageContent, messageId, messageTimestamp));
		});
	});
}

export async function getUserIdWithToken(database: sqlite3.Database, userToken: string): Promise<number> {
	return new Promise<number>((resolve, reject): void => {
		database.get(
		`SELECT userId
		FROM users
		WHERE userToken = $token
		`,
		{
			$token: userToken,
		},
		(err: Error, row: any): void => {
			if (err) {
				reject(err);
			}

			resolve(Number.parseInt(row["userId"], 10));
		});
	});
}
