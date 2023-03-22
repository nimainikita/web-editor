<?php
session_start();
if($_SESSION["auth"] != true){
  header("HTTP/1.0 403 Forbidden");
  die();
}
//Выведим все файлы html которые есть в проекте project
$htmlFiles = glob("../../*.html"); //glob — находит файловые пути, совпадающие с шаблоном, в д.с. все html в корне project. Возвращает массив страниц
$response = []; //Массив в который поместим названия файлов

foreach($htmlFiles as $file){ //Проходимся по каждому элементу из htmlfiles
   array_push($response, basename($file)); //В новый массив пушим имя файла. basename - берет имя файла
}

echo json_encode($response);//Распарсим в json