import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Autocomplete, Avatar, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, TextField } from '@mui/material';
import { LoginContext } from '../api/login';
import { UsersAuthContext } from '../api/UsersAuth';

const ShareFiles = ({ isOpen, setIsOpen, handleShowSnackbar, setIsLoading, selectedFile, setSelectedFile }) => {
    const { fetchLoginData } = useContext(LoginContext);
    const { patchUserDriveData } = useContext(UsersAuthContext);
    const course = sessionStorage.getItem('SelectedCourse');
    const [users, setUsers] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const fetchData = useCallback(async()=>{
        setIsLoading(true);
        const users_Data = await fetchLoginData(course);
        setIsLoading(false);
        if(users_Data && users_Data.message){
            handleShowSnackbar('error','Error occured while fetching data. Please try again later.');
            setIsOpen(false);
            setSelectedFile(null);
        }else if(users_Data){
            setUsers(users_Data);
        }
    },[fetchLoginData, handleShowSnackbar, setIsLoading])

    useEffect(()=>{
        fetchData();
    },[])

    console.log(users)

  return (
    <Dialog open={isOpen} sx={{zIndex : '810'}}>
        <img src='/images/V-Cube-Logo.png' width='14%' className='ml-[43%]'/>
        <DialogTitle variant='h5'>Who do you want to share file ?</DialogTitle>
        <DialogContent className='min-h-[20rem] h-auto w-full flex flex-col items-center justify-between'>
            <Box className='w-full h-[80%] overflow-auto' sx={{scrollbarWidth : 'thin'}}>
                {Array.isArray(users) && users.length > 0 && users.map((user, index)=>(
                    <FormControlLabel control={<Checkbox size='medium' onClick={(e)=>setSelectedUsers(e.target.checked ? (pre)=>[...pre, user.Username] : selectedUsers.filter(item => item !== user.Username))} />} key={index} sx={{margin : '5px 0'}}
                        label={<Box className='w-[300px] flex items-center justify-start'><Avatar src={typeof user.Image !== 'object' ? user.Image : null} className='mr-3 w-full' /> {user.Username}</Box>}/>
                ))
                }
            </Box>
            <Autocomplete
                className='w-full'
                multiple
                readOnly
                value={selectedUsers}
                options={[]}
                renderInput={(params) => (
                    <TextField
                        multiple
                        {...params}
                        variant="outlined"
                        label="Select Users"
                    />
                )}
            />
        </DialogContent>
        <DialogActions>
            <Button variant='outlined' onClick={()=>{setIsOpen(false);setSelectedFile(null)}}>Cancel</Button>
            <Button variant='contained'>Submit</Button>
        </DialogActions>
    </Dialog>
  )
}

export default ShareFiles;