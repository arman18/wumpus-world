class Cell{
    constructor(){
        this.containsWompus = false;
        this.containsPit = false;
        this.stinkCounter = 0;
        this.breezeCounter = 0;
        
        this.parent = null;
        this.location = [];
        this.visited = false;
        
        this.containsGold = false;
        this.hasStink = false;
        this.hasBreeze = false;
        this.pit = undefined; //[-1,0,1] -1 means not exist; 0 means may be exist; 1 means exist
        this.wompus = undefined; //[-1,0,1]
    }
}
let queue = []; //[[0,1],[1,2]]
let FolWoppus = [];
let FolPit = [];
let currentCell = -1,arrows=5;
/*
[[1,3],[5,6],[3,2]],
    [[1,4],[5,2],[2,2]],
    [[3,3],[6,6],[3,3]]
*/
let count = 0;
for(var i=0;i<10;i++) for(var j=0;j<10;j++){
    let ele = $('.grid .cell').eq(count);
        ele.attr('data-row', i);
        ele.attr('data-col', j);
    count++;
  }
const board=[];
function initBoard(){
    for(let i=0;i<10;i++){
        board.push([]);
        for(let j=0;j<10;j++){
            board[i].push(new Cell());
            board[i][j].location.push(i);
            board[i][j].location.push(j);
        }
        
    }
}
initBoard();
const log = console.log;

function contains(contaiterArray,elementArray){ 
    for(let i=0;i<contaiterArray.length;i++){
        if(contaiterArray[i][0]==elementArray[0] &&
            contaiterArray[i][1]==elementArray[1] ){
                return i;

            }
    }
return -1;
// contaiterArray = [[1,2],[3,4],[5,6]]
// elementArray = [1,2]
// return the index of matches
// let pos = contains(queue,[1,2]);
// if(pos!=-1) queue.splice(pos,1);
}
function getAdjacent(cell){

    const cellLocation = cell.location;
    let array = [];
    let row,col;
    row = cellLocation[0]; // left
    col = cellLocation[1]-1;
    if(col>-1) array.push([cellLocation[0],cellLocation[1]-1])
    col = cellLocation[1]+1;
    if(col<10) array.push([cellLocation[0],cellLocation[1]+1])

    row = cellLocation[0]-1; // up
    col = cellLocation[1];
    if(row>-1) array.push([cellLocation[0]-1,cellLocation[1]])
    row = cellLocation[0]+1; // down
    if(row<10) array.push([cellLocation[0]+1,cellLocation[1]])

    return array;
}

function updateQueue(cell){ // cell:Cell
    let pos;
    let adj = getAdjacent(cell);
    adj.forEach((item)=>{
        if(board[item[0]][item[1]].visited) return;
        pos = contains(queue,item);
        if(pos==-1) queue.push(item);
    });
}


