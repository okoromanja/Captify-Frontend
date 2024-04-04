import React from 'react'
import UserProfileLayout from './UserProfileLayout'
import { useUserAuth } from '../../context/UserAuthContext'
import { useState } from 'react'
import { reauthenticateWithCredential, updatePassword, updateProfile, } from 'firebase/auth';
import { auth } from '../../firebase';
import { EmailAuthProvider } from 'firebase/auth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const UserSecurity = () => {


    const { user, logOut } = useUserAuth();
    const [password, setPassword] = useState(user.password || ""); // You can add a password field here for updating the password


    const [previousPassword, setPreviousPassword] = useState("")
    const navigate = useNavigate();

    // Function to update password

    const handleUpdatePassword = async () => {
        try {
            // Ensure that the user is authenticated
            if (user) {
                // Check if the previous password is correct
              const credential = EmailAuthProvider.credential(user.email, previousPassword)

                try {
                    await reauthenticateWithCredential(user, credential);
                } catch (reauthError) {
                    toast.error("Please provide correct credentials");
                    return;
                }

                // If the previous password is correct, update the profile and password

                if (password) {
                    await updatePassword(auth.currentUser, password);
                }

                // Display a success message
                toast.success("Password updated successfully!");
                await logOut()
                navigate("/login")

            } else {
                // Handle the case where the user is not authenticated
                alert("User is not authenticated. Please log in.");
            }
        } catch (error) {
            // Handle any errors here
            alert("An error occurred while updating the profile: " + error.message);
        }

    }
    return (
        <UserProfileLayout>


            <div className='w-2/3 h-[400px] flex border p-5 bg-white rounded-md'>

                <div className='w-2/3 flex flex-col gap-4'>
                    <h2 className='text-xl font-medium py-3'>Pssword Reset</h2>

                    <span className='w-full flex justify-between items-center p-2'>
                        <label className='text-sm' htmlFor="name">Old Password</label>
                        <input value={previousPassword} onChange={(e) => setPreviousPassword(e.target.value)} type="text" className='px-3 py-2 w-2/3  border-gray-500 border  rounded-sm outline-none' />
                    </span>

                    <span className='w-full flex justify-between items-center p-2'>

                        <label className='text-sm' htmlFor="email">New Password</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="text" className=
                            'px-3 py-2 w-2/3  border-gray-500 border  rounded-sm outline-none' />

                    </span>
                    <span className='flex justify-end'>
                        <a href='/forgetPassword' className='hover:underline cursor-pointer'>Forget password?</a>
                    </span>

                    <div className='flex items-center  py-4'>
                        <button onClickCapture={handleUpdatePassword} className='px-5 w-2/5 py-3 bg-bg-blue text-white rounded-3xl hover:bg-blue-600'>Update Password</button>
                    </div>

                </div>

            </div>


        </UserProfileLayout>
    )
}

export default UserSecurity