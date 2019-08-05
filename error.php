if (defined($_POST["error"])) {
	file_put_contents("./bugreports/" . time() . ".txt", $_POST["error"], FILE_APPEND);
}
