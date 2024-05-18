// JavaScript file
// Rules

/*
Things To Accomplish:
- Move a checker to an appropriate space
- highlight available spaces to go
- Alternate turns
- Allow pieces to be jumped when in proper space
- prevent backwards movement if not a king
- add a symbol to pieces that are kings
- 
- decalre winner (all pieces are gone or no move to make)



*/
///////////////////////////
// * Query Selectors
///////////////////////////
const redPiece = document.querySelectorAll(".red-piece");
const blackPiece = document.querySelectorAll(".black-piece");
const squares = document.querySelectorAll(".square");
const checker = document.querySelectorAll(".checker");
const checkerboard = document.querySelector(`.checkerboard`);
const playerTurnText = document.querySelector(`.player-turn`);

///////////////////////////
// * Variables
///////////////////////////
const squaresArray = [];
const final2DArrayofBlackSquares = [];
let availableSqrPosition1;
let availableSqrPosition2;
let selectedPiece;
let sqrOfSelectedPiece;
let checkerRow;
// this prevents undefined from occuring when accessing the element
// checker to be removed does not come about until after the first checker is clicked, which is
// what caused earlier errors
let checkerToBeRemoved = selectedPiece?.parentElement;
let isRedTurn = true;

// add square els to the array
squares.forEach((sqr) => squaresArray.push(sqr));
// filter to only the playable squares
const playableSquares = squaresArray.filter((sqr) =>
  sqr.classList.contains("black")
);
// this gives me an array of the just the numbers for the playable squares
// to create a 2D array, i need to break these up into arrays of 4
const playableSquaresIdArray = playableSquares.map((item) =>
  extractNumFromIdName(item)
);

/////////////////////////////////////////////////////
// * Recursive Function | Get 2D Array
/////////////////////////////////////////////////////
// this is a recursive function that will create my 2D array of playable (black) squares
create2DArrayOfBlackSquares(playableSquaresIdArray);

function create2DArrayOfBlackSquares(arr) {
  if (arr?.length > 3) {
    let newRow = arr.splice(0, 4);
    final2DArrayofBlackSquares.push(newRow);
    create2DArrayOfBlackSquares(arr);
  }
}

console.log(final2DArrayofBlackSquares);

