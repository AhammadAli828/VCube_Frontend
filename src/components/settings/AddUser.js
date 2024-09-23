import React, { useContext, useEffect, useState } from 'react';
import { Box, TextField, InputAdornment, IconButton, Select, FormControl, InputLabel, FormHelperText, MenuItem, Button } from '@mui/material';
import { AccountCircleRounded, LocalPhoneRounded, MailRounded, LockOutlined, LockRounded, Visibility, VisibilityOff, ClassRounded, PersonAddAlt1Rounded, GroupRounded, Password, Email } from '@mui/icons-material';
import InputField from '../InputField';
import NumberInput from '../noSpinnerField';
import { UserDetails } from '../UserDetails';
import { LoginContext } from '../api/login';
import { useAuth } from '../api/AuthContext';
import { UsersAuthContext } from '../api/UsersAuth';
import { UserGoogleContext } from '../api/Google';

const AddNewUser = ({ handleShowSnackbar, setIsLoading, setTabValue }) => {
    const { newUserCreate, checkUser, checkPassword, checkUserDetails } = useContext(LoginContext);
    const { logout } = useAuth();
    const { removeUserLoginData } = useContext(UsersAuthContext);
    const { userGoogleLogout } = useContext(UserGoogleContext);
    const userDetails = UserDetails('All');
    const isUser = UserDetails('User');
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [accPassword, setAccPassword] = useState(null);
    const [password, setPassword] = useState(null);
    const [conPassword, setConPassword] = useState(null);
    const [course, setCourse] = useState(null);
    const [user, setUser] = useState(null);
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [onSubmit, setOnSubmit] = useState(false);


    useEffect(()=>{
        if (userDetails.User !== "Super Admin"){
            setUser('User');
            setCourse(userDetails.Course);
        }
    },[])

    const handleSubmit = () => {
        setOnSubmit(true);
        if(!username || !email || !phone || checkPhoneError(phone) || !accPassword || !password ||
             !conPassword || conPassword !== password || !course || !user
        )return;
        checkUserAuth();
    };

    const checkUserAuth = async()=>{
        setIsLoading(true);
        const data = {
            Username : userDetails.Username,
            Password : accPassword
        }
        const res = await checkPassword(data);
        setIsLoading(false);
        if(res && res.message){
            const status = res.response.status;
            if (status === 401) handleShowSnackbar('error', 'Invalid Password.');
            else if (status === 423) handleShowSnackbar('error', 'Access Denied.');
            else if (status === 404) handleShowSnackbar('error', 'User Not Found');
            else handleShowSnackbar('error', res.message);
            if (status === 423 || status === 404){
                userGoogleLogout();
                removeUserLoginData();
                logout();
            }
        }else if(res === 'Valid'){
            setIsLoading(true);
            (isUser === 'Super Admin') ? check_User() : checkData();
        }
    }

    const check_User = async () => {
        const data = {
            User : user,
            Course : course
        }
        const res = await checkUser(data);
        setIsLoading(false);
        if(res.status && res.status === 202){
            setIsLoading(true);
            checkData();
        }else if(res.response.status === 226){
            handleShowSnackbar('error',`The ${user} has already been assigned to this ${course}.`);
        }else if(res.response.status === 406){
            handleShowSnackbar('error',`First, add the Admin to the ${course}, and then proceed to add the User.`);
        }else{
            handleShowSnackbar('error',res.message);
        }
        
    }

    const checkData = async ()=>{
        const data = {
            Username : username,
            Email : email,
            Phone : phone
        }
        const res = await checkUserDetails(data);
        setIsLoading(false);
        if (res && res.status){
            if (res.status === 226 && res.data.message === 'Username exists'){
                handleShowSnackbar('error','Username is already taken. Please choose another one.');
            }else if(res.status === 226 && res.data.message === 'Email exists'){
                handleShowSnackbar('error','Email is already taken. Please choose another one.');
            }else if(res.status === 226 && res.data.message === 'Phone exists'){
                handleShowSnackbar('error','Phone is already taken. Please choose another one.');
            }else if(res.status === 202){
                setIsLoading(true);
                postData();
            }
        }else{
            handleShowSnackbar('error',res.message);
        }
    }

    const postData = async () => {
        const data = {
            Username : username,
            Email : email,
            Phone : phone,
            Password : password,
            Course : course,
            User : user,
            AddedBy : userDetails.User
        }
        const res = await newUserCreate(data);
        setIsLoading(false);
        if(res && res.message){
            handleShowSnackbar('error',res.message);
        }else{
            handleShowSnackbar('success',`User : ${username} has been created successfully.`);
            setTabValue(0);
        }
        
    }

    const checkPhoneError = (getvalue)=>{
        const value = getvalue && getvalue.toString();
        if (onSubmit && !value)return true;
        if (value && !(value.startsWith('9') || value.startsWith('8') || value.startsWith('7') || value.startsWith('6')))return true;
        if(value && value.length !== 10)return true;
        return false;
    }

  return (
    <Box className='w-[80%] grid grid-cols-2 mt-10 gap-x-10 gap-y-2'>
        <Box className='h-20 flex flex-row items-start justify-between'>
            <AccountCircleRounded className='text-slate-400' sx={{fontSize : '30px', marginTop : '20px'}} />
            <InputField className='w-[88%]' label='Username' error={onSubmit && !username} helperText={onSubmit && !username && 'Enter Username'}
                value={username} onChange={(e)=>setUsername(e.target.value)} />
        </Box>
        <Box className='h-20 flex flex-row items-start justify-between'>
            <MailRounded className='text-slate-400' sx={{fontSize : '30px', marginTop : '20px'}} />
            <InputField className='w-[88%]' label='Email' error={(onSubmit && !email) || (email && !email.includes('@'))} helperText={onSubmit && !email ? 'Enter Email' : (email && !email.includes('@')) ? 'Enter Valid Email' : ''}
                value={email} onChange={(e)=>setEmail(e.target.value)} />
        </Box>
        <Box className='flex h-20 items-start justify-between'>
            <LocalPhoneRounded className='text-slate-400' sx={{fontSize : '30px', marginTop : '20px'}} />
            <NumberInput label='Phone' sx={{width : "88%"}} value={phone} onChange={(e)=>setPhone(e.target.value)}
            error={(onSubmit && !phone) || (phone && checkPhoneError(phone))} 
            helperText={onSubmit && !phone ? "Enter Phone Number" : (phone && checkPhoneError(phone)) ? "Enter Valid Phone Number" : ""}/>
        </Box>
        <Box className='h-20 flex flex-row items-start justify-between'>
            <LockRounded  className='text-slate-400' sx={{fontSize : '30px', marginTop : '20px'}} />
            <TextField sx={{
                    width: '88%',
                    '& .MuiInputBase-input': {
                    fontSize: '20px',
                    padding: '5px 0',
                    },
                    '& .MuiInputLabel-root': {
                    fontSize: '20px',
                    },
                }}
                error={(onSubmit && !accPassword)}
                helperText={(onSubmit && !accPassword) ? "Invalid Password" : ""}
                type={showPassword1 ? 'text' : 'password'}
                label="Your Account Password"
                value={accPassword}
                onChange={(e) => {setAccPassword(e.target.value)}}
                variant="standard"
                fullWidth
                InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={()=>setShowPassword1(!showPassword1)}
                        >
                        {showPassword1 ? <VisibilityOff className='text-slate-400' /> : <Visibility className='text-slate-400' />}
                        </IconButton>
                    </InputAdornment>
                    ),
                }}
            />
        </Box>
        <Box className='h-20 flex flex-row items-start justify-between'>
            <LockOutlined className='text-slate-400' sx={{fontSize : '30px', marginTop : '20px'}} />
            <InputField className='w-[88%]' label='Password' type='password' error={(onSubmit && !password) || (onSubmit && password !== conPassword)} helperText={onSubmit && !password ? 'Enter Password' : (onSubmit && password !== conPassword) ? "Password Doesn't Match" : ''}
                value={password} onChange={(e)=>setPassword(e.target.value)} />
        </Box>
        <Box className='h-20 flex flex-row items-start justify-between'>
            <LockRounded  className='text-slate-400' sx={{fontSize : '30px', marginTop : '20px'}} />
            <TextField sx={{
                    width: '88%',
                    '& .MuiInputBase-input': {
                    fontSize: '20px',
                    padding: '5px 0',
                    },
                    '& .MuiInputLabel-root': {
                    fontSize: '20px',
                    },
                }}
                error={(onSubmit && !conPassword) || (password && conPassword && password !== conPassword)}
                helperText={(onSubmit && !conPassword) ? "Invalid Password" : (password && conPassword && password !== conPassword) ? "Password Doesn't Match" : ""}
                type={showPassword2 ? 'text' : 'password'}
                label="Confirm Password"
                value={conPassword}
                onChange={(e) => {setConPassword(e.target.value)}}
                variant="standard"
                fullWidth
                InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={()=>setShowPassword2(!showPassword2)}
                        >
                        {showPassword2 ? <VisibilityOff className='text-slate-400' /> : <Visibility className='text-slate-400' />}
                        </IconButton>
                    </InputAdornment>
                    ),
                }}
            />
        </Box>

        {isUser === 'Super Admin' && <Box className='h-20 flex flex-row items-start justify-between'>
            <ClassRounded className='text-slate-400' sx={{fontSize : '30px', marginTop : '20px'}} />
            <FormControl variant="standard" sx={{width : '88%'}}>
            <InputLabel shrink={course ? true : false} sx={{fontSize : '20px', color : (onSubmit && !course) ? '#d32f2f' : ""}}>Select Course</InputLabel>
            <Select
                error={onSubmit && !course}
                value={course}
                onChange={(e)=>{setCourse(e.target.value);user && user.split(' ')[0] === 'Placements' && e.target.value !== 'Placements' && setUser(null)}}
                sx={{width: '100%',
                '& .MuiInputBase-input': {
                fontSize: '20px',
                padding: '5px 0',
                },
                '& .MuiInputLabel-root': {
                fontSize: '20px',
                },}}
                >
                <MenuItem value="Python">Python</MenuItem>
                <MenuItem value="Java">Java</MenuItem>
                <MenuItem value="Placements">Placements</MenuItem>
            </Select>
            <FormHelperText sx={{color : '#d32f2f'}}>{(onSubmit && !course) ? "Select Batch" : ""}</FormHelperText>
            </FormControl>
        </Box>}

        {isUser === 'Super Admin' && <Box className='h-20 flex flex-row items-start justify-between'>
            <GroupRounded className='text-slate-400' sx={{fontSize : '30px', marginTop : '20px'}} />
            <FormControl variant="standard" sx={{width : '88%'}}>
            <InputLabel shrink={user ? true : false} sx={{fontSize : '20px', color : (onSubmit && !user) ? '#d32f2f' : ""}}>Select User</InputLabel>
            <Select
                error={onSubmit && !user}
                value={user}
                onChange={(e)=>{setUser(e.target.value.split(' ')[0] === 'Placements' ? (course === 'Placements') ? e.target.value : handleShowSnackbar('error','Select a Placements Course to add a Placements User.') : e.target.value)}}
                sx={{width: '100%',
                '& .MuiInputBase-input': {
                fontSize: '20px',
                padding: '5px 0',
                },
                '& .MuiInputLabel-root': {
                fontSize: '20px',
                },}}
                >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Placements Admin">Placements Admin</MenuItem>
                <MenuItem value="Placements User">Placements User</MenuItem>
            </Select>
            <FormHelperText sx={{color : '#d32f2f'}}>{(onSubmit && !user) ? "Select User" : ""}</FormHelperText>
            </FormControl>
        </Box>}

        <Box className='flex items-center justify-center'>
            <Button variant='contained' sx={{width : '88%', height : '40px', borderRadius : '30px', margin : '10px 0 0 40px'}} startIcon={<PersonAddAlt1Rounded/>} onClick={handleSubmit}>Add User</Button>
        </Box>
    </Box>
  )
}

export default AddNewUser;