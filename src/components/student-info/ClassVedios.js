import React, { startTransition, useContext, useEffect, useRef, useState } from 'react';
import { Box, Card, CardMedia, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { CloseRounded, ArrowForwardIosRounded, PlayCircleRounded, PlayDisabledRounded, PlayArrowRounded } from '@mui/icons-material';
import { AssessmentContext } from '../api/Assessment';

const ClassVedios = ({ isOpen, setIsOpen, JoiningDate, course, batchName, handleShowSnackbar }) => {
    const { fetchRecordings } = useContext(AssessmentContext);
    const [monthsRange, setMonthRange] = useState([]);
    const [vedioData, setVedioData] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedVedio, setSelectedVedio] = useState(null);
    const [vedioUrl, setVedioUrl] = useState(null);
    const [watchTime, setWatchTime] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [vedioplaying, setVedioPlaying] = useState(false);

//   if (isOpen === true){
//     document.addEventListener('contextmenu', (event) => {
//       event.preventDefault();
//     });
//   }

    const fetchData = async () => {
        const res = await fetchRecordings(course,null);
        if (res && res.message){
            handleShowSnackbar('error',res.message);
        }else if(res){
            if (Array.isArray(res) && res.length > 0){
                const data = res.filter((data)=>`${data.Date.split('-')[1]} ${data.Date.split('-')[2]}` === selectedMonth && data.BatchName === batchName);
                setVedioData(data);
            }else{
                setVedioData(null);
            }
        }
    }

    useEffect(()=>{
        selectedVedio && setVedioUrl(selectedVedio.Vedio_URL.split(' ')[0])
    },[selectedVedio])

    useEffect(()=>{
        startTransition(()=>{
            fetchData();
            if (!vedioData || (Array.isArray(vedioData) && vedioData.length > 0)){
                setSelectedVedio(null);
                setVedioUrl(null);
            }
        })
    },[selectedMonth])

    const getMonthYearRange = (joiningDateStr) => {
        const [joiningMonth, joiningYear] = joiningDateStr.split('-');
        const startDate = new Date(`${joiningMonth} 1, ${joiningYear}`);
        const endDate = new Date();
        const result = [];
      
        const maxMonths = 8;
        let currentMonthCount = 0;
      
        for (let date = startDate; date <= endDate && currentMonthCount < maxMonths; date.setMonth(date.getMonth() + 1)) {
            result.push(date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }));
            currentMonthCount++;
        }
      
        setMonthRange(result);
        setSelectedMonth(result[result.length - 1]);
    };

      useEffect(()=>{
        getMonthYearRange(JoiningDate);
      },[])

      useEffect(()=>{
        if (vedioplaying){
            setTimeout(()=>{
                setWatchTime((pre)=> pre +=1 );
            },1000);
        } 
      },[watchTime, vedioplaying])

    //   console.log(Math.floor(watchTime / 60), watchTime % 60);


  return (
    <Dialog open={isOpen} sx={{zIndex : '700'}} fullScreen>
        <DialogTitle className='flex items-start justify-between h-20' sx={{padding : '0'}}>
            <img src="/images/V-Cube-Logo.png" alt='' width='8%' className='ml-[46%]'/>
            <IconButton onClick={()=>setIsOpen(false)} sx={{marginRight : '10px'}}><CloseRounded sx={{fontSize : '35px'}}/></IconButton>
        </DialogTitle>
        <DialogContent className='h-full flex items-center justify-start' sx={{padding : '30px 50px'}}>
        <Box className='w-[40%] h-full flex flex-col items-center justify-start rounded-md'>
            <FormControl className='w-full h-20'>
                <Select 
                    value={selectedMonth}
                    onChange={(e)=>{setSelectedMonth(e.target.value);setVedioPlaying(false)}}>
                    {monthsRange && monthsRange.map((month)=>(
                        <MenuItem value={month}>{month}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Box className='w-full h-full border-[1px] border-gray-300 rounded-md flex flex-col items-center justify-start overflow-y-auto' sx={{scrollbarWidth : 'thin'}}>
                {Array.isArray(vedioData) && vedioData.map((data,index)=>(<Card className={`w-full h-16 min-h-16 flex items-center justify-between pl-3 mt-1 mb-1
                    cursor-pointer ${selectedVedio === data ? 'border-2 border-blue-400' : ' border-[1px] border-gray-200 '}`} 
                    sx={{transition : '0.3s ease-in-out', background : selectedVedio === data && '#eff6ff'}}>
                    <Box className='w-[80%] h-full flex items-start flex-col justify-center' key={index} onClick={()=>{setSelectedVedio(data);setVedioPlaying(false)}}>
                        <Typography>{data.Date}</Typography>
                        <Typography variant='h6'>{data.Title}</Typography>
                    </Box>
                    <ArrowForwardIosRounded color='disabled' />
                </Card>))}
            </Box>
        </Box>
        <Box className='ml-20 h-[40rem] w-full flex items-start justify-start flex-col pl-5 pt-5'>
            <Typography variant='h4'>{course} - {batchName}</Typography>
            <Typography variant='h5' sx={{margin : '25px 0'}}>{selectedVedio ? `${selectedVedio.Title} : ${selectedVedio.Date}` : 'Select a Vedio'}</Typography>
            <Card className='h-[55%] w-[69%] flex items-center justify-center'>
                {selectedVedio ? <CardMedia
                    component="video"
                    onPlaying={()=>setVedioPlaying(true)}
                    onPause={()=>setVedioPlaying(false)}
                    onEnded={()=>setVedioPlaying(false)}
                    controls
                    controlsList='nodownload'
                    src={vedioUrl ? vedioUrl : selectedVedio.Vedio_URL.split(' ')[0]}
                    onContextMenu={(event)=>event.preventDefault()}
                    sx={{ width: '100%', height: '100%' }}
                >
                    Your browser does not support the video tag.
                </CardMedia> : 
                <CardMedia>
                    <Box className='flex flex-col w-full h-full items-center justify-center'>
                        <PlayArrowRounded sx={{fontSize : '100px'}} color='disabled' />
                        <Typography variant='h5'>No Vedio Selected</Typography>
                    </Box>
                </CardMedia>}
            </Card>
            <Box className='h-28 w-full mt-5 flex items-center justify-start'>
                {selectedVedio && selectedVedio.Vedio_URL.split(' ').map((url)=>
                    <Card className= 'w-1/5 h-[80%] flex items-center justify-center mr-10' sx={{bgcolor : 'black'}}>
                        <IconButton onClick={()=>{setVedioUrl(url);setVedioPlaying(url === vedioUrl)}}>
                            <PlayCircleRounded sx={{fontSize : '50px', color : url === vedioUrl ? '#1976d2' : 'grey'}} />
                        </IconButton>
                    </Card>)}
            </Box>
        </Box>
        </DialogContent>
    </Dialog>
  )
}

export default ClassVedios;