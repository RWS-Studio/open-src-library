// Welpike

// js for the open-source-library docs

const db_url = "/api/db/docs.json";
let datas = [];

// docs homepage
let api_docs_container = document.querySelector("#api-docs-container"),
    api_docs_search = document.querySelector("#api-docs-search"),
    api_docs_search_share = document.querySelector("#api-docs-search-share");

// doc page
let api_docs_name = document.querySelector("#api-docs-name"),
    api_docs_description = document.querySelector("#api-docs-description"),
    api_docs_tags = document.querySelector("#api-docs-tags"),
    api_docs_text = document.querySelector("#api-docs-text");


function docs_search(){
    // function to search on the doc db directly on the html
    // fields : doc name + tags
    let q = api_docs_search.value.toLowerCase();
    let docs_items = document.querySelectorAll(".api-doc");
    docs_items.forEach(doc => {
        let name = doc.querySelector("h3").textContent.toLocaleLowerCase();
        let tags = doc.getAttribute("data-tags");
        if(name.indexOf(q) != -1 || tags.indexOf(q) != -1){
            doc.style.display = "block";
        }
        else{
            doc.style.display = "none";
        }
    })

    // show the url to access to this page and have the same search request
    api_docs_search_share.innerText = window.location.host+window.location.pathname+"?search="+q;
}

function docs_index_view(datas){
    let counter = 0;

    datas.forEach(doc => {
        let doc_div = document.createElement("a");
        let doc_name = document.createElement("h3");
        let doc_description = document.createElement("p");
        let doc_tags = document.createElement("span");

        doc_name.textContent = doc["name"];
        doc_description.textContent = doc["description"];
        doc_tags.textContent = doc["tags"];

        api_docs_container.append(doc_div);
        doc_div.append(doc_name);
        doc_div.append(doc_tags);
        doc_div.append(doc_description);

        doc_div.classList.add("api-doc");
        doc_name.classList.add("api-doc-name");
        doc_tags.classList.add("api-doc-tags");
        doc_description.classList.add("api-doc-description");

        doc_div.setAttribute("href", "/docs/doc.html?id="+counter);
        doc_div.setAttribute("data-tags", doc["tags"]);

        counter++;
    })

    // to search like docs_search() but directly with the url
    let url = new URL(window.location.href);
    if(url.searchParams.get("search")){
        let q = url.searchParams.get("search").toLowerCase();
        let docs_items = document.querySelectorAll(".api-doc");
        docs_items.forEach(doc => {
            let name = doc.querySelector("h3").textContent.toLocaleLowerCase();
            let tags = doc.getAttribute("data-tags");
            if(name.indexOf(q) != -1 || tags.indexOf(q) != -1){
                doc.style.display = "block";
            }
            else{
                doc.style.display = "none";
            }
        })
        api_docs_search.setAttribute("value", q);

        // show the url to access to this page and have the same search request without show the past share url
        // else is that : /docs/index.html?search=[q]?search=[new_q]
        api_docs_search_share.innerText = window.location.host+window.location.pathname+"?search="+q;
    }
}

function doc_view(datas){
    const url = new URL(window.location.href); 
    const doc_id = url.searchParams.get('id'); // get doc id

    if(!doc_id){
        window.location.href = "/docs/index.html"; // redirect to docs-index
    }

    doc=datas[doc_id];
    
    // to have a <ul> with the tags + a link to search the projects with this tag
    let doc_tags_html = "";
    doc["tags"].forEach(tag => {
        doc_tags_html+="<li><a href='/docs/index.html?search="+tag+"&src="+doc["name"]+"'>"+tag+"</a></li>";
    });
    
    // put values in the html file
    api_docs_name.innerText = doc["name"];
    api_docs_description.innerText = doc["description"];
    api_docs_tags.innerHTML = doc_tags_html;
    api_docs_text.innerText = doc["text"];
}


// determine what to do in function of the page (get with document.body.id)
function determinePage(datas){
    let page = document.body.id;
    if(page=="docs-index"){
        docs_index_view(datas);
    }
    else if(page=="doc"){
        doc_view(datas);
    }
}

// get infos from db (docs.json) and put them in the list datas
fetch(db_url).then((data)=>{
    data.json().then((data)=>{
        datas = data;
        determinePage(datas);
    })
})

// initialisation for the docs search
api_docs_search.addEventListener("keyup", docs_search);