//////////////////////////////////////////////////////
// * Listen for CheckerBoard Click
//////////////////////////////////////////////////////
checkerboard.addEventListener("click", (e) => {
  // is it a checker?
  if (e.target.classList.contains("checker")) {
    // removes the active class from previous selections on each new click
    squares.forEach((sqr) => {
      if (
        sqr.classList.contains("active") ||
        sqr.classList.contains("active-jump")
      ) {
        sqr?.classList.remove("active");
        sqr?.classList.remove("active-jump");
      }
    });
    // removes active class when a different piece is selected
    selectedPiece?.classList.remove("active");

    ///////////////////////////
    // if checker is red
    ///////////////////////////
    if (e.target.classList.contains("red-piece")) {
      // prevents player from going if it is not their turn
      if (!isRedTurn) return;
      let currentSquareOfChecker = extractNumFromIdName(e.target.parentElement);
      selectedPiece = e.target;
      console.log(selectedPiece, " <-- selected piece");
      selectedPiece.classList.add("active");
      determineRedsNextMove(currentSquareOfChecker);
    }
    ///////////////////////////
    // if checker is black
    ///////////////////////////
    else {
      // prevents player from going if it is not their turn
      if (isRedTurn) return;
      let currentSquareOfChecker = extractNumFromIdName(e.target.parentElement);
      selectedPiece = e.target;

      selectedPiece.classList.add("active");
      determineBlacksNextMove(currentSquareOfChecker);
    }
  }

  /////////////////////////////////////////////
  // action to remove piece if it is jumped
  /////////////////////////////////////////////
  if (
    e.target.classList.contains("square") &&
    e.target.classList.contains("active-jump")
  ) {
    // this moves the child away from the current el and into the new active one
    // then removes the active class from all elements involved
    e.target.appendChild(selectedPiece);
    checkerToBeRemoved?.firstElementChild?.remove();
    e.target.classList.remove("active-jump");

    // ! this is only for red 45deg btw
    if (
      document
        .getElementById(`square-${availableSqrPosition1 - 7}`)
        .classList.contains("active-jump")
    ) {
      deselectAvailableSquares(availableSqrPosition1, "jump");
    } else {
      deselectAvailableSquares(availableSqrPosition1);
    }
    if (
      document
        .getElementById(`square-${availableSqrPosition2 - 7}`)
        ?.classList.contains("active-jump")
    ) {
      deselectAvailableSquares(availableSqrPosition2, "jump");
    } else {
      deselectAvailableSquares(availableSqrPosition2);
    }

    selectedPiece.classList.remove("active");
    ///////////////////////////
    // toggles player turns
    ///////////////////////////
    isRedTurn = !isRedTurn;
    renderWhosTurn(isRedTurn);
  }
  /////////////////////////////////////////////
  // action to remove piece if it is jumped
  /////////////////////////////////////////////
  if (
    e.target.classList.contains("square") &&
    e.target.classList.contains("active")
  ) {
    // this moves the child away from the current el and into the new active one
    // then removes the active class from all elements involved
    e.target.appendChild(selectedPiece);
    deselectAvailableSquares(availableSqrPosition1);
    deselectAvailableSquares(availableSqrPosition2);
    selectedPiece.classList.remove("active");
    // toggles player turns
    isRedTurn = !isRedTurn;
    renderWhosTurn(isRedTurn);
  }
});

///////////////////////////
// Func: render whos turn it is
///////////////////////////
function renderWhosTurn(isRedTurn) {
  if (isRedTurn) {
    playerTurnText.style.color = "red";
    return (playerTurnText.innerText = `Red's`);
  } else {
    playerTurnText.style.color = "black";

    return (playerTurnText.innerText = `Black's`);
  }
}
/*
Now I have the square num of the piece I currently selected
- I need to come up with an alogrithim that will automatically allow me to choose the next available squares
- highlight the available squares
- default available squares are one above and one to the right
- if there is none above then only to the right
- if there is none to the right then only above 
*/