function nextCell(currentCell){
    if(queue.length==0) return [0,0];
     const gold = queue.filter((item)=>{
         return item.containsGold;
     });
     let tempArray,tempDistance;
     tempDistance=Infinity;
     if(gold.length>=1) {
        gold.forEach((item)=>{
            let dist = Math.sqrt(Math.pow(item[0]-currentCell[0],2)+Math.pow(item[1]-currentCell[1],2));
            if(dist<tempDistance){
                tempDistance =dist;
                tempArray=item;
            }
        });
        return tempArray;
     }

     //tempDistance=Infinity;
     const empty = queue.filter((each)=>{
         item = board[each[0]][each[1]];
        if(item.wompus==-1 && item.pit==-1) return true;
        else return false;
    });
    if(empty.length>=1) {
        empty.forEach((item)=>{
            let dist = Math.sqrt(Math.pow(item[0]-currentCell[0],2)+Math.pow(item[1]-currentCell[1],2));
            if(dist<tempDistance){
                tempDistance =dist;
                tempArray=item;
            }
        });
        return tempArray;
    }

    //tempDistance=Infinity;
    const nopit = queue.filter((each)=>{
        item = board[each[0]][each[1]];
        if(item.pit==-1) return true;
        else return false;
    });
    if(nopit.length>=1) {
        nopit.forEach((item)=>{
            let dist = Math.sqrt(Math.pow(item[0]-currentCell[0],2)+Math.pow(item[1]-currentCell[1],2));
            if(dist<tempDistance){
                tempDistance =dist;
                tempArray=item;
            }
        });
        return tempArray;
    }

    //tempDistance=Infinity;
    const wompusOnly = queue.filter((each)=>{
        item = board[each[0]][each[1]];
        if(item.wompus==1) return true;
        else return false;
    });
    if(wompusOnly.length>=1) {
        wompusOnly.forEach((item)=>{
            let dist = Math.sqrt(Math.pow(item[0]-currentCell[0],2)+Math.pow(item[1]-currentCell[1],2));
            if(dist<tempDistance){
                tempDistance =dist;
                tempArray=item;
            }
        });
        return tempArray;
    }
    
    //tempDistance=Infinity;
    const bothUnsure = queue.filter((each)=>{
        item = board[each[0]][each[1]];
        if(item.wompus==0 && item.pit==0) return true;
        else return false;
    });
    if(bothUnsure.length>=1) {
        bothUnsure.forEach((item)=>{
            let dist = Math.sqrt(Math.pow(item[0]-currentCell[0],2)+Math.pow(item[1]-currentCell[1],2));
            if(dist<tempDistance){
                tempDistance =dist;
                tempArray=item;
            }
        });
        return tempArray;
    }

    queue.forEach((item)=>{
        let dist = Math.sqrt(Math.pow(item[0]-currentCell[0],2)+Math.pow(item[1]-currentCell[1],2));
        if(dist<tempDistance){
            tempDistance =dist;
            tempArray=item;
        }
    });
    return tempArray;
    //return queue[0];
    

}
function resolutionFol(element,type){
    let FOLs;
    if(type=='wompus') FOLs = FolWoppus;
    else FOLs = FolPit;
    let items,pos;
    for(let i=0;i<FOLs.length;i++){
        items = FOLs[i];
        pos = contains(items,element);
        if(pos!=-1) items.splice(pos,1);
        if(items.length==1) {
            log('this cell ('+element+') resolved a '+type+' statement');
            if(type=='wompus') board[items[0][0]][items[0][1]].wompus=1;
            else board[items[0][0]][items[0][1]].pit=1;
            FOLs.splice(i,1);
            i--;
        }
    }
}

function addNewStatementFolWompus(cell){ // adjacent
    let FOLs;
    FOLs = FolWoppus;
    let adj = getAdjacent(cell);
    // if any adj cell contains wompus do not add any statement
    if(adj.some((item)=>{
        return board[item[0]][item[1]].wompus==1;
    })) return 0;
    FOLs[FOLs.length] = [];
    // if any adj cell does not contains wompus exclude it from statement
    adj.forEach((item)=>{
        if(board[item[0]][item[1]].wompus==-1) return;
        if(board[item[0]][item[1]].visited==true) return;
        board[item[0]][item[1]].wompus = 0;
        FOLs[FOLs.length-1].push(item);
    });
    // if statement contains only one item do not add it
    if(FOLs[FOLs.length-1].length==1) { // sure here exist our assumption
        let sureCell = FOLs[FOLs.length-1];
        board[sureCell[0][0]][sureCell[0][1]].wompus=1;
        return FOLs.splice(FOLs.length-1,1);
    }
    if(FOLs[FOLs.length-1].length==0) FOLs.splice(FOLs.length-1,1);
}

function addNewStatementFolPit(cell){ // adjacent
    let FOLs;
    FOLs = FolPit;
    let adj = getAdjacent(cell);
    // if any adj cell contains pit do not add any statement
    if(adj.some((item)=>{
        return board[item[0]][item[1]].pit==1;
    })) return 0;
    FOLs[FOLs.length] = [];
    // if any adj cell does not contains wompus exclude it from statement
    adj.forEach((item)=>{
        if(board[item[0]][item[1]].pit==-1) return;
        if(board[item[0]][item[1]].visited==true) return;
        board[item[0]][item[1]].pit = 0;
        FOLs[FOLs.length-1].push(item);
    });
    // if statement contains only one item do not add it
    if(FOLs[FOLs.length-1].length==1) { // sure here exist our assumption
        let sureCell = FOLs[FOLs.length-1];
        board[sureCell[0][0]][sureCell[0][1]].pit=1;
        return FOLs.splice(FOLs.length-1,1);
    }
    if(FOLs[FOLs.length-1].length==0) FOLs.splice(FOLs.length-1,1);

}

