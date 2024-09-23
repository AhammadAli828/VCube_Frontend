import React, { useContext, useEffect, useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, FormHelperText, Card, Button } from '@mui/material';
import { AttributionRounded } from '@mui/icons-material';

const Search = ({ user, courseData, batchData, selectedBatch, setSelectedBatch, selectedCourse, setSelectedCourse, userCourse, setShortLoading ,setTakeStdAtt }) => { 

    useEffect(()=>{
      setSelectedBatch(sessionStorage.getItem('SelectedBatch'));
      setSelectedCourse(sessionStorage.getItem('SelectedCourse'));
    },[])

    const handleCourseChange = (e) => {
      setSelectedCourse(e.target.value);
      sessionStorage.setItem('SelectedCourse',e.target.value);
      sessionStorage.setItem('SelectedBatch','');
      setSelectedBatch(null);
      setShortLoading(true);
    }

  return (
    <Box className="h-14 mt-4 mb-4 w-[95%] ml-[2.5%] flex items-center justify-evenly bg-transparent">
     {userCourse === 'All' && user === 'Super Admin' && 
          <FormControl sx={{width : '30%'}} variant='standard'>
          <InputLabel variant='standard' shrink={selectedCourse ? true : false} sx={{fontSize : '20px', color : ''}}>Select Course</InputLabel>
          <Select
            value={selectedCourse}
            onChange={(e)=>handleCourseChange(e)}
            sx={{width: '100%',
              '& .MuiInputBase-input': {
              fontSize: '20px',
              padding: '5px 0',
              },
              '& .MuiInputLabel-root': {
              fontSize: '20px',
              },}}
              >
            {courseData && courseData.map((data,index)=>(
              <MenuItem value={data.Course} key={index}>{data.Course}</MenuItem>
            ))
            }
          </Select>
      </FormControl>}

      <FormControl variant="standard" sx={{width : '30%'}}>
        <InputLabel shrink={selectedBatch ? true : false} sx={{fontSize : '20px', color : ''}}>Select Batch</InputLabel>
        <Select
          value={selectedBatch}
          onChange={(e)=>{setSelectedBatch(e.target.value);setShortLoading(true);sessionStorage.setItem('SelectedBatch',e.target.value)}}
          sx={{width: '100%',
            '& .MuiInputBase-input': {
            fontSize: '20px',
            padding: '5px 0',
            },
            '& .MuiInputLabel-root': {
            fontSize: '20px',
            },}}
            >
          {selectedCourse && batchData && batchData.map((data)=>{
              if(data.Course === selectedCourse){
                return(
                  <MenuItem value={data.BatchName}>{data.BatchName}</MenuItem>
                )
              }
            })
          }
          {selectedCourse && <MenuItem value="All">All Batches</MenuItem>}
        </Select>
      </FormControl>
      <Button variant="contained" startIcon={<AttributionRounded />} onClick={()=>setTakeStdAtt(true)}>Take Student Attendance</Button>
    </Box>
  )
};

export default Search;