//////////////////////////////////////////////////////
// Determine available moves for red
//////////////////////////////////////////////////////
function determineRedsNextMove(checkerPosValue) {
  let test = final2DArrayofBlackSquares.map((arr, idx) => {
    if (arr.includes(checkerPosValue)) {
      //   console.log(idx, " <-- arr1Lvl Index");
      //   console.log(arr.indexOf(checkerPosValue), " <-- arr2Lvl Index");

      // movement for Regular Red Pieces
      moveRegularRedPiece(arr, idx, checkerPosValue);
      // movement for King Red Pieces
    }
  });

  return test;
}
//////////////////////////////////////////////////////
// Move red | Regular piece
//////////////////////////////////////////////////////
function moveRegularRedPiece(arr, idx, checkerPosValue) {
  //   difference for even row and odd row index
  if (idx % 2 === 0) {
    //   initializing the vars
    // this allows us to select 1 of the available squares when we click on the checker
    availableSqrPosition1 =
      final2DArrayofBlackSquares[idx - 1][arr.indexOf(checkerPosValue)];
    selectAvailableSquares(availableSqrPosition1);

    //   initializing the vars
    availableSqrPosition2 =
      final2DArrayofBlackSquares[idx - 1][arr.indexOf(checkerPosValue) - 1];

    //   this if prevents us from selecting the second option if it does not exist on the board
    if (availableSqrPosition2) {
      //   if 2 is available then it will highlight 2 as well
      selectAvailableSquares(availableSqrPosition2);
    }
  } else {
    //   initializing the vars
    // this allows us to select 1 of the available squares when we click on the checker
    availableSqrPosition1 =
      final2DArrayofBlackSquares[idx - 1][arr.indexOf(checkerPosValue)];
    selectAvailableSquares(availableSqrPosition1);

    //   initializing the vars
    availableSqrPosition2 =
      final2DArrayofBlackSquares[idx - 1][arr.indexOf(checkerPosValue) + 1];

    //   this if prevents us from selecting the second option if it does not exist on the board
    if (availableSqrPosition2) {
      //   if 2 is available then it will highlight 2 as well
      selectAvailableSquares(availableSqrPosition2);
    }
  }
}
//////////////////////////////////////////////////////
// Determine available moves for black
//////////////////////////////////////////////////////
function determineBlacksNextMove(checkerPosValue) {
  let test = final2DArrayofBlackSquares.map((arr, idx) => {
    if (arr.includes(checkerPosValue)) {
      //   console.log(idx, " <-- arr1Lvl Index");
      //   console.log(arr.indexOf(checkerPosValue), " <-- arr2Lvl Index");

      // movement for Regular Red Pieces
      moveRegularBlackPiece(arr, idx, checkerPosValue);
    }
  });

  return test;
}
//////////////////////////////////////////////////////
// Move black | Regular piece
//////////////////////////////////////////////////////
function moveRegularBlackPiece(arr, idx, checkerPosValue) {
  //   difference for even row and odd row index
  if (idx % 2 === 0) {
    console.log("even indexed row || odd visual row");
    //   initializing the vars
    // this allows us to select 1 of the available squares when we click on the checker
    availableSqrPosition1 =
      final2DArrayofBlackSquares[idx + 1][arr.indexOf(checkerPosValue)];
    selectAvailableSquares(availableSqrPosition1);

    //   initializing the vars
    availableSqrPosition2 =
      final2DArrayofBlackSquares[idx + 1][arr.indexOf(checkerPosValue) - 1];

    //   this if prevents us from selecting the second option if it does not exist on the board
    if (availableSqrPosition2) {
      //   if 2 is available then it will highlight 2 as well
      selectAvailableSquares(availableSqrPosition2);
    }
  } else {
    //   initializing the vars
    // this allows us to select 1 of the available squares when we click on the checker
    availableSqrPosition1 =
      final2DArrayofBlackSquares[idx + 1][arr.indexOf(checkerPosValue)];
    selectAvailableSquares(availableSqrPosition1);

    //   initializing the vars
    availableSqrPosition2 =
      final2DArrayofBlackSquares[idx + 1][arr.indexOf(checkerPosValue) + 1];

    //   this if prevents us from selecting the second option if it does not exist on the board
    if (availableSqrPosition2) {
      //   if 2 is available then it will highlight 2 as well
      selectAvailableSquares(availableSqrPosition2);
    }
  }
}

