<?php
require("./../database.php");
try{
echo
"{
	\"type\":\"messages\",
	\"data\":" . json_encode(getMessages(intval($_GET['channelId'] ?? 0, 10))) . "
}";
} catch (Exception $e) {
echo "";
}
?>
