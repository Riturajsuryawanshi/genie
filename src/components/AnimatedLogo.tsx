import { Phone } from "lucide-react";

export const AnimatedLogo = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 p-3 rounded-2xl shadow-xl">
        <Phone className="h-7 w-7 text-white drop-shadow-lg" />
      </div>
      
      <div className="flex flex-col">
        <span className="text-2xl font-bold bg-gradient-to-r from-purple-300 via-violet-300 to-indigo-300 bg-clip-text text-transparent">
          <span>Call</span>
          <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
            Genie
          </span>
        </span>
        
        <div className="text-xs text-purple-300/70 -mt-1 font-medium tracking-wide">
          AI Phone Assistant
        </div>
      </div>
    </div>
  );
};