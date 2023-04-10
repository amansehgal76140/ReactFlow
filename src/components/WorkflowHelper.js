import React,{useState, useEffect,useCallback,useRef} from 'react'
import Box  from '@mui/material/Box'
import Sidebar from './Sidebar'
import axios from 'axios';
import ReactFlow,  {Controls,ReactFlowProvider, addEdge,useNodesState, 
                    useEdgesState, 
                    getIncomers,getOutgoers,
                    getConnectedEdges} from 'reactflow';
import 'reactflow/dist/style.css';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';

const AddedNode=(module)=>{
    return (
        <Box>
        <Grid container>
            <Grid item xs={1}>
                <Box borderRight={module.style.border}>
                    <Typography variant='body2'>
                        {module.output_type ? module.input_type : "NA"}
                    </Typography>
                </Box>
            </Grid>

            <Grid item xs={10}>
                <Box borderRight={module.style.border}>
                    <Typography variant='body2'>
                        {module.name}
                    </Typography>
                </Box>
            </Grid>
            
            <Grid item xs={1}>
                <Box >
                    <Typography variant='body2'>
                        {module.output_type ? module.output_type : module.input_type}
                    </Typography>
                </Box>
            </Grid>
        </Grid>
        </Box>
    )
  }

  const NodeStyle={
    height:"21px", 
    width:"250px", 
    zIndex: 0, padding:"0px", 
    margin: "0px", 
    border:"1px solid blue"
  } 

function WorkflowHelper({selectedModule}) {

  const [page,setPage] = useState(1);
  const [modules,setSelectedModule] = useState([]);
  const [id,setId] = useState(-1);

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const handleFetch=(updatedPage)=>{
    const url = `https://64307b10d4518cfb0e50e555.mockapi.io/modules?page=${updatedPage}&limit=5` ;
    axios.get(url)
        .then((res)=>{
            setSelectedModule(res.data);
        })
        .catch((err)=>{
            console.log(err);
        })
  }
  
  const onConnect = useCallback(
    (connection) => {
        setId(connection.target);
        setEdges((eds) => addEdge(connection, eds))
    },
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const id = event.dataTransfer.getData('application/reactflow');
    
      if (typeof id === 'undefined' || !id) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      
      const isPresent = nodes.findIndex((node)=> node.id === id);
      console.log(isPresent);
      if(isPresent !== -1)
      return ;
      const module = modules.filter((module)=>module.id === id);
      console.log(module);
      const newNode = {
        id,
        type: 'default',
        position,
        data: { label: AddedNode({...module[0],style:{border:"1px solid red"}}), module: module[0] },
        style: {...NodeStyle,border:"1px solid red"},
        deleteable : true
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance,modules,nodes] //eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(()=>{
    handleFetch(page);
  },[page])

  useEffect(()=>{
    if(id === -1 && selectedModule)
    {
        
        setNodes([{
            id: selectedModule.id,
            type: 'input',
            data: {label: AddedNode({...selectedModule,style:{border:"1px solid blue"}}), module: selectedModule},
            style: NodeStyle,
            position: {x: 200, y: 90}
    }]);
    return ;
    }
    console.log(id);
    console.log(nodes);
    const tempNode = nodes.filter((node)=>node.id === id);
    console.log(tempNode[0].data.module)
    const temp = nodes.map((node)=>{
        if(node.id !== id)
        return node;
        else
        return {id: tempNode[0].id, type: tempNode[0].type, 
            data: {label: AddedNode({...tempNode[0].data.module, style:{border:"1px solid blue"} }), module:tempNode[0].data.module},
            position: tempNode[0].position, 
            deletable: tempNode[0].deletable,
            style: NodeStyle
        }
    })
    setNodes(temp);
  },[id]) //eslint-disable-line react-hooks/exhaustive-deps
  
  const handlePageChange = (event,value)=>{
    setPage(value);
  }

   const isFind=(tempEdges,node)=>{
    if(node.id === selectedModule.id)
    return 1;
    return tempEdges.findIndex((currEdge)=>currEdge.target === node.id);
   }

  const onNodesDelete = useCallback(
    (deleted) => {

        const tempEdges = deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter((edge) => !connectedEdges.includes(edge));

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({ id: `${source}->${target}`, source, target }))
          );

          return [...remainingEdges, ...createdEdges];
        }, edges)
        setEdges(tempEdges);
        const tempNodes = nodes.map((node)=>{
            if(isFind(tempEdges,node) !== -1)
            return node;

            else{
              console.log(node);
            return {id: node.id, type: node.type, 
                data: {label: AddedNode({...node.data.module,style:{border:"1px solid red"}}), module: node.data.module},
                position: node.position, 
                deletable: node.deletable,
                style: {...NodeStyle,border:"1px solid red"}
              }
            }
        })
        console.log(tempNodes);
      console.log(tempEdges);
      setNodes(tempNodes);
    },
    [nodes, edges]  //eslint-disable-line react-hooks/exhaustive-deps
  );

  if(modules.length === 0)
  return <div>Loading ....</div>

  return (
    <Box display={"flex"} width={"100%"} height={650}>
         <ReactFlowProvider>
         <Box width={"26%"}>
            <Sidebar modules={modules} page={page} handlePageChange={handlePageChange}/>
        </Box>
            <Box width={"74%"} height={"100%"} ref={reactFlowWrapper}>   
         <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onNodesDelete={onNodesDelete}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView >
            <Controls />
            </ReactFlow>
        </Box>
        </ReactFlowProvider>
        </Box>
  )
}

export default WorkflowHelper