import { useFormik } from 'formik';
import { ArrowRight, Building, Eye, EyeOff, UserSearch } from 'lucide-react';
import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { axiosRequest, saveToken, saveRefreshToken } from '../../utils/token';
import { toast } from 'sonner';

const Register = memo(() => {
  const [role, setRole] = useState<'candidate' | 'company'>('candidate')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Full Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phoneNumber: Yup.string().required('Phone Number is required'),
      password: Yup.string().min(6, 'Must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          role: role === 'candidate' ? 'Candidate' : 'Organization'
        };
        const {data} = await axiosRequest.post('/api/Auth/register', payload);
        if (data?.data?.token || data?.token || data?.accessToken) {
          toast.success("Registration successful! Please log in.");
          navigate('/login');
        } else {
          toast.success("Registration successful! Please log in.");
          navigate('/login');
        }
      } catch (error) {
        console.error("Register Error:", error);
        toast.error("Registration failed. Please try again.");
      }
    },
  });

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-[100vh] flex flex-col relative overflow-hidden font-sans">
      
      <div className="absolute inset-0 z-0">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtHFMx9mcLrb0HM8175SUeHO-fXGa_ZfZa9dZ0UOgFiiGHqQogmGNE3QAmPYqZZu1M9b7_cfsRIG3V2i5OHDh32Ihio59pDfRf0LkmZYVDcx0ZuKdpF8BVQFfMzzrnhc4ahJwpbGDuqPPUz_xfMb2UnWYEf4_Ty6412SdoooqdPJfawcxCmHIZC3bSOu9sRgKukvKWfyoXq2mCi85rFUSqRjM59expIy2ee8t9TkNDCAEObvqRWDTei2X6-3e5nIvVETfWOuiasYk" 
          alt="" 
          className="w-[100%] h-[100%] object-cover opacity-[0.3] mix-blend-luminosity" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8f9ff]/90 to-[#e5eeff]/90"></div>
      </div>

      <main className="flex-grow flex items-center justify-center p-[16px] md:p-[32px] relative z-10 w-[100%] max-w-[1280px] mx-auto">
        
        <div className="bg-[rgba(255,255,255,0.85)] backdrop-blur-[12px] border-[1px] border-[rgba(255,255,255,0.3)] w-[100%] max-w-[500px] rounded-[12px] shadow-lg p-[32px] md:p-[40px] flex flex-col gap-[32px] transition-transform duration-300 hover:shadow-xl">
          
          <div className="text-center space-y-[8px]">
            <a href="/" className="inline-block text-[#00288e] text-[24px] leading-[32px] font-[600] mb-[16px]">ai-job</a>
            <h1 className="text-[28px] md:text-[32px] leading-[36px] md:leading-[40px] font-[600] text-[#0b1c30]">Create an Account</h1>
            <p className="text-[14px] leading-[20px] font-[400] text-[#444653]">Join the future of precision recruitment.</p>
          </div>

          <div className="grid grid-cols-2 gap-[16px]">
            <button 
              type="button"
              onClick={() => setRole('candidate')}
              className={`flex flex-col items-center justify-center p-[24px] rounded-[8px] border-[2px] transition-colors group relative overflow-hidden ${role === 'candidate' ? 'border-[#00288e] bg-[#00288e]/5' : 'border-[#c4c5d5] bg-[#f8f9ff] hover:border-[#00288e]/50 hover:bg-[#eff4ff]'}`}
            >
              <UserSearch className={`mb-[12px] w-[36px] h-[36px] transition-transform ${role === 'candidate' ? 'text-[#00288e] scale-[1.1]' : 'text-[#444653] group-hover:text-[#00288e]'}`} />
              <span className={`text-[20px] leading-[28px] font-[500] transition-colors ${role === 'candidate' ? 'text-[#00288e]' : 'text-[#0b1c30] group-hover:text-[#00288e]'}`}>Find a Job</span>
              <span className="text-[12px] leading-[16px] font-[600] tracking-[0.05em] text-[#444653] mt-[4px]">Candidate</span>
              {role === 'candidate' && (
                <div className="absolute top-[8px] right-[8px] w-[12px] h-[12px] bg-[#00288e] rounded-full"></div>
              )}
            </button>
            
            <button 
              type="button"
              onClick={() => setRole('company')}
              className={`flex flex-col items-center justify-center p-[24px] rounded-[8px] border-[2px] transition-colors group relative overflow-hidden ${role === 'company' ? 'border-[#00288e] bg-[#00288e]/5' : 'border-[#c4c5d5] bg-[#f8f9ff] hover:border-[#00288e]/50 hover:bg-[#eff4ff]'}`}
            >
              <Building className={`mb-[12px] w-[36px] h-[36px] transition-transform ${role === 'company' ? 'text-[#00288e] scale-[1.1]' : 'text-[#444653] group-hover:text-[#00288e]'}`} />
              <span className={`text-[20px] leading-[28px] font-[500] transition-colors ${role === 'company' ? 'text-[#00288e]' : 'text-[#0b1c30] group-hover:text-[#00288e]'}`}>Hire Talent</span>
              <span className="text-[12px] leading-[16px] font-[600] tracking-[0.05em] text-[#444653] mt-[4px]">Organization</span>
              {role === 'company' && (
                <div className="absolute top-[8px] right-[8px] w-[12px] h-[12px] bg-[#00288e] rounded-full"></div>
              )}
            </button>
          </div>

          <form className="flex flex-col gap-[20px]" onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-[4px]">
              <label htmlFor="fullName" className="text-[12px] leading-[16px] font-[600] tracking-[0.05em] text-[#0b1c30]">Full Name</label>
              <input 
                type="text" 
                id="fullName" 
                {...formik.getFieldProps('fullName')}
                placeholder="Jane Doe" 
                className={`w-[100%] h-[48px] px-[16px] rounded-[8px] bg-[#ffffff] border-[1px] ${formik.touched.fullName && formik.errors.fullName ? 'border-red-500' : 'border-[#c4c5d5]'} text-[#0b1c30] text-[16px] leading-[24px] focus:outline-none focus:border-[#00288e] focus:ring-[2px] focus:ring-[#00288e]/20 transition-all placeholder:text-[#757684]`} 
              />
              {formik.touched.fullName && formik.errors.fullName ? (
                <div className="text-red-500 text-[12px] leading-[16px] mt-[4px]">{formik.errors.fullName}</div>
              ) : null}
            </div>
            
            <div className="flex flex-col gap-[4px]">
              <label htmlFor="email" className="text-[12px] leading-[16px] font-[600] tracking-[0.05em] text-[#0b1c30]">Email</label>
              <input 
                type="email" 
                id="email" 
                {...formik.getFieldProps('email')}
                placeholder="jane@example.com" 
                className={`w-[100%] h-[48px] px-[16px] rounded-[8px] bg-[#ffffff] border-[1px] ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-[#c4c5d5]'} text-[#0b1c30] text-[16px] leading-[24px] focus:outline-none focus:border-[#00288e] focus:ring-[2px] focus:ring-[#00288e]/20 transition-all placeholder:text-[#757684]`} 
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-[12px] leading-[16px] mt-[4px]">{formik.errors.email}</div>
              ) : null}
            </div>

            <div className="flex flex-col gap-[4px]">
              <label htmlFor="phoneNumber" className="text-[12px] leading-[16px] font-[600] tracking-[0.05em] text-[#0b1c30]">Phone Number</label>
              <input 
                type="tel" 
                id="phoneNumber" 
                {...formik.getFieldProps('phoneNumber')}
                placeholder="+1 234 567 8900" 
                className={`w-[100%] h-[48px] px-[16px] rounded-[8px] bg-[#ffffff] border-[1px] ${formik.touched.phoneNumber && formik.errors.phoneNumber ? 'border-red-500' : 'border-[#c4c5d5]'} text-[#0b1c30] text-[16px] leading-[24px] focus:outline-none focus:border-[#00288e] focus:ring-[2px] focus:ring-[#00288e]/20 transition-all placeholder:text-[#757684]`} 
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                <div className="text-red-500 text-[12px] leading-[16px] mt-[4px]">{formik.errors.phoneNumber}</div>
              ) : null}
            </div>
            
            <div className="flex flex-col gap-[4px]">
              <label htmlFor="password" className="text-[12px] leading-[16px] font-[600] tracking-[0.05em] text-[#0b1c30]">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  {...formik.getFieldProps('password')}
                  placeholder="••••••••" 
                  className={`w-[100%] h-[48px] pl-[16px] pr-[48px] rounded-[8px] bg-[#ffffff] border-[1px] ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-[#c4c5d5]'} text-[#0b1c30] text-[16px] leading-[24px] focus:outline-none focus:border-[#00288e] focus:ring-[2px] focus:ring-[#00288e]/20 transition-all placeholder:text-[#757684]`} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[16px] top-[50%] translate-y-[-50%] text-[#444653] hover:text-[#00288e] transition-colors"
                >
                  {showPassword ? <Eye className="w-[24px] h-[24px]" /> : <EyeOff className="w-[24px] h-[24px]" />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-[12px] leading-[16px] mt-[4px]">{formik.errors.password}</div>
              ) : null}
            </div>
            
            <button 
              type="submit" 
              disabled={formik.isSubmitting}
              className="w-[100%] h-[48px] bg-[#00288e] hover:bg-[#001c66] text-[#ffffff] text-[12px] leading-[16px] font-[600] tracking-[0.05em] rounded-[8px] shadow-sm hover:shadow transition-all flex items-center justify-center gap-[8px] mt-[8px] disabled:opacity-70 focus:outline-none focus:ring-[2px] focus:ring-offset-[2px] focus:ring-[#00288e]"
            >
              {formik.isSubmitting ? 'Creating Account...' : 'Create Account'}
              <ArrowRight className="w-[20px] h-[20px]" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-[16px] py-[8px]">
            <div className="h-[1px] bg-[#c4c5d5] flex-grow"></div>
            <span className="text-[12px] leading-[16px] font-[600] tracking-[0.05em] text-[#444653] uppercase">Or</span>
            <div className="h-[1px] bg-[#c4c5d5] flex-grow"></div>
          </div>

          {/* Social Logins */}
          <div className="flex flex-col gap-[12px]">
            <button type="button" className="w-[100%] h-[48px] bg-[#ffffff] border-[1px] border-[#c4c5d5] hover:bg-[#eff4ff] text-[#0b1c30] text-[12px] leading-[16px] font-[600] tracking-[0.05em] rounded-[8px] transition-colors flex items-center justify-center gap-[12px]">
              <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg>
              Sign up with Google
            </button>
            <button type="button" className="w-[100%] h-[48px] bg-[#ffffff] border-[1px] border-[#c4c5d5] hover:bg-[#eff4ff] text-[#0b1c30] text-[12px] leading-[16px] font-[600] tracking-[0.05em] rounded-[8px] transition-colors flex items-center justify-center gap-[12px]">
              <svg className="w-[20px] h-[20px]" fill="#0A66C2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>
              Sign up with LinkedIn
            </button>
          </div>

          {/* Footer Link */}
          <div className="text-center mt-[8px]">
            <p className="text-[14px] leading-[20px] font-[400] text-[#444653]">
              Already have an account? 
              <a href="/login" className="text-[#00288e] hover:text-[#1e40af] font-[600] transition-colors underline-offset-4 hover:underline ml-[4px]">Log in</a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#eff4ff] border-t-[1px] border-[#c4c5d5] relative z-10 w-[100%]">
        <div className="flex flex-col md:flex-row justify-between items-center w-[100%] py-[32px] px-[32px] max-w-[1280px] mx-auto gap-[16px] md:gap-0">
          <div className="text-[20px] leading-[28px] font-[600] text-[#444653]">
            ai-job
          </div>
          <nav>
            <ul className="flex flex-wrap justify-center gap-[24px]">
              <li><a href="#" className="text-[14px] leading-[20px] font-[400] text-[#444653] hover:text-[#006c49] transition-colors focus:ring-[2px] focus:ring-[#00288e] outline-none rounded">About Us</a></li>
              <li><a href="#" className="text-[14px] leading-[20px] font-[400] text-[#444653] hover:text-[#006c49] transition-colors focus:ring-[2px] focus:ring-[#00288e] outline-none rounded">Contact</a></li>
              <li><a href="#" className="text-[14px] leading-[20px] font-[400] text-[#444653] hover:text-[#006c49] transition-colors focus:ring-[2px] focus:ring-[#00288e] outline-none rounded">Privacy Policy</a></li>
              <li><a href="#" className="text-[14px] leading-[20px] font-[400] text-[#444653] hover:text-[#006c49] transition-colors focus:ring-[2px] focus:ring-[#00288e] outline-none rounded">Terms of Service</a></li>
              <li><a href="#" className="text-[14px] leading-[20px] font-[400] text-[#444653] hover:text-[#006c49] transition-colors focus:ring-[2px] focus:ring-[#00288e] outline-none rounded">Cookie Policy</a></li>
            </ul>
          </nav>
          <div className="text-[14px] leading-[20px] font-[400] text-[#444653] text-center md:text-right">
            © 2026 ai-job. Precision Recruitment Powered by AI.
          </div>
        </div>
      </footer>
    </div>
  )
})

export default Register
