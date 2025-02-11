<?php
  if(!isset($_GET['id'])){
    header("location: ../index.php");
    exit();
  }else {
    echo $_GET['id'];
  }
?>