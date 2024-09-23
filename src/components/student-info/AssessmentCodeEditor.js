import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography } from '@mui/material';
import CodeEditor from './CodeEditor';
import CodingQuestionPage from './CodingQuestionPage';

export const handleFullScreen = () => {
    const editor = document.querySelector('.fullScreen');
    if(!editor)return;
    if (editor.requestFullscreen) {
      editor.requestFullscreen().catch((error) => {
          console.error("Failed to enter fullscreen:", error);
      });
    } else if (editor.webkitRequestFullscreen) {
        editor.webkitRequestFullscreen().catch((error) => {
            console.error("Failed to enter fullscreen:", error);
        });
    } else if (editor.mozRequestFullScreen) {
        editor.mozRequestFullScreen().catch((error) => {
            console.error("Failed to enter fullscreen:", error);
        });
    } else if (editor.msRequestFullscreen) {
        editor.msRequestFullscreen().catch((error) => {
            console.error("Failed to enter fullscreen:", error);
        });
    }
  }

export const handleExitFullScreen = () => {
    if (document.exitFullscreen) {
        document.exitFullscreen().catch((error) => {
            console.error("Failed to exit fullscreen:", error);
        });
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen().catch((error) => {
            console.error("Failed to exit fullscreen:", error);
        });
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen().catch((error) => {
            console.error("Failed to exit fullscreen:", error);
        });
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen().catch((error) => {
            console.error("Failed to exit fullscreen:", error);
        });
    }
  }

const AssessmentCodeEditor = ({ isOpen, setIsOpen, stdId, configs, handleShowSnackbar, fetchStdData, solveAssessmentData, name, course, batchName, isUser }) => {
  const results = useRef(null);
  const [tabValue, setTabValue] = useState(0);
  const [resultPopUp, setResultPopUp] = useState(false);
  const [hideQuestion, setHideQuestion] = useState(false);
  const [full_Screen, setFull_Screen] = useState(true);
  const [popUp, setPopUp] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [seconds, setSeconds] = useState(10);

    const startTimeout = () => {
      setSeconds(10);
      if (timeoutId) {
          clearTimeout(timeoutId);
      }
      const id = setTimeout(() => {
          setIsOpen(false);
          setPopUp(false);
      }, 11000);
      setTimeoutId(id);
    };

    useEffect(() => {
      const handleFullscreenChange = () => {
          if (document.fullscreenElement) {
              setFull_Screen(true);
              clearTimeout(timeoutId);
              setPopUp(false);
          } else {
              setFull_Screen(false);
              setPopUp(true);
              startTimeout();
          }
      };

      document.addEventListener('fullscreenchange', handleFullscreenChange);

      return () => {
          document.removeEventListener('fullscreenchange', handleFullscreenChange);
          if (timeoutId) {
              clearTimeout(timeoutId);
          }
      };
    }, [timeoutId]);

    useEffect(() => {
      const handleKeydown = (e) => {
          if (e.key === 'Meta'){
              handleExitFullScreen();
          }
      };

      document.addEventListener('keydown', handleKeydown);

      return () => {
          document.removeEventListener('keydown', handleKeydown);
      };
    }, []);

    useEffect(()=>{
      if (popUp)setTimeout(()=>{setSeconds((pre)=>pre-=1)},1000);
    },[seconds,popUp])


  return (
    <>
    <Dialog fullScreen sx={{zIndex : '700'}} open={isOpen}>
        <DialogContent className='fullScreen flex items-center justify-between bg-gray-200' sx={{padding : 0 }}>
            <CodingQuestionPage results={results.current} questionData={solveAssessmentData} tabValue={tabValue} setTabValue={setTabValue} 
                                handleExitFullScreen={handleExitFullScreen} resultPopUp={resultPopUp} setResultPopUp={setResultPopUp} isUser={isUser}
                                hideQuestion={hideQuestion} setHideQuestion={setHideQuestion} full_Screen={full_Screen} handleFullScreen={handleFullScreen} />
            <CodeEditor setResults={results}
                        test_Cases={solveAssessmentData && JSON.parse(solveAssessmentData.Test_Cases)} 
                        stdId={stdId} configs={configs} handleShowSnackbar={handleShowSnackbar}
                        fetchStdData={fetchStdData} setResultPopUp={setResultPopUp} hideQuestion={hideQuestion}
                        isSql={solveAssessmentData && JSON.parse(solveAssessmentData.Question).SQL === 'Yes'}
                        full_Screen={full_Screen} setTabValue={setTabValue} questionId={solveAssessmentData && solveAssessmentData.id}
                        name={name} course={course} batchName={batchName} isUser={isUser} />
        </DialogContent>
    </Dialog>
    <Dialog open={popUp}>
      <DialogTitle variant='h6'>Please use fullscreen mode to complete your assignment.</DialogTitle>
      <DialogContent>
        <Typography variant='h4' className='w-full text-center'>{seconds}s</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={()=>{setIsOpen(false);setPopUp(false);setSeconds(10)}}>Exit</Button>
        <Button variant='contained' onClick={()=>{handleFullScreen();setPopUp(false);setSeconds(10)}} >Back to Full Screen</Button>
      </DialogActions>
    </Dialog>
    </>
  )
}

export default AssessmentCodeEditor;