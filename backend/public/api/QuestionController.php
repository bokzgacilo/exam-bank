<?php
class Question
{
  private $conn;

  public function __construct($db)
  {
    $this->conn = $db;
  }
  
  public function create($question, $options, $answer, $category, $name, $subject, $term)
  {
    $query = "INSERT INTO question (question, options, answer, category, created_by, subject, terms) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("sssssss", $question, $options, $answer, $category, $name, $subject, $term);

    if ($stmt->execute()) {
      $last_id = $this->conn-> insert_id;

      $fetch_query = "SELECT * FROM question WHERE id = ?";
      $fetch_stmt = $this->conn->prepare($fetch_query);
      $fetch_stmt->bind_param("i", $last_id);
      $fetch_stmt->execute();
      $result = $fetch_stmt->get_result();

      // Return the fetched row
      return $result->fetch_assoc();
    }

    return false;
  }


  public function viewAll($subject, $type)
  {
    if ($type === "Admin" || $type === "Coordinator") {
      $query = "SELECT * FROM question";
      $stmt = $this->conn->query($query);
    } else if ($type === "Instructor") {
      $query = "SELECT * FROM question WHERE subject = ?";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("s", $subject);
      $stmt->execute();
      $stmt = $stmt->get_result();
    } else {
      return [];
    }

    return $stmt->fetch_all(MYSQLI_ASSOC);
  }
  

  public function view($id)
  {
    $query = "SELECT * FROM exams WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc();
  }

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