//////////////////////////////////////////////////////
// FUNC: Select the available squares
//////////////////////////////////////////////////////
// arr, idx, checkerPosValue
//! this allows us to select 1 of the available squares when we click on the checker
function selectAvailableSquares(position) {
  let availableSqrs = document.getElementById(`square-${position}`);

  if (availableSqrs?.firstElementChild) {
    // position = Number(position);
    // console.log(selectedPiece)
    // * will come back to deselcting piece later
    // selectedPiece?.classList.remove("active");
    // return false;
    ///////////////////////////
    // determines which square can be jumped in basic red movement
    // king movement will take in two more if statements comparing avPos1 vs avPos2
    ///////////////////////////
    // this is if there is not other piece in the landing spot
    if (
      isRedTurn &&
      !document
        .getElementById(`square-${position}`)
        .firstElementChild.classList.contains("red-piece") &&
      document
        .getElementById(`square-${Number(position) - 7}`)
        .classList.contains("black") &&
      !document.getElementById(`square-${Number(position) - 7}`)
        .firstElementChild &&
      // extractNumFromIdName(availableSqrs + 1) % 8 !== 0 &&

      extractNumFromIdName(selectedPiece.parentElement) - 14 === position - 7
      // checkerToBeRemoved?.firstElementChild?.classList.contains(
      //   "black-piece"
      // ) &&
      // !document.getElementById(
      //   `square-${extractNumFromIdName(selectedPiece.parentElement) - 7}`
      // ).firstElementChild
      // availableSqrPosition1 === availableSqrPosition2
    ) {
      // console.log("THIS IS RED45");
      // console.log("");
      // console.log(selectedPiece.parentElement);

      // console.log(availableSqrs, " <-- available Sqr");
      // console.log(position, " <-- position");
      // console.log(availableSqrPosition1, " <-- avail Pos 1");
      // console.log(availableSqrPosition2, " <-- avail Pos 2");

      // return red315degJump(availableSqrs, position);
      return selectSquareToJumpTo(availableSqrs, position, "red45");
    } else if (
      isRedTurn &&
      extractNumFromIdName(selectedPiece.parentElement) - position !== 7 &&
      document
        .getElementById(`square-${Number(position) - 9}`)
        .classList.contains("black") &&
      !document
        .getElementById(`square-${position}`)
        .firstElementChild.classList.contains("red-piece") &&
      // targets all squares on right edge of board
      extractNumFromIdName(availableSqrs) % 8 !== 0 &&
      !document.getElementById(`square-${Number(position) - 9}`)
        .firstElementChild
      //  && extractNumFromIdName(selectedPiece.parentElement) - 18 === position-11

      // checkerToBeRemoved?.firstElementChild?.classList.contains("black-piece")
      //    &&
      //  document.getElementById(`square-${extractNumFromIdName(Number(selectedPiece.parentElement) -16)}`)?.firstElementChild

      // availableSqrPosition1 > availableSqrPosition2
    ) {
      // console.log(checkerToBeRemoved);
      // console.log("");
      // console.log("THIS IS RED315");
      // console.log(extractNumFromIdName(availableSqrs), " <-- available Sqr");
      // console.log(position, " <-- position");
      // console.log(availableSqrPosition1, " <-- avail Pos 1");
      // console.log(availableSqrPosition2, " <-- avail Pos 2");
      // console.log("test");

      return selectSquareToJumpTo(availableSqrs, position, "red315");

      // return red45degJump(availableSqrs, position);
    } else if (
      !isRedTurn &&
      availableSqrs?.firstElementChild?.classList.contains("red-piece") &&
      extractNumFromIdName(availableSqrs) % 8 !== 0 &&
      position - extractNumFromIdName(selectedPiece.parentElement) === 9 &&
      !document.getElementById(`square-${Number(position) + 9}`)
        .firstElementChild &&
      !document
        .getElementById(`square-${position}`)
        .firstElementChild.classList.contains("black-piece")

      //   !document
      //   .getElementById(`square-${position}`)
      //   .firstElementChild.classList.contains("red-piece") &&
      // document
      //   .getElementById(`square-${Number(position) - 7}`)
      //   .classList.contains("black") &&
      // !document.getElementById(`square-${Number(position) - 7}`)
      //   .firstElementChild &&
      // extractNumFromIdName(availableSqrs + 1) % 8 !== 0 &&

      // extractNumFromIdName(selectedPiece.parentElement) - 14 === position - 7
    ) {
      console.log("THIS IS BLACK135");
      console.log("");
      console.log(availableSqrs, " <-- available Sqr");
      console.log(position, " <-- position");
      console.log(availableSqrPosition1, " <-- avail Pos 1");
      console.log(availableSqrPosition2, " <-- avail Pos 2");
      // this is for a red 315deg jump!
      return selectSquareToJumpTo(availableSqrs, position, "black135");
      // return black135degJump(availableSqrs, position);
      // return red45degJump(availableSqrs, position);
    } else if (
      !isRedTurn &&
      document
        .getElementById(
          `square-${
            Number(extractNumFromIdName(selectedPiece.parentElement)) + 7
          }`
        )
        ?.firstElementChild?.classList.contains("red-piece") &&
      !document.getElementById(`square-${Number(position) + 7}`)
        ?.firstElementChild &&
      document
        .getElementById(`square-${Number(position) + 14}`)
        ?.classList.contains("black") &&
      !document
        .getElementById(`square-${position}`)
        ?.firstElementChild?.classList.contains("black-piece")
    ) {
      console.log("THIS IS BLACK225");
      console.log("");
      console.log(
        document
          .getElementById(`square-${Number(position) + 14}`)
          ?.classList.contains("black")
      );
      console.log(availableSqrs, " <-- available Sqr");
      console.log(position, " <-- position");
      console.log(availableSqrPosition1, " <-- avail Pos 1");
      console.log(availableSqrPosition2, " <-- avail Pos 2");

      return selectSquareToJumpTo(availableSqrs, position, "black225");

      // return red45degJump(availableSqrs, position);
    } else if (
      isRedTurn &&
      !availableSqrs.firstElementChild.classList.contains("black-piece")
    ) {
      return;
    }
  }

  availableSqrs.classList.add("active");
  return true;
}
//////////////////////////////////////////////////////
// FUNC: Deselect the available squares
//////////////////////////////////////////////////////
function deselectAvailableSquares(position, isJumping) {
  let availableSqrs = document.getElementById(`square-${position}`);

  if (availableSqrs?.firstChild?.classList?.contains("piece")) {
    // console.log(selectedPiece)
    // * will come back to deselcting piece later
    // selectedPiece?.classList.remove("active");
    // return false;
    console.log("black piece ahead");
  } else {
    // removes all active squares
    squares.forEach((sqr) => {
      if (
        sqr.classList.contains("active") ||
        sqr.classList.contains("active-jump")
      ) {
        sqr?.classList.remove("active");
        sqr?.classList.remove("active-jump");
      }
    });
    console.log("something something something to log");
  }

  if (isJumping) {
    console.log(availableSqrs);
    console.log(availableSqrPosition1);
    console.log(availableSqrPosition2);

    availableSqrs = document.getElementById(`square-${position - 7}`);
    availableSqrs.classList.remove(`active`, `active-jump`);
  } else if (!isJumping) {
    availableSqrs?.classList?.remove(`active`);
  }

  return true;
}

