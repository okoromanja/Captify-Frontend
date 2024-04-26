import React from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { MdOutlineCloudUpload } from "react-icons/md";
import { MdClose } from "react-icons/md";
import { MdCloudUpload, MdDelete } from "react-icons/md"
import { AiFillFileImage } from "react-icons/ai"
import { useState, useRef, useEffect } from 'react'
import Sidebar from '../../layout/Sidebar';
import axios from "axios"
import { GrSync } from "react-icons/gr";
import { BsDatabaseDown } from "react-icons/bs";
import { LuUploadCloud } from "react-icons/lu";
import Transcripted from '../../components/SyncAI/Transcripted';
import { FiFileText } from "react-icons/fi";
import { LuFileAudio } from "react-icons/lu";




const SyncAiPage = () => {

    const [file, setFile] = useState({
        audio: null,
        transcript: null
        // Add more keys if needed for other types of files
    });
    const [progress, setProgress] = useState({
        audio: 0,
        transcript: 0
    });
    const [cloudUrl, setCloudUrl] = useState({
        audio: "",
        transcript: ""
        // Add more keys if needed for other types of files
    });
    const [filename, setFileName] = useState("No File Selected")


    const [showFormModal, setShowFormModal] = useState(false);

    const [isUploadAudio, setIsUploadAudio] = useState(false);
    const [isUploadTranscript, setIsUploadTranscript] = useState(false);
    const [data, setData] = useState(false)
    const [initialData, setInitialData] = useState("")
    const [processing, setProcessing] = useState(false)




    const cloudinaryBaseUrl = "https://api.cloudinary.com/v1_1/dgpwe8xy6";


    const handleInputClick = () => {
        document.querySelector(".input-field").click()
    }
    const handleInputClick2 = () => {
        document.querySelector(".input-field-2").click()
    }

    const handleFileChange = async (event, stateKey) => {
        if (stateKey === 'audio') {
            setIsUploadAudio(true);
        } else if (stateKey === 'transcript') {
            setIsUploadTranscript(true);
        }


        const selectedFile = event.target.files[0];

        console.log("selectedFile", selectedFile)
        setFile((prevFiles) => ({
            ...prevFiles,
            [stateKey]: selectedFile
        }))

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("upload_preset", "xguxdutu");
            formData.append("cloud_name", "dgpwe8xy6");
            formData.append("folder", "Audio");
            formData.append("quality", "auto:good");

            const cloudinaryResponse = await axios.post(
                `${cloudinaryBaseUrl}/upload`,
                formData,
                {
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        setProgress(prevProgress => ({
                            ...prevProgress,
                            [stateKey]: progress
                        }));
                        console.log(`Upload Progress for ${stateKey} file: ${progress}%`);
                    }
                }
            );

            const cloudinaryFileUrl = cloudinaryResponse.data.secure_url;

            setCloudUrl((prevUrls) => ({
                ...prevUrls,
                [stateKey]: cloudinaryFileUrl
            }));
        } catch (error) {
            console.error(`Error in uploading ${stateKey} file`, error);
        }


        // Finish file upload process
        if (stateKey === 'audio') {
            setIsUploadAudio(false);
        } else if (stateKey === 'transcript') {
            setIsUploadTranscript(false);
        }
    };





    const hanldeSync = async () => {
        setProcessing(true)
       
        try {
            const requestBody = {
                source_config: {
                    url: cloudUrl.audio
                },

                source_transcript_config: {
                    url: cloudUrl.transcript
                },
                metaData: "This is forced alignment test"
            }

            console.log("requestBody", requestBody)


            const firstStepRes = await fetch(`${import.meta.env.VITE_HOST_URL}/sync/submit-alignment-job`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    audioUrl: cloudUrl.audio,
                    transcriptUrl: cloudUrl.transcript
                })
            });


            const responseData = await firstStepRes.json();
            setInitialData(responseData)
            setShowFormModal(false)
           
            console.log("Alignment job submitted successfully:", responseData.id);

            const timeOut = await new Promise(resolve => setTimeout(resolve, 50000))
            console.log("Process in  ", timeOut)



            const secondStepRes = await fetch(`${import.meta.env.VITE_HOST_URL}/sync/submit-alignment-job-second`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: responseData.id
                })
            });
            const responseDataSecond = await secondStepRes.json();

            console.log("responseDataSecond", responseDataSecond)



            const thirdStepRes = await fetch(`${import.meta.env.VITE_HOST_URL}/sync/submit-alignment-job-third`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: responseData.id
                })
            });
            const responseDatathird = await thirdStepRes.json();
            setData(responseDatathird)
            console.log("responseDataSecond", responseDatathird.monologues)
            setProcessing(false)



        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                console.error('Server responded with status:', error.response.status);
                console.error('Response data:', error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error:', error.message);
            }
        }
       
        
    }

    // console.log("File selected audio", file.audio.name)
    console.log("Cloudurl ", cloudUrl)
    console.log(data.monologues
    )




    console.log("file", file)




    return (
        <>
            <div className='w-full min-h-screen'>

                <div className='flex w-full'>

                    <Sidebar />

                    {
                        !initialData ? <div className='flex flex-col w-full py-5 px-10 bg-[#F7F7F7] min-h-screen overflow-x-hidden '>


                            <div className='   rounded-md flex items-center flex-col  min-h-screen py-5 gap-5'>


                                <div className='border min-h-80 md:w-full shadow-md p-5 flex flex-col  gap-8 h-[300px] bg-white'>
                                    <span className='flex flex-row items-center gap-2 py-5'>
                                        <RxDashboard className='text-3xl' />
                                        <h1 className='text-3xl font-bold font-poppins text-text-black'> Recent Files</h1>
                                    </span>

                                    <h1 className='text-2xl text-center font-roboto text-text-gray-other'>Welcome to Captify!</h1>

                                    <div className='flex items-center justify-center'>

                                        <button onClick={() => setShowFormModal(!showFormModal)} className='text-center px-5 py-4 w-2/5 h-20
rounded-md bg-bg-blue text-white text-xl font-medium font-roboto hover:bg-blue-500 '><span className='flex items-center text-center justify-center gap-2'>
                                                <GrSync size={20} /> <p>Resyncing Ai</p>
                                            </span></button>
                                    </div>

                                </div>

                            </div>


                        </div> :
                            <Transcripted processing={processing} data={data} setData={setData} cloudUrl={cloudUrl} file={file} showFormModal={showFormModal} setShowFormModal={setShowFormModal} />
                    }

                </div>



            </div>




            {showFormModal && (
                <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50 ">


                    <div className=" flex items-center flex-col bg-white min-h-[500px] max-h-[600px] p-5 rounded-lg  md:w-[700px] gap-5">

                        <div className='w-full justify-between  flex flex-row  px-5   py-5'>


                            <span className='flex flex-1  flex-row items-center justify-center gap-2'>
                                <MdOutlineCloudUpload className='text-2xl' />
                                <h1 className='text-2xl font-bold font-poppins text-text-black'> Upload Files</h1>
                            </span>
                            <div className='ml-auto'>

                                <MdClose onClick={() => setShowFormModal(!showFormModal)} className='text-end w-10 h-10 cursor-pointer hover:bg-gray-300 p-2 rounded-full ' size={25} />
                            </div>

                        </div>



                        <div className='flex w-full p-5 flex-row items-center justify-center gap-5'>

                            {/* 1st Form */}
                            <form onClick={handleInputClick} className='flex flex-col items-center justify-center    h-36   cursor-pointer rounded-md md:w-[400px] w-44 mb-10 bg-offWhite'>
                                {
                                    !file.audio && <div className='flex flex-col items-center gap-1 py-3 px-2'>
                                        <h1 className='text-xl py-1 text-text-black font-medium font-roboto text-center'>Upload Audio file</h1>
                                        <LuFileAudio color='#1475cf' size={30} />
                                    </div>
                                }

                                {
                                    cloudUrl.audio && <section className='mx-2  flex flex-col justify-between items-center px-4 py-5 rounded-md gap-2'>

                                        <span className='flex items-center gap-2'>
                                            <AiFillFileImage color='#1475cf' />
                                            {file.audio.name}
                                            <MdDelete className='hover:z-50' cursor="pointer"

                                            />
                                        </span>

                                        <img className='w-6 h-6 my-3' src="/checked.png" alt="img" />
                                    </section>
                                }

                                {
                                    isUploadAudio && <div className='flex  items-center flex-col'>

                                        <p className='py-1'>{file.audio.name}</p>
                                        <p className='py-1'>{`${progress.audio}%`}</p>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                                        </div>
                                    </div>

                                }
                                <div className='py-2'>
                                    <input
                                        accept='.m4a, .mp3 , .mp4, .mov, .wav, .ogg, .wmv, .mpeg, .wma,'
                                        onChange={(event) => handleFileChange(event, 'audio')}
                                        className='input-field'
                                        type="file"
                                        hidden
                                    />
                                </div>

                            </form>

                            {/* <p className='text-center text-lg text-gray-500'>Or</p> */}
                            {/* 2nd Form */}



                            <form onClick={handleInputClick2} className='flex flex-col items-center justify-center    h-36   cursor-pointer rounded-md md:w-[400px] w-44 mb-10 bg-offWhite'>
                                {
                                    !file.transcript && <div className='flex flex-col items-center gap-1 py-3 px-2'>
                                        <h1 className='text-xl py-1 text-text-black font-medium font-roboto text-center'>Upload Text File</h1>
                                        <FiFileText color='#1475cf' size={30} />
                                    </div>
                                }

                                {
                                    cloudUrl.transcript && <section className='mx-2  flex flex-col justify-between items-center px-4 py-5 rounded-md gap-2'>

                                        <span className='flex items-center gap-2'>
                                            <AiFillFileImage color='#1475cf' />
                                            {file.transcript.name}
                                            <MdDelete className='hover:z-50' cursor="pointer"
                                                onClick={() => {
                                                    setFileName("No Selected Files")
                                                    setFile(null)
                                                }}
                                            />
                                        </span>

                                        <img className='w-6 h-6 my-3' src="/checked.png" alt="img" />
                                    </section>
                                }

                                {
                                    isUploadTranscript && <div className='flex  items-center flex-col'>

                                        <p className='py-1'>{file && file.transcript.name}</p>
                                        <p className='py-1'>{`${progress.transcript}%`}</p>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                                        </div>
                                    </div>

                                }
                                <div className='py-2'>
                                    <input
                                        accept=' .pdf ,.txt,'
                                        onChange={(event) => handleFileChange(event, 'transcript')}
                                        className='input-field-2'
                                        type="file"
                                        hidden
                                    />
                                </div>

                            </form>




                        </div>
                        <button disabled={isUploadAudio && isUploadTranscript} onClick={hanldeSync} className='text-center px-5 py-4 w-full h-16
rounded-md bg-bg-blue text-white text-xl font-medium font-roboto hover:bg-blue-500 '><span className='flex items-center text-center justify-center gap-2'>
                                <GrSync size={25} /> <p>Resync </p>
                            </span></button>
                    </div>


                </div>
            )}
        </>
    )
}

export default SyncAiPage
