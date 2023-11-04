import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



const CustomizedSnackbars = (props) => {
    return (
        <Snackbar
            open={props.message.showSnackBar}
            autoHideDuration={7000}
            onClose={props.onHandleClose}
        >
            <Alert onClose={props.onHandleClose} severity={props.message.severity}>
                {props.message.message}
            </Alert>
        </Snackbar>
    );
};

export default CustomizedSnackbars;