function updatePitInfo(cell,value ){
    if(cell.pit==undefined)
        cell.pit = value;
    else if(cell.pit==0){
        cell.pit = value;
        if(value==-1) // if no pit exit then this information might help other cell ensuring there is a pit
            resolutionFol(cell.location,'pit');
    }
}
function updateWompusInfo(cell,value ){
    if(cell.wompus==undefined)
        cell.wompus = value;
    else if(cell.wompus==0){
        cell.wompus = value;
        if(value==-1) // if no pit exit then this information might help other cell ensuring there is a pit
            resolutionFol(cell.location,'wompus');
    }
}
function reduceStickCounter(cell){
    const adj = getAdjacent(cell);
    let adjcell;
    adj.forEach((item)=>{
        adjcell = board[item[0]][item[1]];
        if(--adjcell.stinkCounter==0){
            adjcell.hasStink = false;
        }
        
    });
}
function reduceBreezeCounter(cell){
    const adj = getAdjacent(cell);
    let adjcell;
    adj.forEach((item)=>{
        adjcell = board[item[0]][item[1]];
        if(--adjcell.breezeCounter==0){
            adjcell.hasBreeze = false;
        }
    });
}
function addStickCounter(cell){
    const adj = getAdjacent(cell);
    let adjcell;
    adj.forEach((item)=>{
        adjcell = board[item[0]][item[1]];
        if(++adjcell.stinkCounter==1){
            adjcell.hasStink = true;
        }
    });
}
function addBreezeCounter(cell){
    const adj = getAdjacent(cell);
    let adjcell;
    adj.forEach((item)=>{
        adjcell = board[item[0]][item[1]];
        if(++adjcell.breezeCounter==1){
            adjcell.hasBreeze = true;
        }
    });
}
function enterACell(cell){
    
    if(currentCell!=-1){
        if(currentCell[0]==0 && currentCell[1]==0){
            $(`[data-row=${0}][data-col=${0}]`).find('img').attr('src','images/home.jpg');
        }
        else{
            $(`[data-row=${currentCell[0]}][data-col=${currentCell[1]}]`).find('img').addClass('hide');
        }

    }
    currentCell = cell.location;
     const element = $(`[data-row=${cell.location[0]}][data-col=${cell.location[1]}]`);
     $(element).find('img').attr('src','images/arrow_man.jpg');
     $(element).find('img').removeClass('hide');
     $(element).addClass('visited');
     if(cell.containsGold) {
        alert("gold found--reload(f5) to play again");
        $('.nextBtn').addClass('hide');
        return;
    }
    if(cell.containsPit) {
        alert("agent fall into pit--reload(f5) to play again");
        $('.nextBtn').addClass('hide');
        return;
    }
    if(cell.containsWompus && arrows==-1) {
        alert("agent killed by wumpus--reload(f5) to play again");
        $('.nextBtn').addClass('hide');
        return;
    }
    cell.visited = true;
    // remove this cell from queue
    let pos = contains(queue,cell.location);
    if(pos!=-1) queue.splice(pos,1);
    // add adjacent cell to queue
    updateQueue(cell);
    if(!cell.containsPit){
        updatePitInfo(cell,-1);
    }
    if(!cell.containsWompus){
        updateWompusInfo(cell,-1);
    }
    let adj = getAdjacent(cell);;
    if(!cell.hasBreeze){
       adj.forEach((item)=>{
           updatePitInfo(board[item[0]][item[1]],-1);
       });
    }
    if(!cell.hasStink){
       adj.forEach((item)=>{
           updateWompusInfo(board[item[0]][item[1]],-1);
       });
    }
    if(cell.hasBreeze){
        addNewStatementFolPit(cell);
        adj.forEach((item)=>{
            updatePitInfo(board[item[0]][item[1]],0);
        });
    }
    if(cell.hasStink){
        addNewStatementFolWompus(cell);
        adj.forEach((item)=>{
            updateWompusInfo(board[item[0]][item[1]],0);
        });
    }
}
// ------ jquery ---------------------------
let nextLocation = [0,0];
$('.nextBtn').on('click',function(e){ 
    
    if(nextLocation.length==0) {
        alert("there is no gold! --reload(f5) to play again");
        $('.nextBtn').addClass('hide');
        return;
    }
    enterACell(board[nextLocation[0]][nextLocation[1]]);
    log('current cell: '+nextLocation);
    log('arrows '+arrows);
    // log('wumpus statements---');
    // log(FolWoppus);
    // log('pit statements---');
    // log(FolPit);
    nextLocation = nextCell(nextLocation);
        
    log('next available cells and resolution');
    queue.forEach((item)=>{
        log('cell '+ item + ', pitAssump: '+board[item[0]][item[1]].pit+', wumpusAssump: '+board[item[0]][item[1]].wompus);
    });
    log('choosed for next cell: '+nextLocation);
    const nextcell = board[nextLocation[0]][nextLocation[1]];
    if((nextcell.wompus==0 || nextcell.wompus==1) && arrows>0){
        log('shooting an arrow--->'+nextLocation);
        arrows--;
    }
    else if((nextcell.wompus==0 || nextcell.wompus==1) && arrows==0){
        if(nextcell.wompus==0) log('i have no arrow. may be going to die. pray for me ');
        if(nextcell.wompus==1) log('i have no arrow. going to die. pray for me ');
        arrows--;
    }
    if(nextcell.pit==1) log('jumping pit');
    if(nextcell.pit==0) log('if pit exist. i am finished. pray for me');
    log('------- 0 ------');
});
$('.startBtn').on('click',function(e){ 
    $('.contextMenu').addClass('hide');
    $('.nextBtn').removeClass('hide');
    $('.grid').removeClass('hoverable');
    $(this).addClass('hide');
});
$('.grid').on('click','.cell',function(e){
    $('.grid .cell.active').toggleClass('active');
    $(this).addClass('active');
});

