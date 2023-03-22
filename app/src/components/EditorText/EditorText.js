export default class EditorText {
  constructor(element, virtualElement) {
    this.element = element;
    this.virtualElement = virtualElement;

    this.element.addEventListener("click", () => this.onClick());
    this.element.addEventListener("blur", () => this.onBlur());
    this.element.addEventListener("keypress", (evt) => this.onKeyPress(evt));
    this.element.addEventListener("input", () => this.onTextEdit());

  }

  onClick(){ // Теперь редактирование заголовков включается только если кликнуть прямо на них а не рядом
    this.element.contentEditable = "true";
    this.element.focus(); 
  }
  //Убираем возможность редактирования когда фокус на элементе исчез и клик рядом с ним не включал редактирование
  onBlur(){
    this.element.removeAttribute("contenteditable")
  }

  onKeyPress(evt){
    if(evt.keyCode === 13){
      this.element.blur();
    }
  }

  onTextEdit(){
    //const id = element.getAttribute("nodeid");
    this.virtualElement.innerHTML = this.element.innerHTML; //То что ввел юзер (после равно) записывается в чистую копию
  }
}