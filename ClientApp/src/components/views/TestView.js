import React from 'react';
import { Jumbotron, Button, Card, Form } from 'react-bootstrap'
import { useParams } from "react-router-dom";
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
  };
  
  const grid = 8;
  
  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
  
    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",
  
    // styles we need to apply on draggables
    ...draggableStyle
  });
  
  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 200,
  });
  const getListStyle2 = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 200,
    display: "inline-flex",
  });

const TestView = () => {
    const [testItems, setTestItems] = React.useState(
        [
            {
              id: "1",
              content: "item 1 content",
              subItems: [
                {
                  id: "10",
                  content: "SubItem 10 content"
                },
                {
                  id: "11",
                  content: "SubItem 11 content"
                }
              ]
            },
            {
              id: "2",
              content: "item 2 content",
              subItems: [
                {
                  id: "20",
                  content: "SubItem 20 content"
                },
                {
                  id: "21",
                  content: "SubItem 21 content"
                }
              ]
            },
            {
              id: "3",
              content: "item 3 content",
              subItems: [
                {
                  id: "30",
                  content: "SubItem 30 content"
                },
                {
                  id: "31",
                  content: "SubItem 31 content"
                }
              ]
            }
          ]        
    );

    const onDragEnd = (result) => {
        // dropped outside the list
        console.log(result);
        console.log("innner drag");
        if (!result.destination) {
          return;
        }
        const sourceIndex = result.source.index;
        const destIndex = result.destination.index;
        if (result.type === "droppableItem") {
          const items = reorder(testItems, sourceIndex, destIndex);
    
          setTestItems(items);
        } else if (result.type === "droppableSubItem") {
          const itemSubItemMap = testItems.reduce((acc, item) => {
            acc[item.id] = item.subItems;
            return acc;
          }, {});
    
          const sourceParentId = parseInt(result.source.droppableId);
          const destParentId = parseInt(result.destination.droppableId);
    
          const sourceSubItems = itemSubItemMap[sourceParentId];
          const destSubItems = itemSubItemMap[destParentId];
    
          let newItems = [...testItems];
    
          /** In this case subItems are reOrdered inside same Parent */
          if (sourceParentId === destParentId) {
            const reorderedSubItems = reorder(
              sourceSubItems,
              sourceIndex,
              destIndex
            );
            newItems = newItems.map(item => {
              if (item.id === sourceParentId) {
                item.subItems = reorderedSubItems;
              }
              return item;
            });
            setTestItems(newItems);
            
          } else {
            console.log(`sourceParentId:${sourceParentId} destParentId:${destParentId} destIndex:${destIndex}`)
            let newSourceSubItems = [...sourceSubItems];
            const [draggedItem] = newSourceSubItems.splice(sourceIndex, 1);
            console.log(`draggedItem:${JSON.stringify(draggedItem)}`)
            let newDestSubItems = [...destSubItems];
            console.log(`destSubItems:${JSON.stringify(destSubItems)}`)
            newDestSubItems.splice(destIndex, 0, draggedItem);
            console.log(`newDestSubItems:${JSON.stringify(newDestSubItems)}`)
    
            let newItems2 = newItems.map(item => {
              if (item.id == sourceParentId) {
                item.subItems = newSourceSubItems;
              } else if (item.id == destParentId) {
                item.subItems = newDestSubItems;
              }
              return item;
            });
            console.log(`newItems2:${JSON.stringify(newItems2)}`)
            setTestItems(newItems2);
          }
        }
    }    
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" type="droppableItem">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle2(snapshot.isDraggingOver)}
            >
              {testItems.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div>
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        {item.content}
                        <span
                          {...provided.dragHandleProps}
                          style={{
                            display: "inline-block",
                            margin: "0 10px",
                            border: "1px solid #000"
                          }}
                        >
                          Drag
                        </span>
                        <Droppable droppableId={item.id} type={`droppableSubItem`}>
                            {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                            >
                                {item.subItems.map((subitem, index) => (
                                <Draggable key={subitem.id} draggableId={subitem.id} index={index}>
                                    {(provided, snapshot) => (
                                    <div style={{ display: "flex" }}>
                                        <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        style={getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                        )}
                                        >
                                        {subitem.content}
                                        <span
                                            {...provided.dragHandleProps}
                                            style={{
                                            display: "block",
                                            margin: "0 10px",
                                            border: "1px solid #000"
                                            }}
                                        >
                                            Drag
                                        </span>
                                        </div>
                                        {provided.placeholder}
                                    </div>
                                    )}
                                </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                            )}
                        </Droppable>
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
}

export default TestView
