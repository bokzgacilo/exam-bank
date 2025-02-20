<?php
class User
{
  private $conn;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  // Create a new exam
  public function create($name, $type, $assigned_subject, $username, $password)
  {
    $query = "INSERT INTO user (name, type, assigned_subject, username, password) VALUES (?, ?, ?, ?, ?)";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("sssss", $name, $type, $assigned_subject, $username, $password);
    return $stmt->execute();
  }

  // Read all user
  public function viewAll()
  {
    $query = "SELECT * FROM user WHERE type <> 'admin'";
    $result = $this->conn->query($query);
    return $result->fetch_all(MYSQLI_ASSOC);
  }

  // Read a single exam
  public function view($id)
  {
    $query = "SELECT * FROM user WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc();
  }

  // Update an exam
  public function edit($id, $title, $description, $date)
  {
    $query = "UPDATE user SET title = ?, description = ?, exam_date = ? WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("sssi", $title, $description, $date, $id);
    return $stmt->execute();
  }

  public function login($username, $password)
  {
    $stmt = $this->conn->prepare("SELECT * FROM user WHERE username = ? AND password = ?");
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
      $row = $result->fetch_assoc();

      return json_encode($row);
    }else {
      return [];
    }
  }

  public function change_password($id, $password)
  {
    $query = "UPDATE user SET password = ? WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("si", $password, $id);
    return $stmt->execute();
  }

  public function change_status($id, $status)
  {
    $query = "UPDATE user SET status = ? WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("si", $status, $id);
    return $stmt->execute();
  }

  // Delete an exam
  public function delete($id)
  {
    $query = "DELETE FROM user WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $id);
    return $stmt->execute();
  }
}