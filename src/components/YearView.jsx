import { format, setMonth } from 'date-fns';
import { motion } from 'framer-motion';

export default function YearView({ currentDate, jumpToMonth }) {
    const months = Array.from({ length: 12 }, (_, i) => i);

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">{format(currentDate, 'yyyy')}</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 flex-grow content-start">
                {months.map(m => {
                    const isCurrent = m === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
                    return (
                        <button 
                            key={m} 
                            onClick={() => jumpToMonth(m)}
                            className={`p-4 rounded-xl text-sm font-semibold transition-all border
                                ${isCurrent ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-transparent hover:border-gray-200 hover:bg-white dark:bg-gray-800 dark:text-gray-300'}`}
                        >
                            {format(setMonth(currentDate, m), 'MMM')}
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
}