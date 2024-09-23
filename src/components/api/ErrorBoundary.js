import React, { Component, useContext, useState } from 'react';
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import { error_types } from '../ExternalData';
import LoadingSkeleton from '../skeleton';
import { MailContext } from './SendMail';
import { DateTime } from '../date-time';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error caught in ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorModel error={this.state.error} />
        }

        return this.props.children;
    }
}

const ErrorModel = ({ error }) => {
    const { postReportData } = useContext(MailContext);
    const [open, setOpen] = useState(false);
    const [errorType, setErrorType] = useState([]);
    const [errorMsg, setErrorMsg] = useState(null);
    const [onSubmit, setOnSubmit] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        setOnSubmit(!onSubmit);
        if(!(errorType && errorMsg))return;
        setLoading(true);
        postReport();
    }

    const postReport = async () => {
        const data = {
            Date : DateTime(),
            Error_Type : JSON.stringify(errorType),
            Error_Message : errorMsg
        }
        const res = await postReportData(data);
        setLoading(false);
        if (res === true){
            setSubmitStatus('success');
        }else{
            setSubmitStatus('failed');
        }
    }

    const handleClose = () => {
        setErrorType([])
        setErrorMsg(null);
        setOnSubmit(false);
        setSubmitStatus(null);
        setOpen(false);
    }

    return (
        <>
        <Box className='w-screen h-screen flex flex-col items-center justify-between'>
            <img src='/images/V-Cube-Logo.png' alt='V-Cube Logo' width='100px' />
            <img src='/images/error.gif' alt='Error Animation' width='300px' className='mt-[10%]' />
            <Typography variant='h4' color='error' className='text-center w-[90%]' sx={{marginBottom : '1%'}}>
                Something went wrong
            </Typography>
            <Typography variant='h6' color='grey'  className='text-center w-[90%]'>
                {error ? error.message : 'An unknown error occurred.'}
            </Typography>
            <Box className='h-[30%] w-full flex flex-col items-center justify-center'>
                <Typography sx={{fontSize : '100%', margin : '1%'}} color='error' className='text-center w-[90%]'>
                    Please retry after some time. If the problem persists, please let us know.
                </Typography>
                <Button variant='contained' onClick={()=>setOpen(true)} >Report Error</Button>
            </Box>
        </Box>
        {loading && <LoadingSkeleton/>}
        <Dialog open={open} onClose={handleClose} sx={{zIndex : '700'}}>
            <img src='/images/V-Cube-Logo.png' alt='' width='16%' className='ml-[42%]' />
            <DialogTitle variant='h5'>Report error</DialogTitle>
            <DialogContent className='h-[18rem] flex flex-col items-center justify-evenly'>
            {!submitStatus ? <>
                <Stack spacing={3} className='w-full mt-3 h-20'>
                <Autocomplete
                    multiple
                    freeSolo
                    options={error_types}
                    getOptionLabel={(option) => option}
                    value={errorType}
                    onChange={(e,values)=>setErrorType(values)}
                    renderInput={(params) => (
                    <TextField required
                        error={onSubmit && (!errorType || (errorType && errorType.length === 0))}
                        helperText={onSubmit && (!errorType || (errorType && errorType.length === 0)) ? "Select Error Type" : ""}
                        {...params}
                        label="Select Error Type"
                        placeholder="Error Type"
                    />
                    )}
                />
                </Stack>
                <TextField multiline rows={3} value={errorMsg} onChange={(e)=>setErrorMsg(e.target.value)}
                    className='h-32 w-full' label='Let us know the issue you faced.'
                    placeholder='Also provide the message shown on the page to get more information.'
                    error={onSubmit && !errorMsg} helperText={onSubmit && !errorMsg && 'Please share the error message for us to investigate the issue.'} />
            </> : 
            <Box className='w-full h-full flex flex-col items-center justify-evenly'>
                <img src={submitStatus && submitStatus === 'success' ? '/images/success.gif' : '/images/failed.gif'} alt='' className='w-1/3' />
                <Typography color={submitStatus && submitStatus === 'success' ? 'green' : 'error'} variant='h6'
                    >Report submission {submitStatus && submitStatus === 'success' ? 'successful' : 'failed'}.
                </Typography>
                {submitStatus && submitStatus === 'failed' ? 
                <Typography className='text-center'>Network error or Something went wrong. Please try again later.</Typography> :
                <Typography className='text-center'>Your report has been received.<br/>We will work to resolve the issue as quickly as possible.</Typography>}
            </Box>}
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={handleClose}>Close</Button>
                {!submitStatus && <Button variant='contained' onClick={handleSubmit}>Submit Report</Button>}
            </DialogActions>
        </Dialog>
        </>
    );
}

export default ErrorBoundary;

