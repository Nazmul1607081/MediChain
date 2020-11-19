<?php
session_start();
echo 'ok';
?>
<?php
     $mobile_number   = $_POST['mobile_number'];
     $condition = $_POST['condition'];
     $temparature = $_POST['temparature'];
     $pressure = $_POST['pressure'];
     $area = $_POST['area'];
     $city = $_POST['city'];
     $division = $_POST['division'];
     $postal = $_POST['postal'];
     
     echo $mobile_number;     
?>



<?php
$servername = "localhost";
$username = "username";
$dbpass = "";
$dbname = "mydb";



// Create connection
$conn = new mysqli($servername, $username, $dbpass, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
$uid = $_SESSION["uid"];

$sql = "SELECT * FROM patients WHERE uid='$uid'";
echo $sql;
$result = $conn->query($sql);
$pid = "null";
$did = $_SESSION['did'];

//date_default_timezone_set('Asia/Bangladesh');
$dt = date('Y-m-d H:i:s');

$addr = $area.",".$city.",".$division.",".$postal;
if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    $pid = $row['pid'];
}
} else {
echo "0 results";
}
echo 'pid = '.$pid;

  $sql = "INSERT INTO `apointments` (`aid`, `pid`, `did`, `rtime`, `dtime`, `initial_condition`, `temperature`, `pressure`, `test`, `advice`, `mobile_number`, `address`) VALUES (NULL, '$pid', '$did', '$dt','','$condition', '$temparature', '$pressure', '', '', '$mobile_number', '$addr')";
  if ($conn->query($sql) === TRUE) {
    echo "Successful";
    header("Location: index.php");
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
  
  

$conn->close();
?>

<?php
?>