"use client"; // Ensures it runs only in the browser

import { format } from "date-fns";
import { useState, useEffect } from "react";

const DateTimeDisplay = () => {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      setDateTime(format(new Date(), "MMM d yyyy h:mm:ss a")); // Update time
    };

    updateDateTime(); // Set initial value
    const interval = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return <p className="text-lg ">{dateTime}</p>;
};

export default DateTimeDisplay;
