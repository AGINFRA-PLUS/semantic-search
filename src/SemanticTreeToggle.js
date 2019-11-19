import React from "react";
import { Popover, Button, Typography} from '@material-ui/core';
import AccountTreeRoundedIcon from '@material-ui/icons/AccountTreeRounded';

function SemanticTreeToggle(props) {

    const handleClick = event => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
   
    return (
    <>
        <Button aria-describedby={id} disabled={props.disabled} className="semanticTree" onClick={handleClick}>
            <AccountTreeRoundedIcon/>
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
            <Typography >The content of the Popover.</Typography>
        </Popover>
        </>
    );
}

export default SemanticTreeToggle;