import axios from "axios";
import UIkit from "uikit";

export default class EditorImages {
  constructor(element, virtualElement, ...cbs){
    this.element = element;
    this.virtualElement = virtualElement;

    this.element.addEventListener("click", () => this.onClick());
    this.imgUploader = document.querySelector("#img-upload")
    
    this.loading = cbs[0];
    this.loaded = cbs[1];

  }

  onClick(){
    this.imgUploader.click();
    this.imgUploader.addEventListener("change", () => {
      
      if(this.imgUploader.files && this.imgUploader.files[0]){
        let formData = new FormData();
        formData.append("image", this.imgUploader.files[0]);
        this.loading();
        axios.post("./api/uploadImage.php", formData, {
          headers:{"Content-Type": "multipart/form-data",}
        }).then((res) => {
          this.virtualElement.src = this.element.src = `./img/${res.data.src}`

        }).catch(() => UIkit.notification({message: 'Ошиюка', status: 'danger'})).finally(()=>{
          console.log("хехех");
          this.imgUploader.value = "";
          this.loaded();
        })
      }
    })
  }
  


}