<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php';
require_once 'QuestionController.php';

$question = new Question($conn);

$action = $_GET['action'] ?? '';

switch ($action) {
    case "create":
        if ($_SERVER["REQUEST_METHOD"] !== "POST") {
            echo json_encode(["message" => "Invalid request method"]);
            exit;
        }
    
        $data = json_decode(file_get_contents("php://input"), true);
    
        if (!$data || !isset($data["question"], $data["options"], $data["answer"], $data["category"], $data["created_by"], $data["subject"])) {
            echo json_encode(["message" => "Invalid input"]);
            exit;
        }
    
        $optionsJson = json_encode($data["options"]);
        $answerJson = json_encode($data["answer"]);
        $termJson = json_encode($data["terms"]);
    
        // Create the question and get the newly inserted row
        $newQuestion = $question->create(
            $data["question"],
            $optionsJson,
            $answerJson,
            $data["category"],
            $data["created_by"],
            $data["subject"],
            $termJson
        );
    
        if ($newQuestion) {
            echo json_encode([
                "message" => "Question created successfully",
                "question" => $newQuestion
            ]);
        } else {
            echo json_encode(["message" => "Failed to create question"]);
        }
        break;    

    case "viewAll":
        if ($_SERVER["REQUEST_METHOD"] !== "POST") {
            echo json_encode(["message" => "Invalid request method"]);
            exit;
        }

        $data = json_decode(file_get_contents("php://input"), true);
        $questions = $question -> viewAll($data["subject"], $data["type"]);

        echo json_encode($questions);
        break;

    default:
        echo json_encode(["message" => "Invalid action"]);
}
?>
