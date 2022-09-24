class Controls{
     constructor(type){
         this.forward=false;
         this.left=false;
         this.right=false;
         this.reverse=false;
         this.forwardEase=false;
         this.leftEase=false;
         this.rightEase=false;
         this.reverseEase=false;

 
         switch(type){
             case "KEYS":
                 this.#addKeyboardListeners();
                 break;
             case "DUMMY":
                 this.forward=true;
                 break;
         }
     }
 
     #addKeyboardListeners(){
         document.onkeydown=(event)=>{
             switch(event.key){
                 case "ArrowLeft":
                     this.left=true;
                     break;
                 case "ArrowRight":
                     this.right=true;
                     break;
                 case "ArrowUp":
                     this.forward=true;
                     break;
                 case "ArrowDown":
                     this.reverse=true;
                     break;

                 case "ArrowLeft" + "Shift":
                     this.left=true;
                     break;
                 case "ArrowRight" + "Shift":
                     this.right=true;
                     break;
                 case "ArrowUp" + "Shift":
                     this.forward=true;
                     break;
                 case "ArrowDown" + "Shift":
                     this.reverse=true;
                     break;  








             }
         }
         document.onkeyup=(event)=>{
             switch(event.key){
                 case "ArrowLeft":
                     this.left=false;
                     break;
                 case "ArrowRight":
                     this.right=false;
                     break;
                 case "ArrowUp":
                     this.forward=false;
                     break;
                 case "ArrowDown":
                     this.reverse=false;
                     break;

                 case "ArrowLeft" + "Shift":
                     this.left=false;
                     break;
                 case "ArrowRight" + "Shift":
                     this.right=false;
                     break;
                 case "ArrowUp" + "Shift":
                     this.forward=false;
                     break;
                 case "ArrowDown" + "Shift":
                     this.reverse=false;
                     break;
             }
         }
     }
 }