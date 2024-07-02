import React, { useState, useEffect } from 'react';
import { useContext } from "react";
import { AppContext } from "../../../App";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, addDays } from 'date-fns';
import { useLocation, useNavigate } from "react-router-dom";
import { fr } from 'date-fns/locale';
import './Calendar.css';
import DropDownArrow from "../../graphics/DropDownArrow";
import Button from "../../generic/UserInputs/Button";

const Calendar = ({ onDateClick, events = [], defaultSelectedDate }) => {
    const { useUserData, fetchHomeworks } = useContext(AppContext);
    const location = useLocation();
    const initialDate = defaultSelectedDate || new Date();
    const [currentDate, setCurrentDate] = useState(initialDate);
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [calendarDays, setCalendarDays] = useState([]);

    const navigate = useNavigate();
    const hashParameters = location.hash.split(";");

    const userHomeworks = useUserData("sortedHomeworks");
    const homeworks = userHomeworks.get();

    //console.log(homeworks)

    // For each homework, check the date and add it to the events array if it is a test set redf
    events = [];

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

    // Detect URL changes and update the selected date if needed
    useEffect(() => {
        const newSelectedDate = hashParameters.length ? hashParameters[0].slice(1) : format(new Date(), 'yyyy-MM-dd');
        //console.log("newSelectedDate", newSelectedDate);
        // if newSelectedDate is empty then retrun
        if (!newSelectedDate) return;
        if (newSelectedDate !== format(selectedDate, 'yyyy-MM-dd')) {
            if (format(newSelectedDate, 'MM') !== format(selectedDate, 'MM')) {
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
    };

    const getDayClass = (day) => {
        const dayStr = format(day, 'yyyy-MM-dd');
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

        console.log(eventsfiltered);

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

    async function fetchAllHomeworks() {
        // Set the button to loading by changing the class
        document.getElementById("fetchHomework").classList.add("submitting");
        const controller = new AbortController();
        let currentDate = new Date(selectedDate);

        while (currentDate <= new Date()) {
            await fetchHomeworks(controller, currentDate);
            currentDate = addDays(currentDate, 1);

            // Add a delay between each fetch to avoid overloading the server
            await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay between requests
        }

        // When all the homeworks are fetched, remove the loading class
        document.getElementById("fetchHomework").classList.remove("submitting");
        document.getElementById("fetchHomework").classList.add("submitted");

        setTimeout(() => {
            document.getElementById("fetchHomework").classList.remove("submitted");
        }, 2000);
    }


    return (
        <div className="calendar">
            <div className="month">
                <span className="arrow arrowleft" onClick={() => changeMonth(-1)}><DropDownArrow /></span>
                <span className="month-name">{format(currentDate, 'MMMM yyyy', { locale: fr })}</span>
                <span className="arrow arrowright" onClick={() => changeMonth(1)}><DropDownArrow /></span>
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
            <div className='buttons'>
                <Button onClick={() => {
                    setCurrentDate(new Date());
                    setSelectedDate(new Date());
                    navigateToDate(format(new Date(), 'yyyy-MM-dd'), true);
                }

            } className='buttonReturn'>Retourner à Aujourd'hui</Button>
                <Button id="fetchHomework" onClick={() => fetchAllHomeworks()} state='' buttonType="submit">Récupérer tous les devoirs à partir de la date sélectionnée</Button>
            </div>
        </div>
    );
};

export default Calendar;
