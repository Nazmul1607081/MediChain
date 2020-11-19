<?php
     $uid   = $_POST['uid'];
     $password = $_POST['password'];
     $fname = $_POST['fname'];
     $lname = $_POST['lname'];
     $gender = $_POST['gender'];
     $work_place = $_POST['work_place'];
     $qualification = $_POST['qualification'];
     $exprience = $_POST['exprience'];
     $department = $_POST['department'];
     $wallet_address = $_POST['wallet_address'];
     echo $uid. " " .$password." testing ";     
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


  if (getimagesize($_FILES['imagefile']['tmp_name']) == false) {
  echo '<br />Please Select An Image.';
  } else {
  //declare variables
 $timage = $_FILES["imagefile"]["tmp_name"];
  // $name = $_FILES['imagefile']['name'];
 //$image = base64_encode(addslashes(file_get_contents($timage)));
 $image = addslashes(file_get_contents($timage));
  //$image = addslashes(file_get_contents($_FILE['imagefile']['tmp_name']));
  $sql = "INSERT INTO `doctors` (`did`, `uid`, `password`, `fname`, `lname`,`image`, `gender`, `work_place`, `qualification`, `experience`, `department`,`wallet_address`) VALUES (NULL, '$uid', '$password', '$fname', '$lname','$image','$gender', '$work_place', '$qualification',  '$exprience', '$department','$wallet_address')";
  if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
    header("Location: index.php");
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
  }
  

$conn->close();
?>

<?php
?>