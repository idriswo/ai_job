import { memo } from 'react'
import { Briefcase, MapPin, Search } from 'lucide-react'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import Section1home from './Section1home/Section1home'

const Home = memo(() => {
  return (
    <>
      <div className="w-full py-[150px] bg-[#f4f7fb] flex flex-col items-center pt-[100px] px-[24px]">
        <h1 className="text-[#003b8e] text-[48px] font-bold tracking-tight text-center">
          Find your dream job with AI
        </h1>
        <p className="text-[#6b7280] text-[18px] mt-[16px] text-center max-w-[600px]">
          Our advanced AI platform connects you with the best companies and positions.
        </p>
        <Card className="mt-[48px] w-[100%] max-w-[860px] bg-[#ffffff] rounded-[8px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-[1px] border-[#e0dfdc] p-[8px] flex flex-col md:flex-row items-center gap-[8px]">
          <div className="relative flex-1 w-[100%]">
            <Briefcase className="absolute left-[16px] top-[50%] translate-y-[-50%] w-[18px] h-[18px] text-[#9ca3af]" />
            <Input 
              placeholder="Job title or keywords..." 
              className="w-[100%] h-[48px] pl-[44px] border-[1px] border-[#e0dfdc] rounded-[6px] text-[#111827] text-[15px] focus-visible:ring-[#003b8e]"
            />
          </div>
          <div className="relative flex-1 w-[100%]">
            <MapPin className="absolute left-[16px] top-[50%] translate-y-[-50%] w-[18px] h-[18px] text-[#9ca3af]" />
            <Input 
              placeholder="City or region..." 
              className="w-[100%] h-[48px] pl-[44px] border-[1px] border-[#e0dfdc] rounded-[6px] text-[#111827] text-[15px] focus-visible:ring-[#003b8e]"
            />
          </div>
          <Button className="w-[100%] md:w-[140px] h-[48px] bg-[#007a5a] hover:bg-[#006046] text-[#ffffff] rounded-[6px] font-semibold text-[15px] flex items-center justify-center gap-[8px] border-none">
            <Search className="w-[18px] h-[18px]" />
            Search
          </Button>
        </Card>
      </div>
      <Section1home />
    </>
  )
})

export default Home