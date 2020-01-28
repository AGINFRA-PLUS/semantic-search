import React from "react";
import axios from "axios";
import { Popover, Button, Typography, CircularProgress, Box } from '@material-ui/core';
import SemanticsResourcesTable from './SemanticsResourcesTable';
import AccountTreeRoundedIcon from '@material-ui/icons/AccountTreeRounded';

function SemanticTreeToggle(props) {
    
    
    const handleClick = event => {
      fetchHierarchy(); 
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    async function fetchHierarchy() {
        axios({
            method: 'post',
            url: 'https://api.agroknow.com/semantic-api/terms/annotate',
            data: props.query    // 10 seconds timeout
          })
          .then(response => { formatResults(response.data);})
          .catch(error => console.error(error))
    }

    function formatResults(data) {
        var rows = [];
        for ( var i in data ) {
            var label = data[i].label;
            var confidence = data[i].confidence;
            var resource = data[i].ontology;
            var parent = data[i].parents; 
            var children = data[i].children;
            rows.push({ label, confidence, resource, parent, children });
          }
          setResults(rows);
    }
    

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [results, setResults] = React.useState([]);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
   
    return (
    <>
        <Button aria-describedby={id} disabled={props.disabled} className="semanticTree" onClick={handleClick}>
            <AccountTreeRoundedIcon/>&nbsp;Classifications
        </Button>
            <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <Box className="semanticBox"><Typography>{results.length != 0 ? <SemanticsResourcesTable rows={results}/>: <CircularProgress /> }</Typography>
            
            

            </Box>
        </Popover>
        </>
    );
}

export default SemanticTreeToggle;