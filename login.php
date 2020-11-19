<?php
session_start();
     $uid   = $_POST['uid'];
     $password = $_POST['password'];
     $utype = $_POST['utype'];
     echo $uid. " " .$password." ".$utype;     
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

$sql = "SELECT * FROM $utype WHERE uid='$uid' and password='$password'";
echo $sql;
$result = $conn->query($sql);
$count = mysqli_num_rows($result);
echo 'results = '.$count." ".$uid." ".$password;
if ($result->num_rows > 0){
    echo ' login successful';
    $_SESSION["login"] = "OK";
    $_SESSION["uid"] = $uid;
    $_SESSION["utype"] = $utype;
  
    header("Location: index.php");
}
else{
  header("Location: index.php");
    echo ' faild';
}
$conn->close();
?>