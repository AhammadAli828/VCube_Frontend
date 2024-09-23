import React, { useState } from 'react';
import { LineChart } from '@mui/x-charts';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { StudentAttendanceCalendar } from '../student-info/AddAtendanceCalender';

const PerformanceInsights = () => {
  const [selectedYear, setSelectedYear] = useState(new Date());

  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const xLabels = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

  return (
    <Box className="w-full mt-10 flex flex-col items-center justify-around">
      <LineChart
        xAxis={[{ scaleType: 'point', data: xLabels }]}
        series={[
          {
            data: [10, 0, 1, 2, 10, 15, 11, 5, 6, 9, 19, 20],
            area: true,
            label : `Detailed ${selectedYear && selectedYear.getFullYear()} Performance Analysis.`,
          },
        ]}
        width={950}
        height={300}
      />
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        views={['year']}
        label="Select Year"
        value={selectedYear}
        onChange={(date)=>setSelectedYear(date)}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  </Box>
  )
}

export default PerformanceInsights;