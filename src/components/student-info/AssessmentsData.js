import React, { startTransition, useContext, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Button, Card, Dialog, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import { ArrowForwardRounded, CloseRounded, DescriptionRounded } from '@mui/icons-material';
import { AssessmentContext } from '../api/Assessment';
import { StudentsContext } from '../api/students';

export const getMonthsDifference = (startDate) => {
    const endDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    let yearsDifference = end.getFullYear() - start.getFullYear();
    let monthsDifference = end.getMonth() - start.getMonth();
    let totalMonths = yearsDifference * 12 + monthsDifference;
    if (end.getDate() < start.getDate()) {
        totalMonths--;
    }
    return totalMonths + 1;
}

const AssessmentsData = ({ isOpen, setIsOpen, course, batchName, handleShowSnackbar, setIsLoading, setSolveAssesments, setSolveAssessmentData, stdId, JoiningDate, isUser }) => {
    const { fetchAssessmentQuestions } = useContext(AssessmentContext);
    const { getStudentAttendanceById } = useContext(StudentsContext);
    const [assessmentData, setAssessmentData]= useState(null);
    const [attData, setAttData] = useState(null);
    const [attCount, setAttCount] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        const res = await fetchAssessmentQuestions(course);
        setIsLoading(false);
        if (res && res.message){
            handleShowSnackbar('error',res.message);
        }else if(res){
            const data = res && res.filter(data=>data.BatchName === batchName && JSON.parse(data.Question).Month === selectedMonth);
            setAssessmentData(data);
            fetchAttData(data);
        }
    }

    const fetchAttData = async (result) => {
        setIsLoading(true);
        const res = await getStudentAttendanceById(stdId);
        setIsLoading(false);
        if (res && res.message){
            res.response.status !== 404 && handleShowSnackbar('error',res.message);
        }else if(res){
            const getData = Array.isArray(res) && res.filter(data=>data.Attendance_Type.split('~')[0] === 'Assignment');
            const filteredData = Array.isArray(getData) && getData.filter((att) => {
                return Array.isArray(result) && result.some((data) => {
                    return att.Attendance_Type.split('~')[1] === `${data.id}`;
                });
            });
            setAttData(filteredData);
            setAttCount(Array.isArray(filteredData) ? filteredData.length : 0);
        }
    }

    useEffect(()=>{
        startTransition(()=>{
            fetchData();
        })
    },[isOpen, selectedMonth])

    const checkSolved = (id) => {
        return  Array.isArray(attData) && attData.some(data=>data.Attendance_Type.split('~')[1] === `${id}`);
    }

    const getPercentage = () => {
        const cnt = Array.isArray(assessmentData) && assessmentData.length > 0 ? (attCount / assessmentData.length) * 100 : 0;
        return cnt > 0 ? cnt : 5;
    }

    const getColor = () => {
        const cnt = getPercentage();
        return cnt < 20 ? '#fee2e2' : cnt > 20 && cnt < 35 ? '#fef2f2' : 
        cnt > 35 && cnt < 50 ? '#fff7ed' : cnt > 50 && cnt < 70 ? '#ffedd5' : 
        cnt > 70 && cnt < 85 ? '#f0fdf4' : '#dcfce7';
    }

    const months = []
    for(let i = 1; i <= getMonthsDifference(JoiningDate); i++){
        months.push(i);
    }

  return (
    <Dialog open={isOpen} sx={{zIndex : '700'}} fullScreen>
        <Typography variant='h5' className='absolute top-5 left-3'>
            Your Assessments <DescriptionRounded sx={{marginLeft : '10px'}} />
        </Typography>
        <img src='/images/V-Cube-Logo.png' alt='' width='8%' className='ml-[46%]' />
        <IconButton sx={{position : 'absolute'}} className='top-3 right-3' onClick={()=>setIsOpen(false)}><CloseRounded sx={{fontSize : '35px'}} /></IconButton>
        <DialogTitle variant='h5' className='flex items-center'>
            <Box className='w-1/3 relative overflow-hidden rounded-md border-[1px] border-slate-300'>
            <FormControl className='w-full outline-none' sx={{zIndex : '100'}}>
                <InputLabel sx={{visibility : selectedMonth ? 'hidden' : 'visible'}}>Select Month</InputLabel>
                <Select
                    value={selectedMonth}
                    onChange={(e)=>setSelectedMonth(e.target.value)}>
                    {months.map((no)=><MenuItem value={`Month ${no}`}>{`Month ${no}`}</MenuItem>)}
                </Select>
            </FormControl>
            <Box className={`absolute left-0 top-0 h-full w-[${getPercentage()}%] flex items-center justify-end`}  sx={{zIndex : '90', background : getColor()}}></Box>
            <Typography color={getPercentage() < 35 ? 'error' : getPercentage() < 70 ? 'orange' : 'green'} className='absolute right-16 top-3 text-center' sx={{fontSize : '12px', zIndex : '100'}}>{attCount}/{Array.isArray(assessmentData) ? assessmentData.length : 0}<br/>Completed</Typography>
            </Box>
        </DialogTitle>
        <DialogContent className='grid grid-cols-2 place-content-start gap-5'>
            {Array.isArray(assessmentData) && assessmentData.length > 0 && assessmentData.map((data,index)=>
            <Tooltip title={isUser !== 'Student' && data.id} arrow>
            <Card className='w-full h-20 border-[1px] border-gray-200 p-5 flex items-center justify-between' key={index}>
                <Typography variant='h5' className='flex items-center justify-start'>{JSON.parse(data.Question).Title} 
                    {JSON.parse(data.Question).SQL === 'Yes' && <img src='/images/Logo-MySql.png' alt='' width='7%' className='ml-5' />}
                </Typography>
                <Box className='w-64 flex items-center justify-between'>
                    <Typography className='bg-green-100 text-green-600 w-[4.50rem] text-center rounded-md'>Easy</Typography>
                    <Button endIcon={!checkSolved(data.id) && <ArrowForwardRounded/>} variant='contained' onClick={()=>{setSolveAssessmentData(data);setSolveAssesments(true);setIsOpen(false)}}
                    sx={{background : checkSolved(data.id) ? '#dcfce7' : '', color : checkSolved(data.id) ? '#16a34a' : 'white', ':hover' : {background : checkSolved(data.id) && '#dcfce7'}}}>{checkSolved(data.id) ? 'SOLVED' : 'SOLVE'}</Button>
                </Box>
            </Card>
            </Tooltip>)}
        </DialogContent>
    </Dialog>
  )
}

export default AssessmentsData;