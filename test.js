import "regenerator-runtime/runtime";



import axios from "axios";






import React, { useState, useEffect, useRef, useCallback } from "react";
import moment from "moment";
import {
  Container,
  Button,
  Header,
  Segment,
  Form,
  Input,
  Label,
  Grid,
  TextArea,
  List,
  Checkbox,
  Pagination,
  Table,
  Icon,
  Embed,
  Confirm,
  Image,
  Card,
} from "semantic-ui-react";

import Avatar from "react-avatar";
import TestEndMsgModal from "./testEndMsgModal";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

import styles from "../styles/videoPlayer.module.css";
import { resumeParse } from "./api/resume";
import {
  getTestQuestions,
  submitAnswers,
  getScoreByTestId,
  saveQuestionAudio,
  getAudioTestReport,
  getVideoTestReport,
  getTestTime,
  testEndFlag,
  handleGetReport,
} from "./api/test";
import { useRouter } from "next/router";
import { Chart } from "react-google-charts";
import ReactPlayer from "react-player";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import useWebSocket from "react-use-websocket";
import screenfull from "screenfull";

import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

import Webcam from "react-webcam";




export default function Test() {


const QuizQuestion = ({ currentQuestion, handleUsersSelctionChange, handleUsersMriSelectionChange, handleUserDiscriptionChange, discriptionValue, optionValue, onChange, handleRecording, listening, handlePreviousClick, handleNextClick, handleResetReportData, currentPage }) => {

  const [buttonStyle, setButtonStyle] = useState("primary");

  const handleButtonClick = () => {
    setButtonStyle("secondary");
  }
  }


const [videoStream, setVideoStream] = useState(null);
const [recording, setRecording] = useState(true);
const videoRecorder = useRef(null);
const recordedChunks = useRef([]);

async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  setVideoStream(stream);
}

async function stopRecording() {
  if (!videoStream) {
    return;
  }

  videoStream.getTracks().forEach((track) => track.stop());

  const videoBlob = new Blob(recordedChunks.current, { type: "video/webm" });

  const formData = new FormData();
  formData.append("video", videoBlob);

  const response = await fetch("/upload", {
    method: "POST",
    body: formData,
  });

  console.log("Video uploaded:", response.status);
  setVideoStream(null);
}

useEffect(() => {
  startRecording();
}, []);

useEffect(() => {
  if (!videoStream) {
    return;
  }

  const options = { mimeType: "video/webm;codecs=h264" };
  videoRecorder.current = new MediaRecorder(videoStream, options);

  videoRecorder.current.ondataavailable = (e) => {
    if (e.data.size > 0) {
      recordedChunks.current.push(e.data);
    }
  };

  videoRecorder.current.start(1000);
}, [videoStream]);

useEffect(() => {
  if (!recording) {
    videoRecorder.current.stop();
  } else if (videoRecorder.current && videoRecorder.current.state === "inactive") {
    videoRecorder.current.start(1000);
  }
}, [recording]);

useEffect(() => {
  if (!recording) {
    return;
  }

  const intervalId = setInterval(() => {
    stopRecording();
    startRecording();
  }, 25000);

  return () => {
    clearInterval(intervalId);
  };
}, [recording]);


const [reportData, setReportData] = useState({
    type: null,
    text: null,
    Grammar: null,
    spelling: null,
    writing_style: null,
    Tone_sentiment: null,
    content_writing: null,
    clarity: null,
  });
const handleResetReportData = () => {
  setReportData({
    type: null,
    text: null,
    Grammar: null,
    spelling: null,
    writing_style: null,
    Tone_sentiment: null,
    content_writing: null,
    clarity: null,
  });
};

