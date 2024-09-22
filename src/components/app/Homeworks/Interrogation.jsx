import { useContext, useRef } from "react";
import { textToHSL } from "../../../utils/utils"
import { formatDateRelative } from "../../../utils/date"
import CheckBox from "../../generic/UserInputs/CheckBox"
import { AppContext } from "../../../App";
import { useNavigate } from "react-router-dom";
import { applyZoom, getZoomedBoudingClientRect } from "../../../utils/zoom";

export default function Interrogation({ task }) { // This component only exists to give a ref for each interrogation
    const { useUserData, fetchHomeworksDone, actualDisplayTheme } = useContext(AppContext)
    const sortedHomeworks = useUserData("sortedHomeworks");
    const currentSortedHomeworks = sortedHomeworks.get();
    const isMouseInCheckBoxRef = useRef(false)
    const taskCheckboxRef = useRef(null);

    const navigate = useNavigate()

    function completedTaskAnimation() {
        const bounds = getZoomedBoudingClientRect(taskCheckboxRef.current.getBoundingClientRect());
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

    function handleKeyDown(e, date, id) {
        console.log(e)
        if (["Enter", " "].includes(e.key)) {
            navigate(`#${date};${id}`)
        }
    }

    const taskColor = typeof task.id === "number" ? textToHSL(task.subjectCode) : undefined;

    return typeof task.id === "number"
        ? <div tabIndex="0" role="a" onKeyDown={(e) => handleKeyDown(e, task.date, task.id)} onClick={() => handleClick(task.date, task.id)} className={`upcoming-assignments ${currentSortedHomeworks[task.date][task.index].isDone ? "done" : ""}`}
            style={{
                "--subject-main-color": actualDisplayTheme === "dark" ? `hsl(${taskColor[0]}, ${taskColor[1]}%, ${taskColor[2]}%)` : `hsl(${taskColor[0]}, ${taskColor[1] - 20}%, ${taskColor[2] - 30}%)`,
                "--subject-bg-color": actualDisplayTheme === "dark" ? `hsla(${taskColor[0]}, ${taskColor[1]}%, ${taskColor[2]}%, .2)` : `hsla(${taskColor[0]}, ${taskColor[1] - 20}%, ${taskColor[2] - 30}%, .2)`,
                // "--text-color-task": `hsl(${taskColor[0]}, ${taskColor[1] - 20}%, ${taskColor[2] - 20}%)`,
                // "--background-color-task": `hsl(${taskColor[0]}, ${taskColor[1] - 5}%, ${taskColor[2] - 5}%)`,
            }}>
            <CheckBox onChange={() => { checkTask(task.date, task.index) }} ref={taskCheckboxRef} checked={currentSortedHomeworks[task.date][task.index].isDone} id={`${task.id}-upcoming-assignments"`} onMouseEnter={() => isMouseInCheckBoxRef.current = true} onMouseLeave={() => isMouseInCheckBoxRef.current = false} style={{ "backgroundImage": currentSortedHomeworks[task.date][task.index].isDone ? `url("data:image/svg+xml,%3Csvg width='126' height='90' viewBox='0 0 126 90' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3.00999 29.4982L4.7539 27.7442C8.77118 23.7036 15.3475 23.8312 19.205 28.0246L47.306 58.5723C48.849 60.2496 51.4795 60.3007 53.0864 58.6844L108.318 3.13256C112.228 -0.799963 118.591 -0.799963 122.501 3.13256L122.99 3.62419C126.868 7.5247 126.868 13.8249 122.99 17.7254L52.9741 88.147C51.4102 89.72 48.8649 89.72 47.301 88.147L3.00999 43.5994C-0.868052 39.6989 -0.868055 33.3987 3.00999 29.4982Z' fill='hsl(${taskColor[0]}, ${taskColor[1]}%, ${taskColor[2]}%)'/%3E%3C/svg%3E")` : "" }} />
            <span><span className="interrogation-label">{task.subject}</span></span>
            <span>{formatDateRelative(new Date(task.date))}</span>
        </div>
        : <div className="dummy-interrogation" />
}