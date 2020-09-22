import React,{useState,useEffect} from 'react';
import Column from '../components/Column';

export default props => {
    const [columns,setColumns] = useState();

    useEffect(() => {
        setColumns([
            {
                name:"Name",
                locked:false,
                tasks:[
                    {name:"task1"},
                    {name:"task2"},
                    {name:"task3"}
                ]
            },
            {
                name:"Name2",
                locked:false,
                tasks:[
                    {name:"task1"},
                    {name:"task2"},
                    {name:"task3"}
                ]
            }
        ]);
    },[]);

    return (
        <div>
            <h1>Board</h1>
            <div style={{display:"flex",padding:20}}>
            {columns && columns.map((column,i) => <Column key={i} tasks={column.tasks} locked={column.locked} name={column.name}/>)}
            </div>
        </div>
    )
}