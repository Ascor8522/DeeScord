{
	"type":"users",
	"data": <?php require("./../database.php"); echo json_encode(getUsers())?>
}