//////////////////////////////////////////////////////
// FUNC: extract the num from the id
// ex: id="square-20" --> 20
//////////////////////////////////////////////////////
function extractNumFromIdName(el) {
  return el.id.split("-").pop();
}

// this function needs to do the following
/*
1. know the place of the checker on the board (the div id it is inside)
2. Know the available div it can move to
- some sort of algorithim to dynamically know which squares are available to move to
- add the active class to those squares that fit the criteria 


DIFFERENCES IN JUMPS
Simple Red:
45deg = -14 difference ; ex 28 to 14
315deg = -20 difference ; ex 64 to 44

Simple Black:
135deg = +20 difference ; ex 44 to 64
225deg = +14 difference ; ex 14 to 28
*/
function showAvailableMoves() {}
// ! works
function red45degJump(availableSqrs, position) {
  availableSqrs.classList.remove("active");
  // let newActiveSqr =  final2DArrayofBlackSquares[idx - 1][arr.indexOf(checkerPosValue) - 1];

  availableSqrs = document.getElementById(`square-${position - 7}`);
  checkerToBeRemoved = document.getElementById(`square-${position}`);

  //   availableSqrs =
  //   i need the parent of the selected piece

  //   let parentOfSelectedPiece = selectedPiece.parentElement;
  //   let targetChecker = extractNumFromIdName(parentOfSelectedPiece);
  //   console.log(
  //     parentOfSelectedPiece,
  //     "<-- this is the parent of the selectedPiece"
  //   );
  //   let test = final2DArrayofBlackSquares.filter((arr, idx) => {
  //     arr.includes(targetChecker);
  //   });

  //   //   console.log(final2DArrayofBlackSquares.indexOf(targetChecker));
  //   final2DArrayofBlackSquares[
  //     final2DArrayofBlackSquares.indexOf(targetChecker) - 1
  //   ][test.indexOf(position) + 1];
  availableSqrs.classList.add("active-jump");
}
// ! works
function red315degJump(availableSqrs, position) {
  // selectSquareToJumpTo(availableSqrs, position, -9);
  //   availableSqrs.classList.remove("active");
  //   // let newActiveSqr =  final2DArrayofBlackSquares[idx - 1][arr.indexOf(checkerPosValue) - 1];
  //   availableSqrs = document.getElementById(`square-${position - 9}`);
  //   checkerToBeRemoved = document.getElementById(`square-${position}`);
  // if(availableSqrs.innerHTML === '') {
  //    availableSqrs.classList.add("active-jump");
  // }
}

