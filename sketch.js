let N = 10;
let numMines = 10;

let dimx = window.innerWidth;
let dimy = window.innerHeight;
let res = Math.min(dimx,dimy);
let w = Math.trunc(res/N);
let grid = [];

while (res%N != 0) {
  res--;
}

class Cell {
  constructor (i,j) {
    this.i = i;
    this.j = j;
    this.mine = false;
    this.revealed = false;
    this.counter = 0;
    this.deactivated = false;
  }
  
  show() {
    if (this.revealed) {
      if (this.mine) {
        noFill();
        square(this.i*w,this.j*w,w);
        if (!this.deactivated) fill(157,0,0);
        else fill(0,157,0);
        circle(this.i*w + w/2,this.j*w + w/2,w*0.75);
      } else {
        fill(157);
        square(this.i*w,this.j*w,w);
        if (this.counter != 0) {
          fill(15);
          text(this.counter,this.i*w + w/2,this.j*w + w/2 +1 );
        }
      }
    } else {
      noFill();
      square(this.i*w,this.j*w,w);
    }
  }
  
  countMines() {
    if (this.mine) {
      this.counter = -1;
      return;
    }
    let cont = 0;
    for(let i = -1 ; i <= 1 ; i++){
      for (let j = -1 ; j <= 1; j++) {
        let newI = this.i + i;
        let newJ = this.j + j;
        if (newI >= 0 && newI < N && newJ >= 0 && newJ < N) {
          let id = newI + newJ*N;
          if (grid[id].mine) cont++;
        }
      }
    }
    this.counter = cont;
  }
  
} // end of class


function mousePressed(){
  let i = Math.trunc(mouseX/w);
  let j = Math.trunc(mouseY/w);
  let id = i + j*N;
  grid[id].revealed = true;
  
  if (grid[id].mine) {
    grid.forEach(cell => cell.revealed = true);
  }
  
  if (grid[id].counter == 0){
    revealBlank(id);
  }
}


function revealBlank(index) {
  for(let i = -1 ; i <= 1 ; i++){
      for (let j = -1 ; j <= 1; j++) {
        let newI = i + grid[index].i;
        let newJ = j + grid[index].j;
        if (newI >= 0 && newI < N && newJ >= 0 && newJ < N) {
          let id = newI + newJ*N;
          if (!grid[id].mine && !grid[id].revealed) {
            grid[id].revealed = true;
            if (grid[id].counter == 0) revealBlank(id);
          }
        }
      }
    }
}


function setup() {
  createCanvas(res,res);
  stroke(15);
  strokeWeight(1);
  textAlign(CENTER,CENTER);
  textSize(w*0.75);
  
  let index_cells = [];
  let cont = 0;
  
  // create cells
  for (let j = 0; j < N ; j++) {
    for (let i = 0 ; i < N ; i++){
      grid.push( new Cell(i,j) );
      index_cells.push(cont);
      cont++;
    }
  }
  
  // set mines 
  for (let i = 0 ; i < numMines ; i++){
    let id = Math.trunc(random(index_cells.length));
    grid[index_cells[id]].mine = true;
    index_cells.splice(id,1);
  }
  
  // count mines
  for (let cell of grid) {
    cell.countMines();
  }
  
}

function draw() {
  background(220);
  
  cont = 0;
  for (let cell of grid) {
    cell.show();
    if (!cell.revealed) cont++;
  }
  
  if (cont == numMines) {
    console.log("You win");
    grid.forEach(cell => {
      cell.deactivated = true; 
      cell.revealed = true; 
    });
  }
  
}


