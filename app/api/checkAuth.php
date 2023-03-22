<?php
session_start();

if($_SESSION["auth"] === true){ //Проверка если уже авторизован
  echo json_encode(array("auth" => true));
}else{
  echo json_encode(array("auth" => false));
}