let currentSelected = '';
$('.grid').on('click','.cell',function(e){ 
    currentSelected = this;
    const row = $(currentSelected).attr('data-row');
    const col = $(currentSelected).attr('data-col');
    // log('hasBreeze '+board[row][col].hasBreeze);
    // log('counter '+board[row][col].breezeCounter);
    // log('hasStink '+board[row][col].hasStink);
    // log('counter '+board[row][col].stinkCounter);
    // log('gold '+board[row][col].containsGold);
    // log('hasPit '+board[row][col].containsPit);
    // log('hasWompus '+board[row][col].containsWompus);
    // log('-----------------------');
  });
$('.contextMenu').on('click','.item',function(e){ 
    if(currentSelected=='') return;
    const img = currentSelected.querySelector('img');
    const src = $(this).attr('data-src');
    const preImgSrc = $(img).attr('src');
    if(src==preImgSrc) return;
    $(img).attr('src', src);
    if(src=='') $(img).addClass('hide');
    else $(img).removeClass('hide');
    const row = $(currentSelected).attr('data-row');
    const col = $(currentSelected).attr('data-col');
    if(preImgSrc.includes('wompus')){
        reduceStickCounter(board[row][col]);
    }
    if(preImgSrc.includes('pit')){
        reduceBreezeCounter(board[row][col]);
    }
    if(src.includes('wompus')){
        addStickCounter(board[row][col]);
        board[row][col].containsWompus = true;
        board[row][col].containsPit = false;
        board[row][col].containsGold = false;
    }
    if(src.includes('pit')){
        addBreezeCounter(board[row][col]);
        board[row][col].containsPit = true;
        board[row][col].containsWompus = false;
        board[row][col].containsGold = false;
        
    }
    if(src==''){
        board[row][col].containsPit = false;
        board[row][col].containsWompus = false;
        board[row][col].containsGold = false;
    }
    if(src.includes('gold')){
        board[row][col].containsPit = false;
        board[row][col].containsWompus = false;
        board[row][col].containsGold = true;
    }
    
  });
  