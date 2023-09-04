import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { actionType } from '../context/reducer';
import { useStateValue } from '../context/StateProvider';
import { app } from '../firebase.config';
import { RxCross2 } from 'react-icons/rx';

export default function Login({ closeModal }) {
  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const [isMenu, setIsMenu] = useState(false);
  const [{ user }, dispatch] = useStateValue();

  const login = async () => {
    if (!user) {
      const {
        user: { refreshToken, providerData },
      } = await signInWithPopup(firebaseAuth, provider);
      dispatch({
        type: actionType.SET_USER,
        user: providerData[0],
      });
      localStorage.setItem("user", JSON.stringify(providerData[0]));
      closeModal();
    } else {
      setIsMenu(!isMenu);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
        <div className="bg-white rounded-lg p-8 relative flex flex-col items-center">
          <RxCross2
            size={30}
            className="absolute right-3 z-50 cursor-pointer"
            onClick={closeModal}
          />
          {/* <h2 className="text-xl font-bold mb-4">Please login</h2>
          {message && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              {message}
            </div>
          )}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-200 rounded-lg py-2 px-4 mb-4"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
            onClick={handleLoginWithEmail}
          >
            Login with Email
          </button> */}
          <h2 className="text-xl font-bold mt-10 mb-4">Login with Google</h2>
          <div className=" block md:flex items-center">
            <button
              className="border-2 border-blue-500 hover:bg-blue-700 text-blue-700 hover:text-white font-bold py-2 px-4 rounded flex items-center"
              onClick={login}
            >
              <FcGoogle size={30} className='mr-2' /> Login with Goggle
            </button>
            {/* <button
          className="ml-4 text-gray-600 hover:text-gray-800 font-bold py-2 px-4 rounded"
          onClick={closeModal}
        >
          Cancel
        </button> */}
          </div>
        </div>
      </div>
    </>
  )
}
