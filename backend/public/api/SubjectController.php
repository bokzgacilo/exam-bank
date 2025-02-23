<?php
class Subject
{
  private $conn;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function create($name)
  {
    $query = "INSERT INTO subjects (name) VALUES (?)";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("s", $name);

    if ($stmt->execute()) {
      $last_id = $this->conn->insert_id;

      $fetch_query = "SELECT * FROM subjects WHERE id = ?";
      $fetch_stmt = $this->conn->prepare($fetch_query);
      $fetch_stmt->bind_param("i", $last_id);
      $fetch_stmt->execute();
      $result = $fetch_stmt->get_result();

      return $result->fetch_assoc();
    }

    return false;
  }

  public function GetAllSubjects($type)
  {
    if ($type === "Admin" || $type === "Coordinator") {
      $query = "SELECT * FROM subjects";
      $stmt = $this->conn->query($query);
    } else {
      return [];
    }

    return $stmt->fetch_all(MYSQLI_ASSOC);
  }


  public function viewAll()
  {
    $query = "SELECT * FROM subjects"; // No WHERE condition
    $stmt = $this->conn->query($query);

    return $stmt->fetch_all(MYSQLI_ASSOC);
  }
}