const GetReport = async (currentQuestion) => {
  try {
    const response = await handleGetReport(currentQuestion);
    setReportData(response);
    setIsReportModalOpen(true);
    return response;
  } catch (error) {
    console.log(error);
  }
};

  const router = useRouter();
  const [audioReport, setAudioReport] = useState(null);
  const [userId, setUserId] = useState("");
  const [testId, setTestId] = useState("");
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage, SetQuestionsPerPage] = useState(1);
  const [optionValue, setOptionValue] = useState(null);
  const [discriptionValue, setDiscriptionValue] = useState("");
  const [transcriptValue, setTranscriptValue] = useState("");
  const [question, setQuestion] = useState("");
  const [questionNo, setQuestionNo] = useState(null);
  const [questionType, setQuestionType] = useState("");
  const [answers, setAnswers] = useState([]);
  const [selectedPageanswers, setSelectedPageAnswers] = useState([]);
  const [testResult, setTestResult] = useState({});
  const [audioTestResult, setAudioTestResult] = useState({});
  const [graphData, setGraphData] = useState([]);
  const [graphOptions, setGraphOptions] = useState({});
  const [isTestStarted, setIsTestStarted] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isFullScreenConfirmModalOpen, setIsFullScreenConfirmModalOpen] =
    useState(false);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [testType, setTestType] = useState(false);
  const [count, setCount] = useState(0);
  const [postBody, setPostBody] = useState("");
  const [editor, setEditor] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [timeLeft, setTimeLeft] = useState(`00:00:00`);
  const [isTestEndMsgModal, setIsTestEndMsgModal] = useState(false);
  const [mirrorMode, setMirrorMode] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const [audioEmotionalReport, setAudioEmotionalReport] = useState({
    series: [],
    options: {
      chart: {
        type: "polarArea",
      },
    },
  });

  const [textEmotionalReport, setTextEmotionalReport] = useState({
    series: [],
    options: {
      chart: {
        type: "radialBar",
      },
    },
  });

  const [emotionCount, setEmotionCount] = useState({
    series: [10, 20, 10, 20, 10, 10, 20],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      colors: [
        "#DF2E38",
        "#A86464",
        "#3A1078",
        "#FDD36A",
        "#BDCDD6",
        "#B4E4FF",
        "#655DBB",
      ],
      labels: [
        "angry",
        "disgust",
        "fear",
        "happy",
        "neutral",
        "sad",
        "surprise",
      ],
      title: {
        text: "Video Emotion Report",
        align: "center",
      },
    },
  });






  useEffect(() => {
    setIsFullScreen(true);
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      // Request access to the user's camera and microphone
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          // Create a MediaRecorder object and pass the MediaStream object to it

          mediaRecorderRef.current = new MediaRecorder(stream);

          // Add event listeners to handle the dataavailable and stop events
          mediaRecorderRef.current.addEventListener(
            "dataavailable",
            (event) => {
              // Send the recorded chunk of data to the server
              //sendChunkToServer(event.data);
            }
          );
          mediaRecorderRef.current.addEventListener("stop", () => {
            // Stop recording and close the MediaStream
            stream.getTracks().forEach((track) => track.stop());
          });

          // Set the srcObject property of the video element to the MediaStream object
          videoElement.srcObject = stream;

          // Start recording
          mediaRecorderRef.current.start();
        })
        .catch((error) => {
          console.error(error);
        });
    }

    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [testType]);

  const handleGoToFullScreen = (e) => {
    document.documentElement.requestFullscreen();
    if (!document.fullscreenElement) {
      // Browser is not in full screen mode
      setCount(count + 1);
    }
  };

  // useEffect(() => {
  //   const ws = new WebSocket("ws://127.0.0.1:8000/ws/sc/");

  //   ws.onopen = () => {
  //     console.log("WebSocket connection opened");
  //     setSocket(ws);
  //   };

  //   ws.onmessage = (event) => {
  //     console.log("WebSocket message received", event.data);
  //     setMessage(event.data);
  //   };

  //   ws.onclose = () => {
  //     console.log("WebSocket connection closed");
  //     setSocket(null);
  //   };

  //   return () => {
  //     if (socket) {
  //       socket.close();
  //       setSocket(null);
  //     }
  //   };
  // }, []);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    console.log("not supported");
  }
  //   const [slectedQuestionNo, setQuestionNo] = useState(0);
  const indexOfLastPost = currentPage * questionsPerPage;
  const indexOfFirstPost = indexOfLastPost - questionsPerPage;
  const currentQuestion = questions.slice(indexOfFirstPost, indexOfLastPost);
