// Welpike

// utilities for open-source-library project

// copy
let copy=(e,text)=>{
    e.preventDefault();
    navigator.clipboard.writeText(text).then(()=>{
        alert("Copied : "+text);
    })
}

// ctrl + m = focus on the search input
'use strict';
document.addEventListener('keydown',(event)=>{
    const command = event.key;
    if(command === 'Control'){
        return;
    }
    if(event.ctrlKey){
        if(command === "m"){
            if(document.body.id=="search"){
                document.getElementById("api-search-input").focus();
            }
            else if(document.body.id=="docs-index"){
                document.getElementById("api-docs-search").focus();
            }
        }
    }
}, false);

// show in the console the message "warning"
function msgWarningInConsole(){
    console.warn("Warning.\nDon't paste some code here if you are unsure of what this code will doing.");
}

msgWarningInConsole();
