import { memo } from 'react'

const Section1home = memo(() => {
  return (
    <div className="w-[100%] flex justify-center py-[64px] bg-[#ffffff]">
      <div className="w-[100%] max-w-[1000px] flex justify-between items-center px-[24px]">
        <div className="flex flex-col items-center gap-[8px]">
          <span className="text-[48px] font-bold text-[#003b8e]">5000+</span>
          <span className="text-[14px] text-[#6b7280]">Active Vacancies</span>
        </div>
        <div className="flex flex-col items-center gap-[8px]">
          <span className="text-[48px] font-bold text-[#007a5a]">2000+</span>
          <span className="text-[14px] text-[#6b7280]">Registered Companies</span>
        </div>
        <div className="flex flex-col items-center gap-[8px]">
          <span className="text-[48px] font-bold text-[#003b8e]">10k+</span>
          <span className="text-[14px] text-[#6b7280]">Talented Candidates</span>
        </div>
        <div className="flex flex-col items-center gap-[8px]">
          <span className="text-[48px] font-bold text-[#007a5a]">95%</span>
          <span className="text-[14px] text-[#6b7280]">AI Match Rate</span>
        </div>
      </div>
    </div>
  )
})

export default Section1home