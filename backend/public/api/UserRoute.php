<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php';
require_once 'UserController.php';

$user = new User($conn);

$action = $_GET['action'] ?? '';

switch ($action) {
    case "create":
        if ($_SERVER["REQUEST_METHOD"] !== "POST") {
            echo json_encode(["message" => "Invalid request method"]);
            exit;
        }

        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data || !isset($data["name"], $data["role"], $data["assigned_subject"], $data["username"], $data["password"])) {
            echo json_encode(["message" => "Invalid input"]);
            exit;
        }

        $result = $user->create($data["name"], $data["role"], $data["assigned_subject"], $data["username"], $data["password"]);

        echo json_encode(["message" => $result ? "User created successfully" : "Failed to create user"]);
        break;

    case "viewAll":
        if ($_SERVER["REQUEST_METHOD"] !== "GET") {
            echo json_encode(["message" => "Invalid request method"]);
            exit;
        }

        $users = $user->viewAll();
        echo json_encode($users);
        break;

    default:
        echo json_encode(["message" => "Invalid action"]);
}
?>
