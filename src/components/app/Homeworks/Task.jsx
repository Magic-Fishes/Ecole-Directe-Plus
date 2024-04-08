import { useRef } from "react"
import { useNavigate } from "react-router-dom";
import CheckBox from "../../generic/UserInputs/CheckBox";

export default function Task({ day, task, taskIndex, userHomeworks }) {
    const isMouseInCheckBoxRef = useRef(false);
    const homeworks = userHomeworks.get()
    
    const navigate = useNavigate();

    function checkTask(date, task, taskIndex) {
        homeworks[date][taskIndex].isDone = !task.isDone;
        userHomeworks.set(homeworks);
    }

    function handleTaskClick(){
        if (!isMouseInCheckBoxRef.current) {
            navigate(`#${day};${task.id}`)
        }
    }

    return <div className="task" onClick={handleTaskClick} >
        <CheckBox onChange={() => { checkTask(day, task, taskIndex) }} checked={task.isDone} onMouseEnter={() => isMouseInCheckBoxRef.current = true} onMouseLeave={() => isMouseInCheckBoxRef.current = false}/>
        <h4>{task.subject.replace(". ", ".").replace(".", ". ")}</h4>
        {task.isInterrogation && <span className="interrogation-alert">évaluation</span>}
    </div>
}