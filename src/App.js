import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import uuid from "uuid/v4";

const itemsFromAPI = [
  { id: uuid(), content: "Make Drag and drop for monday" },
  { id: uuid(), content: "Dashboard" },
  { id: uuid(), content: "New feature" },
  { id: uuid(), content: "Bug fix" },
  { id: uuid(), content: "Email marketing" },
  { id: uuid(), content: "Another feature" },
  { id: uuid(), content: "Fix feature 15" },
];

const columnsFromAPI = {
  [uuid()]: {
    name: "To do",
    items: itemsFromAPI
  },
  [uuid()]: {
    name: "Desenvolvimento",
    items: []
  },
  [uuid()]: {
    name: "Em progresso",
    items: []
  },
  [uuid()]: {
    name: "Concluido",
    items: []
  }
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return; //check se onde foi solto é diferente do atual

  const { source, destination } = result;

  // console.log(source, destination);

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];

    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);

    const newColumns = {
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    }
    setColumns(newColumns);

    // console.log(newColumns);

  } else {
    const column = columns[source.droppableId];
    const sourceItems = [...column.items];

    const [removed] = sourceItems.splice(source.index, 1);
    sourceItems.splice(destination.index, 0, removed);

    const newColumns = {
      ...columns,
      [source.droppableId]: {
        ...column,
        items: sourceItems
      }
    }
    setColumns(newColumns);

    // console.log(newColumns);
  }
};

function App() {
  const [columns, setColumns] = useState(columnsFromAPI);
  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <DragDropContext
        onDragEnd={result => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column]) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
              key={columnId}
            >
              <h2>{column.name}</h2>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "#8d7ce6"
                            : "lightgrey",
                          padding: 4,
                          width: 250,
                          minHeight: 400
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}

                                    style={{
                                      padding: 16,
                                      margin: "0 0 8px 0",
                                      minHeight: "30px",
                                      backgroundColor: snapshot.isDragging
                                        ? "#2f1e82"
                                        : "#3b24a8",
                                      color: "white",
                                      ...provided.draggableProps.style
                                    }}
                                  >
                                    {item.content}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
