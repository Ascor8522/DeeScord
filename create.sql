CREATE TABLE "channels" (
  `channelId` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
  `channelName` TEXT,
  `channelTopic` TEXT,
  `channelTimestamp` INTEGER NOT NULL,
  `channelDeleted` TEXT NOT NULL
)

CREATE TABLE "messages" (
  `messageId` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
  `messageChannelId` INTEGER NOT NULL,
  `messageAuthorId` INTEGER NOT NULL,
  `messageContent` TEXT,
  `messageTimestamp` INTEGER NOT NULL,
  `messageDeleted` TEXT NOT NULL
)

CREATE TABLE "users" (
  `userId` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
  `userLogin` TEXT NOT NULL UNIQUE,
  `userJoinTimestamp` INTEGER NOT NULL,
  `userPassword` TEXT NOT NULL,
  `userToken` TEXT,
  `userName` TEXT NOT NULL,
  `userStatus` TEXT NOT NULL,
  `userIcon` TEXT,
  `userDeleted` TEXT NOT NULL
)
