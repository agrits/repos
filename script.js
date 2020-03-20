/**
* Represents a repository
* @constructor
* @param {Object} obj - JSON object to be parsed
 */

class Repo{
  constructor(obj){
    Object.assign(this, obj)
  }
  /** Checks if repo was updated before given date*/
  wasUpdatedAfterDate = function(date) {
    date = new Date(date)
    return (new Date(this.updated_at)) >= date
  }
  /** Returns html representation of repository*/
  asHTMLElement = function(){
    var row = createRow()
    row.appendChild(createCell(this.owner.login))
    row.appendChild(createCell(this.name))
    row.appendChild(createCell(this.description))
    row.appendChild(createCell(this.updated_at))
    row.appendChild(createCell(this.clone_url))
    return row
  }
}

/** Creates header for repository table */
function createHeader(){
  columns = "Owner,Name,Description,Latest Update,Clone URL".split(",")
  tr = document.createElement("tr")
  columns.forEach(col =>
    tr.appendChild(createHeaderCell(col))
  )
  return tr
}

/** Creates header cell*/
function createHeaderCell(content){
  th = document.createElement("th")
  th.innerHTML = content
  return th
}

/** Create new row*/
function createRow(){
  tr = document.createElement("tr")
  return tr
}

/** Creates cell for given content */
function createCell(content){
  td = document.createElement("td")
  td.innerHTML = content
  return td
}

/** Renders all <repos> tags*/
function renderRepos(){
  elements = document.getElementsByTagName("repos")
  Array.from(elements).forEach(el => {
    user = el.attributes['data-user'].textContent
    date = el.attributes['data-update'].textContent
    renderUserRepos(user, date, el)
  })
}

/** Render repositories of given user and switches element for rendered object*/
function renderUserRepos(user, date, element){
  table = document.createElement("table")
  table.setAttribute("id", user+"Table")
  fetch('https://api.github.com/users/'+user+'/repos')
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      if("message" in json){
        row = createRow()
        row.appendChild(createCell(`Error while fetching: ${json.message}`))
      }
      else{
        table.appendChild(createHeader())
        json.map(obj => new Repo(obj))
            .filter(repo => repo.wasUpdatedAfterDate(date))
            .forEach(repo => {table.appendChild(repo.asHTMLElement())})
        element.parentNode.replaceChild(table, element)
      }
    })
    .catch((error) => {
      alert(`Can't fetch data for ${user}`)
    });
}

// Could also use 'defer' in HTML
document.addEventListener("DOMContentLoaded", function() {
  renderRepos()
});
