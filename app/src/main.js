import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";

//import 'bootstrap/dist/css/bootstrap.min.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// //Скрипт вывода имен файлов на страницу
// function getPageList(){
 
//   $("h1").remove();
//   $.get("./api", data => {
//     data.forEach(file => {
//       $("body").append(`<h1>${file}</h1>`)
//     });
//   }, "JSON");

// }

// //Вызов функции в начале
// getPageList();

// $("button").click(() => {
//   $.post("./api/createPage.php", {
//     "name": $("input").val()
//   }, () => {
//     getPageList(); //И при успешном запросе
//   })
//   .fail(() => {
//     alert("Страница уже есть");
//   })
// });