import React, { useState, useEffect, useCallback, useRef } from "react"


const EditorMeta = (props) => {
  const [meta, setMeta] = useState({title: '', keywords: '', description: ''})
  const {modal, target, virtualDom} = props;
  
  const title = useRef();
  const keywords = useRef()
  const description = useRef()
  useEffect(()=>{
    virtualDom ? getMeta(virtualDom) : false;
    //console.log(virtualDom)
  }, [virtualDom]);

  useEffect(()=>{

  }, [])


  //Получим уже имеющиеся мета данные
  const getMeta = useCallback((virtualDom) => {
    title.current = virtualDom.head.querySelector("title") || virtualDom.head.appendChild(virtualDom.createElement("title"));
    keywords.current = virtualDom.head.querySelector("meta[name='keywords']");

    if(!keywords.current){
      keywords.current = virtualDom.head.appendChild(virtualDom.createElement("meta"))
      keywords.current.setAttribute("name", "keywords")
      keywords.current.setAttribute("content", "")

    }
    description.current = virtualDom.head.querySelector("meta[name='description']");
    if(!description.current){
      description.current = virtualDom.head.appendChild(virtualDom.createElement("meta"))
      description.current.setAttribute("name", "description")
      description.current.setAttribute("content", "")
    }

    setMeta({
      title: title.current.innerHTML,
      keywords: keywords.current.getAttribute("content"),
      description: description.current.getAttribute("content")
    })
   
  }, [title, keywords, description, virtualDom, meta])
  //Сохраняем мета теги
  const applyMeta = () => {
    title.current.innerHTML = meta.title
    keywords.current.setAttribute("content", meta.keywords);
    description.current.setAttribute("content", meta.description);
  }

  const valueChangeHandler = (evt) => {
    
    if(evt.target.getAttribute("data-title")){
      setMeta((state) => ({...state, title: evt.target.value}))
    } else if(evt.target.getAttribute("data-key")){
      
      setMeta((state) => ({...state, keywords:evt.target.value}))
    }else{
 
      setMeta((state) => ({...state, description: evt.target.value}));
    }
  }
  return(
  <>
    <div id={target} uk-modal={modal.toString()} container="false">
      <div className="uk-modal-dialog uk-modal-body">
        <h2 className="uk-modal-title">Редактирование meta-tags</h2>

        <form>
          <div className="uk-margin">
            <input data-title 
            className="uk-input" type="text" placeholder="Title" value={meta.title} onChange={(evt) => valueChangeHandler(evt)}/>
          
          </div>

          <div className="uk-margin">
            <textarea  data-key onChange={(evt) => valueChangeHandler(evt)}
            className="uk-textarea" rows="5" placeholder="Keywords" value={meta.keywords}></textarea>
          </div>
          
          <div className="uk-margin">
            <textarea  data-descr onChange={(evt) => valueChangeHandler(evt)}
            className="uk-textarea" rows="5" placeholder="Description" value={meta.description}></textarea>
          </div>

        </form>

        <p className="uk-text-right">
          <button className="uk-button uk-button-default uk-modal-close" type="button">Отменить</button>
          <button onClick={applyMeta}
             className="uk-button uk-button-primary uk-modal-close" 
             type="button">Применить</button>                   
        </p>
      </div>
    </div>
  </>
  )
}

export default EditorMeta