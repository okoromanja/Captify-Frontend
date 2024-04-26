import { useState } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import RootLayout from "./layout/RootLayout";
import BotApi from "./pages/Bot";
import RealTimeTranscriptions from "./components/RealTimeTranscriptions";

import Signup from "./pages/Signup";
import Login from "./pages/Login";

import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { UserAuthContextProvider } from "./context/UserAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgetPassword from "./SmallComponents/ForgetPassword";
import { EmailAuthCredential } from "firebase/auth";
import EmailVerification from "./SmallComponents/EmailVerification";
import Pricing from "./pages/Other/Pricing";
import Success from "../src/SmallComponents/Success"
import Cancel from "../src/SmallComponents/Cancel"
import PlanDetails from "./components/pricing/PlanDetails";
import PreAudioTranscriptions from "./pages/Other/PreAudioTranscriptions";
import UserProfilePage from "./pages/Other/UserProfilePage";
import UserSecurity from "./components/SideComponents/UserSecurity";
import UserPaymentInfo from "./components/SideComponents/UserPaymentInfo"
import ViewTranscriptions from "./components/PreAudio/ViewTranscriptions";
import SyncAiPage from "./pages/Other/SyncAiPage";
import ViewSyncFiles from "./components/SyncAI/ViewSyncFiles";



function App() {


  return (
    <>

      <UserAuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/home" element={

              <ProtectedRoute>
                <RootLayout />
              </ProtectedRoute>

            } />
            <Route exact path="/transcription" element={

              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }

            />
            <Route exact path="/realtimetranscriptions" element={

              <ProtectedRoute>
                <RealTimeTranscriptions />
              </ProtectedRoute>
            }

            />
            <Route exact path="/botapi" element={

              <ProtectedRoute>
                <BotApi />
              </ProtectedRoute>

            } />


            <Route exact path="/pricing" element={

              <ProtectedRoute>
                <Pricing />
              </ProtectedRoute>}

            />

            <Route exact path="/plandetails" element={

              <ProtectedRoute>
                <PlanDetails />
              </ProtectedRoute>}

            />
            <Route exact path="/pre-audio-transcriptions" element={

              <ProtectedRoute>
                <PreAudioTranscriptions />
              </ProtectedRoute>}

            />
            <Route exact path="/user-profile" element={

              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>}

            />
            <Route exact path="/user-security-setting" element={

              <ProtectedRoute>
                <UserSecurity />
              </ProtectedRoute>}

            />
            <Route exact path="/user-payment-info" element={

              <ProtectedRoute>
                <UserPaymentInfo />
              </ProtectedRoute>}

            />

            
            <Route exact path="/pre-audio-transcriptions/view/:id" element={

              <ProtectedRoute>
                <ViewTranscriptions />
              </ProtectedRoute>}

            />


            <Route exact path="/resyncingAi" element={

              <ProtectedRoute>
                <SyncAiPage />
              </ProtectedRoute>}

            />

            <Route exact path="/resyncingAi/view-sync-file" element={

              <ProtectedRoute>
                <ViewSyncFiles />
              </ProtectedRoute>}

            />

            


           

            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/forgetPassword" element={<ForgetPassword />} />
            <Route exact path="/emailverification" element={<EmailVerification />} />
            <Route exact path="/success" element={<Success />} />
            <Route exact path="/cancel" element={<Cancel />} />
          </Routes>
        </BrowserRouter>
        <div> <Toaster /></div>



      </UserAuthContextProvider>
    </>
  );
}

export default App;
