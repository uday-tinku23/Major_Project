import './Register.css';
import logo from './assets/logo.png';
import former from './assets/former.jpg';
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { auth, googleProvider } from './firebase';
import { signInWithPopup } from "firebase/auth";
import { useFormikContext } from 'formik';

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .required('**Required'),
  email: Yup.string().email('**Invalid email').required('**Required'),
  password: Yup.string()
    .min(6, '**Password must be at least 6 characters')
    .required('**Required'),
  conform: Yup.string()
    .oneOf([Yup.ref('password'), null], '**Passwords must match')
    .required('**Required'),
  checkbox: Yup.boolean()
    .oneOf([true], '**You must accept the terms and conditions')
    .required('**Required')
});

const getFirebaseErrorMessage = (error) => {
  if (error.code) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      default:
        return error.message;
    }
  }
  return error.message || 'Registration failed.';
};

const GoogleFillEmailButton = ({ setError, setIsLoading }) => {
  const { setFieldValue } = useFormikContext();
  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setFieldValue('email', result.user.email);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <button
      type="button"
      className="google-btn"
      onClick={handleGoogleSignIn}
      style={{
        width: '100%',
        marginBottom: '16px',
        background: '#fff',
        color: '#195030',
        border: '1px solid #195030',
        borderRadius: '12px',
        padding: '12px 0',
        fontWeight: 600,
        fontSize: '1.05rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        cursor: 'pointer'
      }}
    >
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: 22, height: 22 }} />
      Continue with Google
    </button>
  );
};

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const acceptTerms = searchParams.get('acceptTerms') === 'true';

  // Use a state to control initial checkbox value
  const [initialCheckbox, setInitialCheckbox] = useState(false);
  useEffect(() => {
    if (acceptTerms) setInitialCheckbox(true);
  }, [acceptTerms]);

  const [showVerifyMsg, setShowVerifyMsg] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [verifiedName, setVerifiedName] = useState('');
  const navigate = useNavigate();
  const [verifyError, setVerifyError] = useState('');

  const handleEmailSignUp = async (values, { resetForm }) => {
    setIsLoading(true);
    setError('');
    try {
      // Instead of creating the Firebase user here, navigate to crop selection with credentials
      setIsLoading(false);
      navigate(`/select-crop?email=${encodeURIComponent(values.email)}&name=${encodeURIComponent(values.name)}&password=${encodeURIComponent(values.password)}`);
      resetForm();
    } catch (err) {
      setError('Failed to proceed to crop selection.');
      setIsLoading(false);
    }
  };

  const handleVerifyClick = async () => {
    setVerifyError('');
    if (auth.currentUser) {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        navigate(`/select-crop?email=${encodeURIComponent(verifiedEmail)}&name=${encodeURIComponent(verifiedName)}`);
      } else {
        setVerifyError('Your email is not verified yet. Please check your inbox and click the verification link.');
      }
    } else {
      setVerifyError('No user found. Please register again.');
    }
  };

  return (
    <>
      {showVerifyMsg ? (
        <div className="registerPage">
          <div className="registerBox">
            <img src={logo} id='logo' alt='logo'></img>
            <h2 id='heading'>Verify Your Email</h2>
            <div className="divider"><span>Check your inbox</span></div>
            <div className="error-message" style={{color:'#195030',background:'#e8f5e9',border:'1px solid #c8e6c9'}}>
              A verification email has been sent to your email address.<br />
              Please verify your email before continuing.
            </div>
            {verifyError && (
              <div className="error-message" style={{marginTop: 8}}>{verifyError}</div>
            )}
            <button id="signup" type="button" style={{width:'100%',marginTop:12}} onClick={handleVerifyClick}>I've Verified My Email</button>
          </div>
          <div className="bg-img"></div>
        </div>
      ) : (
        <Formik
          enableReinitialize
          initialValues={{
            name: '',
            email: '',
            password: '',
            conform: '',
            checkbox: initialCheckbox,
          }}
          validationSchema={SignupSchema}
          onSubmit={handleEmailSignUp}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="registerPage">
                <div className="registerBox">
                  <img src={logo} id='logo' alt='logo'></img>
                  <GoogleFillEmailButton setError={setError} setIsLoading={setIsLoading} />
                  <h2 id='heading'>Get Started Now</h2>

                  <div className="divider">
                    <span>Register with Email</span>
                  </div>

                  {error && <div className="error-message">{error}</div>}

                  <div className="inputContainer">
                    <div className="input">
                      <label htmlFor='name'>Name</label>
                      {errors.name && touched.name ? (
                        <span className='validation'>{errors.name}</span>
                      ) : null}
                      <Field
                        id='name'
                        placeholder='Enter your Name'
                        name='name'
                      ></Field>
                    </div>

                    <div className="input">
                      <label htmlFor='email'>Email address</label>
                      {errors.email && touched.email ? (
                        <span className='validation'>{errors.email}</span>
                      ) : null}
                      <Field
                        id='email'
                        placeholder='Enter your email address'
                        name='email'
                      ></Field>
                    </div>
                    
                    <div className="input">
                      <label htmlFor='password'>Password</label>
                      {errors.password && touched.password ? (
                        <span className='validation'>{errors.password}</span>
                      ) : null}
                      <div className="password-container" style={{ display: 'flex' }}>
                        <Field
                          id='password'
                          type={showPassword ? 'text' : 'password'}
                          placeholder='Create a password'
                          name='password'
                        ></Field>
                        <div
                          className="eyeIcon"
                          onClick={() => {
                            setShowPassword(!showPassword)
                          }}
                        >
                          {!showPassword && <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px' }} viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" /></svg>}
                          {showPassword && <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px' }} viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" /></svg>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="input">
                      <label htmlFor='conform'>Confirm password</label>
                      {errors.conform && touched.conform ? (
                        <span className='validation'>{errors.conform}</span>
                      ) : null}
                      <Field
                        id='conform'
                        type='password'
                        placeholder='Confirm your password'
                        name='conform'
                      ></Field>
                    </div>
                    
                    <div className="checkbox-container">
                      <Field
                        type="checkbox"
                        id="terms"
                        name='checkbox'
                      />
                      <label htmlFor="terms">
                        I agree to the{' '}
                        <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#195030', textDecoration: 'underline', fontWeight: 600 }}>
                          Terms and Conditions
                        </a>
                      </label>
                    </div>
                    {errors.checkbox && touched.checkbox ? (
                      <span className='validation'>{errors.checkbox}</span>
                    ) : null}

                    <button id='signup' type='submit' disabled={isLoading}>
                      {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                  </div>
                </div>
                <div className="bg-img">
                  <img src={former} id="bgimg" alt="farmer background" />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </>
  )
} 