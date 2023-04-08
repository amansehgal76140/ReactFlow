import React,{useEffect, useState} from 'react'
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useParams } from "react-router-dom";
import WorkflowHelper from '../components/WorkflowHelper';

function WorkFlow() {

    const params = useParams();
    const [selectedModule,setSelectedModule] = useState({});

    useEffect(() => {
        const {id} = params;
        const url = "https://64307b10d4518cfb0e50e555.mockapi.io/workflow/"+id;
        axios.get(url)
        .then((res)=>{
            setSelectedModule(res.data);
            console.log(res.data);
        })
        .catch((err)=>{
            console.log(err);
        })
    }, [])
    
    if(!selectedModule.id)
    return <div>Loading....</div>

  return (
    <div>
        <Navbar module={selectedModule} />
        <WorkflowHelper selectedModule={selectedModule} />
    </div>
  )
}

export default WorkFlow