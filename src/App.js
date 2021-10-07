import {
  GoogleAuthProvider, GithubAuthProvider, getAuth, signInWithPopup, signOut, createUserWithEmailAndPassword
} from "firebase/auth";
import { useState } from "react";
import './App.css';
import initializeAuthentication from './Firebase/firebase.init';
initializeAuthentication();
const googleProvider = new GoogleAuthProvider();
initializeAuthentication();
const gitHubProvider = new GithubAuthProvider();
function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [user, setUser] = useState({})
  const [isLogin, setIsLogin] = useState(false);
  const auth = getAuth()
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const { displayName, email, photoUrl } = result.user;
        const loggedInUser = {
          name: displayName,
          email: email,
          photo: photoUrl
        };
        setUser(loggedInUser);
      })
      .catch(error => {
        console.log(error.message);
      })
  }

  const handleGithubSignIn = () => {
    signInWithPopup(auth, gitHubProvider)
      .then(result => {
        const { displayName, photoUrl, email } = result.user;
        const loggedInUser = {
          name: displayName,
          email: email,
          photo: photoUrl
        }
        setUser(loggedInUser);
      })
      .catch(error => {
        console.log(error.message);
      })
  }
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser({});
      })
  }
  const toggleLogin = e => {
    setIsLogin(e.target.checked);
  }
  const handleEmailChange = e => {
    setEmail(e.target.value);
  }
  const handlePasswordChange = e => {
    setPassword(e.target.value);
  }
  const handleRegistration = e => {
    e.preventDefault();
    console.log(email, password);
    if (password.length < 6) {
      setError('Password Must be at least 6 charecters long.')
      return;
    }
    // if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
    //   setError('Password Must Contain 2 UperCase')
    //   return;
    // }
    //   isLogin ? proccessLogin(email, password) : creatNewUser(email, password);

    // }
    if (isLogin) {
      proccessLogin(email, password);
    }
    else {
      creatNewUser(email, password);
    }
    const proccessLogin = (email, password) => {
      signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
        })
        .catch(error => {
          setError(error.message);
        })
    }
    const creatNewUser = (email, password) => {
      createUserWithEmailAndPassword = (auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
          setError('');
        })
        .catch(error => {
          setError(error.message);

        })
    }
    return (
      <div>
        {!user.name ?
          <div className="mx-5">
            <h2>Please{isLogin ? 'Login' : 'Register'}</h2>
            <form onSubmit={handleRegistration}>
              <div className="row mb-3">
                <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
                <div className="col-sm-10">
                  <input onChange={handleEmailChange} type="email" className="form-control" id="inputEmail3" />
                </div>
              </div>
              <div className="row mb-3">
                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
                <div className="col-sm-10">
                  <input onChange={handlePasswordChange} type="password" className="form-control" id="inputPassword3" />
                </div>
              </div>
              <div className="mb-3 form-check">
                <input onChange={toggleLogin} type="checkbox" className="form-check-input" id="exampleCheck1" />
                <label className="form-check-label" htmlFor="exampleCheck1">Already Registered?</label>
              </div>
              <div className="row mb-3">{error}</div>
              <button type="submit" className="btn btn-primary">Please{isLogin ? 'Login' : 'Register'}</button>
            </form>
            <br />
            <br />
            <br />





            <button onClick={handleGoogleSignIn}>Google Sign IN</button>
            <button onClick={handleGithubSignIn}>Github Sign In</button>
          </div> :
          <button onClick={handleSignOut}>Sign Out</button>}

        <br />
        {
          user.email && <div>
            <h2>welcome:{user.name}</h2>
            <p>i know ur email:{user.email}</p>
            <img src={user.photo} alt="" />
          </div>
        }
      </div>
    )
    export default App
