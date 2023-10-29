//https://minesweeper.online/

var grid = [];

var TOCLICK = -3;
var MINE = -2;
var CLOSED = -1;
var EMPTY = 0;
var ONE = 1;
var TWO = 2;
var THREE = 3;
var FOUR = 4;
var FIVE = 5;
var SIX = 6;
var MINES;

function getRandomArbitrary(min, max) {
    return 0;
    min = 150;
    max = 200;
    return Math.random() * (max - min) + min;
}

function getGrid() {
    var cells = document.getElementById("A43").children;

    var col = 0;

    grid[col] = [];

    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];

        var cell_col = cell.id.split("_")[2];

        if (cell_col != col) {
            col = cell_col;
            grid[col] = [];
        }

        if (!cell.classList.contains("hd_closed")) {
            for (var t = 0; t < 7; t++){
                if (cell.classList.contains("hd_type"+t))
                    grid[col].push(t);
            }

        }
        else
            grid[col].push(CLOSED);

    }
}
function printGrid() {
    console.log(grid);
}

function gen(grid,left){
    if(left.length == 0) {
        var ret = [];
        ret[0] =  grid;
        return ret;
    }
    var cell = left.pop();
    var gridcp = [];
    for (var i = 0; i < grid.length; i++)
        gridcp[i] = grid[i].slice();
    var ways = gen(gridcp,left.slice());

    var ans = [];
    var nb = [];
    for (var x = -1; x <= 1; x++) {
        for (var y = -1; y <= 1; y++) {
            var ix = cell[0] + x;
            var jy = cell[1] + y;

            if (ix >= 0 && ix < size[0] && jy >= 0 && jy < size[1]) {
                if (grid[ix][jy] > 0) nb.push([ix,jy]);
            }
        }
    }
    for(var w = 0; w < ways.length; w++){
        for(var poss = -3; poss<=-2; poss++){
            var newgrid = [];
            for (var i = 0; i < ways[w].length; i++)
                newgrid[i] = ways[w][i].slice();
            newgrid[cell[0]][cell[1]] = poss;
            var works = true;
            for(var n = 0; n < nb.length; n++){
                var i = nb[n][0];
                var j = nb[n][1];
                var k = grid[i][j];
                var emptynum=0;
                var minenum = 0;
                var total = 0;
                for (var x = -1; x <= 1; x++) {
                    for (var y = -1; y <= 1; y++) {
                        var ix = nb[n][0] + x;
                        var jy = nb[n][1] + y;
            
                        if (ix >= 0 && ix < size[0] && jy >= 0 && jy < size[1]) {
                            if(newgrid[ix][jy] == TOCLICK)emptynum++
                            if(newgrid[ix][jy] == MINE) minenum++;
                            if(newgrid[ix][jy] < 0) total++;
                        }
                    }
                }
                if (minenum > k || (total - emptynum < k)) works = false;
            }
            if(works) ans.push(newgrid);
        }
    }
    return ans;
}

function clickDom(targetNode) {
    triggerMouseEvent(targetNode, "mousedown");
    triggerMouseEvent(targetNode, "mouseup");
}

function triggerMouseEvent(node, eventType) {
    var clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent(eventType, true, true);
    node.dispatchEvent(clickEvent);
}



getGrid();

var size = [grid.length, grid[0].length];

var num_mines = 10;

function createArray()
{
    var arr = [size[0]];

    for (var i = 0; i < size[0]; i++)
    {
        arr[i] = [];
        for (var j = 0; j < size[1]; j++)
        {
            arr[i].push(0);
        }
    }

    return arr;
}

