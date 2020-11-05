import callBoardDataApi from '../api-board-data/BoardDataApi';

const moveCardToColumnAtIndex = async (taskId, columnId, index) => {
    await callBoardDataApi("BoardData/MoveCardToColumnAtIndex", "PATCH", {Param1: taskId, Param2: columnId, Param3: index});
}

const findCardById = (inputBoard, cardId) => {
    for (let colIndex = 0; colIndex < inputBoard.Columns.length; ++colIndex) {
        const column = inputBoard.Columns[colIndex];
        for (let cardIndex = 0; cardIndex < column.Cards.length; ++cardIndex) {
            if (column.Cards[cardIndex].Id === cardId) {
                return column.Cards[cardIndex];
            }
        }
    }
    return null;
}
const findColumnById = (inputBoard, columnId) => {
    for (let colIndex = 0; colIndex < inputBoard.Columns.length; ++colIndex) {
        if (inputBoard.Columns[colIndex].Id === columnId) {
            return inputBoard.Columns[colIndex];
        }
    }
    return null;
}

export default (result, board, setBoard) => {
  const { destination, source, draggableId } = result;
  // Exit if No destination
  if (!destination) {
      return;
  }
  // Exit if Dropping on same place
  if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
  }
  const startColumn = findColumnById(board, source.droppableId);
  const finishColumn = findColumnById(board, destination.droppableId);
  const card = findCardById(board, draggableId);
 
  if (source.droppableId === destination.droppableId) {
      // Reordering task on same column
      const newBoard = {...board}  
      const newCards = [...startColumn.Cards];
      newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, card);
      const updateColumn = findColumnById(newBoard, destination.droppableId);
      updateColumn.Cards = newCards;
      setBoard(newBoard);
  } else { 
      // Moving task to new column
      const newBoard = {...board} 
      const startColumnCards = [...startColumn.Cards];
      startColumnCards.splice(source.index, 1);
      const newStartColumn = findColumnById(newBoard, source.droppableId);
      newStartColumn.Cards = startColumnCards;
      const finishColumnCards = [...finishColumn.Cards];
      finishColumnCards.splice(destination.index, 0, card);
      const newFinishColumn = findColumnById(newBoard, destination.droppableId);
      newFinishColumn.Cards = finishColumnCards;
      setBoard(newBoard);
  }
  moveCardToColumnAtIndex(draggableId, destination.droppableId, destination.index);
}