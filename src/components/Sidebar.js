import React from 'react'
import  Paper  from '@mui/material/Paper';
import  Box  from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import "./Sidebar.css";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import DisplayModule from './DisplayModule';

function Sidebar({modules,handlePageChange,page}) {

    const onDragStart = (event, nodeType) => {
        console.log(nodeType);
        event.dataTransfer.setData('application/reactflow', nodeType.id);
        event.dataTransfer.effectAllowed = 'move';
      };

      if(!modules)
      return <div>Loading ...</div>

return (
    <Paper>
        <Box paddingY={2} paddingX={3} minHeight={640}>
         <Typography variant='h6'>Modules</Typography>   
        {modules.map((module,index)=>{
            return (
                <DisplayModule key={index} module={module} onDragStart={onDragStart} />
            )
        })}   
        <Stack className="pagination" >
          <Pagination count={20} page={page} onChange={handlePageChange} />
        </Stack> 
        </Box>
    </Paper>
  )
}

export default Sidebar