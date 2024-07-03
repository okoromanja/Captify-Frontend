import React from 'react'
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from '../../layout/Sidebar';

import { LuSubtitles } from "react-icons/lu";

import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from "axios"
import DeleteModal from '../PreAudio/DeleteModal';



import { RiDeleteBin6Line } from "react-icons/ri";
import CustomAudioPlayer from "../PreAudio/CustomAudioPlayer"


const ViewSyncFiles = () => {


  const contentRef = useRef(null)

  const [isDownloadingtr, setIsDownloadingtr] = useState(false); // New state variable
  const [showSRT, setShowSRT] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [wordsIndex, setWordsIndex] = useState("");
  const [transcriptions, setTranscriptions] = useState("");
  const [dbTranscript, setDbTranscript] = useState("");

  const navigate = useNavigate();



  const { id } = useParams();
  console.log("id in view transcriptions", id)




  useEffect(() => {

    const fetchSingleTranscription = async () => {

      const fetch = await axios.post(`${import.meta.env.VITE_HOST_URL}/sync/fetch-transcript`, { id: id }, {
        headers: {
          "Content-Type": "application/json"
        }
      }).catch((err) => {
        console.log("Error while fetching the transcription in view transcriptions", err)
      })
      setDbTranscript(fetch.data)


    }

    fetchSingleTranscription()

  }, [id])
  console.log("dbTranscript", dbTranscript)



  // funtion to download the srt file

  const downloadSrtFile = () => {

    const element = document.createElement("a");

    const srtContent = generateSrtContent()
    console.log("srt content from the generateSrtContent function", srtContent)

    const file = new Blob([srtContent], { type: "text/plain" }); // Create blob with text content
    element.href = URL.createObjectURL(file);
    element.download = `${dbTranscript.audioFilename}.srt`;
    document.body.appendChild(element); // Required for Firefox
    element.click();

  };

  // function to convert timestamps into correct srt format timestamps
  const convertToSrtTime = (seconds) => {
    const pad = (num, size) => ('000' + num).slice(size * -1);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);
    return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(secs, 2)},${pad(milliseconds, 3)}`;
  };

  // function to generate the srt content

  const generateSrtContent = () => {
    let srtContent = '';
    let segmentIndex = 1;

    dbTranscript.syncData.forEach((data, i) => {
      let paragraphContent = '';

      data.elements.forEach((words, j) => {
        if (words.value.trim() !== '') {
          paragraphContent += words.value + ' ';
          if ((j + 1) % 24 === 0) {
            const startTime = convertToSrtTime(data.elements[j - 12].ts);
            const endTime = convertToSrtTime(words.end_ts);
            srtContent += `${segmentIndex}\n${startTime} --> ${endTime}\n${paragraphContent.trim()}\n\n`;
            segmentIndex += 1;
            paragraphContent = ''; // Reset paragraph content for next segment
          }
        }
      });

      // If there is any remaining paragraph content that wasn't added due to the 12-word condition
      if (paragraphContent.trim() !== '') {
        const lastElement = data.elements[data.elements.length - 1];
        const startTime = convertToSrtTime(data.elements[data.elements.length - 12]?.ts || 0);
        const endTime = convertToSrtTime(lastElement.end_ts);
        srtContent += `${segmentIndex}\n${startTime} --> ${endTime}\n${paragraphContent.trim()}\n\n`;
        segmentIndex += 1;
      }
    });

    return srtContent;
  };

  const handleToggleSRT = () => {
    console.log("Before toggle:", showSRT); // Log current state before toggle
    setShowSRT(!showSRT); // Toggle the value of showSRT
    console.log("After toggle:", showSRT); // Log current state after toggle
  };

  const calculateHighlightedIndex = (currentTime) => {
    console.log("currentTime", currentTime);

    const segments = dbTranscript.syncData.map((data) => data.elements);

    // Iterate through each segment array
    for (let i = 0; i < segments.length; i++) {
      const segmentArray = segments[i];

      // Iterate through each segment object in the array
      for (let j = 0; j < segmentArray.length; j++) {
        const segment = segmentArray[j];

        // Extract start and end times of the current segment
        const { ts, end_ts } = segment;
        console.log("start", ts);
        console.log("end", end_ts);

        // Check if the current time falls within the duration of this segment
        if (currentTime >= ts && currentTime <= end_ts) {
          setWordsIndex(j);
          // If matched, return the index
          return i;
        }
      }
    }

    // If no match found, return -1
    return -1;
  };


  console.log("wordsIndex", wordsIndex)




  const deleteTranscription = async () => {

    try {
      await axios.delete(`${import.meta.env.VITE_HOST_URL}/sync/deleteTranscription`, {
        data: {
          id: id
        }
      }

      )
      toast.success("File deleted")
      navigate("/resyncingAi")
    } catch (error) {
      console.log("Error while deleting the transcription", error)
    }


  }


  return (

    <>
      <div className='w-full min-h-screen'>
        <div className='flex w-full'>

          <Sidebar />


          <div className=' md:w-full w-full md:px-5 flex flex-col   gap-5  '>


            <div className='w-full flex p-5  gap-8 md:flex-row flex-col items-center justify-center'>




              <span className='flex w-full  p-5 md:w-2/3   shadow-md flex-col h-[430px] overflow-y-scroll  gap-5 py-5 rounded-md bg-bg-navy-blue '>

                <span className='flex flex-row    gap-2'>

                  <span className='md:text-2xl text-lg flex-col gap-3 font-bold font-poppins   '> ReSyncing <p>{dbTranscript.audioFilename} + {dbTranscript.transcriptFilename} </p>  </span>
                </span>

                <div className=' font-roboto'>

                  {

                    <div className='w-full' >

                      {
                        dbTranscript &&
                        dbTranscript.syncData.map((data, i) => (
                          <div className="w-full py-2" key={i}>
                            {/* <p>speaker: {data.speaker}</p> */}
                            <div className="flex flex-wrap gap-1">
                              {data.elements.map((words, j) => (
                                // Check if words.value is not an empty string
                                words.value.trim() !== "" && (
                                  <div className='' key={j}>
                                    <p className='flex gap-3' style={{ color: j === wordsIndex ? '#f1b900' : 'white' }}>
                                      {words.value}
                                      {(j + 1) % 12 === 0 && (
                                        <span>( {data.elements[j - 6].ts} -- {words.end_ts} )</span>
                                      )}
                                    </p>
                                  </div>
                                )
                              ))}
                            </div>
                          </div>
                        ))
                      }



                    </div>

                  }

                </div>



              </span>


              <div className='w-60 bg-bg-navy-blue h-[430px] py-5  flex items-center justify-center shadow-md   rounded-md '>

                <div className='flex px-3  items-start h-full  w-full flex-col '>
                  <h2 className='text-lg font-semibold  my-4 mt-5'>Export</h2>



                  <div className='flex flex-col items-start justify-center gap-2'>

                    <button onClick={downloadSrtFile} className=' w-full hover:bg-bg-hover-color hover:text-black rounded-md p-4'>
                      <span className='flex items-center   gap-2 '>
                        <LuSubtitles size={25} />
                        Download SRT
                      </span>

                    </button>

                    <span onClick={() => setShowDeleteModal(true)} className='hover:bg-bg-hover-color hover:text-black rounded-md w-full p-4 flex items-center gap-3 cursor-pointer mb-2'>
                      <RiDeleteBin6Line size={25} /> Delete File
                    </span>

                  </div>



                </div>

              </div>
            </div>
            {
              showDeleteModal && <DeleteModal deleteTranscript={deleteTranscription} setShowDeleteModal={setShowDeleteModal} filename={dbTranscript.audioFilename} />
            }

            <div className='w-full bg-bg-navy-blue p-5 items-center  mt-20 flex flex-col  gap-2 rounded-md'>
              <p className='text-center font-semibold  font-poppins'> {dbTranscript.audioFilename} </p>
              {
                dbTranscript && <div className='w-full flex items-center justify-center self-end'>

                  <CustomAudioPlayer calculateHighlightedIndex={calculateHighlightedIndex} audioUrl={dbTranscript.audio_url} />
                </div>
              }



            </div>



          </div>
        </div>
      </div>
    </>
  )
}

export default ViewSyncFiles
