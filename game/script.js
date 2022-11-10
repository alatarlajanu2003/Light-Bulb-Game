const bulb = '💡'
let lightedAreas = []

let xDIM
let yDIM
let blackCells
let blackCellsWithIndex

let initialPage = document.querySelector(".initialPage")
let matrixPage = document.querySelector(".matrixPage")

const enoughBulbsAround = 'rgb(57, 255, 20)'

let msecVar
let msec, sec, min, hour, timerOn = 0

/**
 * Save to local storage
 * @param {*} name 
 * @param {*} value 
 */
function permaSave(name, value){
    window.localStorage.setItem(name, JSON.stringify(value))
}

/**
 * Retrieve from local storage
 * @param {*} name 
 * @returns 
 */
function permaLoad(name){
    return JSON.parse(window.localStorage.getItem(name))
}

/**
 * Based on the dimensions selected, initialises the positions of black tiles and how many bulbs can be around them
 * @param {*} boardValue 
 * @param {*} nameValue 
 */
function selectBoard(boardValue, nameValue){
    switch(boardValue){
        case "7x7":   xDIM = 7; 
                      yDIM = 7; 
                      blackCells = ['03', '11', '15', '30', '33', '36', '51', '55', '63']
                      blackCellsWithIndex = {'11' : 0, '03' : 1, '15' : 2, '55' : 2, '63' : 3}
                      break
        case "7x7*":  xDIM = 7; 
                      yDIM = 7; 
                      blackCells = ['02', '04', '20', '22', '24', '26', '33', '40', '42', '44', '46', '62', '64']
                      blackCellsWithIndex = {'13' : 0, '24' : 3, '33' : 1, '40' : 2, '64' : 2}
                      break
        case "10x10": xDIM = 10; 
                      yDIM = 10; 
                      blackCells = ['01', '15', '17', '19', '21', '22', '27', '34', '41', '44', '45', '46', '53', 
                                    '54', '55', '58', '65', '72', '77', '78', '80', '82', '84', '98']
                      blackCellsWithIndex = {'15' : 3, '17' : 2, '21' : 0, '41' : 1, '45' : 1, '58' : 3, '72' : 1, '77' : 0, 
                                             '80' : 3,  '84' : 0, '98' : 0}
                      let table = document.querySelector("#neededForBoard")
                      table.style.paddingTop = "0%"
                      table.style.minWidth = "640px"
                      break
    }
    let name = document.querySelector("#nameScoreBoard")
    name.innerText += " " + nameValue
}

/**
 * Hides the starting page, and shows the layout of the game itself
 */
function showBoard(){
    initialPage.style.display = "none"
    matrixPage.style.display = "flex"
}

/**
 * Event listener to the "Start" button, where the time lapse is initialized and strated
 * The selection, initialization, and showing functions of map are called here (in case a new game is chosen)
 * The "restartGame()" is called (in case the saved game is chosen)
*/
let startButton = document.querySelector("#startButton")
startButton.addEventListener("click", ()=>{
    if (document.querySelector("#boards").value != "savedGame"){
        msec = 0, sec = 1, min = 1, hour = 1, timerOn = 0
        start()
        let name = document.querySelector("#name")
        let board = document.querySelector("#boards")
        nameValue = name.value 
        boardValue = board.value
        selectBoard(boardValue, nameValue)
        initializeTable()
        showBoard()
    } else {
        restoreGame()
    }
})

function setMSec() {
    if (msec < 10) {
      document.getElementById("msec").innerText = "0" + msec;
    } else {
      document.getElementById("msec").innerText = msec;
    }
    msec = msec + 1;
    if (msec >= 10) {
      setSec();
      msec = 0;
    }
    msecVar = setTimeout(setMSec, 100);
}
  
function setSec() {
    if (sec >= 60) {
      setMin();
      sec = 0;
    }
    if (sec < 10) {
      document.getElementById("sec").innerText = "0" + sec;
    } else {
      document.getElementById("sec").innerText = sec;
    }
    sec = sec + 1;
}
  
