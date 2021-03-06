import * as BoardDataApi from '../api-board-data/BoardDataApi';
import { Board } from '../view-components/TazkrObjects';

const moveCardToColumnAtIndex = async (taskId: string, columnId: string, index: number) => {
    await BoardDataApi.moveCardToColumnAtIndex(taskId, columnId, index);
}

const findCardById = (inputBoard: Board, cardId: string) => {
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
const findColumnById = (inputBoard: Board, columnId: string) => {
    for (let colIndex = 0; colIndex < inputBoard.Columns.length; ++colIndex) {
        if (inputBoard.Columns[colIndex].Id === columnId) {
            return inputBoard.Columns[colIndex];
        }
    }
    return null;
}

export default (result: any, inputboard: Board, setBoard: (board: Board) => void) => {
    const { destination, source, draggableId } = result;
    // Exit if No destination
    if (!destination) {
        return;
    }
    // Exit if Dropping on same place
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return;
    }
    const board = JSON.parse(JSON.stringify(inputboard));
    const startColumn = findColumnById(board, source.droppableId);
    const finishColumn = findColumnById(board, destination.droppableId);
    const card = findCardById(board, draggableId);
   
    if (startColumn !== null && finishColumn !== null  && card !== null) {
      if (source.droppableId === destination.droppableId) {
          // Reordering task on same column
          const newBoard = {...board}  
          const newCards = startColumn.Cards.filter(x => x.Id !== draggableId);;
          newCards.splice(destination.index, 0, card);
          const updateColumn = findColumnById(newBoard, destination.droppableId);
          if (updateColumn !== null) {
              updateColumn.Cards = newCards;
              setBoard(newBoard);
          }
      } else { 
          // Moving task to new column
          const newBoard = {...board} 
          const startColumnCards = startColumn.Cards.filter(x => x.Id !== draggableId);
          const newStartColumn = findColumnById(newBoard, source.droppableId);
          const newFinishColumn = findColumnById(newBoard, destination.droppableId);
          if (newStartColumn !== null && newFinishColumn !== null) {
              newStartColumn.Cards = startColumnCards;
              const finishColumnCards = [...finishColumn.Cards];
              finishColumnCards.splice(destination.index, 0, card);
              
              newFinishColumn.Cards = finishColumnCards;
              setBoard(newBoard);
              }
          }
      }
      moveCardToColumnAtIndex(draggableId, destination.droppableId, destination.index);
}