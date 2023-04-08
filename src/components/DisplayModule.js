import React from 'react'
import "./Sidebar.css";
import Grid  from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function DisplayModule({module, onDragStart}) {
  return (
    <Box className="module" onDragStart={(event) => onDragStart ? onDragStart(event, module) : ""} draggable>
        <Grid container spacing={2}>
            <Grid item xs={2}><Box padding={1} borderRight={"1px solid blue"}><Typography>{module.input_type}</Typography></Box></Grid>
            <Grid item xs={8}><Box padding={1} borderRight={"1px solid blue"}><Typography>{module.name}</Typography></Box></Grid>
            <Grid item xs={2}><Box padding={1}><Typography>{module.output_type}</Typography></Box></Grid>
        </Grid>
     </Box>
  )
}

export default DisplayModule