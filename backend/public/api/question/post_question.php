<?php
  header("Access-Control-Allow-Origin: http://localhost:5173");
  header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Authorization");
  header("Content-Type: application/json");

  include("../../config/database.php");

  $data = json_decode(file_get_contents("php://input"), true);

  $optionsJson = json_encode($data['options']); 
  $answerJson = json_encode($data['answer']);

  $stmt = $conn->prepare("INSERT INTO question (question, options, answer, category, created_by, subject) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssss", $data['question'], $optionsJson, $answerJson, $data['category'], $data['created_by'], $data['subject']);

  if($stmt -> execute()){
    echo 1;
  }else {
    echo $stmt -> error;
  }

  $stmt->close();
  $conn->close();
?>