<?php
session_start();
if($_SESSION["auth"] != true){
  header("HTTP/1.0 403 Forbidden");
  die();
}
$_POST = json_decode(file_get_contents("php://input"), true); //Посылаем пост запрос в апи в виде json
$newFile = "../../" . $_POST["name"] . ".html"; //Форма создаваемого файла

//Проверка если файл существует
if(file_exists($newFile)){
  header("HTTP/1.0 400 Bad Request"); //Возвращаем заголовок в случае если файл есть
}else{
  fopen($newFile, "w"); // открываем файл для редактирования

}






