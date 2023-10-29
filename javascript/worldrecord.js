//https://minesweeperonline.com/

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


function getRandomArbitrary() {
    return 0;
    // min = 100;
    max = 130;
    return Math.random() * (max - min) + min;
}


function getGrid() {
    var cells = document.getElementsByClassName("square");
    var grid_size;
    if(cells.length == 121)grid_size=[9,9];
    else if(cells.length == 324) grid_size = [16,16];
    else grid_size = [16,30];
    
    for (var i = 0; i < grid_size[0]; i++) {
        grid[i] = [];
        for (var j = 0; j < grid_size[1]; j++)
        {
            var cell = document.getElementById((i+1) + "_" + (j+1));
            
            if (!cell.classList.contains("blank")) {
                for(var t = 0; t < 7; t++){
                    if (cell.classList.contains("open"+t)) grid[i].push(t);
                }
            }
            else
                grid[i].push(CLOSED);
        }
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
                // console.log(minenum+" "+emptynum+" "+total+" "+k+" "+left.length+" "+nb[n]);
                if (minenum > k || (total - emptynum < k)) works = false;
            }
            // console.log(works);
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

function guess(){
    for (var i = 0; i < size[0]; i++) {
        for (var j = 0; j < size[1]; j++) {
            if(grid[i][j] == CLOSED && MINES[i][j] == 0){
                clickDom(document.getElementById((i + 1) + "_" + (j + 1)));
                return;
            }
        }
    }
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

    clickDom(document.getElementById(parseInt(size[0] / 2) + "_" + parseInt(size[1] / 2)));

    getGrid();

    console.log(grid);
    
    var checky = 0;
    
    while (checky < 500) {
        console.log(checky);
    
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
                                        // console.log(i+" "+j+" "+empty)
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
    
        // console.log(mines);
    
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
    
        // console.log("no mines");
        // console.log(noMines);
        // console.log("MINES");
        // console.log(MINES);
        // console.log("GRID");
        // console.log(grid);
        var found = 0;
        for (var i = 0; i < size[0]; i++) {
            for (var j = 0; j < size[1]; j++) {
                if(noMines[i][j] == 1){
                    found++;
                    clickDom(document.getElementById((i + 1) + "_" + (j + 1)));
                    await new Promise(r => setTimeout(r, getRandomArbitrary()));
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
        // console.log("found");
        // console.log(found);
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
            // console.log("ADJ");
            // console.log(ADJ);
            if (ADJ.length > 45){
                console.log('ADJ.length');
                console.log(ADJ.length);
                guess();
                continue;
            }
            var ways = gen(grid,ADJ);
            // console.log("ways");
            // console.log(ways);
            var mines = [];
            var empty = [];
            var found2 = 0;
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
                    MINES[i][j] = 1;
                    found2++;
                }
                if(isEmpty){
                    clickDom(document.getElementById((i + 1) + "_" + (j + 1)));
                    empty.push([i,j])
                    found2++;
                    await new Promise(r => setTimeout(r, getRandomArbitrary()));
                }
            }
            console.log("found2")
            console.log(found2);
            if(found2 == 0){
                guess();
                continue;
            }
        }
    }
}

await main();