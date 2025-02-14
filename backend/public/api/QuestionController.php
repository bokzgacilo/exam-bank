<?php
class Question
{
  private $conn;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  // Create a new exam
  public function create($title, $description, $date)
  {
    $query = "INSERT INTO exam (title, description, exam_date) VALUES (?, ?, ?)";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("sss", $title, $description, $date);
    return $stmt->execute();
  }

  // Read all exams
  public function viewAll($assigned_subject) {
    if ($assigned_subject === "none") {
        $query = "SELECT * FROM question"; // No WHERE condition
        $stmt = $this->conn->query($query);
    } else {
        $query = "SELECT * FROM question WHERE subject = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $assigned_subject);
        $stmt->execute();
        $stmt = $stmt->get_result();
    }

    return $stmt->fetch_all(MYSQLI_ASSOC);
}



  // Read a single exam
  public function view($id)
  {
    $query = "SELECT * FROM exams WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc();
  }

  // Update an exam
  public function edit($id, $title, $description, $date)
  {
    $query = "UPDATE exams SET title = ?, description = ?, exam_date = ? WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("sssi", $title, $description, $date, $id);
    return $stmt->execute();
  }

  // Delete an exam
  public function delete($id)
  {
    $query = "DELETE FROM exams WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $id);
    return $stmt->execute();
  }
}