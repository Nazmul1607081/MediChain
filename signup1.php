<?php
     $uid   = $_POST['uid'];
     $password = $_POST['password'];
     $fname = $_POST['fname'];
     $lname = $_POST['lname'];
     $gender = $_POST['gender'];
     $wallet_address = $_POST['wallet_address'];
     echo $uid. " " .$password;     
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

$sql = "INSERT INTO `patients` (`pid`, `uid`, `password`, `fname`, `lname`, `gender`,  `wallet_address`) VALUES (NULL, '$uid', '$password', '$fname', '$lname','$gender', '$wallet_address')";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
    header("Location: index.php");
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
$conn->close();
?>