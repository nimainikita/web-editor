function useHelperDom(){
  //Разбираем код страницы в DOM дерево
  const parseStringDOM = (str) => {
    const parser = new DOMParser(); //DOMParser парсит html/xml, содержащиеся в строке DOM
    return parser.parseFromString(str, "text/html");
  };

  //Найти все текстовые ноды и обернуть их в редактируемые теги
  const wrapTextNodes = (dom) => {
    const body = dom.body; //получаем body тег нашего iframe
    let textNodes = [];//Сюда складываем каждую отдельную ноду с текстом

    function recursy (element) {
      element.childNodes.forEach(node => { //Получаем всех детей element и выводим в консоль
          
      //Здесь мы проверяем, нашли ли мы текстовую ноду и пустая ли это нода. Заменяем пробелы на пустой текст если встречаются и проверяем больше нуля ли текст
        if(node.nodeName === "#text" && node.nodeValue.replace(/\s+/g, "").length > 0){ // если мы зашли в дочерний элемент и наткнулись на текст, то это то что надо
             textNodes.push(node); //Пушим ноды в массив
        }else{ //если наткнулись не на текст - снова перебираем всю страницу
            recursy(node);
        }
      })
    };

    recursy(body); //запускаем функцию на body страницы, этим самым переходя по каждому дочернему элементу
      
    //Даем каждой текстовой ноде возможность редактирования
    textNodes.forEach((node, i) => {
      const wrapper = dom.createElement("text-editor"); //Создаем свой тег враппеп для текста
      node.parentNode.replaceChild(wrapper, node); //заменяем тег в который обернут текст своим тегом
      wrapper.appendChild(node);  
      wrapper.setAttribute("nodeid", i);
    });

    return dom;
  };

  //Перебираем теги и убираем тег text-editor
  const unwrapTextNodes = (dom) => {
    dom.body.querySelectorAll("text-editor").forEach(element => { //Перебираем все наши теги кастомные
      //console.log(element)
      element.parentNode.replaceChild(element.firstChild, element); //Обращаемся к род. ноде элемента и заменяем ее дочернюю ноду
    })
  };

  //Превращение DOM структуры в строку для отправки на сервер
  const domToString = (dom) => {
    //XMLSerializer может быть использован для конвертации веток DOM-дерева или дерева целиком в текст
    const serializer = new XMLSerializer();
    return serializer.serializeToString(dom);
  }
  
  const wrapImages = (dom) => { //Ищем все теги img, проходимся по картинкам и устанавливаем атрибут
    dom.body.querySelectorAll("img").forEach((img, i) => { //Цикл принимает каждую отдельную картинку и номер по порядку
      img.setAttribute("editableimgid", i)
    });

    
    return dom
  }
  const unWrapImages = (dom) => { //Удаляем атрибут
    dom.body.querySelectorAll("[editableimgid]").forEach(img => { 
      img.removeAttribute("editableimgid")
    });
  }

  return{parseStringDOM, wrapTextNodes, unwrapTextNodes, domToString, wrapImages, unWrapImages};
  
}

export default useHelperDom;