// ! works
function black135degJump(availableSqrs, position) {
  availableSqrs.classList.remove("active");
  // let newActiveSqr =  final2DArrayofBlackSquares[idx - 1][arr.indexOf(checkerPosValue) - 1];

  availableSqrs = document.getElementById(`square-${Number(position) + 9}`);
  checkerToBeRemoved = document.getElementById(`square-${position}`);

  availableSqrs?.classList?.add("active-jump");
}

// ! works
function black225degJump(availableSqrs, position) {
  availableSqrs.classList.remove("active");
  // let newActiveSqr =  final2DArrayofBlackSquares[idx - 1][arr.indexOf(checkerPosValue) - 1];

  availableSqrs = document.getElementById(`square-${position + 7}`);
  checkerToBeRemoved = document.getElementById(`square-${position}`);

  availableSqrs.classList.add("active-jump");
}
// remove the child from checker placed square, replace child in the active square
// introduced some small bug
function selectSquareToJumpTo(availableSqrs, position, colorAndDirection) {
  let num;
  switch (colorAndDirection) {
    case "red45":
      num = -7;
      break;
    case "red315":
      num = -9;
      break;
    case "black135":
      num = 9;

      break;
    case "black225":
      num = 7;

      break;
    default:
      break;
  }
  availableSqrs.classList.remove("active");
  // let newActiveSqr =  final2DArrayofBlackSquares[idx - 1][arr.indexOf(checkerPosValue) - 1];
  console.log(
    extractNumFromIdName(selectedPiece.parentElement),
    " <-- parent id of selected piece"
  );
  sqrOfSelectedPiece = document.getElementById(
    `square-${extractNumFromIdName(selectedPiece.parentElement)}`
  );
  console.log(sqrOfSelectedPiece, " <-- currenmt piece");
  console.log(num);
  availableSqrs = document.getElementById(`square-${Number(position) + num}`);
  checkerToBeRemoved = document.getElementById(`square-${position}`);
  // returns early if there is another checker in the jump target square
  if (availableSqrs.firstElementChild) return;
  availableSqrs?.classList?.add("active-jump");
  console.log(availableSqrs, " <-- available Sqr");
  console.log(position, " <-- position");
  console.log(availableSqrPosition1, " <-- avail Pos 1");
  console.log(availableSqrPosition2, " <-- avail Pos 2");
  console.log(checkerToBeRemoved, " <-- checker to be removed");
}

/*
* CURRENT ISSUES | 5/17/24 12:37PM
1. When I select a new checker, the old active class remains on the first option
2. The old active-jump class remains on the selected square after a jump or choosing another route
3. logic for choosing the jump desitnation is inconsistent

*/
