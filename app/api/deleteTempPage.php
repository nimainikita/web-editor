<?php
session_start();
if($_SESSION["auth"] != true){
  header("HTTP/1.0 403 Forbidden");
  die();
}
$file = "../../s42069m2soroka28loool.html"; // какой файл удалять

//Проверка если файл существует
if(file_exists($file)){
  unlink($file); //unlink - удаляет файл, принимает путь к файлу
}else{
  header("HTTP/1.0 400 Bad Request"); //Возвращаем заголовок в случае если файла и так нет

}