const [isIntervalRunning, setIsIntervalRunning] = useState(false);
const [intervalId, setIntervalId] = useState(null); // added state for interval ID



  async function fetchTestTime() {
    const testTimeResult = await getTestTime(userId, testId);

    const statusResult =
      testTimeResult && testTimeResult.test_status
        ? testTimeResult.test_status
        : 0;

    const filteredTestTime =
      statusResult && statusResult.length
        ? statusResult.filter((_data) => _data.test_id === testId)
        : [];

    const selectedTest =
      filteredTestTime && filteredTestTime.length
        ? filteredTestTime.slice(-1).pop()
        : null;
    console.log(selectedTest);

    if (selectedTest && selectedTest.test_expected_end_time && !isIntervalRunning) {
      setIsIntervalRunning(true);

      setTestType(selectedTest.test_type === "training");
      startCountdown(selectedTest.test_expected_end_time); // start the countdown
    }
  }

useEffect(() => {
  async function fetchData() {
    await fetchTestTime();
  }

  fetchData();
}, []); // add dependency array to run the effect only once

useEffect(() => {
  return () => {
    clearInterval(intervalId); // clear the interval on unmount
  };
}, [intervalId]); // add dependency to clear the interval only when intervalId changes

function startCountdown(endTime) {
  const intervalId = setInterval(() => {
    const currentTime = moment();

    // Format current time in hh:mm:ss
    const formattedTime = currentTime.format("h:mm:ss");

    const endTimeSeconds = toSeconds(endTime);
    const nowSeconds = toSeconds(formattedTime);
    let timeLeft = endTimeSeconds - nowSeconds;

    if (timeLeft <= 0) {
      console.log("Time is up!");
      clearInterval(intervalId);
      setIsIntervalRunning(false);
      handleTimeUp();
    } else {
      const hours = Math.floor(timeLeft / 3600) || "00";
      const minutes = Math.floor((timeLeft % 3600) / 60) || "00";
      const seconds = timeLeft % 60 || "00";
      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    }
  }, 1000);

  setIntervalId(intervalId); // save the interval ID to state
}

function handleTimeUp() {
  const currentTime = moment();

  // Format current time in hh:mm:ss
  const formattedTime = currentTime.format("h:mm:ss");
  testEndFlag(userId, testId, formattedTime);
  setIsConfirmModalOpen(false);
  setIsTestStarted(false);
  fetchTestInfo();
  setIsTestEndMsgModal(true);
}

function fetchTestInfo() {
  getScoreByTestId(userId, testId).then((testResultData) => {
    if (testResultData) {
      setTestResult(testResultData.scores);
    }
  });

  getAudioTestReport(userId, testId).then((audioResultData) => {
    if (audioResultData) {
      setAudioTestResult(audioResultData);
    }
  });
}

