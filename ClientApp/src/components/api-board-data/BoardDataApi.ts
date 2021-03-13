import authService from '../api-authorization/AuthorizeService';

const callBoardDataApi = async (url = '', method='GET', data = {}) => {
    console.log(`BoardDataApi, url[${url}] method[${method}] data[${data}]`);
    const token = await authService.getAccessToken();
    const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'same-origin', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
        // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: method === "GET" ? null : JSON.stringify(data) // body data type must match "Content-Type" header
    });
    if (response.ok) {
        const jsonResult = await response.json(); // parses JSON response into native JavaScript objects
        return jsonResult;
    } else {
        if (response.status === 401) {
            authService.signIn();
        }
        return [];
    }
}
export const getBoards = async () => {
    return callBoardDataApi("BoardData/Boards","GET")
}
export const createBoard = async (boardName: string) => {
    return callBoardDataApi("BoardData/Boards","POST", { Param1: boardName });
}
export const getBoard = async (boardId: string) => {
    return callBoardDataApi(`BoardData/Boards/${boardId}`,"GET");
}
export const deleteBoard = async (boardId: string) => {
    return callBoardDataApi(`BoardData/Boards/${boardId}`,"DELETE",{})
}
export const renameBoard = async (boardId: string, boardTitle: string) => {
    return callBoardDataApi(`BoardData/Boards/${boardId}/Title`,"PUT",{ Param1: boardTitle })
}
export const setBoardPublicVisibility = async (boardId: string, isPublic: boolean) => {
    return callBoardDataApi(`BoardData/Boards/${boardId}/IsPubliclyVisible`, "PUT", { Param1 : isPublic});
}
export const addColumn = async (boardId: string, columnTitle: string) => {
    return callBoardDataApi(`BoardData/Columns`,"POST",{ Param1: boardId, Param2: "New Column"});
}
export const renameColumn = async (columnId: string, columnTitle: string) => {
    return callBoardDataApi(`BoardData/Columns/${columnId}/Title`,"PUT",{ Param1: columnTitle })
}
export const deleteColumn = async (columnId: string) => {
    return callBoardDataApi(`BoardData/Columns/${columnId}`,"DELETE",{});
}
export const addCardToColumn = async (columnId: string, cardTitle: string, boardId: string) => {
    return callBoardDataApi(`BoardData/Cards`,"POST",{ Param1: columnId, Param2: cardTitle, Param3: boardId })
}
export const updateCard = async (cardId: string, cardTitle: string|null, cardDescription: string|null, boardId: string) => {
    return callBoardDataApi(`BoardData/Cards/${cardId}`,"PATCH",{  Param1: cardTitle, Param2: cardDescription, Param3: boardId })
}
export const renameCard = async (cardId: string, cardTitle: string, boardId: string) => {
    return updateCard(cardId, cardTitle, null, boardId);
}
export const deleteCard = async (cardId: string, boardId: string) => {
    return callBoardDataApi(`BoardData/Cards/${cardId}`,"DELETE",{ Param1: boardId })
}
export const getUsers = async () => {
    return callBoardDataApi(`BoardData/Users`,"GET")
}
export const addBoardUser = async (boardId: string, userName: string) => {
    return callBoardDataApi(`BoardData/Boards/${boardId}/BoardUsers`,"POST",{ Param1: userName});
}
export const moveCardToColumnAtIndex = async (taskId: string, columnId: string, index: number) => {
    return callBoardDataApi(`BoardData/Cards/${columnId}/${taskId}/${index}`, "PUT", {});
}
export const sendChatMessage = async (chatId: string, chatMessage: string) => {
    return callBoardDataApi(`BoardData/Chat/${chatId}`, "POST", { Param1: chatMessage});
}
export const getChatMessages = async (chatId: string) => {
    return callBoardDataApi(`BoardData/Chat/${chatId}`,"GET");
}