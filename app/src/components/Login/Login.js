import React, { useState } from "react";

const Login = (props) => {
  const [pass, setPass] = useState("");

  const onPasswordChange = (evt) => {
    setPass(evt.target.value);
  }
  let logError;
  props.passErr ? logError = <span className="login-error">Пароль неверный</span> : null;
  return(
  <div className="login-container"> 
    <div className="login">
      <h2 className="uk-modal-title uk-text-center">Авторизация</h2>
      <div className="uk-margin-top uk-text-lead">Пароль</div>
      <input 
      type="password" name="" className="uk-input uk-margin-top" placeholder="Пароль" onChange={onPasswordChange} value={pass}/>
      {logError}
      <button onClick={()=>props.login(pass)}
      className="uk-button uk-button-primary uk-margin-top" type="button">Войти</button>

    </div>
  </div>
  )
}

export default Login;