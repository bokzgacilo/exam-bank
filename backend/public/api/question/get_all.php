<?php
  header("Access-Control-Allow-Origin: http://localhost:5173");
  header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Authorization");

  include("../../config/database.php");

  $result = $conn->query("SELECT * FROM question");

  if ($result->num_rows > 0) {
    $questions = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($questions);
  } else {
    echo json_encode([]);
  }

  $conn->close();
?>
