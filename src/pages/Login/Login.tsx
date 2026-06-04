import { memo, useState } from 'react'
import { Mail, Lock, EyeOff, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { axiosRequest, saveToken, saveRefreshToken } from '../../utils/token';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';

const Login = memo(() => {
  const [role, setRole] = useState<'Candidate' | 'Organization'>('Candidate')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const {data} = await axiosRequest.post('/api/Auth/login', values);
        console.log("Login Response:", data);
        const token = data?.data?.token || data?.accessToken || data?.access_token || data?.token || (typeof data === 'string' ? data : null);
        const refreshToken = data?.data?.refreshToken || data?.refreshToken;
        if (token) {
          saveToken(token);
          if (refreshToken) saveRefreshToken(refreshToken);
          toast.success("Login successful!");
          
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.role === 'Candidate') {
              navigate('/candidate');
            } else {
              navigate('/');
            }
          } catch(e) {
            if (role === 'Candidate') {
              navigate('/candidate');
            } else {
              navigate('/');
            }
          }
        } else {
          toast.error("Login successful, but no token received.");
        }
      } catch (error: unknown) {
        console.error("Login Error:", error);
        const errorMsg = error.response?.data?.message || error.response?.data?.error || "Invalid email or password";
        toast.error(errorMsg);
        formik.setFieldError('email', errorMsg);
        formik.setFieldError('password', errorMsg);
      }
    },
  });

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] h-[100vh] flex flex-col relative overflow-hidden font-sans">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDtrh9WwFYeTeD10QFK7A1ior4iyIDicktc3nS6fXB5h8J9yQN9TzYKmU_Uewm0OdS8wZO2J2ZDzuA5SoEh4iiQBTMQIWg2mc72JoNYSI_YGet9p2TLDcxqmhMjQJUBij3RyuoeUV4BHTyM3-yJ3Bv-XLc8gvEB2tlOSGi1GQ8XX102S9tiwCPgoBSYmW8NEXuJ9VwCsvFkaMdVG5fq7SzZUJGClaJYNnmRioPDDkT97kIiGmaQIPKO0VDPbRSKyF7NdHcFY1D-kCw')" }}
      >
        <div className="absolute inset-0 bg-[#f8f9ff]/70 backdrop-blur-sm mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8f9ff]/90 via-[#f8f9ff]/60 to-[#f8f9ff]/90"></div>
      </div>

      <main className="flex-grow flex items-center justify-center p-[16px] md:p-[32px] relative z-10 w-[100%] h-[100%]">
        <div className="w-[100%] max-w-[480px]">
          <div className="text-center mb-[32px]">
            <h1 className="text-[24px] leading-[32px] font-[600] text-[#00288e]">ai-job</h1>
          </div>

          <div className="bg-[rgba(255,255,255,0.85)] backdrop-blur-[12px] border-[1px] border-[rgba(196,197,213,0.5)] rounded-[12px] shadow-lg p-[32px]">
            <div className="flex p-[4px] bg-[#d3e4fe] rounded-[8px] mb-[32px] relative">
              <div 
                className="absolute top-[4px] bottom-[4px] w-[calc(50%-4px)] bg-[#f8f9ff] rounded-[4px] shadow-sm transition-transform duration-300 ease-in-out pointer-events-none"
                style={{ transform: role === 'Candidate' ? 'translateX(0)' : 'translateX(100%)' }}
              ></div>
              
              <button 
                type="button"
                onClick={() => setRole('Candidate')}
                className={`flex-1 py-[8px] text-center text-[12px] leading-[16px] font-[600] tracking-[0.05em] relative z-10 transition-colors duration-200 ${role === 'Candidate' ? 'text-[#00288e]' : 'text-[#444653]'}`}
              >
                Candidate
              </button>
              
              <button 
                type="button"
                onClick={() => setRole('Organization')}
                className={`flex-1 py-[8px] text-center text-[12px] leading-[16px] font-[600] tracking-[0.05em] relative z-10 transition-colors duration-200 ${role === 'Organization' ? 'text-[#00288e]' : 'text-[#444653]'}`}
              >
                Organization
              </button>
            </div>

            <div className="mb-[32px]">
              <h2 className="text-[28px] md:text-[32px] leading-[36px] md:leading-[40px] font-[600] text-[#0b1c30] mb-[8px]">Welcome Back</h2>
              <p className="text-[14px] leading-[20px] font-[400] text-[#444653]">Log in to continue to your dashboard.</p>
            </div>

            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-[24px]">
              <div>
                <label htmlFor="email" className="block text-[12px] leading-[16px] font-[600] tracking-[0.05em] text-[#0b1c30] mb-[4px]">Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-[12px] flex items-center pointer-events-none text-[#444653]">
                    <Mail className="w-[20px] h-[20px]" />
                  </span>
                  <input 
                    type="email" 
                    id="email" 
                    {...formik.getFieldProps('email')}
                    placeholder="name@example.com" 
                    className={`block w-[100%] h-[48px] pl-[40px] pr-[12px] rounded-[8px] border-[1px] ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-[#c4c5d5]'} bg-[#f8f9ff] text-[14px] leading-[20px] focus:border-[#00288e] focus:ring-[2px] focus:ring-[#00288e]/20 transition-all placeholder:text-[#757684]`}
                  />
                </div>
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-[12px] leading-[16px] mt-[4px]">{formik.errors.email}</div>
                ) : null}
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-[4px]">
                  <label htmlFor="password" className="block text-[12px] leading-[16px] font-[600] tracking-[0.05em] text-[#0b1c30]">Password</label>
                  <button type='button'  onClick={() => navigate('/forgot-password')} className="text-[12px] leading-[16px] font-[600] tracking-[0.05em] text-[#00288e] hover:text-[#1e40af] transition-colors">Forgot password?</button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-[12px] flex items-center pointer-events-none text-[#444653]">
                    <Lock className="w-[20px] h-[20px]" />
                  </span>
                  <input 
                    type={showPassword ? "text" : "password"}
                    id="password" 
                    {...formik.getFieldProps('password')}
                    placeholder="••••••••" 
                    className={`block w-[100%] h-[48px] pl-[40px] pr-[40px] rounded-[8px] border-[1px] ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-[#c4c5d5]'} bg-[#f8f9ff] text-[14px] leading-[20px] focus:border-[#00288e] focus:ring-[2px] focus:ring-[#00288e]/20 transition-all placeholder:text-[#757684]`}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-[12px] flex items-center text-[#444653] hover:text-[#0b1c30] focus:outline-none"
                  >
                    {showPassword ? <Eye className="w-[20px] h-[20px]" /> : <EyeOff className="w-[20px] h-[20px]" />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-500 text-[12px] leading-[16px] mt-[4px]">{formik.errors.password}</div>
                ) : null}
              </div>

              <button 
                type="submit" 
                disabled={formik.isSubmitting}
                className="w-[100%] flex justify-center py-[12px] px-[16px] border-[1px] border-transparent rounded-[8px] shadow-sm text-[12px] leading-[16px] font-[600] tracking-[0.05em] text-[#ffffff] bg-[#00288e] hover:bg-[#001c66] focus:outline-none focus:ring-[2px] focus:ring-offset-[2px] focus:ring-[#00288e] transition-colors disabled:opacity-70"
              >
                {formik.isSubmitting ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <div className="mt-[32px]">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-[100%] border-t-[1px] border-[#c4c5d5]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-[8px] bg-[#ffffff] text-[#444653] text-[12px] leading-[16px] font-[600] tracking-[0.05em]">Or continue with</span>
                </div>
              </div>

              <div className="mt-[24px] grid grid-cols-2 gap-[12px]">
                <button type="button" className="w-[100%] inline-flex justify-center items-center h-[40px] px-[16px] border-[1px] border-[#c4c5d5] rounded-[8px] shadow-sm bg-[#f8f9ff] text-[14px] leading-[20px] text-[#0b1c30] hover:bg-[#eff4ff] transition-colors gap-[8px]">
                  <svg className="w-[20px] h-[20px]" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                  </svg>
                  Google
                </button>
                <button type="button" className="w-[100%] inline-flex justify-center items-center h-[40px] px-[16px] border-[1px] border-[#c4c5d5] rounded-[8px] shadow-sm bg-[#f8f9ff] text-[14px] leading-[20px] text-[#0b1c30] hover:bg-[#eff4ff] transition-colors gap-[8px]">
                  <svg aria-hidden="true" className="w-[20px] h-[20px] text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                  LinkedIn
                </button>
              </div>
            </div>

            <p className="mt-[32px] text-center text-[14px] leading-[20px] text-[#444653]">
              Don't have an account? <button  onClick={()=> navigate("/register")} className="text-[#00288e] hover:text-[#1e40af] font-[500] transition-colors">Register</button>
            </p>
          </div>
        </div>
      </main>

      <footer className="w-[100%] py-[24px] text-center text-[12px] leading-[16px] font-[600] tracking-[0.05em] text-[#444653] relative z-10 bg-[#ffffff]/50 backdrop-blur-md border-t-[1px] border-[#c4c5d5]/30">
        <p>© 2026 ai-job. Precision Recruitment Powered by AI.</p>
      </footer>
    </div>
  )
})

export default Login
