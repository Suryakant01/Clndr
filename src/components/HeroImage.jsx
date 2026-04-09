import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, UploadCloud } from 'lucide-react'; // Added icons
import { getHeroImage } from '../utils/themeMap';

export default function HeroImage({ currentDate, customImages, updateHeroImage }) {
  // 1. Determine the key for this specific month/year
  const monthKey = format(currentDate, 'yyyy-MM');
  
  // 2. Priority: User Selected Image > Seasonal Default
  const displayImage =
  customImages?.[monthKey] || getHeroImage(currentDate);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateHeroImage(monthKey, reader.result); // Saves Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      className="relative h-56 md:h-72 w-full overflow-hidden bg-gray-900 group"
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)' }}
    >
      {/* Animated Image Layer */}
      <AnimatePresence mode="wait">
        <motion.img
          key={displayImage} // Animates on month change OR manual upload
          src={displayImage}
          alt="Calendar Hero"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      </AnimatePresence>
      
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* CENTERED DATE BADGE */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-sm font-semibold tracking-[0.3em] text-blue-200 uppercase drop-shadow-md">
          {format(currentDate, 'yyyy')}
        </p>
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-wider text-white drop-shadow-lg">
          {format(currentDate, 'MMMM')}
        </h2>
      </div>

      {/* UPLOAD BUTTON: Top Right */}
      <label className="absolute top-4 right-4 z-20 cursor-pointer p-2 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full border border-white/20 transition-all group-hover:scale-110 active:scale-95 shadow-lg">
        <Camera size={20} className="text-white" />
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange} 
        />
      </label>

      {/* Subtle Hint on Hover */}
      <div className="absolute top-5 right-14 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="text-[10px] font-bold text-white bg-black/40 px-2 py-1 rounded-md uppercase tracking-tighter">
          Change Month Photo
        </span>
      </div>
    </div>
  );
}