function toSeconds(timeString) {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}


  function onChange(newValue) {
    console.log("change", newValue);
  }

  const video_proctor_outputs = {
    user_id: 101,
    unknown_faces: "FALSE",
    multiple_faces: "FALSE",
    distracted: "TRUE",
    cell_phone: "FALSE",
    book: "TRUE",
    text_on_screen: "TRUE",
    blink_nervousness: "TRUE",
    face_hand_nervousness: "TRUE",
    dominant_emotion: "negative",
    blinking_not_detected: "FALSE",
  };

  const emotion_info = {
    user_id: 100,
    angry_count: 10,
    disgust_count: 20,
    fear_count: 10,
    happy_count: 20,
    neutral_count: 10,
    sad_count: 10,
    surprise_count: 20,
  };

  useEffect(() => {
    if (userId && testId) {
      fetchTestTime();
      fetchTestInfo();
    }
  }, [userId, testId]);

  useEffect(() => {
    // const interval = setInterval(() => {
    //   const checkFullScreen = () => {
    //     setIsFullScreen(!!document.fullscreenElement);
    //   };
    //   document.addEventListener("fullscreenchange", checkFullScreen);
    //   return () => {
    //     document.removeEventListener("fullscreenchange", checkFullScreen);
    //   };
    // }, 1000);
    // return () => clearInterval(interval);
    if (window) {
      const checkFullScreen = () => {
        setIsFullScreen(
          window.innerWidth === screen.width &&
            window.innerHeight === screen.height
        );
      };
      window.addEventListener("resize", checkFullScreen);
      return () => {
        window.removeEventListener("resize", checkFullScreen);
      };
    }
    if (
      screen.width == window.innerWidth &&
      screen.height == window.innerHeight
    ) {
      //full web browser
      setIsFullScreen(true);
    }
  }, []);

  useEffect(() => {
    if (window) {
      let audioCount = 0;
      if (audioTestResult.audio_emotion_count) {
        audioCount = audioTestResult.audio_emotion_count;
      }
      if (audioTestResult && audioTestResult.audio_emotion_report) {
        const { Surprise, Disgust, Fear, Happy, Sadness, Neutral, Angry } =
          audioTestResult.audio_emotion_report;

        const audioTestSeries = [
          Surprise ? Math.round(Surprise) : 0,
          Disgust ? Math.round(Disgust) : 0,
          Fear ? Math.round(Fear) : 0,
          Happy ? Math.round(Happy) : 0,
          Sadness ? Math.round(Sadness) : 0,
          Neutral ? Math.round(Neutral) : 0,
          Angry ? Math.round(Angry) : 0,
        ];

        const audioTestSeriesLabel = [
          "Surprise",
          "Disgust",
          "Fear",
          "Happy",
          "Sadness",
          "Neutral",
          "Angry",
        ];

        setAudioEmotionalReport({
          series: audioTestSeries && audioTestSeries,
          options: {
            chart: {
              type: "radialBar",
            },
            labels: audioTestSeriesLabel && audioTestSeriesLabel,
            stroke: {
              colors: ["#fff"],
            },
            title: {
              text: "Audio Emotion Report",
              align: "center",
            },
            fill: {
              opacity: 0.8,
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200,
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
            yaxis: {
              min: 0,
              max: 10,
            },
          },
        });
      }

      if (audioTestResult && audioTestResult.text_emotion_report) {
        const maxValue = 10;

        const valueToPercent = (val) => (val * 10) / maxValue;
        let { neutral, positive, negative } =
          audioTestResult.text_emotion_report;

        const textSeries = [
          neutral ? valueToPercent(neutral) : 0,
          positive ? valueToPercent(positive) : 0,
          negative ? valueToPercent(negative) : 0,
        ];
        const textSeriesLabel = ["Neutral", "Positive", "Negative"];
        setTextEmotionalReport(
          {
            series: textSeries && textSeries,
            options: {
              chart: {
                height: 350,
                type: "radialBar",
              },
              plotOptions: {
                radialBar: {
                  dataLabels: {
                    show: true,
                    value: {
                      show: true,
                      formatter: function (val) {
                        return val;
                      },
                    },
                  },
                },
              },
              labels: textSeriesLabel && textSeriesLabel,
              title: {
                text: "Content Emotion Report",
                align: "center",
              },
              legend: {
                show: true,
                floating: true,
                position: "right",
                formatter: function (val, opts) {
                  return val + " - " + opts.w.globals.series[opts.seriesIndex];
                },
                offsetX: -80,
                offsetY: 20,
              },
            },
          }

          //   {
          //   chart: {
          //     type: "radialBar",
          //     height: 350,
          //     width: 380,
          //   },
          //   plotOptions: {
          //     radialBar: {
          //       size: undefined,
          //       inverseOrder: true,
          //       hollow: {
          //         margin: 5,
          //         size: "48%",
          //       },
          //       track: {
          //         show: false,
          //       },
          //       startAngle: -180,
          //       endAngle: 180,
          //     },
          //   },
          //   stroke: {
          //     lineCap: "round",
          //   },
          //   // yaxis: {
          //   //   min: 0,
          //   //   max: 10,
          //   // },
          //   series: textSeries && textSeries,
          //   labels: textSeriesLabel && textSeriesLabel,
          //   legend: {
          //     show: true,
          //     floating: true,
          //     position: "right",
          //     offsetX: 70,
          //     offsetY: 240,
          //   },
          // }
        );
      }
    }
  }, [audioTestResult]);

  const addAnswer = (
    answerToBeAdded,
    questionNumberToBeAdded,
    questionTypeToBeAdded
  ) => {
    const selectedAnswers = [...answers];
    const pageAnswers = [...selectedPageanswers];
    let found = false;
    let isfound = false;

    for (let i = 0; i < selectedAnswers.length; i++) {
      if (selectedAnswers[i].question_no === questionNumberToBeAdded) {
        selectedAnswers[i]["answer"] = answerToBeAdded;
        found = true;
        break;
      }
    }

    for (let i = 0; i < pageAnswers.length; i++) {
      if (pageAnswers[i].question_no === questionNumberToBeAdded) {
        (pageAnswers[i]["answer"] = answerToBeAdded), (isfound = true);
        break;
      }
    }

    if (!found) {
      selectedAnswers.push({
        ["test_id"]: testId,
        ["user_id"]: userId,
        ["question_no"]: questionNumberToBeAdded,
        ["question_type"]: questionTypeToBeAdded,
        ["answer"]: answerToBeAdded,
      });
    }
    if (!isfound) {
      pageAnswers.push({
        ["pageNo"]: currentPage,
        ["question_no"]: questionNumberToBeAdded,
        ["answer"]: answerToBeAdded,
        ["question_type"]: questionTypeToBeAdded,
      });
    }
    setAnswers([...selectedAnswers]);
    setSelectedPageAnswers([...pageAnswers]);
  };

  useEffect(() => {
    if (isRecording && transcript) {
      setDiscriptionValue(transcript);
      addAnswer(transcript, questionNo, questionType);
    }

    // return () => {
    //   setDiscriptionValue("");
    // };
  }, [isRecording, transcript, questionNo, questionType]);

  // useEffect(() => {
  //   if (window) {
  //     window.onblur = () => alert("switched tab");
  //     localStorage.openpages = Date.now();
  //     window.addEventListener(
  //       "storage",
  //       function (e) {
  //         if (e.key == "openpages") {
  //           localStorage.page_avilable = Date.now();
  //         }
  //         if (e.key == "page_avilable") {
  //           alert("one more tab opened");
  //         }
  //       },
  //       false
  //     );
  //   }
  // }, []);

  const startAudioRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setIsRecording(true);
        const options = {
          audioBitsPerSecond: 128000,
          mimeType: "audio/wav",
        };
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        const audioChunks = [];

        recorder.addEventListener("dataavailable", (event) => {
          audioChunks.push(event.data);
        });

        recorder.addEventListener("stop", () => {
          setIsAudioRecording(false);
          setAudioChunks([...audioChunks]);
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          setAudioBlob(audioBlob);
          setAudioUrl(URL.createObjectURL(audioBlob));
        });

        recorder.start();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const stopAudioRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

const sendAudioData = async () => {
  let mp3File = new File([...audioChunks], "audio/wav", {
    audioBitsPerSecond: 128000,
    mimeType: "audio/wav",
  });

  try {
    const result = await saveQuestionAudio(
      userId,
      testId,
      questionNo,
      question,
      discriptionValue,
      mp3File
    );
    setAudioReport(result); // save the result in the audioReport state
  } catch (error) {
    console.error("Failed to send audio data:", error);
  }
};


  const handlePreviousClick = (e) => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      SpeechRecognition.stopListening();
      setIsRecording(false);
      resetTranscript;
      setDiscriptionValue("");

      //   setQuestionNo(null);
      //   setQuestionType("");
      const foundValue =
        selectedPageanswers.find(({ pageNo }) => pageNo === currentPage - 1) ||
        {};
      if (foundValue && foundValue.question_type === "mcq") {
        setOptionValue(foundValue.answer);
      }

      if (foundValue && foundValue.question_type === "descriptive_audio") {
        setDiscriptionValue(foundValue.answer);
      }
    }
  };

  const handleNextClick = (e) => {

    if (currentPage < questions.length) {
      setCurrentPage(currentPage + 1);
      setIsRecording(false);
      SpeechRecognition.stopListening();
      resetTranscript();
      setDiscriptionValue("");
      const foundValue =
        selectedPageanswers.find(({ pageNo }) => pageNo === currentPage + 1) ||
        {};

      if (foundValue && foundValue.question_type === "mcq") {
        setOptionValue(foundValue.answer);
      }


      if (foundValue && foundValue.question_type === "descriptive_audio") {
        setDiscriptionValue(foundValue.answer);
      }
    }
  };

  const handleUsersSelctionChange = (option, qNo, qType) => {
    setOptionValue(option);
    addAnswer(option, qNo, qType);
  };


  const handleUsersMriSelectionChange = (option, qNo, qType) => {
    setOptionValue(prevOptionValue => {
      if (prevOptionValue.includes(option)) {
        return prevOptionValue.filter((val) => val !== option);
      } else {
        return [...prevOptionValue, option];
      }
    });
    addAnswer(optionValue, qNo, qType);
  };
  

  const handleUserDiscriptionChange = (e, qNo, qType) => {
    const value = e.target.value;
    setDiscriptionValue(value);
    addAnswer(value, qNo, qType);
  };

  const handleFillBlanksChange = (e, qNo, qType) => {
    const value = e.target.value;
    setDiscriptionValue(value);
    addAnswer(value, qNo, qType);
  };

