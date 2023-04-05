export default function TestReport() {
  const router = useRouter();
  // added by mitanshu for cross button
  const handleBack = () => {
    router.back();
  }
  const closeButton = (
    <Icon
      name='close'
      size='large'
      style={{
        position: 'absolute',
        top: '3.7em',
        right: '2em',
        cursor: 'pointer'
      }}
      onClick={handleBack}
    />
  );
  //upto this
  const { userReportId } = router.query;

  const [testId, setTestId] = useState("");

  const [postBody, setPostBody] = useState("");
  const [editor, setEditor] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [audioTestResult, setAudioTestResult] = useState({});
  const [audioPace, setAudioPace] = useState({});
  const [audioClarity, setAudioClarity] = useState({});
  const [videoTestResult, setVideoTestResult] = useState({});
  const [detailTestResult, setDetailTestResult] = useState([]);
  const [detailTextResult, setDetailTextResult] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [dominantEmotion, setDominantEmotion] = useState("Angry");
  const [isDetailTestReportModalOpen, setIsDetailTestReportModalOpen] =
    useState(false);
  const [isVideoTestReportModalOpen, setIsVideoTestReportModalOpen] =
    useState(false);

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
        "#FF4560",
        "#D4526E",
        "#F86624",
        "#FEB019",
        "#81D4FA",
        "#A300D6",
        "#8D5B4C",
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

  async function fetchTestInfo() {
    setIsLoading(true);
    const testResultData = await getScoreByTestId(userReportId, testId);
    const audioResultData = await getAudioTestReport(userReportId, testId);
    const videoResultData = await   getVideoTestReport(userReportId, testId);
    const detailResultData = await getDetailTestReport(userReportId, testId);
    //const detailTextData = await getDetailTextReport(userReportId, testId);
    setIsLoading(false);

    if (testResultData) {
      setTestResult(testResultData.scores);
    }

    if (audioResultData) {
      setAudioTestResult(audioResultData);
    }

    if (videoResultData) {
      setVideoTestResult(videoResultData.video_proctor_outputs);
  
    }
    console.log(video_proctor_outputs)
    //if (videoResultData) {
     // setVideoTestResult2(videoResultData.video_proctor_outputs);
    //}   

    if (detailResultData) {
      setDetailTestResult(detailResultData && detailResultData.data);
    }

    //if (detailTextData) {
     // setDetailTextResult(detailTextData);
    //}
  }

  function toSeconds(timeString) {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  const video_proctor_outputs = {
    user_id : setVideoTestResult.user_id ,
    unknown_faces : setVideoTestResult.unknown_faces,
    multiple_faces : setVideoTestResult.multiple_faces,
    distracted : setVideoTestResult.distracted,
    cell_phone : setVideoTestResult.cell_phone,
    book : setVideoTestResult.book,
    text_on_screen : setVideoTestResult.text_on_screen,
    blink_nervousness : setVideoTestResult.blink_nervousness,
    face_hand_nervousness : setVideoTestResult.face_hand_nervousness,
    dominant_emotion : setVideoTestResult.dominant_emotion,
    blinking_not_detected : setVideoTestResult.blinking_not_detected,
  };

  const emotion_info = {
    user_id : 100,
    angry_count: 10,
    disgust_count: 20,
    fear_count: 10,
    happy_count: 20,
    neutral_count: 10,
    sad_count: 10,
    surprise_count: 20,
  };

  useEffect(() => {
    if (userReportId && testId) {
      fetchTestInfo();
    }
  }, [userReportId, testId]);

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
          Surprise ? Surprise : 0,
          Disgust ? Disgust : 0,
          Fear ? Fear : 0,
          Happy ? Happy : 0,
          Sadness ? Sadness : 0,
          Neutral ? Neutral : 0,
          Angry ? Angry : 0,
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
                    width: 380,
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
            yaxis: {
              min: 0,
              //max: 100,
            },
          },
        });
      }
      if (audioTestResult && audioTestResult.audio_pace) {
  const { SLOW, FAST, AVERAGE } = audioTestResult.audio_pace;
  const audioPaceSeries = [SLOW ? SLOW : 0, AVERAGE ? AVERAGE : 0, FAST ? FAST : 0];
  const audioPaceSeriesLabel = ["SLOW", "AVERAGE", "FAST"];
  setAudioPaceReport({
    series: audioPaceSeries,
    options: {
      chart: {
        type: "radialBar",
      },
      labels: audioPaceSeriesLabel,
      stroke: {
        colors: ["#fff"],
      },
      title: {
        text: "Audio Pace Report",
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
              width: 380,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      yaxis: {
        min: 0,
        //max: 100,
      },
    },
  });
}

if (audioTestResult && audioTestResult.audio_clarity) {
  const { Excellent, STANDARD, POOR } = audioTestResult.audio_clarity;
  const audioClaritySeries = [Excellent ? Excellent : 0, STANDARD ? STANDARD : 0, POOR ? POOR : 0];
  const audioClaritySeriesLabel = ["Excellent", "STANDARD", "POOR"];
  setAudioClarityReport({
    series: audioClaritySeries,
    options: {
      chart: {
        type: "radialBar",
      },
      labels: audioClaritySeriesLabel,
      stroke: {
        colors: ["#fff"],
      },
      title: {
        text: "Audio Clarity Report",
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
              width: 380,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      yaxis: {
        min: 0,
        //max: 100,
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
        setTextEmotionalReport({
          series: textSeries && textSeries,
          options: {
            chart: {
              height: 350,
              type: "radialBar",
            },
            colors: ["#03A9F4", "#13D8AA", "#FF4560"],
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
              offsetX: -40,
              // offsetY: ,
            },
          },
        });
      }
    }
  }, [audioTestResult]);

  useEffect(() => {
    const userReportIdData = JSON.parse(sessionStorage.getItem("userReportId"));
    const testIdData = JSON.parse(sessionStorage.getItem("testId"));
    setTestId(testIdData);
  }, []);

  return (
    <div>
      <Dimmer active={isLoading}>
        <Loader />
      </Dimmer>
      
      {detailTestResult && detailTestResult.length>0? (

      <Container style={{ marginTop: "4em" }}>
        {closeButton}
        <Segment>
          <Header textAlign="center">
            Total Score:
            {testResult ? testResult.total_percentage : 0}%

          </Header>
        </Segment>
        <Button
          color="blue"
          onClick={(e) => setIsDetailTestReportModalOpen(true)}
        >
          Details{" "}
        </Button>
        {isDetailTestReportModalOpen ? (
          <DetailTestReportModal
            isDetailTestReportModalOpen={isDetailTestReportModalOpen}
            setIsDetailTestReportModalOpen={setIsDetailTestReportModalOpen}
            detailTestResult={detailTestResult}
            testResult={testResult}
          />
        ) : null}

        {audioClarity && (
  <div>
    <h2>Audio Clarity Report</h2>
    <Chart
      options={audioClarity.options}
      series={audioClarity.series}
      type="bar"
      height={350}
    />
  </div>
)}

{audioPace && (
  <div>
    <h2>Audio Pace Report</h2>
    <Chart
      options={audioPace.options}
      series={audioPace.series}
      type="donut"
      height={350}
    />
  </div>
)}


        <Segment>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <ReactApexChart
                  options={audioEmotionalReport.options}
                  series={audioEmotionalReport.series}
                  type="polarArea"
                  width={420}
                />
              </Grid.Column>
              <Grid.Column width={8}>
                <ReactApexChart
                  options={textEmotionalReport.options}
                  series={textEmotionalReport.series}
                  type="radialBar"
                  width={350}
                />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={8}>
                <Header style={{ marginLeft: "20%" }}>
                  Dominant Expression:{dominantEmotion}
                </Header>
                {dominantEmotion === "Confident" && (
                  <Image
                    style={{ marginLeft: "25%" }}
                    src="/smiling-face-with-sunglasses-people.gif"
                    alt="#"
                    width={100}
                    height={34}
                  />
                )}

                {dominantEmotion === "Sad" && (
                  <Image
                    style={{ marginLeft: "25%" }}
                    src="/Very Sad Emoji.png"
                    alt="#"
                    width={100}
                    height={34}
                  />
                )}
                {dominantEmotion === "Worried" && (
                  <Image
                    style={{ marginLeft: "25%" }}
                    src="/worried-face-people.gif"
                    alt="#"
                    width={100}
                    height={34}
                  />
                )}

                {dominantEmotion === "Nervous" && (
                  <Image
                    style={{ marginLeft: "25%" }}
                    src="/Cold Sweat Emoji.png"
                    alt="#"
                    width={100}
                    height={34}
                  />
                )}

                {dominantEmotion === "Neutral" && (
                  <Image
                    style={{ marginLeft: "25%" }}
                    src="/Neutral Face Emoji.png"
                    alt="#"
                    width={100}
                    height={34}
                  />
                )}

                {dominantEmotion === "Charming" && (
                  <Image
                    style={{ marginLeft: "25%" }}
                    src="/Happy Emoji.png"
                    alt="#"
                    width={100}
                    height={34}
                  />
                )}

                {dominantEmotion === "Angry" && (
                  <Image
                    style={{ marginLeft: "25%" }}
                    src="/Angry Emoji.png"
                    alt="#"
                    width={100}
                    height={34}
                  />
                )}
              </Grid.Column>
              <Grid.Column width={8}></Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Button
          color="blue"
          onClick={(e) => setIsVideoTestReportModalOpen(true)}
        >
          Video Proctoring Details{" "}
      </Button>
        {isVideoTestReportModalOpen ? (
          <VideoTestReportModal
            isVideoTestReportModalOpen={isVideoTestReportModalOpen}
            setIsVideoTestReportModalOpen={setIsVideoTestReportModalOpen}
            detailTestResult={detailTestResult}
            testResult={testResult}
          />
        ) : null}

      </Container>
      ) : (
        <Container style={{ marginTop: "4em" }}>
        {closeButton}
        Report Not available
        </Container>
      )}
    </div>
  );
}