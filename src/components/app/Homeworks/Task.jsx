import { useRef, useContext } from "react"
import { useNavigate } from "react-router-dom";
import CheckBox from "../../generic/UserInputs/CheckBox";

import { AppContext } from "../../../App";

import "./Task.css";

export default function Task({ day, task, taskIndex, userHomeworks, ...props }) {
    const { fetchHomeworksDone } = useContext(AppContext)
    const isMouseInCheckBoxRef = useRef(false);
    const homeworks = userHomeworks.get()
    
    const navigate = useNavigate();

    function checkTask(date, task, taskIndex) {
        const tasksToUpdate = (task.isDone ? {
            tasksNotDone: [task.id],
        } : {
            tasksDone: [task.id],
        })
        fetchHomeworksDone(tasksToUpdate)
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

    return <div className="task" onClick={handleTaskClick} {...props} >
        <CheckBox onChange={() => { checkTask(day, task, taskIndex) }} checked={task.isDone} onMouseEnter={() => isMouseInCheckBoxRef.current = true} onMouseLeave={() => isMouseInCheckBoxRef.current = false}/>
        <h4>{task.subject.replace(". ", ".").replace(".", ". ")}</h4>
        {task.isInterrogation && <span className="interrogation-alert">évaluation</span>}
    </div>
}