const handleTestEndConfirm = async (e) => {
  const currentTime = moment();

  // Format current time in hh:mm:ss
  const formattedTime = currentTime.format("h:mm:ss");
  const logTime = currentTime.format("MMMM Do YYYY, h:mm:ss a");

  console.log(`Test ended at ${logTime}`);

  setIsConfirmModalOpen(false);
  setIsTestEndMsgModal(true);

  // Use Promise.all to await multiple promises
  await Promise.all([
    submitAnswers(answers),
    testEndFlag(userId, testId, formattedTime),
    fetchTestInfo()
  ]);

  setIsTestStarted(false);
};


  const handleCancelGoToFullScreen = async (e) => {
    const currentTime = moment();
    router.push("/testList");
    // Format current time in hh:mm:ss
    const formattedTime = currentTime.format("h:mm:ss");
    await submitAnswers(answers);
    await testEndFlag(userId, testId, formattedTime);
    setIsTestStarted(false);
    fetchTestInfo();
  };

  // useEffect(() => {
  //   if (count > 3) {
  //     handleEndTest();
  //   }
  // }, [count]);

  const handleNavigationToTest = async (e) => {
    setIsTestEndMsgModal(false);
    router.push("/testList");
  };



  async function fetchQuestionsList() {
    const testQuestions = await getTestQuestions(testId);
    setQuestions(testQuestions && testQuestions.question);
  }

  const handleRecording = (e, qNo, qType, q) => {
    if (!isRecording) {
      setQuestion(q);
      setQuestionNo(qNo);
      setQuestionType(qType);
      setIsRecording(true);
      SpeechRecognition.startListening({ continuous: true });
      startAudioRecording();
    } else {
      setIsRecording(false);
      SpeechRecognition.stopListening();
      stopAudioRecording();
    }
  };

  useEffect(() => {
    const userIdData = JSON.parse(sessionStorage.getItem("userId"));
    const testIdData = JSON.parse(sessionStorage.getItem("testId"));
    setUserId(userIdData);
    setTestId(testIdData);
  }, []);

  useEffect(() => {
    if (testId) {
      fetchQuestionsList();
    }
  }, [testId]);

  return (
    <div>

      <Container style={{ marginTop: "2em" }}>
        {/* <Segment.Group> */}
        <Segment>
          <Grid>
            <Grid.Column>
              <Button>Total Questions :{questions.length}</Button>
              <Button style={{ marginLeft: "25%" }}>
                Time Left :{timeLeft ? timeLeft : 0}
              </Button>
              <Button
                onClick={(e) => setIsConfirmModalOpen(true)}
                floated="right"
                color="blue"
              >
                End Test
              </Button>
            </Grid.Column>
          </Grid>
        </Segment>
        <Confirm
          open={isConfirmModalOpen}
          content="Are you sure you want to end the test?"
          onCancel={(e) => setIsConfirmModalOpen(false)}
          onConfirm={handleTestEndConfirm}
        />
        <Segment textAlign="left" style={{ marginBottom: "6em" }}>
{currentQuestion && currentQuestion.length ? currentQuestion.map(({question_no, question_type, difficulty, questions, answer, options}, index) => (
<Segment attached key={question_no}>
<Segment.Group>
<Segment textAlign="left" color="blue" inverted>
<Header as="h3">{currentPage - 1 + (index + 1)}. {questions}</Header>
</Segment>
{question_type === "mcq" ? (
<Segment>
<List selection>
{options.map((_data) => (
<List.Item key={_data}>
<Checkbox onClick={(e) => handleUsersSelctionChange(_data, question_no, question_type)} value={_data} checked={_data === optionValue} radio label={_data} className="modern-checkbox" />
</List.Item>
))}
</List>
</Segment>
) : question_type === "mri" ? (
<Segment>
<List selection>
{options.map((_data) => (
<List.Item key={_data}>
<Checkbox onClick={(e) => handleUsersMriSelectionChange(_data, question_no, question_type)} value={_data} checked={_data === optionValue} label={_data} className="modern-checkbox" />
</List.Item>
))}
</List>
</Segment>
) : question_type === "fill_blanks" ? (
<Segment>
<Form>
<TextArea onChange={(e) => handleUserDiscriptionChange(e, question_no, question_type)} value={discriptionValue} placeholder="Enter your answer here" style={{ minHeight: 100 }} className="modern-textarea" />
</Form>
</Segment>
) : question_type === "coding" ? (
<Segment>
<AceEditor mode="javascript" theme="monokai" onChange={onChange} name="UNIQUE_ID_OF_DIV" editorProps={{ $blockScrolling: true }} className="modern-aceeditor" />
</Segment>
) : (
<Segment>
<Grid>
<Grid.Column width={10}>
<Form>
<TextArea onChange={(e) => handleUserDiscriptionChange(e, question_no, question_type)} value={discriptionValue} placeholder="Enter your answer here" style={{ minHeight: 100 }} className="modern-textarea" />
</Form>
</Grid.Column>
<Grid.Column width={6} textAlign="center">
<Button color="green" onClick={sendAudioData} style={{ marginTop: 15 }}  className="modern-button">Save</Button>
<br />
<br />
<Icon size="big" link name={listening ? "microphone" : "microphone slash"} onClick={(e) => handleRecording(e, question_no, question_type, questions)} color={listening ? "green" : "red"} />
</Grid.Column>
</Grid>
</Segment>
)}
<Segment >
  <Grid columns={2}>
    <Grid.Column floated="left">
      <Button color="blue" onClick={handlePreviousClick} className="modern-button">Previous</Button>
    </Grid.Column>
    <Grid.Column floated="right">
      <Button color="blue" onClick={() => { handleNextClick(); handleResetReportData(); }} className="modern-button">Next</Button>
    </Grid.Column>
  </Grid>
</Segment>

</Segment.Group>
</Segment>
)) : "No questions found"}


        </Segment>

        {isTestEndMsgModal ? (
          <TestEndMsgModal
            isTestEndMsgModal={isTestEndMsgModal}
            handleNavigationToTest={handleNavigationToTest}
          />
        ) : null}


{testType && (
  <Segment>

    <Grid columns="equal">
      <Grid.Column>
        <Button color="blue" onClick={() => GetReport(discriptionValue)} style={{ marginLeft: '10px' }}>
          <Icon name="file alternate outline" />
          Analysis Report
        </Button>
      </Grid.Column>

      <Grid.Column width={reportData.type ? 10 : 16} textAlign="center">
        <div
          className={styles["video-container"]}
          onClick={() => setMirrorMode(!mirrorMode)}
        >
          <video
            ref={videoRef}
            autoPlay
            controls // Add the controls attribute
            className={mirrorMode ? styles.mirror : ""}
          />
        </div>
      </Grid.Column>

      {reportData.type && audioReport && (
        <Grid.Column width={reportData.type ? 6 : 0}>
          <Segment>
            <Header>Audio Report</Header>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Category</Table.HeaderCell>
                  <Table.HeaderCell>Feedback</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(audioReport).map(([key, value]) => (
                  <Table.Row key={key}>
                    <Table.Cell>{key}</Table.Cell>
                    <Table.Cell>{value}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Segment>
        </Grid.Column>
      )}

      {reportData.type && (
        <Grid.Column width={audioReport ? 10 : 16}>
          <Segment>
            <Header as='h2'>Written Communication Report</Header>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Category</Table.HeaderCell>
                  <Table.HeaderCell>Feedback</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Grammar</Table.Cell>
                  <Table.Cell>{reportData.Grammar}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Spelling</Table.Cell>
                  <Table.Cell>{reportData.spelling}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Writing Style</Table.Cell>
                  <Table.Cell>{reportData.writing_style}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Tone/Sentiment</Table.Cell>
                  <Table.Cell>{reportData.Tone_sentiment}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Content Writing</Table.Cell>
                  <Table.Cell>{reportData.content_writing}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Clarity</Table.Cell>
                  <Table.Cell>{reportData.clarity}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Segment>
        </Grid.Column>
      )}

    </Grid>
  </Segment>
)}






      </Container>
      {
        <Confirm
          open={!isFullScreen ? true : false}
          content="Please Go to FullScreen or Test will be Ended"
          onCancel={handleCancelGoToFullScreen}
          onConfirm={handleGoToFullScreen}
        />
      }
      {/* // ) : null */}
    </div>
  );
}
