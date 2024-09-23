import { Box, IconButton, Typography, Popover } from '@mui/material';
import React, { useEffect, useState } from 'react';

export const StudentAttendanceCalendar = ({ open, id, anchorEl, setAnchorEl, month, year, stdMonthDates, batchMonthDates, attType, selectedValue }) => {
  const [monthDates, setMonthDates] = useState([]);
  const selectedDates = []
  for(let i = 1; i <= selectedValue; i++){
    selectedDates.push(i);
  }
  const dates = Array.isArray(stdMonthDates) && month && stdMonthDates[parseInt(month.split('~')[2])];
  const batchDates = attType === 'Assignment' ? selectedDates : Array.isArray(batchMonthDates) && month && batchMonthDates[parseInt(month.split('~')[2])];
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getFirstDayOfMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const dayOfWeek = date.getDay();
    const empty = []
    for(let i = 1; i <= dayOfWeek; i++ ){
      empty.push(" ");
    }
    return empty;
  }

  
  useEffect(() => {
    const dates = Array.from({ length: month && parseInt(month.split('~')[1]) }, (_, i) => i + 1);
    setMonthDates([...days,...getFirstDayOfMonth(parseInt(year),month  && parseInt(month.split('~')[2])),...dates]);
  }, [month]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box className='w-[20rem] h-auto'>
          <Typography sx={{position : 'absolute', fontWeight : 'bold', fontSize : '20px'}} className='top-5 right-5 text-slate-400'>{`${dates && dates.length > 0 && batchDates.length > 0 ? Math.floor((dates.length / batchDates.length) * 100) : 0}%`}</Typography>
        <Typography sx={{margin : '20px 0 30px 30px'}} variant='h5' >{`${month && month.split('~')[0]} ${year}`}</Typography>
      <Box className='w-[90%] h-[85%] mt-[5%] ml-[3%] mb-5 grid grid-cols-7 gap-3'>
        {monthDates.map((value,index)=><Box className={`w-10 h-10 rounded-full flex items-center justify-center ${dates && dates.includes(`${value}`) ? 'bg-[#4caf50]' : batchDates && batchDates.includes(attType === 'Assignment' ? value : `${value}`) ? 'bg-[#1976d2]' : ''}`}>
          <IconButton className='w-10 h-10' color={dates && dates.includes(`${value + 1}`) ? 'primary' :  batchDates && batchDates.includes(`${value}`) ? 'success' : ''}>
          <Typography className={(dates && dates.includes(`${value}`)) || (batchDates && batchDates.includes(attType === 'Assignment' ? value : `${value}`)) ? `text-white` : (parseInt(value) > 0) ? 'text-gray-500' : 'text-[#1976d2]'} >{value}</Typography></IconButton>
        </Box>)}
      </Box>
      </Box>
    </Popover>
  );
};