function setMin() {
    if (min >= 60) {
      setHour();
      min = 0;
    }
    if (min < 10) {
      document.getElementById("min").innerText = "0" + min;
    } else {
      document.getElementById("min").innerText = min;
    }
    min = min + 1;
}
  
function setHour() {
    if (hour < 10) {
      document.getElementById("hour").innerText = "0" + hour;
    } else {
      document.getElementById("hour").innerText = hour;
    }
    hour = hour + 1;
}
  
  /**
   * Starts the time lapse
   */
function start() {
    if (!timerOn) {
      timerOn = 1;
      setMSec();
    }
}
  
  /**
   * Stops the time lapse
   */
function stop() {
    clearTimeout(msecVar);
    timerOn = 0;
}

function delegate(parent, child, when, what){
    function eventHandlerFunction(event){
        let eventTarget  = event.target
        let eventHandler = this
        let closestChild = eventTarget.closest(child)

        if(eventHandler.contains(closestChild)){
            what(event, closestChild)
        }
    }

    parent.addEventListener(when, eventHandlerFunction)
}

/**
 * Initializes the map
 */
function initializeTable(){ 
    let table = document.querySelector('table') 
    for(let i = 0; i < xDIM; i++){
        let newTr = document.createElement('tr')
        for (let j = 0; j < yDIM; j++){
            let newTd = document.createElement('td')
            newTd.classList.add(`${i}${j}`)
            if (blackCells.includes(`${i}${j}`)){
                newTd.classList.add("color-black")
                if (blackCellsWithIndex.hasOwnProperty(`${i}${j}`)){
                    newTd.innerText = blackCellsWithIndex[`${i}${j}`]
                }
            }
            else {
                newTd.classList.add("color-white")
            }
            newTr.appendChild(newTd)
        }
        table.appendChild(newTr)
    }
}

/**
 * Returns if 2 lists are equal
 * @param {*} list1 
 * @param {*} list2 
 * @returns 
 */
function equals(list1, list2){
    if (list1 === list2) return true
    if (list1 == null || list2 == null) return false
    if (list1.length != list2.length) return false
    for (let i = 0; i < list1.length; ++i) {
        if (list1[i] !== list2[i]) return false;
      }
      return true;

}

/**
 * Returns the coordinates of the cells which should be illuminated, excluding the ones which are already illuminated by another bulb
 * @param {*} coordOfCellsOnXY 
 * @param {*} cellsOnXY 
 * @param {*} inLightedAreas 
 * @returns 
 */
function noClushWithLight(coordOfCellsOnXY, cellsOnXY, inLightedAreas){
    let copyLightedAreas = lightedAreas
    let copyCoordOfCellsOnXY = coordOfCellsOnXY
    copyLightedAreas = copyLightedAreas.filter(list => !equals(list,  coordOfCellsOnXY))
    if (copyLightedAreas.length != 0){
        for(const list of copyLightedAreas){
            for (const el of list){
                if (copyCoordOfCellsOnXY.includes(el)){
                        copyCoordOfCellsOnXY = copyCoordOfCellsOnXY.filter(elem => elem != el)
                    }
                }
            }
        }
    if (inLightedAreas){
        lightedAreas = lightedAreas.filter(list => !equals(list, coordOfCellsOnXY))
        coordOfCellsOnXY = copyCoordOfCellsOnXY
    }else{
        coordOfCellsOnXY = copyCoordOfCellsOnXY
        lightedAreas.push(Array.from(cellsOnXY.map(cell => cell.classList[0])))
        }
    return coordOfCellsOnXY
}

/**
 * Illuminates the cells which are on the selected cell's X axis and Y axis, until a black cell is met
 * @param {*} position 
 * @param {*} elem 
 */
