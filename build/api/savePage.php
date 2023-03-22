<?php
session_start();
if($_SESSION["auth"] != true){
  header("HTTP/1.0 403 Forbidden");
  die();
}

$_POST = json_decode(file_get_contents("php://input"), true); //Посылаем пост запрос в апи в виде json

$file = $_POST["pageName"]; 
$newHTML = $_POST["html"]; //Новый html файл

if(!is_dir("../backups/")){
  mkdir("../backups/");
}

$backups = json_decode(file_get_contents("../backups/backups.json"));

if(!is_array($backups)){
  $backups = []; //будем записывать в формат json все данные когда будет создаваться новая копия
}


if($newHTML && $file){
  $backupFileName = uniqid() . ".html";

  copy("../../" . $file, "../backups/" . $backupFileName); //Копируем файл в backup, создавая уникальное название
  array_push($backups, ["page" => $file, "file" => $backupFileName, "time" => date("H:i:s d:m:y")]);
  file_put_contents("../backups/backups.json", json_encode($backups)); //В json кладем закодированный в json массив backups ( этот файл будем отдавать юзеру )
  file_put_contents("../../" . $file, $newHTML); //Кладем контент из файла в новый файл
}else{
  header("HTTP/1.0 400 Bad Request"); //Возвращаем заголовок в случае если файлa нет
  
}
