import { memo } from 'react'

import {FaFacebookF,FaTwitter,FaLinkedinIn,FaInstagram } from 'react-icons/fa';


const Footer = memo(() => {
  return (
    <footer className="w-[100%] bg-[#ffffff] border-t-[1px] border-[#e0dfdc] py-[64px] flex justify-center mt-[auto]">
      <div className="w-[100%] max-w-[1200px] px-[24px] flex flex-col gap-[48px]">
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-[32px]">
          <div className="flex flex-col gap-[16px]">
            <a href="/" className="text-[#003b8e] font-bold text-[28px] tracking-tight">
              ai-job
            </a>
            <p className="text-[#6b7280] text-[15px] max-w-[300px]">
              Our advanced AI platform connects you with the best companies and positions worldwide.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-[64px]">
            <div className="flex flex-col gap-[16px]">
              <span className="font-semibold text-[#111827] text-[16px]">Platform</span>
              <a href="#" className="text-[#6b7280] hover:text-[#003b8e] text-[14px] transition-colors">Browse Jobs</a>
              <a href="#" className="text-[#6b7280] hover:text-[#003b8e] text-[14px] transition-colors">Browse Companies</a>
              <a href="#" className="text-[#6b7280] hover:text-[#003b8e] text-[14px] transition-colors">Candidates</a>
              <a href="#" className="text-[#6b7280] hover:text-[#003b8e] text-[14px] transition-colors">Pricing</a>
            </div>
            
            <div className="flex flex-col gap-[16px]">
              <span className="font-semibold text-[#111827] text-[16px]">Company</span>
              <a href="#" className="text-[#6b7280] hover:text-[#003b8e] text-[14px] transition-colors">About Us</a>
              <a href="#" className="text-[#6b7280] hover:text-[#003b8e] text-[14px] transition-colors">Careers</a>
              <a href="#" className="text-[#6b7280] hover:text-[#003b8e] text-[14px] transition-colors">Privacy Policy</a>
              <a href="#" className="text-[#6b7280] hover:text-[#003b8e] text-[14px] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>

        <div className="w-[100%] h-[1px] bg-[#e0dfdc]"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-[16px]">
          <span className="text-[#6b7280] text-[14px]">
            © 2026 ai-job. All rights reserved.
          </span>
          <div className="flex items-center gap-[24px]">
            <a href="#" className="text-[#6b7280] hover:text-[#003b8e] transition-colors">
              <FaFacebookF className="w-[20px] h-[20px]" />
            </a>
            <a href="#" className="text-[#6b7280] hover:text-[#003b8e] transition-colors">
              <FaTwitter className="w-[20px] h-[20px]" />
            </a>
            <a href="#" className="text-[#6b7280] hover:text-[#003b8e] transition-colors">
              <FaLinkedinIn className="w-[20px] h-[20px]" />
            </a>
            <a href="#" className="text-[#6b7280] hover:text-[#003b8e] transition-colors">
              <FaInstagram className="w-[20px] h-[20px]" />
            </a>
          </div>
        </div>
        
      </div>
    </footer>
  )
})

export default Footer