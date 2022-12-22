// Welpike

/* to do : 
 * - found a name for the project
 * - create a github org to have a github website to publish our work (name=name of project)
 * - create gihub repo
 * - front-end
 * - seo optimisation (+ og + twitter)
 * - sqlite database (in another repo)
 * - found datas to have a big database
 */

const db_url = "/api/db/db.json";
let datas = [];

// home page
let api_random_project = document.querySelector("#api-random-project");

// project page
let api_name = document.querySelector("#api-name"),
    api_website = document.querySelector("#api-website"),
    api_repo = document.querySelector("#api-repo"),
    api_installation = document.querySelector("#api-installation"),
    api_presentation = document.querySelector("#api-presentation"),
    api_license = document.querySelector("#api-license"),
    api_version = document.querySelector("#api-version"),
    api_tags = document.querySelector("#api-tags"),
    api_other_projects = document.querySelector("#api-other-projects");

// search page
let api_search_input = document.querySelector("#api-search-input"),
    api_search_results = document.querySelector("#api-search-results");

let project = [];

function index_view(datas){
    // go on a random project feature
    let project_id = Math.floor(Math.random() * (datas.length - 0));
    api_random_project.setAttribute("href", "/project.html?id="+project_id);
}

function project_view(datas){
    const url = new URL(window.location.href); 
    const project_id = url.searchParams.get('id'); // get project id

    if(!project_id){
        window.location.href = "/";
    }

    project=datas[project_id];

    // to have a HTML list with the tags + a link to search the projects with this tag
    let project_tags_html = "";
    project["tags"].forEach(tag => {
        project_tags_html+="<li><a href='/search.html?q="+tag+"&src="+project["name"]+"'>"+tag+"</a></li>";
    });

    // put values in the html file
    api_name.innerText = project["name"];
    api_website.setAttribute("href", project["website"]);
    api_repo.setAttribute("href", project["repo"]);
    api_installation.setAttribute("href", project["installation"]);
    api_presentation.innerText = project["presentation"];
    api_license.innerText = project["license"];
    api_license.setAttribute("href", project["license_url"]);
    api_version.innerText = project["version"];
    api_tags.innerHTML = project_tags_html;

    // search projects with this project in their tags
    api_other_projects.setAttribute("href", "/search.html?q="+project["name"]+"&src="+project["name"]);
}

function search_view(datas){
    const url = new URL(window.location.href); 
    let q = url.searchParams.get('q'); // get q
    let q_output = q;
    
    let src = url.searchParams.get('src'); // if it's a link from a #api-other-projects a tag

    if(q){

        q = q.split(" ");

        let search_results = [],
            search_results_ids = [];

        q.forEach(_q => {
            let counter = 0;
            datas.forEach(data => {
                let data_tags = data["tags"];

                if(data["name"] != src && data["name"].toLowerCase() != src){  // check if data == src
                    if(data["name"] == _q || data["name"].toLowerCase() == _q){
                        search_results.push(data);
                        search_results_ids.push(counter);
                    }else{
                        for(let i in data_tags){
                            if(data_tags[i] == _q){
                                search_results.push(data);
                                search_results_ids.push(counter);
                            }
                        }
                    }
                }
                
                counter++;
            });
        })

        // avoid duplication
        search_results = [...new Set(search_results)];
        search_results_ids = [...new Set(search_results_ids)];

        // show results
        let counter = 0,
            showMsgNotFound = false;

        search_results.forEach(result => {
            if(result["name"] != src){
                // defs
                let search_result_div = document.createElement("a");
                let search_result_name = document.createElement("h3");
                let search_result_presentation = document.createElement("p");
                let search_result_version = document.createElement("span");
                let search_result_tags = document.createElement("span");

                // values attribution
                search_result_name.textContent = result["name"];
                search_result_presentation.textContent = result["presentation"];
                search_result_version.textContent = result["version"];
                search_result_tags.textContent = result["tags"];

                // set
                api_search_results.append(search_result_div);
                search_result_div.append(search_result_name);
                search_result_div.append(search_result_presentation);
                search_result_div.append(search_result_version);
                search_result_div.append(search_result_tags);

                // set classes
                search_result_div.classList.add("api-search-result");
                search_result_name.classList.add("api-search-result-name");
                search_result_presentation.classList.add("api-search-result-presentation");
                search_result_version.classList.add("api-search-result-version");
                search_result_tags.classList.add("api-search-result-tags");

                search_result_div.setAttribute("href", "/project.html?id="+search_results_ids[counter])

                counter++;
            }else{
                // if name of the result == src
                showMsgNotFound = true;
            }
        })

        // if results is empty
        if(search_results.length == 0){
            showMsgNotFound = true;
        }
        
        // if results is empty AND if the only result == the src -> show the error msg
        if(showMsgNotFound == true && search_results.length == 0){
            let not_found_div = document.createElement("div");
            let not_found_title = document.createElement("h3");
            let not_found_text = document.createElement("p");
            let not_found_link = document.createElement("a");

            not_found_title.textContent = "Sorry, there aren't any project in the database that match with your query.";
            not_found_text.textContent = "You can create a GitHub issue to ask we is there are projects that there aren't in the database yet.";
            not_found_link.textContent = "Submit an Issue";

            api_search_results.append(not_found_div);
            not_found_div.append(not_found_title);
            not_found_div.append(not_found_text);
            not_found_div.append(not_found_link);

            not_found_div.classList.add("api-error");
            not_found_link.setAttribute("href", "https://github.com");
        }

        api_search_input.setAttribute("placeholder", q_output);
    }
}

// determine what to do in function of the page (get with document.body.id)
function determinePage(datas){
    let page = document.body.id;
    if(page=="index"){
        index_view(datas);
    }
    else if(page=="project"){
        project_view(datas);
    }
    else if(page=="search"){
        search_view(datas);
    }
}    

// main program
// get infos from db.json and put them in the list datas
fetch(db_url).then((data)=>{
    data.json().then((data)=>{
        datas = data;
        determinePage(datas);
    })
})
