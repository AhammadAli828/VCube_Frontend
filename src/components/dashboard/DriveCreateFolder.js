import React, { useContext, useEffect, useState } from 'react';
import { Box, Stepper, Step, StepLabel, StepContent, Button, Paper, Typography, TextField, CircularProgress, InputAdornment } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { CheckCircleRounded, CloudUploadOutlined, TouchAppRounded } from '@mui/icons-material';
import { UserDetails } from '../UserDetails';
import { DateTime } from '../date-time';
import { UsersAuthContext } from '../api/UsersAuth';

export const getFileExtension = (filename) => {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex !== -1 ? filename.substring(lastDotIndex + 1).toLowerCase() : null;
};

export const getFileNameWithoutExtension = (filename) => {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename;
};

const VerticalLinearStepper = ({ handleShowSnackbar, setIsLoading, driveUser, setCreateFolder, createFile, setFileCreate, fetchData }) => {
  const { postUserDriveData } = useContext(UsersAuthContext);
  const user = UserDetails('All');
  const dateTime = DateTime();
  const [activeStep, setActiveStep] = useState(0);
  const [isFileError, setIsFileError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filesData, setFilesData] = useState(null);
  const [folderName, setFolderName] = useState(createFile ? 'N/A' : null);
  const steps = createFile ? ['Add Files','Create Files'] : ['Set Folder Name', 'Add Files','Create Folder'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };


  const getFileRead = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        resolve(reader.result);
      };
  
      reader.onerror = () => {
        reject(new Error("Error reading file"));
      };
  
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (acceptedFiles) => {
      setIsFileError(false);    
      setLoading(true);
      setTimeout(()=>{
          setLoading(false);
          const sizeCheck = acceptedFiles.every((file)=>(file.size / (1024 * 1024)).toFixed(2) <= 5);
          const size = (acceptedFiles.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024)) <= 10;
          if(!sizeCheck)handleShowSnackbar('error','You can upload each file with a maximum size of 5 MB. Files larger than 5 MB will not be accepted.');
          if(!size)handleShowSnackbar('error','You can upload files up to 10 MB. Files larger than 10 MB will not be accepted.');
          if(!sizeCheck || !size){
            setIsFileError(true);
            return;
          };
          handleData(acceptedFiles);
      },3000)
  };
  
  const handleData = async (acceptedFiles) => {
    const data = [];
    let cnt = 0
    for (const file of acceptedFiles) {
      const fileContent = await getFileRead(file);
      data.push({
        Username: user.Username,
        Email: user.Email,
        Course: user.Course,
        Folder: folderName,
        FileName: file.name,
        DrivePassword : cnt == 0 ? driveUser.Drive : 'None',
        File: fileContent,
        Size: (file.size / (1024 * 1024)).toFixed(2),
        Date: dateTime,
      });
      cnt++;
    };
    setFilesData(data);
    setTimeout(()=>{handleNext()},1000);
  };

  const submitData = async () => {
    setIsLoading(true);
    const res = await postUserDriveData(user.Course, user.Username, filesData);
    fetchData();
    setIsLoading(false);
    if (res === true){
      createFile ? handleShowSnackbar('success','Files Added Successfully.'):
                  handleShowSnackbar('success',`Folder: ${folderName} Created Successfully.`);
    }else if(res && res.message){
      handleShowSnackbar('error',`Failed to save folder. ${res.message}. Please try again later`);
    }
    setTimeout(()=>{
      setCreateFolder(false);
      setFileCreate(false);
    },2000);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    multiple: true,
  });

  return (
    <Box className='w-full h-full'>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step}>
            <StepLabel
              optional={
                index === steps.length - 1 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step}
            </StepLabel>
            <StepContent>
              {(createFile ? index === -1 : index === 0) ? <Box className='w-full h-20 flex items-center justify-start'>
                <TextField label='Enter Foldername' value={folderName} onChange={(e)=>setFolderName(e.target.value)} />
              </Box> 
              : (createFile ? index === 0 : index === 1) ? 
                <Box
                    className="w-full h-52 border-2 border-dashed border-slate-300 rounded-lg"
                    {...getRootProps()}
                    sx={{
                    border: isFileError ? '2px dashed red' : '2px dashed #ccc',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isDragActive
                        ? '#f0f0f0'
                        : isFileError
                        ? 'rgb(254, 242, 242)'
                        : 'rgb(247 248 249)',
                    }}
                >
                    <input {...getInputProps()} />
                    <CloudUploadOutlined sx={{ fontSize: '80px', color: 'lightgrey' }} />
                    <Typography variant="body1">
                    {isDragActive
                        ? 'Drop the file here ...'
                        : 'Drag and drop, or click to select a file.'}
                    </Typography>
                    <Box sx={{ m: 1, position: 'relative' }}>
                    <Button
                        variant="contained"
                        component="span"
                        disabled={loading}
                        startIcon={filesData && !isFileError ? <CheckCircleRounded /> : <TouchAppRounded />}
                        color={isFileError ? 'error' : filesData && !isFileError ? 'success' : 'primary'}
                    >
                        {filesData && !isFileError ? "File's Selected" : 'Select File'}
                    </Button>
                    {loading && (
                        <CircularProgress
                        size={24}
                        sx={{
                            color: 'primary',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
                        }}
                        />
                    )}
                    </Box>
               </Box> 
               : 
              <Box className='w-full min-h-20 max-h-96 overflow-y-auto' sx={{scrollbarWidth : 'thin'}}>
                {Array.isArray(filesData) && filesData.map((fileData, idx)=>(
                <TextField value={getFileNameWithoutExtension(fileData.FileName)}
                    onChange={(e) => {
                      const updatedFilesData = [...filesData];
                      updatedFilesData[idx].FileName = `${e.target.value}.${getFileExtension(fileData.FileName)}`;
                      setFilesData(updatedFilesData);
                    }}  className='w-full h-16'
                    InputProps={{endAdornment: <InputAdornment position="end">
                      <Typography color='primary' variant='h6'>.{getFileExtension(fileData.FileName)}</Typography>
                    </InputAdornment>}} 
                />))}
              </Box>}
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={()=>{handleNext();index === steps.length - 1 && submitData()}}
                  sx={{ mt: 1, mr: 1 }}
                  disabled={(index === 0 && !folderName) || ((createFile ? index === 0 : index === 1) && !filesData)}
                >
                  {index === steps.length - 1 ? 'Finish' : 'Continue'}
                </Button>
                <Button
                  disabled={index === 0}
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Back
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default VerticalLinearStepper;