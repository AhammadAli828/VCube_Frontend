import React, { useContext, useEffect, useState } from 'react';
import { Autocomplete, Box, Button, Dialog, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { CloseRounded } from '@mui/icons-material';
import { AssessmentContext } from '../api/Assessment';

const UploadCodingQuestions = ({ isOpen, setIsOpen, selectedCourse, selectedBatch, handleShowSnackbar, setIsLoading,     editAssignment, editAssignmentData, setEditAssignment, setEditAssignmentData }) => {
    const { postAssessmentQuestions, patchAssessmentQuestions } = useContext(AssessmentContext);
    const [level, setLevel] = useState(null);
    const [title, setTitle] = useState(null);
    const [question, setQuestion] = useState(null);
    const [isSql, setIsSql] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [testCases, setTestCases] = useState(
        Array.from({ length: 10 }, () => ({ inputs: [], expected: [] }))
    );
    const [examples, setExamples] = useState(
        Array.from({ length: 2 }, () => ({ input: [], output: [], explanation: [] }))
    );

    useEffect(()=>{
        if(editAssignment && editAssignmentData){
            setQuestion(JSON.parse(editAssignmentData[0].Question).Question)
            setTitle(JSON.parse(editAssignmentData[0].Question).Title)
            setIsSql(JSON.parse(editAssignmentData[0].Question).SQL)
            setLevel(editAssignmentData[0].Level)
            setSelectedMonth(JSON.parse(editAssignmentData[0].Question).Month)
            setTestCases(JSON.parse(editAssignmentData[0].Test_Cases))
            setExamples(JSON.parse(editAssignmentData[0].Examples))
        }
    },[isOpen, editAssignment, editAssignmentData])

    const handleInputChange = (index, event, newValue) => {
        const newPairs = [...testCases];
        newPairs[index].inputs = newValue;
        setTestCases(newPairs);
    };

    const handleOutputChange = (index, event, newValue) => {
        const newPairs = [...testCases];
        newPairs[index].expected = newValue;
        setTestCases(newPairs);
    };

    const handleInput = (idx, event, newValue) => {
        const newPairs = [...examples];
        newPairs[idx].input = newValue;
        setExamples(newPairs);
    }

    const handleOutput = (idx, event, newValue) => {
        const newPairs = [...examples];
        newPairs[idx].output = newValue;
        setExamples(newPairs);
    }

    const handleExplanation = (idx, event, newValue) => {
        const newPairs = [...examples];
        newPairs[idx].explanation = newValue;
        setExamples(newPairs);
    }


    const handleSubmit = () =>{
        const hasEmptyArrays = testCases.some(({ inputs, expected }) =>
            inputs.length === 0 || expected.length === 0
        );
        const has_Empty_Arrays = examples.some(({ input, output, explanation }) =>
            input.length === 0 || output.length === 0 || explanation.length === 0
        );
        if (!level || !title || !question || hasEmptyArrays || has_Empty_Arrays || !isSql || !selectedMonth){
            handleShowSnackbar('error','All fields are required. Please fill them out.');
            return;
        }
        setIsLoading(true);
        submitAssessment();
    }

    const submitAssessment = async() => {
        const data = {
            Course : selectedCourse,
            BatchName : selectedBatch,
            Question : JSON.stringify({Title : title, Question : question, SQL : isSql, Month : selectedMonth}),
            Test_Cases : JSON.stringify(testCases),
            Examples : JSON.stringify(examples),
            Level : level
        }
        if(editAssignment && editAssignmentData)data['id'] = editAssignmentData[0].id;
        const res = editAssignment && editAssignmentData ? await patchAssessmentQuestions(data) : await postAssessmentQuestions(data);
        if (res && res.message){
            handleShowSnackbar('error',res.message);
        }else if(res){
            handleShowSnackbar('success',`Assessment Question has been ${editAssignment && editAssignmentData ? 'updated' : 'uploaded'} successfully.`);
            handleClose();
        }
        setIsLoading(false);
    };

    const handleClose = () => {
        setTestCases(Array.from({ length: 10 }, () => ({ inputs: [], expected: [] })));
        setExamples(Array.from({ length: 2 }, () => ({ input: [], output: [], explanation: [] })));
        setTitle(null);
        setLevel(null);
        setQuestion(null);
        setQuestion(null);
        setIsOpen(false);
        setIsSql(null);
        setEditAssignment(false);
        setEditAssignmentData(null);
    }

  return (
    <Dialog fullScreen open={isOpen}>
        <Box className='flex items-center justify-between'>
            <Typography variant='h5'>Upload Coding Assignment</Typography>
            <img src='/images/V-Cube-Logo.png' alt='' width='7%' className='absolute left-[46.50%]'/>
            <IconButton className='top-2 right-2' onClick={handleClose}><CloseRounded sx={{fontSize : '35px'}} /></IconButton>
        </Box>
        <DialogTitle className='flex items-center justify-between'>
            <FormControl className='w-52' variant='standard'>
                <InputLabel shrink={selectedMonth} >Select Month</InputLabel>
                <Select
                    value={selectedMonth}
                    onChange={(e)=>setSelectedMonth(e.target.value)}
                    >
                    {[1,2,3,4,5,6,7,8].map((month)=><MenuItem value={`Month ${month}`}>Month {month}</MenuItem>)}
                </Select>
            </FormControl>
            <Box className='flex items-center justify-between w-52'>
                <Typography>SQL? : </Typography>
                <Button onClick={()=>setIsSql('Yes')} variant={isSql === 'Yes' ? 'contained' : 'outlined'}>Yes</Button>
                <Button onClick={()=>setIsSql('No')} variant={isSql === 'No' ? 'contained' : 'outlined'}>No</Button>
            </Box>
            <Box className='flex items-center justify-between w-[30%]'>
                <Typography>Select Level : </Typography>
                <Button color='success' variant={level === 'Easy' ? 'contained' : 'outlined'} onClick={()=>setLevel('Easy')}>Easy</Button>
                <Button color='warning' variant={level === 'Medium' ? 'contained' : 'outlined'} onClick={()=>setLevel('Medium')}>Medium</Button>
                <Button color='error' variant={level === 'Hard' ? 'contained' : 'outlined'} onClick={()=>setLevel('Hard')}>Hard</Button>
            </Box>
        </DialogTitle>
        <DialogContent className='max-h-[40rem] overflow-y-auto' sx={{scrollbarWidth : 'thin'}}>
            <Box className='pt-3 flex flex-col items-center justify-start h-80'>
                <TextField className='w-full h-[5.50rem]' value={title} inputProps={{ maxLength : 40 }} onChange={(e)=>setTitle(e.target.value)}
                  InputLabelProps={{ shrink: title ? true : false }} label='Question Title'/>
                <TextField multiline rows={7} onChange={(e)=>setQuestion(e.target.value)} value={question}
                 InputLabelProps={{ shrink: question ? true : false }} className='w-full' label='Your Question Here...'/>
            </Box>
            <Box className='w-full flex items-center justify-between'>
                {[0,1].map(idx=><Box className='w-[48%]'>
                    <Typography sx={{fontWeight : 'bold'}} variant='h6'>Example {idx + 1}</Typography>
                    <Typography sx={{fontWeight : 'bold', margin : '10px 0'}}>Input</Typography>
                    <Autocomplete
                        sx={{margin : '15px 0'}}
                        multiple
                        freeSolo
                        value={examples[idx].input}
                        options={[]}
                        onChange={(event, newValue) => handleInput(idx, event, newValue)}
                        renderInput={(params) => (
                            <TextField
                                multiple
                                {...params}
                                variant="outlined"
                                label="Input"
                            />
                        )}
                    />
                    <Typography sx={{fontWeight : 'bold', margin : '10px 0'}}>Output</Typography>
                    <Autocomplete
                        sx={{margin : '15px 0'}}
                        multiple
                        freeSolo
                        value={examples[idx].output}
                        options={[]}
                        onChange={(event, newValue) => handleOutput(idx, event, newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Output"
                            />
                        )}
                    />
                    <Typography sx={{fontWeight : 'bold', margin : '10px 0'}}>Explanation</Typography>
                    <Autocomplete
                        sx={{margin : '15px 0'}}
                        multiple
                        freeSolo
                        value={examples[idx].explanation}
                        options={[]}
                        onChange={(event, newValue) => handleExplanation(idx, event, newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Explanation"
                            />
                        )}
                    />
                </Box>)}
            </Box>
            <Typography variant='h5' sx={{ fontWeight: 'bold', margin: '50px 0 20px 0' }}>
                Test Cases
            </Typography>
            <Grid container spacing={3}>
                {testCases.map((pair, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                            TestCase {index + 1}
                        </Typography>
                        <Autocomplete
                            sx={{margin : '15px 0'}}
                            multiple
                            freeSolo
                            value={pair.inputs}
                            options={[]}
                            onChange={(event, newValue) => handleInputChange(index, event, newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label={`Input ${index + 1}`}
                                />
                            )}
                        />
                        <Autocomplete
                            multiple
                            freeSolo
                            value={pair.expected}
                            options={[]}
                            onChange={(event, newValue) => handleOutputChange(index, event, newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label={`Output ${index + 1}`}
                                />
                            )}
                        />
                    </Grid>
                ))}
            </Grid>
        <Button variant='contained' sx={{width : '50%', margin : '3% 0 0 25%', height : '40px'}}
            onClick={handleSubmit}>Submit</Button>
        </DialogContent>
        
    </Dialog>
  )
}

export default UploadCodingQuestions;