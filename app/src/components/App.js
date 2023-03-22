import "../helpers/iframeLoader.js"; // волшебная пилюля
import axios from "axios";
import React, { useState, useEffect, useRef, useCallback } from "react";
import useHelperDom from "../helpers/use-helper.js";
import EditorText from "./EditorText/EditorText.js"; 
import EditorMeta from "./EditorMeta/EditorMeta.js";
import EditorImages from "./EditorImages/EditorImages.js";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Spinner from "./Spinner/Spinner.js";
import UIkit from "uikit";
import ConfirmModal from "./ConfirmModal/ConfirmModal.js";
import ChooseModal from "./ChooseModal/ChooseModal.js";
import Panel from "./Panel/Panel.js";
import Login from "./Login/Login.js";
const App = () => {
  const [pageList, setPageList] = useState([]); //Это наш список страниц
  const [backupList, setBackupList] = useState([]);//Список бэкапов
  const [newPageName, setNewPageName] = useState(""); //А это имя страницы
  const [currentPage, setCurrentPage] = useState("index.html"); //Текущая страница
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [loginError, setIsLoginError] = useState(false);
  const virtualDom = useRef();
 
  const iframe = useRef(); //наш фрейм
  //Свой хук
  const {parseStringDOM, wrapTextNodes, unwrapTextNodes, domToString, wrapImages, unWrapImages} = useHelperDom();

  //Вызываем функцию init только когда впервые отрендерится компонент
  useEffect(() => {
    checkAuth();
    init(null, currentPage);
    
  }, [currentPage, isAuth]);


  const checkAuth = () => {
    axios.get("./api/checkAuth.php")
          .then(res => {
            setIsAuth(res.data.auth)
          })
  }
  const login = (pass) => {
    if(pass.length >= 8){
      axios.post("./api/login.php", {"password": pass})
            .then(res=>{
              setIsAuth(res.data.auth);
              setIsLoginError(!res.data.auth);
            })
    }else{
      setIsLoginError(true);
    }
  }
  const logout = () => {
    axios.get("./api/logout.php")
          .then(() => {
            window.location.replace("/");
          })
  }
  //Принимает название страницы, открывает ее
  const init = (evt, page) => {
    if(evt){
      evt.preventDefault();
    }
    if(isAuth){ 
      loading()
      //iframe.current = document.querySelector('iframe'); //наш фрейм: определяем его селектором 
      open(page, loaded); //открывает страницу
      loadPageList();
      loadBackupList();
    }

  }
  
  //Здесь мы устанавливаем путь динамический к нужной странице
  const open = useCallback((page, cb) => {
    setCurrentPage(page) //Устанавливаем путь к странице + сброс кэширования

    //Посылаем запрос на сервер и получаем страницу
    axios.get(`../${page}?rnd=${Math.random()}`).then(res => parseStringDOM(res.data)) //Получаем чистый исходный код страницы в виде строки и превращаем в DOM структуру
      .then(wrapTextNodes) //Метод оборачивает все текстовые ноды и оборачиваем в свой спец. тег чтобы редачить его
      .then(wrapImages) //Оборачиваем при открытии страницы
      .then(dom => { //Сохраняем "чистую" копию в virtual dom. На этом моменте чистая копия === загрязненной
        virtualDom.current = dom;
        return dom;       
      })
      .then(domToString) //Превращаем DOM дерево в строку
      .then(html => axios.post("./api/saveTemplate.php", {html})) //Отправка строки dom на сервер. На сервере создается новая html страница с нужной структурой
      .then(() => iframe.current?.load("../s42069m2soroka28loool.html")) //Загружаем temp.html в iframe (страницу, созданную выше)***
      .then(() => axios.post("./api/deleteTempPage.php"))
      .then(() => enabelEditing()) //iframe готов - значит врубаем функцию для доступа к редактированию элементов
      .then(() => injectStyles()) //Активируем функцию для добавления стилей
      .then(cb);
                          

    loadBackupList()
  }, [virtualDom, iframe, currentPage])
  
  //Сохранить файл на сервере
  const save = useCallback(async (cbSuccess, cbError, toggle) => {
    loading();
    const newDom = virtualDom.current?.cloneNode(virtualDom); //Копируем данные, лежащие в виртуальном dom
    unwrapTextNodes(newDom);  //Убираем редактирующие теги 
    unWrapImages(newDom); //при сохранении убираем возможность редактирования
    const html = domToString(newDom) //Структуру dom делаем строкой
    await axios.post("./api/savePage.php", {pageName: currentPage, html}) //Object notation вместо html: html
          .then(toggle)
          .then(cbSuccess)
          .catch(cbError)
          .finally(loaded);
          
          
    loadBackupList(); 
  }, [virtualDom, currentPage]);
  
  //Добавляем возможность редактирования
  const enabelEditing = useCallback(() => {
    iframe.current.contentDocument.body.querySelectorAll("text-editor").forEach(element => {
      const id = element.getAttribute("nodeid");
      const virtualElement = virtualDom.current?.body.querySelector(`[nodeid="${id}"]`);

      new EditorText(element, virtualElement) //Вынесли код в класс
    });


    iframe.current.contentDocument.body.querySelectorAll("[editableimgid]").forEach(element => {
      const id = element.getAttribute("editableimgid");
      const virtualElement = virtualDom.current?.body.querySelector(`[editableimgid="${id}"]`);

      new EditorImages(element, virtualElement, loading, loaded) //Вынесли код в класс
    })
  }, [iframe, virtualDom]);



  //Загружаем список страниц
  const loadPageList = () => {
      axios.get("./api/pageList.php").then(response => setPageList(response.data)); //data - то что возвращает axios, в нем нужная информация
  };
  const loadBackupList = useCallback(() => {
    axios.get("./backups/backups.json")
          .then(res => setBackupList(res.data.filter(backup => {
            return backup.page === currentPage;
          })))
  }, [currentPage])
  
  const restoreBackup = useCallback((evt, backup) => {
    if(evt){
      evt.preventDefault();
    }
    UIkit.modal.confirm("Несохраненные данные будут удалены. Восстановить страницу?", {labels:{ok: "Восстановить", cancel:"Отменить"}})
    .then(() => {
      loading();
      return axios.post("./api/restoreBackup.php", {"page": currentPage, "file":backup })
    })
    .then(()=>{
      open(currentPage, loaded);
    })
  }, [currentPage])
  //ЗДЕСЬ СДЕЛАЕМ СВОИ СТИЛИ ДЛЯ РАМКИ РЕДАКТИРОВАНИЯ
  const injectStyles = () => {
    const style = iframe.current.contentDocument.createElement("style");
    style.innerHTML = `
      text-editor:hover{
        outline: 3px solid skyblue;
        outline-offset:3px;
        border-radius:2px;
      }

      text-editor:focus{
        outline: 3px solid red;
        border-radius:2px;
        outline-offset:3px;
      }

      [editableimgid]:hover{
        outline: 3px solid skyblue;
        outline-offset:3px;
        border-radius:2px;
      }
    `;

    iframe.current.contentDocument.head.appendChild(style);
  }

  

  const loading = () => {
    setIsLoading(true);
  }
  const loaded = () => {
    setIsLoading(false);
  }

  let spinner;

  isLoading ? spinner = <Spinner active/> : spinner= <Spinner />
  if(!isAuth){
    return <Login login={login} passErr={loginError}/>
  }
  const modal = true;
  return(
  <>
    
    <iframe ref={iframe} src="" frameBorder="0"></iframe>
    <input id="img-upload" type="file" accept="image/*" style={{display: "none"}}/>

    {spinner}
    
    <Panel />

    <ConfirmModal 
    text={{
      title:'Сохранение',
      description: 'Вы действительно хотите сохранить изменения?',
      button: "Опубликовать"
    }}
    modal={modal} 
    target={'modal-save'} 
    method={save}/>
    <ConfirmModal 
    text={{
      title:'Выход',
      description: 'Вы действительно хотите выйти?',
      button: "Выйти"
    }}
    modal={modal} 
    target={'modal-logout'} 
    method={logout}/>
  
    <ChooseModal modal={modal} target={'modal-open'} data={pageList} redirect={init}/>
    <ChooseModal modal={modal} target={'modal-backup'} data={backupList} redirect={restoreBackup}/>
    <EditorMeta modal={modal} target={'modal-meta'} virtualDom={virtualDom.current}/>

  </>
  )
}

export default App;