import React, { useState, useEffect, useRef } from 'react';
import { useContext } from "react";
import { AppContext } from "../../../App";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, addDays } from 'date-fns';
import { useLocation, useNavigate } from "react-router-dom";
import { fr } from 'date-fns/locale';
import DropDownArrow from "../../graphics/DropDownArrow";

import './Calendar.css';

export default function Calendar({ onDateClick, defaultSelectedDate }) {
    const { useUserData, fetchHomeworksSequentially, } = useContext(AppContext);
    const location = useLocation();
    const initialDate = defaultSelectedDate || new Date();
    const [currentDate, setCurrentDate] = useState(initialDate);
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [calendarDays, setCalendarDays] = useState([]);
    
    const isShifted = useRef(false);
    const progressBarRef = useRef(null);

    const navigate = useNavigate();
    const hashParameters = location.hash.split(";");

    const userHomeworks = useUserData("sortedHomeworks");
    const homeworks = userHomeworks.get();

    //console.log(homeworks)

    // For each homework, check the date and add it to the events array if it is a test set redf
    const events = [];

    for (const date in homeworks) {
        for (const task of homeworks[date]) {
            if (task.isDone) {
                events.push({ date, color: 'green' });
            } else if (task.isInterrogation) {
                events.push({ date, color: '#d94848' });
            } else {
                events.push({ date, color: '#4b48d9' });
            }
        }
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!isShifted.current) isShifted.current = event.key === "Shift";
        }
        const handleKeyUp = (event) => {
            if (isShifted.current) isShifted.current = !(event.key === "Shift");
        }
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyUP", handleKeyUp);
        }
    }, [])

    // Detect URL changes and update the selected date if needed
    useEffect(() => {
        const newSelectedDate = hashParameters.length ? hashParameters[0].slice(1) : format(new Date(), 'yyyy-MM-dd');
        //console.log("newSelectedDate", newSelectedDate);
        // if newSelectedDate is empty then retrun
        if (!newSelectedDate) return;
        if (newSelectedDate !== format(selectedDate, 'yyyy-MM-dd')) {
            if ((new Date(newSelectedDate)).getMonth() !== (new Date(selectedDate)).getMonth()) {
                setCurrentDate(newSelectedDate);
            }
            setSelectedDate(new Date(newSelectedDate));
        }
    }, [location]);


    useEffect(() => {
        generateCalendar();
    }, [currentDate]);

    const generateCalendar = () => {
        const startDate = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
        const endDate = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });

        let date = startDate;
        const days = [];

        while (date <= endDate) {
            days.push(date);
            date = addDays(date, 1);
        }

        setCalendarDays(days);
    };

    const changeMonth = (months) => {
        setCurrentDate(addMonths(currentDate, months));
    };

    const handleDayClick = (day) => {
        navigateToDate(format(day, 'yyyy-MM-dd'));
        // If the day is not in the current month, switch to that month
        if (format(day, 'MM') !== format(currentDate, 'MM')) {
            setCurrentDate(day);
        }
        setSelectedDate(day);
        if (onDateClick) onDateClick(day); // Call the callback with the selected date
        if (isShifted.current) fetchAllHomeworks(day);
    };

    const getDayClass = (day) => {
        // const dayStr = format(day, 'yyyy-MM-dd');
        const isDifferentMonth = format(day, 'MM') !== format(currentDate, 'MM');
        const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
        const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
        // const highlight = events.find(event => event.date === dayStr)?.color;

        let className = 'day';
        if (isDifferentMonth) className += ' grey';
        if (isSelected) className += ' selected';
        if (isToday) className += ' today';
        // if (highlight) className += ` ${highlight}`;

        return className;
    };

    const getDayStyle = (day) => {
        const dayStr = format(day, 'yyyy-MM-dd');
        const eventsfiltered = events.filter(event => event.date === dayStr);
        const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

        //console.log(eventsfiltered);

        if (eventsfiltered.length > 0) {
            //if all the events in the day have the color green, we want to set the color to green
            if (eventsfiltered.every(events => events.color === 'green')) {
                return { backgroundColor: 'green' };
            }
            //if one event in the day has the color d94848, we want to set the color to red and ignore the other color
            else if (eventsfiltered.find(events => events.color === '#d94848')) {
                return { backgroundColor: '#d94848' };
            }
            else {
                // Get the color of the first event by 
                return { backgroundColor: '#4b48d9' };
            }
        } else if (isToday) {
            //if this is a grey day, we want to keep the grey color
            if (format(day, 'MM') !== format(currentDate, 'MM')) {
                return { backgroundColor: '#525273' };
            } else {
                return { backgroundColor: '#8989c0' }; // Special color for today
            }
        }

        return {};
    };

    function navigateToDate(newDate, cleanup = false) {
        navigate(`#${newDate};${(cleanup && hashParameters[1]) || ""}${hashParameters.length === 3 ? ";" + hashParameters[2] : ""}`, { replace: true });
    }

    async function fetchAllHomeworks(day) {
        // Set the button to loading by changing the class
        // Set display to block for the progress bar
        day = new Date(day)
        progressBarRef.current.style.display = "block";
        var progressPercentage = 0.0;
        const controller = new AbortController();
        let currentDate = new Date(day);

        while (currentDate <= new Date()) {
            await fetchHomeworksSequentially(controller, currentDate);
            // Set the progress bar to the percentage of completion (a value between 0.0 and 1.0)
            // the date should be all taken at midnight
            const midnightCurrentDate = new Date(currentDate.setHours(0, 0, 0, 0));
            console.log(day)
            const midnightDate = new Date(day).setHours(0, 0, 0, 0);
            const midnightToday = new Date().setHours(0, 0, 0, 0);

            progressPercentage = (midnightCurrentDate - midnightDate) ? 0 : (midnightCurrentDate - midnightDate) / (midnightToday - midnightDate);
            progressBarRef.current.value = progressPercentage;
            // Go to the date on the clendar
            setCurrentDate(currentDate);
            setSelectedDate(currentDate);
            navigateToDate(format(currentDate, 'yyyy-MM-dd'), true);

            currentDate = addDays(currentDate, 1);
        }
        // When all the homeworks are fetched, remove the loading class

        setTimeout(() => {
            // Hide the progress bar
            progressBarRef.current.style.display = "none";
        }, 2000);
    }

    return (
        <div className="calendar">
            <div className="month">
                <DropDownArrow className="arrow arrowleft" onClick={() => changeMonth(-1)} />
                <span className="month-name" onClick={() => {
                    setCurrentDate(new Date());
                    setSelectedDate(new Date());
                    navigateToDate(format(new Date(), 'yyyy-MM-dd'), true);
                }}>{format(currentDate, 'MMMM yyyy', { locale: fr })}</span>
                <DropDownArrow className="arrow arrowright" onClick={() => changeMonth(1)} />
            </div>
            <div className="weekdays">
                <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
            </div>
            <div className="days">
                {calendarDays.map((day, index) => (
                    <span
                        key={index}
                        className={getDayClass(day)}
                        style={getDayStyle(day)}
                        onClick={() => handleDayClick(day)}
                    >
                        {format(day, 'd')}
                    </span>
                ))}
            </div>
            <progress ref={progressBarRef} className="progress-bar" value={0} />
        </div>
    );
};