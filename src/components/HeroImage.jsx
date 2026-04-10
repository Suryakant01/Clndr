import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera } from 'lucide-react';
import { getHeroImage } from '../utils/themeMap';
import { compressImage } from '../utils/imageUtils';

export default function HeroImage({ currentDate, heroImage, updateHeroImage }) {
  const displayImage = heroImage || getHeroImage(currentDate);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Compress and resize image before saving to DB
      const compressedBase64 = await compressImage(file, 1200, 0.8);
      updateHeroImage(compressedBase64);
    }
  };

  return (
    <div 
      className="relative h-56 md:h-72 w-full overflow-hidden bg-gray-900 group print:h-48"
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)' }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={displayImage}
          src={displayImage}
          alt="Calendar Hero"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center pointer-events-none text-center">
        <p className="text-sm font-semibold tracking-[0.3em] text-blue-200 uppercase drop-shadow-md">
          {format(currentDate, 'yyyy')}
        </p>
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-wider text-white drop-shadow-lg">
          {format(currentDate, 'MMMM')}
        </h2>
      </div>

      {/* UPLOAD BUTTON - Hidden in Print */}
      <label className="no-print absolute top-4 left-4 z-20 cursor-pointer p-2 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full border border-white/20 transition-all shadow-lg text-white">
        <Camera size={20} />
        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </label>
    </div>
  );
}