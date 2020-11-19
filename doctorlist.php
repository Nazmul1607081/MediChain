<?php
//insert sql
$docotr_insert = "INSERT INTO `doctors` (`did`, `uid`, `password`, `fname`, `lname`, `gender`, `work_place`, `qualification`, `experience`, `department`) VALUES (NULL, 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a'), (NULL, 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b')";
?>
<?php
$isLoggedin = false;
session_start();
if(!(isset($_SESSION["login"]) && $_SESSION["login"] == "OK")){
    header("Location: login.html");
}
else{
    $isLoggedin = true;
    echo $_SESSION['uid'].$_SESSION['utype'];
}
?>

<?php
class Doctor
{
    public $did;
  public $uid ;
  public $password ;
  public $fname ;
  public $lname ;
  public $image;
  public $gender ;
  public $work_place ;
  public $qualification ;
  public $experience ;
  public $department ;
  public $wallet_address ;
  function __construct($did,$uid,$password,$fname,$lname,$image,$gender,$work_place,$qualification,$experience,$department,$wallet_address) {
    $this->did = $did;
    $this->uid = $uid;
    $this->password = $password;
    $this->fname = $fname;
    $this->lname = $lname;
    $this->image = $image;
    $this->gender = $gender;
    $this->work_place = $work_place;
    $this->qualification = $qualification;
    $this->experience = $experience;
    $this->department = $department;
    $this->wallet_address = $wallet_address;
    
  }
  
}
$doctors = array();
?>

<?php
$servername = "localhost";
$username = "username";
$password = "";
$dbname = "mydb";



// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
$dep = $_GET['department'];
$sql = "SELECT * FROM doctors WHERE department='$dep'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    $d = new Doctor($row['did'],$row['uid'],$row['password'],$row['fname'],$row['lname'],$row['image'],$row['gender'],$row['work_place'],$row['qualification'],$row['experience'],$row['department'],$row['wallet_address']);
    array_push($doctors,$d);

    echo "<a href='doctor.php?did=".$row['did']."'>";
    echo "uid: " . $row["fname"]. " " . $row["lname"]. " " . "<br>";
    echo '</a>';
}
} else {
echo "0 results";
}
$conn->close();
?>



<!doctype html>
<html lang="en">

<head>
    <title> <?php
            echo ucfirst($dep);
            ?> Specialist</title>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="doctorlist.css">
    <link rel="stylesheet" href="main.css">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <script src="https://kit.fontawesome.com/a8a8a17def.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
</head>

<body>
    <!--nav bar-->


    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
        integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous">
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
        integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous">
    </script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
        integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous">
    </script>

    <section>
        <div class="container">
            <h1 class="heading">
                <?php
            echo $dep;
            ?> Specialist
            </h1>
            <div class="card-wrapper">
                <?php
                for ($i=0; $i < count($doctors); $i++) { 
                  ?>
                <div class="card">
                    <img src="image/136_medical-background-vector-l.jpg" alt="card-background" class="card-img">
                    <?php
                    echo '<img alt="profile image" class="profile-img" src="data:image/jpeg;base64,'.base64_encode( $doctors[$i]->image ).'"/>';
                    ?>

                    <h1><?php
                    echo $doctors[$i]->uid;
                    ?></h1>
                    <p class="job-title"><?php
                    echo $doctors[$i]->experience;
                    ?></p>
                    <P class="about">
                        <?php
                    echo $doctors[$i]->qualification;
                    ?></P>
                    <p class="about2">
                        <?php
                    echo $doctors[$i]->work_place;
                    ?>
                    </P>
                    <?php
                    echo "<a class= 'btn' href='doctor.php?did=".$doctors[$i]->did."'>";
                    echo "Book Appointment" . "<br>";
                    echo '</a>';
                    ?>
                    <!-- <a href="#" class="btn">Book Appointment</a> ///for image : "image/download (5).jpg"-->
                    <ul class="social-media">
                        <li><a href="#"><i class="fab fa-facebook-square"></i></a></li>
                        <li><a href="#"><i class="fab fa-twitter-square"></i></a></li>
                        <li><a href="#"><i class="fab fa-instagram"></i></a></li>
                        <li><a href="#"><i class="fab fa-google-plus-square"></i></a></li>
                    </ul>

                </div>
                <?php
                }
                ?>

                <!-- <div class="card">
                    <img src="image/136_medical-background-vector-l.jpg" alt="card-background" class="card-img">
                    <img src="image/download (4).jpg" alt="profile image" class="profile-img">
                    <h1>Md. Rakib Uddin</h1>
                    <p class="job-title">Cancer Specialist</p>
                    <P class="about">
                        MBBS,FCPS from Dhaka Medical College.</P>
                    <p class="about2">
                        Recently working in National Cancer Center,Dhaka.
                    </P>
                    <a href="#" class="btn">Book Appointment</a>
                    <ul class="social-media">
                        <li><a href="#"><i class="fab fa-facebook-square"></i></a></li>
                        <li><a href="#"><i class="fab fa-twitter-square"></i></a></li>
                        <li><a href="#"><i class="fab fa-instagram"></i></a></li>
                        <li><a href="#"><i class="fab fa-google-plus-square"></i></a></li>
                    </ul>

                </div>


                <div class="card">
                    <img src="image/136_medical-background-vector-l.jpg" alt="card-background" class="card-img">
                    <img src="image/download (3).jpg" alt="profile image" class="profile-img">
                    <h1>Md. Samsuzzaman</h1>
                    <p class="job-title">Cancer Specialist</p>
                    <P class="about">
                        MBBS,FCPS from Dhaka Medical College.</P>
                    <p class="about2">
                        Recently working in National Cancer Center,Dhaka.
                    </P>
                    <a href="#" class="btn">Book Appointment</a>
                    <ul class="social-media">
                        <li><a href="#"><i class="fab fa-facebook-square"></i></a></li>
                        <li><a href="#"><i class="fab fa-twitter-square"></i></a></li>
                        <li><a href="#"><i class="fab fa-instagram"></i></a></li>
                        <li><a href="#"><i class="fab fa-google-plus-square"></i></a></li>
                    </ul>

                </div>


                <div class="card">
                    <img src="image/136_medical-background-vector-l.jpg" alt="card-background" class="card-img">
                    <img src="image/images (1).jpg" alt="profile image" class="profile-img">
                    <h1>Md. Anwar Ali</h1>
                    <p class="job-title">Cancer Specialist</p>
                    <P class="about">
                        MBBS,FCPS from Dhaka Medical College.</P>
                    <p class="about2">
                        Recently working in National Cancer Center,Dhaka.
                    </P>
                    <a href="#" class="btn">Book Appointment</a>
                    <ul class="social-media">
                        <li><a href="#"><i class="fab fa-facebook-square"></i></a></li>
                        <li><a href="#"><i class="fab fa-twitter-square"></i></a></li>
                        <li><a href="#"><i class="fab fa-instagram"></i></a></li>
                        <li><a href="#"><i class="fab fa-google-plus-square"></i></a></li>
                    </ul>

                </div> -->
                < </div>
    </section>
</body>

</html>