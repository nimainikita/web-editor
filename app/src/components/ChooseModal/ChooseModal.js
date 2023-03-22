import React from "react"
import { NavItem } from "reactstrap"


const ChooseModal = ({modal, target, data, redirect}) => {

  const list = data.map(item => {
    if(item.time){
      return(
        <li key={item.file}>
          <a onClick={(evt) => redirect(evt, item.file)} className="uk-link-muted uk-modal-close" href="#">Backup от: {item.time}</a>
        </li>
      )
    }else{
      return(
        <li key={item}>
          <a onClick={(evt) => redirect(evt, item)} className="uk-link-muted uk-modal-close" href="#">{item}</a>
        </li>
      )
    }

  })

  let message;
  if(data.length < 1){
    message = <div>Backup'ов нет!</div>
  }

  return(
    <div id={target} uk-modal={modal.toString()} container="false">
      <div className="uk-modal-dialog uk-modal-body">
        <h2 className="uk-modal-title">Открыть</h2>
        {message}
        <ul className="uk-list uk-list-divider">
          {list}
        </ul>
        <p className="uk-text-right">
          <button className="uk-button uk-button-default uk-modal-close" type="button">Отменить</button>
                         
        </p>
      </div>
    </div>

  )
}
export default ChooseModal;