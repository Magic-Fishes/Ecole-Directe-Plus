import { useRef } from "react"
import { useNavigate } from "react-router-dom";
import CheckBox from "../../generic/UserInputs/CheckBox";

import "./Task.css";

export default function Task({ day, task, taskIndex, userHomeworks, ...props }) {
    const isMouseInCheckBoxRef = useRef(false);
    const homeworks = userHomeworks.get()
    
    const navigate = useNavigate();

    function checkTask(date, task, taskIndex) {
        homeworks[date][taskIndex].isDone = !task.isDone;
        userHomeworks.set(homeworks);
    }

    function handleTaskClick() {
        console.log("handleTaskClick ~ handleTaskClick:")
        const notebookContainer = document.getElementsByClassName("notebook-container")[0];
        console.log("handleTaskClick ~ notebookContainer:", notebookContainer)
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