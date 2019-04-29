{
	"type":"channels",
	"data": <?php require("./../database.php"); echo json_encode(getChannels())?>
}
