import React from 'react';
import { useNavigate } from 'react-router-dom';

const TrainCard = ({ train, journeyDate }) => {
  const navigate = useNavigate();

  const handleBook = () => {
    navigate(`/book/${train._id}`, { state: { train, journeyDate } });
  };

  // Helper to calculate journey duration
  const calculateDuration = (dep, arr) => {
    const [depH, depM] = dep.split(':').map(Number);
    const [arrH, arrM] = arr.split(':').map(Number);
    
    let depTotalMins = depH * 60 + depM;
    let arrTotalMins = arrH * 60 + arrM;
    
    if (arrTotalMins < depTotalMins) {
      arrTotalMins += 24 * 60; // Next day arrival
    }
    
    const diff = arrTotalMins - depTotalMins;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Train Details Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
              #{train.trainNumber}
            </span>
            {train.trainType && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                train.trainType.toLowerCase() === 'superfast' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                train.trainType.toLowerCase() === 'rajdhani' || train.trainType.toLowerCase() === 'shatabdi' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                'bg-emerald-50 text-emerald-700 border-emerald-100'
              }`}>
                🚆 {train.trainType}
              </span>
            )}
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{train.trainName}</h3>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-black text-gray-800">{train.departureTime}</p>
              <p className="text-sm font-medium text-gray-500">{train.source}</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center px-4 hidden sm:flex">
              <span className="text-xs text-gray-400 mb-1">{train.runningDays?.length === 7 ? 'Daily' : 'Select Days'}</span>
              <div className="w-full flex items-center">
                <div className="h-2 w-2 rounded-full bg-[#10B981]"></div>
                <div className="h-px flex-1 border-dashed border-t-2 border-gray-300 mx-1"></div>
                <div className="h-2 w-2 rounded-full bg-[#10B981]"></div>
              </div>
              <span className="text-xs font-semibold text-gray-500 mt-1">
                ⏱ {calculateDuration(train.departureTime, train.arrivalTime)}
              </span>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-black text-gray-800">{train.arrivalTime}</p>
              <p className="text-sm font-medium text-gray-500">{train.destination}</p>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 lg:gap-2 lg:pl-6 lg:border-l border-gray-100">
          <div className="text-left lg:text-right">
            <p className="text-sm text-gray-500 uppercase tracking-wide">Fare</p>
            <p className="text-3xl font-extrabold text-blue-700">₹{train.fare.toLocaleString()}</p>
            
            <p className={`text-sm font-semibold mt-1 flex items-center justify-start lg:justify-end gap-1 ${
              train.availableSeats > 20 ? 'text-green-600' : train.availableSeats > 0 ? 'text-orange-500' : 'text-red-500'
            }`}>
              <span className="h-2 w-2 rounded-full bg-current"></span>
              {train.availableSeats > 0 ? `${train.availableSeats} Available` : 'Waitlist / Full'}
            </p>
          </div>

          <button
            onClick={handleBook}
            disabled={train.availableSeats === 0}
            className="btn-primary py-3 px-8 w-full lg:w-auto"
          >
            {train.availableSeats === 0 ? 'Sold Out' : 'Book Ticket'}
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default TrainCard;
