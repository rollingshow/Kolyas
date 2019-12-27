let cur = {
  x:0,
  y:0
};

var grid = document.getElementById("grid"); 
var gamestart = 0;
generateGrid();

function generateGrid() {
  //generate 10 by 10 grid
  gamestart = 0;
  grid.innerHTML="";
  for (var i=0; i<12; i++) {
    row = grid.insertRow(i);
    for (var j=0; j<12; j++) {
      cell = row.insertCell(j);
      cell.onclick = function() { clickCell(this); };
      cell.oncontextmenu = function() { markCell(this); };
      var mine = document.createAttribute("data-mine");       
      mine.value = "true";             
      cell.setAttributeNode(mine);
    }
  }
  document.getElementsByTagName("td")[0].classList.add("active");

}

function addMines() {
  //Add mines randomly
  let m = document.querySelectorAll('td');
  m.forEach(function(elem)
  {
   elem.setAttribute("data-mine","false");
  });
  for (var i=0; i<20; i++) {
    var row = Math.floor(Math.random() * 12);
    var col = Math.floor(Math.random() * 12);
    var cell = grid.rows[row].cells[col];
    cell.setAttribute("data-mine","true");
    console.log(row+" "+col);
  }
}

function revealMines() {
    //Highlight all mines in red
    for (var i=0; i<12; i++) {
      for(var j=0; j<12; j++) {
        var cell = grid.rows[i].cells[j];
        console.log(cell.getAttribute("data-mine"));
        if (cell.getAttribute("data-mine")=="true") cell.classList.contains("mine");
      }
    }
}

function checkLevelCompletion() {
  var levelComplete = true;
    for (var i=0; i<12; i++) {
      for(var j=0; j<12; j++) {
        if ((grid.rows[i].cells[j].getAttribute("data-mine")=="false") && (grid.rows[i].cells[j].innerHTML=="")) levelComplete=false;
      }
  }
  if (levelComplete) {
    gamestart=2;
     revealMines();
    alert("You Win!");
  }
}
function markCell(cell)
{
  if (gamestart==2) 
    return;
  cell.classList.toggle("flag");
  event.preventDefault();
}

function clickCell(cell) {
  //Check if the end-user clicked on a mine
  if (gamestart==0)
  {
    while (cell.getAttribute("data-mine")=="true") 
    {
      addMines();
    }
    gamestart = 1;
  }
  if ((cell.classList.contains("flag")) || (gamestart==2)) 
    return;
  if (cell.getAttribute("data-mine")=="true") {
    revealMines();
    gamestart=2;
    alert("Game Over");
  } else {
    cell.classList.add("clicked");
    //Count and display the number of adjacent mines
    var mineCount=0;
    var cellRow = cell.parentNode.rowIndex;
    var cellCol = cell.cellIndex;
    //alert(cellRow + " " + cellCol);
    for (var i=Math.max(cellRow-1,0); i<=Math.min(cellRow+1,11); i++) {
      for(var j=Math.max(cellCol-1,0); j<=Math.min(cellCol+1,11); j++) {
        if (grid.rows[i].cells[j].getAttribute("data-mine")=="true") mineCount++;
      }
    }
    cell.innerHTML=mineCount;
    if (mineCount==0) { 
      //Reveal all adjacent cells as they do not have a mine
      for (var i=Math.max(cellRow-1,0); i<=Math.min(cellRow+1,11); i++) {
        for(var j=Math.max(cellCol-1,0); j<=Math.min(cellCol+1,11); j++) {
          //Recursive Call
          if (grid.rows[i].cells[j].innerHTML=="") clickCell(grid.rows[i].cells[j]);
        }
      }
    }
    checkLevelCompletion();
  }
}
  document.onkeydown = keyboardEvents;
  function keyboardEvents(e) {
    console.log(e);
    let elems = document.getElementsByTagName("td");
    if (elems) {
      for (let i = 0; i < 144; i++) {
        if (elems[i].classList.contains('active')) {
          
          if ((e.code == "Enter") && (e.ctrlKey || e.metaKey || e.shiftKey) ) {
            markCell(elems[i]);
          }
          else if (e.code == 'Enter') {
            clickCell(elems[i]);
          }
          if (e.type == 'keydown') {
            if (e.key == "ArrowUp") {
              let cords = i - 12;
              if (cords < 0)
                cords = 144 + cords;
              elems[cords].classList.add("active");
              elems[i].classList.remove('active');
            }
            else if (e.key == 'ArrowDown') {
              let cords = i + 12;
              if (cords > 144)
                cords = cords % 12;
              console.log(cords);
              elems[cords].classList.add("active");
              elems[i].classList.remove('active');

            }
            else if (e.key == 'ArrowLeft') {
              console.log(elems); 
              let cords = i - 1;
              if (Math.floor(cords / 12) != Math.floor(i / 12))
                cords = i + 11;
               elems[cords].classList.add("active");
              elems[i].classList.remove('active');
            }
            else if (e.key == "ArrowRight") {
              let cords = i + 1;
              console.log(cords / 12, i / 12);
              if (Math.floor(cords / 12) != Math.floor(i / 12))
                cords = i - 11;
              elems[cords].classList.add("active");
              elems[i].classList.remove('active');
            }
          }
          break;
        }
      }
    }
  } 
  