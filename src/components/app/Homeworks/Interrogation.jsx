import { useContext, useRef } from "react";
import { textToHSL } from "../../../utils/utils"
import CheckBox from "../../generic/UserInputs/CheckBox"
import { AppContext } from "../../../App";
import { useNavigate } from "react-router-dom";
import { applyZoom } from "../../../utils/zoom";

export default function Interrogation({ task }) { // This component only exists to give a ref for each interrogation
    const { useUserData, fetchHomeworksDone } = useContext(AppContext)
    const sortedHomeworks = useUserData("sortedHomeworks");
    const currentSortedHomeworks = sortedHomeworks.get();
    const isMouseInCheckBoxRef = useRef(false)
    const taskCheckboxRef = useRef(null);

    const navigate = useNavigate()

    function completedTaskAnimation() {
        const bounds = taskCheckboxRef.current.getBoundingClientRect();
        const origin = {
            x: bounds.left + bounds.width / 2,
            y: bounds.top + bounds.height / 2
        }
        confetti({
            particleCount: 40,
            spread: 70,
            origin: {
                x: origin.x / applyZoom(window.innerWidth),
                y: origin.y / applyZoom(window.innerHeight)
            },
        });
    }

    function checkTask(date, taskIndex) {
        const task = currentSortedHomeworks[date][taskIndex]
        const tasksToUpdate = (task.isDone ? {
            tasksNotDone: [task.id],
        } : {
            tasksDone: [task.id],
        })
        fetchHomeworksDone(tasksToUpdate);
        if (tasksToUpdate.tasksDone !== undefined) {
            completedTaskAnimation();
        }
        currentSortedHomeworks[date][taskIndex].isDone = !task.isDone;
        sortedHomeworks.set(currentSortedHomeworks);
    }

    function handleClick(date, id) {
        if (!isMouseInCheckBoxRef.current) {
            navigate(`#${date};${id}`)
        }
    }

    return task.id !== "dummy"
        ? <div tabIndex="0" role="a" onClick={() => handleClick(task.date, task.id)} className="next-interrogation" style={{ backgroundColor: textToHSL(task.subject) }}>
            <CheckBox onChange={() => { checkTask(task.date, task.index) }} ref={taskCheckboxRef} checked={currentSortedHomeworks[task.date][task.index].isDone} id={`${task.id}-next-interrogation"`} onMouseEnter={() => isMouseInCheckBoxRef.current = true} onMouseLeave={() => isMouseInCheckBoxRef.current = false} />
            <span>{task.subject}</span>
            <span>{task.date}</span>
        </div>
        : <div className="dummy-interrogation" />
}