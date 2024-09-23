import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Box, Avatar, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { StudentsContext } from '../api/students';
import { CancelRounded, CheckCircleRounded, Visibility } from '@mui/icons-material';
import StudentAttendanceForm from './StudentAttendanceForm';
import { DateTime } from '../date-time';


const StudentDetails = ({ studentsData, setStudentsData, selectedCourse, selectedBatch, setIsLoading, handleShowSnackbar, importData, setImportData, takeStdAtt, setTakeStdAtt, openStdAttDialog, setOpenStdAttDialog }) => {
  const { fetchStudentsData, getStudentAttendanceByCourse } = useContext(StudentsContext);
  const [selectedId, setSelectedId] = useState([]);
  const [studentAttData, setStudentAttData] = useState([]);
  const [stdData, setStdData] = useState([]);
  const navigate = useNavigate();
  const dateTime = DateTime().split(' ');


  const fetchStdData = async () => {
    setIsLoading(true);
    try {
      const [stdData, attData] = await Promise.all([
        fetchStudentsData(selectedCourse),
        getStudentAttendanceByCourse(selectedCourse)
      ]);
      if (stdData && stdData.message) {
        handleShowSnackbar('error', stdData.message);
        setStudentsData([]);
      } else {
        setStudentsData(stdData);
        setStudentAttData(attData);
      }
    } catch (error) {
      handleShowSnackbar('error', 'Failed to fetch Student data');
      setStudentsData([]);
      setStudentAttData([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (selectedCourse && selectedBatch) {
      fetchStdData();
    }
  }, [setIsLoading, selectedCourse, selectedBatch]);

  const stdAttendance = () => {
      if(!selectedId || (Array.isArray(selectedId) && selectedId.length === 0)){
        handleShowSnackbar('warning','Select atleast one Student to take an Attendance.');
        setTakeStdAtt(false);
      }else{
        setIsLoading(true);
        const data = []
        selectedId.forEach((id)=>{
          data.push(studentsData[id-1])
        })
        setStdData(data);
        setOpenStdAttDialog(true);
      }
  };

  useEffect(()=>{
    if(takeStdAtt)stdAttendance();
    setTakeStdAtt(false);
  },[takeStdAtt])

  const chkStdAtt = (data) => {
    return Array.isArray(studentAttData) && studentAttData.some(stdAtt=>(
      stdAtt.StudentId === data.id && stdAtt.BatchName === data.BatchName &&
      `${data.Name}~${data.Phone}` === stdAtt.Name && stdAtt.Date === dateTime[0] && stdAtt.Attendance_Type === 'Class'
    ));
  }

  const chkRowStdAtt = (data) => {
    const classAtt = Array.isArray(studentAttData) && studentAttData.some(stdAtt=>(
      `${data.name}~${data.phone}` === stdAtt.Name && stdAtt.BatchName === data.batch &&
      stdAtt.Date === dateTime[0] && stdAtt.Attendance_Type === 'Class'
    ));
    const study = Array.isArray(studentAttData) && studentAttData.some(stdAtt=>(
      `${data.name}~${data.phone}` === stdAtt.Name && stdAtt.BatchName === data.batch &&
      stdAtt.Date === dateTime[0] && stdAtt.Attendance_Type === 'Mock Test'
    ));
    const interview = Array.isArray(studentAttData) && studentAttData.some(stdAtt=>(
      `${data.name}~${data.phone}` === stdAtt.Name && stdAtt.BatchName === data.batch &&
      stdAtt.Date === dateTime[0]  && stdAtt.Attendance_Type === 'Interview'
    ));

    return !(classAtt && study && interview);
  }

  
  const handleRowClick = useCallback((id) => {
    const uniqueURL = sessionStorage.getItem('UniqueURL');
    setIsLoading(true);
    sessionStorage.setItem('StudentDetails_ID', JSON.stringify(studentsData[id - 1].id));
    setTimeout(() => { navigate(`/vcube/student-info/${uniqueURL.substring(60,90)}`); }, 1000);
  }, [studentsData, navigate, setIsLoading]);


  const columns = useMemo(() => [
    { field: 'id', headerName: 'ID', width: 50, headerClassName: 'text-lg' },
    {
      field: 'image',
      headerName: '',
      width: 50,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Avatar alt={params.row.name} src={params.row.image} sx={{ marginTop: '5px', padding: '0' }} />
      ),
    },
    { field: 'name', headerName: 'Name', width: 200, headerClassName: 'text-lg' },
    { field: 'batch', headerName: 'Batch', width: 180, headerClassName: 'text-lg' },
    { field: 'phone', headerName: 'Phone', width: 150, headerClassName: 'text-lg' },
    { field: 'email', headerName: 'Email', width: 270, headerClassName: 'text-lg' },
    { field: 'highest_Degree', headerName: 'Highest Degree', width: 170, headerClassName: 'text-lg' },
    { field: 'passout_Year', headerName: 'Passout Year', width: 130, headerClassName: 'text-lg' },
    {
      field: 'attendance',
      headerName: 'Attendance',
      width: 60,
      headerClassName: 'text-lg',
      renderCell: (params) => (
        params.row.attendance ? <CheckCircleRounded color='success' /> : <CancelRounded color='error' />
      ),
    },
    {
      field: 'view',
      headerName: 'View',
      width: 60,
      headerClassName: 'text-lg',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <IconButton onClick={() => handleRowClick(params.row.id)}><Visibility /></IconButton>
      ),
    }
  ], [handleRowClick]);


const rows = useMemo(() => {
  return studentsData.reduce((acc, data, index) => {
    if (data.BatchName === selectedBatch || selectedBatch === 'All') {
      acc.push({
        id: index + 1,
        image: JSON.parse(data.Personal_Info).Image || "",
        batch: data.BatchName,
        name: data.Name,
        phone: data.Phone,
        email: data.Email,
        highest_Degree: (typeof data.Educational_Info === 'object')
          ? ""
          : (JSON.parse(data.Educational_Info).PG_Specialization)
            ? JSON.parse(data.Educational_Info).PG_Specialization
            : JSON.parse(data.Educational_Info).Degree_Specialization,
        passout_Year: (typeof data.Educational_Info === 'object')
          ? ""
          : (JSON.parse(data.Educational_Info).PG_Specialization)
            ? JSON.parse(data.Educational_Info).PG_Passed_Year
            : JSON.parse(data.Educational_Info).Degree_Passed_Year,
        attendance: chkStdAtt(data),
      });
    }
    return acc;
  }, []);
}, [studentsData, selectedBatch, chkStdAtt]);
  
  const downloadExcel = async (data) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const filename = `VCUbe_${selectedCourse}_${selectedBatch}_Students_Data.xlsx`;
    XLSX.writeFile(wb, filename);
    handleShowSnackbar('success','Data Imported Successfully');
  };

  useEffect(()=>{
    if(importData){
      if(!selectedCourse){
        handleShowSnackbar('error','Please choose a preferred course before exporting the student data.');
        return;
      }else{
        const myData = [];
        if (studentsData) {
          studentsData.forEach((data) => {
            if(data.Course === selectedCourse && (data.BatchName === selectedBatch || selectedBatch === 'All')){
              const Data = {
              personalInfo: JSON.parse(data.Personal_Info),
              };
              if(typeof data.Educational_Info !== 'object')Data['educationalInfo'] = JSON.parse(data.Educational_Info);
              if(typeof data.Placement_Info !== 'object')Data['placementInfo'] = JSON.parse(data.Placement_Info);
              myData.push(Data);
            }
          });
        }

        const combinedData = myData.map((data) => {
          const { Image, Resume, ...personalInfo } = data.personalInfo || "";
          const { Skills, Cities, ...placementInfo } = data.placementInfo || "";
        
          return {
            ...personalInfo,
            ...data.educationalInfo,
            Skills: Array.isArray(Skills) ? Skills.join(', ') : '',
            Cities: Array.isArray(Cities) ? Cities.join(', ') : '',
            ...placementInfo,
          };
        });

        downloadExcel(combinedData);
    }
    };
    setImportData(false);
  },[importData])

  return (
    <Box className="w-[96%] max-h-[61%] h-[61%] ml-[2%] bg-white">
      <DataGrid
        rows={rows}
        columns={columns}
        sx={{
          cursor : 'pointer',
          '& .MuiDataGrid-columnHeader': {
          },
        }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 100 },
          },
        }}
        isRowSelectable={(params) => {return chkRowStdAtt(params.row)}}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={(newSelection)=>setSelectedId(newSelection)}
      />
      <StudentAttendanceForm isOpen={openStdAttDialog} setIsOpen={setOpenStdAttDialog} stdData={stdData} handleShowSnackbar={handleShowSnackbar} setIsLoading={setIsLoading} fetchStdData={fetchStdData} studentAttData={studentAttData} studentsData={studentsData} selectedCourse={selectedCourse} selectedBatch={selectedBatch} />
    </Box>
  )
};

export default StudentDetails;