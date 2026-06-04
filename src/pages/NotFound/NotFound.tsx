import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';

const NotFound = memo(() => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-white dark:bg-slate-950 px-[24px]">
      <div className="relative">
        <div className="absolute -inset-[20px] bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-2xl opacity-70"></div>
        <div className="w-[120px] h-[120px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full flex items-center justify-center shadow-lg relative z-10 mb-[32px]">
          <FileQuestion className="w-[56px] h-[56px] text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
      
      <h1 className="text-[48px] font-bold text-slate-900 dark:text-white mb-[16px] text-center">
        404 - Page Not Found
      </h1>
      
      <p className="text-[18px] text-slate-500 dark:text-slate-400 text-center max-w-[500px] mb-[40px] leading-relaxed">
        Oops! We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps the URL is incorrect.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-[16px]">
        <Button 
          onClick={() => navigate(-1)} 
          variant="outline"
          className="w-full sm:w-auto h-[48px] rounded-xl px-[24px] font-semibold border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-[8px]"
        >
          <ArrowLeft className="w-[18px] h-[18px]" />
          Go Back
        </Button>
        <Button 
          onClick={() => navigate('/')} 
          className="w-full sm:w-auto h-[48px] rounded-xl px-[24px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-[8px]"
        >
          <Home className="w-[18px] h-[18px]" />
          Back to Home
        </Button>
      </div>
    </div>
  );
});

export default NotFound;
