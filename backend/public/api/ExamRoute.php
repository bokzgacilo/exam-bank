<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once '../config/database.php';
require_once 'ExamController.php';

$exam = new Exam($conn);

$action = $_GET['action'] ?? '';

if ($action === 'viewAll') {
    $exams = $exam -> viewAll();
    echo json_encode($exams);
} else {
    echo json_encode(["message" => "Invalid action"]);
}
?>