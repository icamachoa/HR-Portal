
import React from 'react';
import { JobVacancy } from '../types';
import { LocationIcon } from './icons/LocationIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';

interface JobCardProps {
  vacancy: JobVacancy;
  onApplyClick: (vacancy: JobVacancy) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ vacancy, onApplyClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex-grow">
        <p className="text-sm text-blue-600 font-semibold">{vacancy.category}</p>
        <h3 className="text-xl font-bold text-gray-800 mt-1 mb-2">{vacancy.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{vacancy.description.substring(0, 100)}...</p>
        
        <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center">
                <LocationIcon className="w-4 h-4 mr-2 text-gray-500" />
                <span>{vacancy.location}</span>
            </div>
            <div className="flex items-center">
                <BriefcaseIcon className="w-4 h-4 mr-2 text-gray-500" />
                <span>{vacancy.type}</span>
            </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => onApplyClick(vacancy)}
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        >
          Aplicar ahora
        </button>
      </div>
    </div>
  );
};
