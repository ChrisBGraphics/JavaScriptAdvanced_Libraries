//-------------------------------------------------------------------------------------
//Custom object to extend Map

class mapFormatter extends Map {
  mapToArray(){
    let returnArray = [];
    this.forEach(function(value, key) {
      returnArray.push([key, value]);
    })
    return returnArray;
  };

}

//-------------------------------------------------------------------------------------
//Initiallize JQuery items
$(document).ready(function() {
    $("#pizzabtn").click(function(){
      $('#pizzabody').show();
        foodTallyModule.addStats($("#pizzaname").val(), $("#pizzanum").val(), "pizza");
    });

    $("#dessertbtn").click(function(){
      $('#dessertbody').show();
      foodTallyModule.addStats($("#dessertname").val(), $("#dessertnum").val(), "dessert");
    });

    $("#pizzaclear").click(function(){
      $('#pizzabody').fadeOut("slow", function(){
        $('#pizzabody').empty();
        foodTallyModule.clearList("pizza");
      });
    });

    $("#dessertclear").click(function(){
      $('#dessertbody').fadeOut("slow", function(){
        $('#dessertbody').empty();
        foodTallyModule.clearList("dessert");
      })
    });

    $("#pizzagraph").click(function(){
      createGraph("#pizzahead", "#pizzabody");
    });

    $("#dessertgraph").click(function(){
      createGraph("#desserthead", "#dessertbody");
    });
    
    $("#accordion").accordion({
      collapsible: true
    });

    $( function() {
      $( "#tabs" ).tabs();
    });

    $("#dialog-graph").dialog({
      autoOpen: false,
      resizable: true,
      modal: true,
      width: 1000,
      show:{
        effect: "drop",
        duration: 500,
      },
      hide:{
        effect: "drop",
        duration: 500,
      },
      buttons: {
        Close: function(){
          $(this).dialog("close");
        }
      },

    });

});

//-------------------------------------------------------------------------------------
//JQuery for dynamic buttons
//Edit button
$(document).on('click', '.btn-edit', function(){
  let tr = $(this).parent();
  let name = tr.children('td:eq(0)').text();
  let value = tr.children('td:eq(1)').text();
  //console.log(name, value);

  tr.children('td:eq(0)').html(`<input name="edit_name" class="edit-name" value="${name}">`);
  tr.children('td:eq(1)').html(`<input type="number" name="edit_num" class="edit-num" value="${value}">`);
  $(this).removeClass('btn-edit').addClass("btn-save");
  $(this).text("Save");
  $(".btn-delete").prop('disabled', true).addClass('ui-state-disabled');
});

//save button
$(document).on('click', '.btn-save', function(){
  let tr = $(this).parent();
  let tb = $(this).closest('tbody');
  let id = $(tb).attr('id');
  //console.log(id);
  let name = tr.find('.edit-name').val();
  let value = tr.find('.edit-num').val();
  let rowIndex = $(`#${id} tr`).index($(this).closest('tr'));
  //console.log(name, value, rowIndex);
  tr.children('td:eq(0)').text(`${name}`);
  tr.children('td:eq(1)').text(`${value}`);
  $(this).removeClass('btn-save').addClass("btn-edit");
  $(this).text("Edit");
  $(".btn-delete").prop('disabled', false).removeClass('ui-state-disabled');
  //update the list in the module
  foodTallyModule.updateStats(name, value, rowIndex, id);

})

//'X' button for deleting entry
$(document).on('click', '.btn-delete', function(){
  let tr = $(this).parent();
  tr.fadeOut("slow", function(){
    let tb = $(this).closest('tbody');
    let id = $(tb).attr('id');
    let rowIndex = $(`#${id} tr`).index($(this).closest('tr'));
    //console.log($(tb).attr('id')+ " " + rowIndex);
    tr.remove();
    foodTallyModule.deleteStats(rowIndex, id);
  });

})

//-------------------------------------------------------------------------------------
function createGraph(head, body){
  let tableHead = $(head).children('tr');
  let names = tableHead.children('th:eq(0)').text();
  let values = tableHead.children('th:eq(1)').text();
  //console.log(tableHead.children('th:eq(0)').text());
  let map = new mapFormatter();
  map.set(names,values);

  let tableBody = $(body).children('tr');
  for(let t of tableBody){
    console.log($(t).children("td:eq(0)").text());
    map.set($(t).children("td:eq(0)").text(), parseInt($(t).children("td:eq(1)").text()));
  }

  let array = map.mapToArray();
  ///console.log(array);
  arrayData = array;
  $("#dialog-graph").dialog("open");
  drawChart();
}

//-------------------------------------------------------------------------------------
//Google Chart code
google.charts.load('current', {'packages':['corechart']});
//google.charts.setOnLoadCallback(drawChart);

let arrayData = [];

function drawChart() {

  var data = google.visualization.arrayToDataTable(arrayData);
  var options = {
    title: 'Food Tally',
    animation: {
      durration: 2000,
      easing: 'out',
      startup: true,
    }
  };

  let chart = new google.visualization.PieChart(document.getElementById('piechart'));

  chart.draw(data, options);

}

