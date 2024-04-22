import { useEffect, useRef, useContext } from "react"
import { useNavigate } from "react-router-dom";
import CheckBox from "../../generic/UserInputs/CheckBox";

import { AppContext } from "../../../App";

import "./Task.css";
import { applyZoom } from "../../../utils/zoom";

export default function Task({ day, task, taskIndex, userHomeworks, ...props }) {
    const { fetchHomeworksDone } = useContext(AppContext)
    const isMouseInCheckBoxRef = useRef(false);
    const taskCheckboxRef = useRef(null);
    
    const homeworks = userHomeworks.get()


    const navigate = useNavigate();

    function completedTaskAnimation() {
        console.log("taskCheckboxRef:", taskCheckboxRef.current);
        const bounds = taskCheckboxRef.current.getBoundingClientRect();
        const origin = {
            x: bounds.left + bounds.width/2,
            y: bounds.top + bounds.height/2
        }
        confetti({
            particleCount: 40,
            spread: 70,
            origin: {
                x: origin.x/applyZoom(window.innerWidth),
                y: origin.y/applyZoom(window.innerHeight)
            },
        });
    }


    function checkTask(date, task, taskIndex) {
        const tasksToUpdate = (task.isDone ? {
            tasksNotDone: [task.id],
        } : {
            tasksDone: [task.id],
        })
        fetchHomeworksDone(tasksToUpdate);
        if (tasksToUpdate.tasksDone !== undefined) {
            completedTaskAnimation();
        }
        homeworks[date][taskIndex].isDone = !task.isDone;
        userHomeworks.set(homeworks);
    }

    function handleTaskClick(event) {
        event.stopPropagation()
        const notebookContainer = document.getElementsByClassName("notebook-container")[0];
        if (!isMouseInCheckBoxRef.current && !notebookContainer.classList.contains("mouse-moved")) {
            navigate(`#${day};${task.id}`);
        }
    }
    console.log("task:", task)

    return <div className={`task ${task.isDone ? "done" : ""}`} onClick={handleTaskClick} {...props} >
        <CheckBox ref={taskCheckboxRef} onChange={() => { checkTask(day, task, taskIndex) }} checked={task.isDone} onMouseEnter={() => isMouseInCheckBoxRef.current = true} onMouseLeave={() => isMouseInCheckBoxRef.current = false} />
        <div className="task-title">
            <h4>
                {task.subject.replace(". ", ".").replace(".", ". ")}
                <hr className="check-line"/>
            </h4>            
            {task.addDate && <span className="add-date">Donné le {(new Date(task.addDate)).toLocaleDateString()}</span>}
            {task.isInterrogation && <span className="interrogation-alert">évaluation</span>}
        </div>
    </div>
}