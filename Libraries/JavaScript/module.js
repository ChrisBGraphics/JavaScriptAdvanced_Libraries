const foodTallyModule = (function () {
  let mainList = [];
  let pizzaList = [];
  let dessertList = [];

  //Init on load of page
  function init(){
    let statListJSON = localStorage.getItem("stats");

    if(statListJSON){
        mainList = JSON.parse(statListJSON);
        restoreLists();
        refreshAllLists();

    }
  }

  class Stats {
    constructor(title, value) {
      this.title = title;
      this.value = value;
    }
  }

  class PizzaStats extends Stats {
    constructor(title, value) {
      super(title, value);
      this.type = "pizza";
    }
  }

  class DessertStats extends Stats {
    constructor(title, value) {
      super(title, value);
      this.type = "dessert";
    }
  }

  //create new stat for either pizza or dessert
  function addStats(title, value, type) {
    let newStats;
    switch (type) {
      case "pizza":
        newStats = new PizzaStats(title, value);
        pizzaList.push(newStats);
        break;
      case "dessert":
        newStats = new DessertStats(title, value);
        dessertList.push(newStats);
        break;
      default:
        newStats = new Stats(title, value);
        mainList.push(newStats);
    }
    console.log(newStats);

    createStats(newStats);
  }

  //generate new table row for the desired table
  function createStats(stats) {
    let statList;

    //add a button for editing
    //let buttonClass = "ui-button ui-widget ui-corner-all"
    let editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.type = "button";
    editButton.className = "ui-button ui-widget ui-corner-all btn-edit";
    // editButton.addEventListener("click", displayEditTask);

    //add a button to delete the task
    let delButton = document.createElement("button");
    delButton.id = "delete-food";
    delButton.innerText = "X";
    delButton.type = "button";
    delButton.className = "ui-button ui-widget ui-corner-all btn-delete";
    // delButton.addEventListener("click", deleteTask);

    switch (stats.type) {
      case "pizza":
        statList = document.getElementById("pizzabody");
        break;
      case "dessert":
        statList = document.getElementById("dessertbody");
        break;
    }

    let row = statList.insertRow();
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    cell1.innerHTML = stats.title;
    cell2.innerHTML = stats.value;

    row.appendChild(editButton);
    row.appendChild(delButton);
    console.log(row);
    $(row).hide();
    $(row).fadeIn("slow");
    //console.log("Pizza: ", pizzaList);
    //console.log("Dessert: ", dessertList);
  }

  function updateStats(name, value, index, id) {
    let stats;
    switch (id) {
      case "pizzabody":
        stats = pizzaList[index];
        stats.title = name;
        stats.value = value;
        console.log(pizzaList);
        break;
      case "dessertbody":
        stats = dessertList[index];
        stats.title = name;
        stats.value = value;
        console.log(dessertList);
        break;
    }
  }

  function deleteStats(index, id) {
    switch (id) {
      case "pizzabody":
        pizzaList.splice(index, 1);
        console.log(pizzaList);
        break;
      case "dessertbody":
        dessertList.splice(index, 1);
        console.log(dessertList);
        break;
    }
  }

  //Local storage
  function saveStatList() {
    mainList = [];
    for(let p in pizzaList){
        console.log(pizzaList[p]);
        mainList.push(pizzaList[p]);
    }
    for(let d in dessertList){
        mainList.push(dessertList[d]);
    }
    let statListJSON = JSON.stringify(mainList);

    localStorage.setItem("stats", statListJSON);
  }

  
  function restoreLists() {
    for(let i = 0; i < mainList.length; i++){
        let stat = mainList[i];
        switch(stat.type){
            case "pizza":
                stat = new PizzaStats(stat.title, stat.value);
                pizzaList.push(stat);
                break;
            case "dessert":
                stat = new DessertStats(stat.title, stat.value);
                dessertList.push(stat);
                break;

        }
    }
  }

  function refreshAllLists(){
    for(let s in mainList){
        createStats(mainList[s]);
    }
  }

  
  function clearList(type) {
    switch(type){
        case "pizza":
            pizzaList.splice(0, pizzaList.length);
            console.log(pizzaList);
            break;
        case "dessert":
            dessertList.splice(0, dessertList.length);
            console.log(dessertList);
            break;
    }
  }
  

  return {
    init: init,
    addStats: addStats,
    updateStats: updateStats,
    deleteStats: deleteStats,
    storeList: saveStatList,
    restorLists: restoreLists,
    refreshList: refreshAllLists,
    clearList: clearList,
    

  };
})();
