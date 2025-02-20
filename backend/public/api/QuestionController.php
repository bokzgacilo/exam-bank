<?php
class Question
{
  private $conn;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  // Create a new exam
  public function create( $question, $options, $answer, $category, $name, $subject)
  {
    $query = "INSERT INTO question (question, options, answer, category, created_by, subject) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("ssssss", $question, $options, $answer, $category, $name, $subject);

    return $stmt->execute();
  }

  public function viewAll($name, $type) {
    if ($type === "Admin" || $type === "Coordinator") {
        $query = "SELECT * FROM question";
        $stmt = $this->conn->query($query);
    } else if ($type === "Instructor") {
        $query = "SELECT * FROM question WHERE created_by = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $name);
        $stmt->execute();
        $stmt = $stmt->get_result();
    } else {
        return [];
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