<?php
//insert sql
$docotr_insert = "INSERT INTO `doctors` (`did`, `uid`, `password`, `fname`, `lname`, `gender`, `work_place`, `qualification`, `experience`, `department`) VALUES (NULL, 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a'), (NULL, 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b')";
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
    echo "<a href='doctor.php?did=".$row['did']."'>";
echo "uid: " . $row["uid"]. " - department: " . $row["department"]. " " . "<br>";
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
    <title>Title</title>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="doctorlist.css">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <script src="https://kit.fontawesome.com/a8a8a17def.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
</head>

<body>

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
            <h1 class="heading">Cancer Specialist</h1>
            <div class="card-wrapper">
                <div class="card">
                    <img src="image/136_medical-background-vector-l.jpg" alt="card-background" class="card-img">
                    <img src="image/download (5).jpg" alt="profile image" class="profile-img">
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

                </div>

                <div class="card">
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

                </div>
                < </div>
    </section>
</body>

</html>