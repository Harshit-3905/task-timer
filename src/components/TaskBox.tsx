import React, { useEffect, useState } from "react";

const TaskBox = ({
  id,
  name,
  estimatedTime,
  timeSpent: initialTimeSpent,
  isRunning: initialIsRunning,
  onComplete,
  onToggleTimer,
}: {
  id: string;
  name: string;
  estimatedTime: number;
  timeSpent: number;
  isRunning: boolean;
  onComplete: () => void;
  onToggleTimer: () => void;
}) => {
  const [timeSpent, setTimeSpent] = useState<number>(initialTimeSpent);
  const [isRunning, setIsRunning] = useState<boolean>(initialIsRunning);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
    onToggleTimer();
  };

  const progress = (timeSpent / (estimatedTime * 60)) * 100;
  const isOvertime = progress > 100;

  return (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-900 truncate">{name}</h2>
          <span
            className={`px-2 py-1 text-sm rounded-full ${isRunning
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
              }`}
          >
            {isRunning ? "Running" : "Paused"}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Estimated Time:</span>
            <span className="font-medium">{estimatedTime} minutes</span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Time Elapsed:</span>
            <span className="font-medium">{formatTime(timeSpent)}</span>
          </div>

          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span
                  className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${isOvertime
                      ? "text-red-800 bg-red-100"
                      : "text-green-800 bg-green-100"
                    }`}
                >
                  {isOvertime ? "Overtime" : "In Progress"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-gray-600">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
              <div
                style={{ width: `${Math.min(progress, 100)}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${isOvertime ? "bg-red-500" : "bg-green-500"
                  }`}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleToggleTimer}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors ${isRunning
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-green-600 hover:bg-green-700"
                }`}
            >
              {isRunning ? "Pause" : "Start"}
            </button>
            <button
              onClick={onComplete}
              className="flex-1 px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskBox;
