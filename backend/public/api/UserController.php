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
    $query = "SELECT * FROM user";
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

  // Delete an exam
  public function delete($id)
  {
    $query = "DELETE FROM user WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $id);
    return $stmt->execute();
  }
}