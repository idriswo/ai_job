import { memo, useState } from 'react';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { axiosRequest } from '../../utils/token';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';

const ResetPassword = memo(() => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      newPassword: Yup.string().min(6, 'Must be at least 6 characters').required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values) => {
      if (!token) {
        toast.error("Invalid or missing reset token.");
        return;
      }
      setIsSubmitting(true);
      try {
        await axiosRequest.post('/api/Auth/reset-password', {
          token,
          newPassword: values.newPassword
        });
        toast.success("Password reset successfully! Please login.");
        navigate('/login');
      } catch (error) {
        console.error("Reset Password Error:", error);
        toast.error("Failed to reset password. Token may be expired.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] h-[100vh] flex flex-col relative overflow-hidden font-sans">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-[#00288e]/40 backdrop-blur-[2px]"></div>
      </div>

      <header className="relative z-10 p-[24px] flex justify-between items-center w-[100%] max-w-[1440px] mx-auto">
        <div className="text-[28px] leading-[36px] font-[700] text-[#ffffff] tracking-tight drop-shadow-md cursor-pointer" onClick={() => navigate('/')}>
          AIJob
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="flex items-center gap-[8px] text-[16px] leading-[24px] font-[600] text-[#ffffff] hover:text-[#d3e4fe] transition-colors drop-shadow-md"
        >
          <ArrowLeft className="w-[20px] h-[20px]" /> Back to Login
        </button>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center p-[24px]">
        <div className="bg-[#ffffff] rounded-[24px] shadow-xl w-[100%] max-w-[480px] overflow-hidden flex flex-col">
          
          <div className="p-[40px] flex flex-col">
            <div className="mb-[32px] text-center">
              <h1 className="text-[32px] leading-[40px] font-[700] text-[#0b1c30] mb-[8px]">Reset Password</h1>
              <p className="text-[16px] leading-[24px] text-[#444653]">Enter your new password below</p>
            </div>

            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-[24px]">
              
              <div>
                <label className="block text-[14px] leading-[20px] font-[600] text-[#0b1c30] mb-[8px]">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-[16px] flex items-center pointer-events-none">
                    <Lock className="h-[20px] w-[20px] text-[#8f90a6]" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    placeholder="Enter new password"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`block w-[100%] pl-[48px] pr-[48px] py-[14px] bg-[#f8f9ff] border-[1px] ${formik.touched.newPassword && formik.errors.newPassword ? 'border-[#ff4d4d]' : 'border-[#c4c5d5]'} rounded-[12px] text-[16px] leading-[24px] text-[#0b1c30] placeholder:text-[#8f90a6] focus:outline-none focus:ring-[2px] focus:ring-[#00288e]/20 focus:border-[#00288e] transition-all`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-[16px] flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-[20px] w-[20px] text-[#8f90a6]" /> : <Eye className="h-[20px] w-[20px] text-[#8f90a6]" />}
                  </div>
                </div>
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <p className="mt-[4px] text-[12px] leading-[16px] text-[#ff4d4d]">{formik.errors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-[14px] leading-[20px] font-[600] text-[#0b1c30] mb-[8px]">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-[16px] flex items-center pointer-events-none">
                    <Lock className="h-[20px] w-[20px] text-[#8f90a6]" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`block w-[100%] pl-[48px] pr-[48px] py-[14px] bg-[#f8f9ff] border-[1px] ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-[#ff4d4d]' : 'border-[#c4c5d5]'} rounded-[12px] text-[16px] leading-[24px] text-[#0b1c30] placeholder:text-[#8f90a6] focus:outline-none focus:ring-[2px] focus:ring-[#00288e]/20 focus:border-[#00288e] transition-all`}
                  />
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="mt-[4px] text-[12px] leading-[16px] text-[#ff4d4d]">{formik.errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-[100%] py-[14px] bg-[#00288e] hover:bg-[#001c63] text-[#ffffff] font-[600] text-[16px] leading-[24px] rounded-[12px] shadow-sm transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

          </div>
        </div>
      </main>
    </div>
  );
});

export default ResetPassword;