async function main()
{

    MINES = createArray();

    // Click start

    console.log(grid);

    console.log(parseInt(size[0] / 2) + "_" + parseInt(size[1] / 2));

    // clickDom(document.getElementsByClassName("start")[0]);

    getGrid();

    console.log(grid);
    
    var checky = 0;
    
    while (checky < 500) {
    
        // Get the grid
        getGrid();
    
        var mines = createArray();
        
        for (var i = 0; i < size[0]; i++) {
            for (var j = 0; j < size[1]; j++) {
                var empty = 0;
                if (grid[i][j] != EMPTY && grid[i][j] != CLOSED) {
                    for (var x = -1; x <= 1; x++) {
                        for (var y = -1; y <= 1; y++) {
                            var ix = i + x;
                            var jy = j + y;
    
                            if (ix >= 0 && ix < size[0] && jy >= 0 && jy < size[1]) {
                                if (grid[ix][jy] == CLOSED) empty++;
                            }
                        }
                    }
    
                    if (grid[i][j] == empty) {
    
                        for (var x = -1; x <= 1; x++) {
                            for (var y = -1; y <= 1; y++) {
                                var ix = i + x;
                                var jy = j + y;
    
                                if (ix >= 0 && ix < size[0] && jy >= 0 && jy < size[1]) {
                                    if (MINES[ix][jy] == 0 && grid[ix][jy] == CLOSED)
                                    {
                                        mines[ix][jy] = 1;
                                        MINES[ix][jy] = 1;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    
        for (var i = 0; i < size[0]; i++) {
            for (var j = 0; j < size[1]; j++) {
                if(MINES[i][j] == 1){
                    grid[i][j] = MINE;
                }
            }
        }
    
    
        var noMines = createArray();
        for (var i = 0; i < size[0]; i++) {
            for (var j = 0; j < size[1]; j++) {
                var filled = 0;
                if (grid[i][j] != EMPTY && grid[i][j] != CLOSED) {
                    for (var x = -1; x <= 1; x++) {
                        for (var y = -1; y <= 1; y++) {
                            var ix = i + x;
                            var jy = j + y;
    
                            if (ix >= 0 && ix < size[0] && jy >= 0 && jy < size[1]) {
                                if (grid[ix][jy] == MINE) filled++;
                            }
                        }
                    }
    
                    if (grid[i][j] == filled) {
    
                        for (var x = -1; x <= 1; x++) {
                            for (var y = -1; y <= 1; y++) {
                                var ix = i + x;
                                var jy = j + y;
    
                                if (ix >= 0 && ix < size[0] && jy >= 0 && jy < size[1]) {
                                    if (grid[ix][jy] == CLOSED)
                                    {
                                        noMines[ix][jy] = 1;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        var found = 0;
        for (var i = 0; i < size[0]; i++) {
            for (var j = 0; j < size[1]; j++) {
                if(noMines[i][j] == 1){
                    found++;
                    clickDom(document.getElementById("cell_" + j + "_" + i));
                    await new Promise(r => setTimeout(r, getRandomArbitrary(100, 150)));
                }
            }
        }
        checky++;
        for (var i = 0; i < size[0]; i++) {
            for (var j = 0; j < size[1]; j++) {
                if(mines[i][j] == 1){
                    found++;
                }
            }
        }
        if(found ==0){
            var ADJ =[];
            for (var i = 0; i < size[0]; i++) {
                for (var j = 0; j < size[1]; j++) {
                    if(grid[i][j] == CLOSED){
                        var isadj = false;
                        for (var x = -1; x <= 1; x++) {
                            for (var y = -1; y <= 1; y++) {
                                var ix = i + x;
                                var jy = j + y;
    
                                if (ix >= 0 && ix < size[0] && jy >= 0 && jy < size[1]) {
                                    if (grid[ix][jy] != EMPTY && grid[ix][jy] != CLOSED)
                                    {
                                        isadj=true;
                                    }
                                }
                            }
                        }
                        if(isadj)ADJ.push([i,j]);
                    }
                }
            }
            var ways = gen(grid,ADJ);
            var mines = [];
            var empty = [];
            for(var g = 0; g < ADJ.length;g++){
                var i = ADJ[g][0];
                var j = ADJ[g][1]
                var isMine = true;
                var isEmpty = true;
                for(w = 0; w < ways.length;w++){
                    if(ways[w][i][j] == MINE) isEmpty = false;
                    if(ways[w][i][j] == TOCLICK) isMine = false;
                }
                if(isMine){
                    mines.push([i,j]);
                }
                if(isEmpty){
                    clickDom(document.getElementById("cell_" + j + "_" + i));
                    empty.push([i,j])
                    await new Promise(r => setTimeout(r, getRandomArbitrary(100, 150)));
                }
            }
        }
    }
}

await main();