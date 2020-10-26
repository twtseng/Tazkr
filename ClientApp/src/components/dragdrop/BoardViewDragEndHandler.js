import callBoardDataApi from '../api-board-data/BoardDataApi';

const moveCardToColumnAtIndex = async (taskId, columnId, index) => {
    await callBoardDataApi("BoardData/MoveCardToColumnAtIndex", "PATCH", {Param1: taskId, Param2: columnId, Param3: index});
}

const findCardById = (inputBoard, cardId) => {
    for (let colIndex = 0; colIndex < inputBoard.columns.length; ++colIndex) {
        const column = inputBoard.columns[colIndex];
        for (let cardIndex = 0; cardIndex < column.cards.length; ++cardIndex) {
            if (column.cards[cardIndex].cardId === cardId) {
                return column.cards[cardIndex];
            }
        }
    }
    return null;
}
const findColumnById = (inputBoard, columnId) => {
    for (let colIndex = 0; colIndex < inputBoard.columns.length; ++colIndex) {
        if (inputBoard.columns[colIndex].columnId === columnId) {
            return inputBoard.columns[colIndex];
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
      const newCards = [...startColumn.cards];
      newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, card);
      const updateColumn = findColumnById(newBoard, destination.droppableId);
      updateColumn.cards = newCards;
      setBoard(newBoard);
  } else { 
      // Moving task to new column
      const newBoard = {...board} 
      const startColumnCards = [...startColumn.cards];
      startColumnCards.splice(source.index, 1);
      const newStartColumn = findColumnById(newBoard, source.droppableId);
      newStartColumn.cards = startColumnCards;
      const finishColumnCards = [...finishColumn.cards];
      finishColumnCards.splice(destination.index, 0, card);
      const newFinishColumn = findColumnById(newBoard, destination.droppableId);
      newFinishColumn.cards = finishColumnCards;
      setBoard(newBoard);
  }
  moveCardToColumnAtIndex(draggableId, destination.droppableId, destination.index);
}