import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts';
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { StudentAttendanceCalendar } from './AddAtendanceCalender';
import { CalendarMonthRounded, ChecklistRounded } from '@mui/icons-material';

const AttendanceINsights = ({ batchAttendanceData, stdAttendanceData, selectedYear, setSelectedYear, JoiningDate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [month, setMonth] = useState(null);
  const [batchDays, setBatchDays] = useState([]);
  const [studentDays, setStudentDays] = useState([]);
  const [stdMonthDates, setStdMonthDates] = useState([]);
  const [batchMonthDates, setBatchMonthDates] = useState([]);
  const [attType, setAttType] = useState(null);
  const [submit, setSubmit] = useState(false);
  const [selectedValue, setSelectedValue] = useState(0);

  const xLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const years = []
  for(let year = 2021; year <= new Date().getFullYear(); year++){years.push(year)}

  const generateMonthYearRangeUntilToday = (startDateStr) => {
    const startDate = new Date(startDateStr);
    const endDate = new Date();

    endDate.setDate(1);
    endDate.setMonth(endDate.getMonth() + 1);

    const monthYearList = [];

    let currentDate = new Date(startDate);
    while (currentDate < endDate) {
        const month = currentDate.toLocaleString('en-US', { month: 'short' });
        const year = currentDate.getFullYear();
        monthYearList.push(`${month}-${year}`);
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return monthYearList;
  };


  const getDatesData = () => {
    const stdData = Array.isArray(stdAttendanceData) && stdAttendanceData.filter(data=>data.Date.split('-')[2] === `${selectedYear}` && attType === 'Assignment' ? data.Attendance_Type.split('~')[0] === attType : data.Attendance_Type === attType);
    const batchData = Array.isArray(batchAttendanceData) && batchAttendanceData.filter(data=>data.Date.split('-')[2] === `${selectedYear}` && data.Attendance_Type === attType);

    setStudentDays([]);
    xLabels.forEach((month)=>{
      let cnt = 0;
      Array.isArray(stdData) && stdData.forEach((std)=>{
        if(std.Date.split('-')[1] === month.substring(0,3) && (attType === 'Assignment' ? std.Attendance_Type.split('~')[0] : std.Attendance_Type) === attType)cnt++;
      })
      setStudentDays((pre)=>[...pre,cnt]);
    })

    setBatchDays([]);
    xLabels.forEach((month, index)=>{
      let cnt = 0;
      Array.isArray(batchData) && batchData.forEach((batch)=>{
        if(batch.Date.split('-')[1] === month.substring(0,3) && batch.Attendance_Type === attType)cnt++;
      })
      attType === 'Assignment' && generateMonthYearRangeUntilToday(JoiningDate).includes(`${month.substring(0,3)}-${selectedYear}`) ? setBatchDays((pre)=>[...pre,monthDays[index]]) : setBatchDays((pre)=>[...pre,cnt]);
    })

    setBatchMonthDates([]);
    xLabels.forEach((month)=>{
      let months = [];
      batchData.forEach((batch)=>{
        if(batch.Date.split('-')[1] === month.substring(0,3) && batch.Attendance_Type === attType)months.push(batch.Date.split('-')[0]);
      })
      setBatchMonthDates((pre)=>[...pre, months])
    })

    setStdMonthDates([]);
    xLabels.forEach((month)=>{
      let months = [];
      Array.isArray(stdData) && stdData.forEach((std)=>{
        if(std.Date.split('-')[1] === month.substring(0,3) && (attType === 'Assignment' ? std.Attendance_Type.split('~')[0] : std.Attendance_Type) === attType)months.push(std.Date.split('-')[0]);
      })
      setStdMonthDates((pre)=>[...pre, months])
    })
  }

  useEffect(()=>{
    getDatesData();
  },[selectedYear])

  const handleClick = (event,idx,value) => {
    setMonth(`${xLabels[idx]}~${monthDays[idx]}~${idx}`);
    setAnchorEl(event.currentTarget);
    setSelectedValue(value);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

    return (
      <Box className="w-full mt-10 flex flex-col items-center justify-around">
        <LineChart
          xAxis={[{ scaleType: 'point', data: xLabels }]}
          series={[
            {
              data: (Array.isArray(studentDays) && studentDays.length > 0) ? studentDays : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              area: true,
              label : `Detailed ${selectedYear || ''} ${attType || ''} Attendance Analysis.`,
            },
          ]}
          width={950}
          height={300}
        />
      {selectedYear && <Box className='w-[900px] -mt-5 flex flex-row items-center justify-between mb-10'>
        {Array.isArray(batchDays) && batchDays.map((value,index)=>(<IconButton key={index} onClick={(e)=>handleClick(e,index,value)} sx={{width : '40px',height : '40px',display : 'flex', alignItems : 'center', justifyContent : 'center'}}>{value}</IconButton>))}
      </Box>}
      <Box className='w-[80%] flex flex-row items-center justify-evenly mt-5'>
      <Box className='w-[30%] flex flex-row items-center justify-between'>
          <ChecklistRounded sx={{fontSize : '30px', marginTop : '15px', color : 'grey'}}/>
          <FormControl className='w-[87%]' variant='standard'>
            <InputLabel>Select Attendance Type*</InputLabel>
            <Select
              value={attType}
              onChange={(e)=>{setAttType(e.target.value);setSubmit(false)}}>
              {['Class','Assignment','Mock Test','Interview'].map(value=><MenuItem value={value}>{value}</MenuItem>)}
            </Select>
          </FormControl>
      </Box>
      <Box className='w-[30%] flex flex-row items-center justify-between'>
          <CalendarMonthRounded sx={{fontSize : '30px', marginTop : '15px', color : 'grey'}}/>
          <FormControl className='w-[87%]' variant='standard'>
            <InputLabel>Select Year*</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e)=>{setSelectedYear(e.target.value);setSubmit(false)}}>
              {years.map(year=><MenuItem value={year}>{year}</MenuItem>)}
            </Select>
          </FormControl>
      </Box>
      <Button variant='contained' sx={{width : '20%', height : '40px', borderRadius : '20px'}} onClick={()=>{setSubmit(true);getDatesData()}}>Submit</Button>
      </Box>
      <StudentAttendanceCalendar open={open} id={id} anchorEl={anchorEl} setAnchorEl={setAnchorEl} month={month} year={selectedYear && selectedYear} stdMonthDates={stdMonthDates} batchMonthDates={batchMonthDates} attType={attType} selectedValue={selectedValue} />
    </Box>
    )
}

export default AttendanceINsights;