function propagateLight(position, elem){

    if (elem.innerText === bulb){
        elem.innerText = ""
    } else {
        elem.innerText = bulb
    }
    let cellsOnXY = Array.from(document.querySelectorAll('td')).filter(cell => (cell.classList[0][0] == position[0] || cell.classList[0][1] == position[1]))  
    let blacks = cellsOnXY.filter(cell => cell.classList.contains("color-black"))
        for (const b_cell of blacks){
            if (b_cell.classList[0][0] == position[0]){
                let j = parseInt(b_cell.classList[0][1])
                if (b_cell.classList[0][1] < position[1]){
                    while (j >= 0 ){
                        cellsOnXY = cellsOnXY.filter(e => e.classList[0] != `${position[0]}${j}`)
                        j -= 1
                    }
                }
                else if (b_cell.classList[0][1] > position[1]){
                    while (j < xDIM ){
                        cellsOnXY = cellsOnXY.filter(e => e.classList[0] != `${position[0]}${j}`)
                        j += 1
                    }
                }
            } else if (b_cell.classList[0][1] == position[1]){
                let i = parseInt(b_cell.classList[0][0])
                if (b_cell.classList[0][0] < position[0]){
                    while (i >= 0){
                        cellsOnXY = cellsOnXY.filter(e => e.classList[0] != `${i}${position[1]}`)
                        i -= 1
                    }
                }
                else if (b_cell.classList[0][0] > position[0]){
                    while (i < yDIM ){
                        cellsOnXY = cellsOnXY.filter(e => e.classList[0] != `${i}${position[1]}`)
                        i += 1
                    }
                }
            }
        }
    if (cellsOnXY.filter(cell => cell != elem && cell.innerText == bulb).length == 0){
        let coordOfCells = Array.from(cellsOnXY.map(cell => cell.classList[0]))

        if(lightedAreas.filter(list => equals(list, coordOfCells)).length == 0){
            coordOfCells = noClushWithLight(coordOfCells, cellsOnXY, false)
        }
        else if(lightedAreas.filter(list => equals(list, coordOfCells)).length != 0){
            coordOfCells = noClushWithLight(coordOfCells, cellsOnXY, true)
        }

        finalCellsOnXY = []
        cellsOnXY.map(cell => {
            for(const coord of coordOfCells){
                if (cell.classList[0] == coord){
                    finalCellsOnXY.push(cell)
                }
            }
        })

        cellsOnXY = finalCellsOnXY
        cellsOnXY.map(cell => cell.classList.toggle("color-yellow"))
    } else {
        toggleRed(elem)
    }
}

/**
 * Returns an array of cells which are placed around the selected cell (on X and Y axis)
 * @param {*} cellPosition 
 * @returns 
 */
function around(cellPosition){
    let selected = Array.from(document.querySelectorAll('td')).filter(cell => 
        (cell.classList[0][0] == cellPosition[0] && (cell.classList[0][1] == parseInt(cellPosition[1]) - 1 || cell.classList[0][1] == parseInt(cellPosition[1]) + 1)) 
      || cell.classList[0][1] == cellPosition[1] && (cell.classList[0][0] == parseInt(cellPosition[0]) - 1 || cell.classList[0][0] == parseInt(cellPosition[0]) + 1))
    return selected
}

function toggleRed(cell){
    setTimeout(() => {
        cell.classList.remove("color-red")
        cell.innerText = ""
     }, 500)
        cell.classList.add("color-red")
        cell.innerText = bulb
}

function turnGreenText (cellMain){
    let selected = around(cellMain.classList[0], true)
    let blacks = selected.filter(cell => cell.classList.contains("color-black"))
    for(let black of blacks){
        if (black.innerText != "") {
            let bubsAroundBlack = around(black.classList[0]).filter(cell => cell.innerText == bulb)
                if (bubsAroundBlack.length == black.innerText){
                    black.style.color = enoughBulbsAround
                } else {
                    black.style.color = "white"
                }
        }
    }
}

/**
 * Returns true/false if there are enough bulbs around a black cell with number on it
 * @param {*} cellMain 
 * @returns 
 */
function enoughAroundBlackCell(cellMain){
    let selected = around(cellMain.classList[0], true)
    let blacks = selected.filter(cell => cell.classList.contains("color-black"))
    for(let black of blacks){
        if (black.innerText == '0') {
            toggleRed(cellMain)
            return true
        }
        if (black.innerText != "") {
            let bulbsAroundBlack = around(black.classList[0]).filter(cell => cell.innerText == bulb)
            if (cellMain.innerText != bulb) {
                if (bulbsAroundBlack.length == black.innerText){
                    toggleRed(cellMain)
                    return true
                }
            }
        }
    }
    return false
}

