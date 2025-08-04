"use client";

interface TimeSelectionProps {
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  disabled?: boolean;
}

export default function TimeSelection({ selectedTime, onTimeSelect, disabled = false }: TimeSelectionProps) {
  // Helper function to get local and UTC time display with dynamic labels
  const getTimeDisplays = (utcTime: string) => {
    const [hours, minutes] = utcTime.split(':').map(Number);
    
    // Create a date object with UTC time for today
    const utcDate = new Date();
    utcDate.setUTCHours(hours, minutes, 0, 0);
    
    // Get local hour for label determination
    const localHour = utcDate.getHours();
    
    // Generate dynamic label and description based on local time
    const getDynamicContent = (hour: number) => {
      if (hour >= 0 && hour < 6) {
        return {
          label: "Late Night",
          description: hour < 3 ? "Late night reading" : "Very early morning"
        };
      }
      if (hour >= 6 && hour < 12) {
        return {
          label: "Morning",
          description: hour < 9 ? "Start your day informed" : "Morning coffee reading"
        };
      }
      if (hour >= 12 && hour < 18) {
        return {
          label: "Afternoon",
          description: hour < 15 ? "Perfect lunch break reading" : "Afternoon knowledge boost"
        };
      }
      return {
        label: "Evening",
        description: hour < 21 ? "Wind down with insights" : "Evening digest"
      };
    };
    
    // Format local time (primary display)
    const localTime = utcDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    // Get timezone name
    const timezoneName = utcDate.toLocaleTimeString('en-US', {
      timeZoneName: 'short'
    }).split(' ').pop();
    
    // Format UTC time (for badge)
    const utcTimeFormatted = utcDate.toLocaleTimeString('en-US', {
      timeZone: 'UTC',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    const dynamicContent = getDynamicContent(localHour);
    
    return {
      label: dynamicContent.label,
      description: dynamicContent.description,
      localTime,
      timezoneName,
      utcTime: utcTimeFormatted
    };
  };

  // Time preference options with dynamic timezone-aware labels and descriptions
  const timeOptions = [
    { 
      value: "06:00", 
      ...getTimeDisplays("06:00")
    },
    { 
      value: "12:00", 
      ...getTimeDisplays("12:00")
    },
    { 
      value: "18:00", 
      ...getTimeDisplays("18:00")
    },
    { 
      value: "24:00", 
      ...getTimeDisplays("24:00")
    },
  ];

  return (
    <div className="space-y-4">
      {timeOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onTimeSelect(option.value)}
          disabled={disabled}
          className={`w-full p-6 rounded-xl border-2 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed ${
            selectedTime === option.value
              ? "border-orange-400 bg-orange-50"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {option.label}
                </h3>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium">
                  {option.utcTime} UTC
                </span>
              </div>
              <p className="text-xl font-bold text-orange-600 mb-1">
                {option.localTime}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Your time ({option.timezoneName})
              </p>
              <p className="text-gray-600">{option.description}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ml-4 ${
              selectedTime === option.value
                ? "border-orange-400 bg-orange-400"
                : "border-gray-300"
            }`}>
              {selectedTime === option.value && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