delegate(document.querySelector('table'), 'td', 'click', (event, elem) =>
{ 
      if (!elem.classList.contains("color-black") && !enoughAroundBlackCell(elem)){   
        propagateLight(elem.classList[0], elem)  
        turnGreenText(elem)
    }
})

let checkButton = document.querySelector("#checkButton")
checkButton.classList.add("color-checkRestartButton")
checkButton.addEventListener('click', () => {
    let lightedCells = Array.from(document.querySelectorAll('td')).filter(cell => cell.classList.contains("color-yellow"))
    if (lightedCells.length != xDIM * yDIM - blackCells.length){ 
        setTimeout(() => {
            checkButton.classList.remove("color-red")
            checkButton.classList.add("color-checkRestartButton")
            checkButton.innerText = "Check"
         }, 1300)
         checkButton.classList.remove("color-checkRestartButton")
         checkButton.classList.add("color-red")
         checkButton.innerText = "WRONG ANSWER!"
    } else {
        checkButton.classList.remove("color-checkRestartButton")
        checkButton.classList.add("color-green")
        checkButton.innerText = "SUCCESS!"
    }
})

let restartButton = document.querySelector("#restartButton")
restartButton.classList.add("color-checkRestartButton")
restartButton.addEventListener('click', () => {
    lightedAreas = []
    let allCells = Array.from(document.querySelectorAll('td'))
    allCells.forEach(cell => {
        cell.style.color = "white"
        if (cell.classList.contains("color-yellow")){
            cell.classList.remove("color-yellow")
            if (cell.innerText == bulb){
                cell.innerText = ""
            }
        }
    })
    let checkButton = document.querySelector("#checkButton")
    if (checkButton.classList.contains("color-green")){
        checkButton.classList.remove("color-green")
        checkButton.classList.add("color-checkRestartButton")
        checkButton.innerText  = "Check"
    }

    
})

/**
 * Saves the needed information to the local storage
 */
let saveButton = document.querySelector('#saveButton')
saveButton.addEventListener('click', ()=>{
    let toSave = []
    document.querySelectorAll('td').forEach(cell => {
        toSave.push({
            color : cell.classList.contains("color-yellow") ? true : false,
            numberOrBulb : cell.innerText == bulb ? bulb : cell.innerText,
            textColor: cell.style.color,
        })
    })
    let savedGame = []
    let name = document.querySelector("#name").value
    let ms = document.querySelector("#msec").innerText
    let s = document.querySelector("#sec").innerText
    let min = document.querySelector("#min").innerText
    let h = document.querySelector("#hour").innerText
    savedGame.push(name, ms, s, min, h, xDIM, yDIM)
    permaSave('data', toSave)
    permaSave('savedGame', savedGame)
    permaSave('boardValue', document.querySelector("#boards").value)
    permaSave('light', lightedAreas)
})

/**
 * Restores the latest results of a saved game and starts it again
 */
function restoreGame(){
    const data = permaLoad('data')
    const savedGame = permaLoad('savedGame')
    const light = permaLoad('light')
    const mapName = permaLoad('boardValue')
    xDIM = savedGame[5]
    yDIM = savedGame[6]
    selectBoard(mapName, savedGame[0])
    initializeTable()
    lightedAreas = light

    let table = Array.from(document.querySelectorAll('td'))
    let cnt = 0
    table.forEach(cell => {
        let color = data[cnt]['color']
        let numberOrBulb = data[cnt]['numberOrBulb']
        if (color) cell.classList.add("color-yellow") 
        numberOrBulb == bulb ? cell.innerText = bulb : cell.innerText = numberOrBulb
        cell.style.color = data[cnt]['textColor']
        cnt ++
    })

    document.querySelector("#msec").innerText = savedGame[1]
    document.querySelector("#sec").innerText = savedGame[2]
    document.querySelector("#min").innerText = savedGame[3]
    document.querySelector("#hour").innerText = savedGame[4]
    msec = parseInt(savedGame[1]), sec = parseInt(savedGame[2])
    min = parseInt(savedGame[3]), hour = parseInt(savedGame[4])
    // start()
    showBoard()
}


