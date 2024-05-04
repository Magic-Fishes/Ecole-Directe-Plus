import { useEffect, useRef, useContext } from "react"
import ContentLoader from "react-content-loader"
import EncodedHTMLDiv from "../../generic/CustomDivs/EncodedHTMLDiv"
import CheckBox from "../../generic/UserInputs/CheckBox"
import { AppContext } from "../../../App"
import { applyZoom } from "../../../utils/zoom";

import "./DetailedTask.css"
export default function DetailedTask({ task, userHomeworks, day, taskIndex, ...props }) {
    const isMouseInCheckBoxRef = useRef(false);
    const taskCheckboxRef = useRef(null);
    const { fetchHomeworks, fetchHomeworksDone } = useContext(AppContext)
    const homeworks = userHomeworks.get()

    useEffect(() => {
        if (!task.content) {
            fetchHomeworks(new AbortController(), day)
        }
    }, [])

    function completedTaskAnimation() {
        const bounds = taskCheckboxRef.current.getBoundingClientRect();
        const origin = {
            x: bounds.left + 15/2,
            y: bounds.top + 15/2
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

    return (task.content ? <div className={`detailed-task ${task.isDone ? "done" : ""}`} id={"task-" + task.id} {...props} >
        <div className="task-header">
            <CheckBox id={"task-cb-" + task.id} ref={taskCheckboxRef} label="Effectué" onChange={() => { checkTask(day, task, taskIndex) }} checked={task.isDone} onMouseEnter={() => isMouseInCheckBoxRef.current = true} onMouseLeave={() => isMouseInCheckBoxRef.current = false} />
            <h4>
                {task.subject.replace(". ", ".").replace(".", ". ")}
            </h4>
        </div>
        <div className="task-subtitle">
            {task.addDate && <span className="add-date">Donné le {(new Date(task.addDate)).toLocaleDateString()} par {task.teacher}</span>}
            {task.isInterrogation && <span className="interrogation-alert">évaluation</span>}
        </div>
        {task.content && <EncodedHTMLDiv className="task-content">{task.content}</EncodedHTMLDiv>}
        <div className="task-footer">
            <div className="task-footer-button">Fichiers</div>
            <div className="task-footer-button">Contenu de séance</div>
        </div>
    </div>
        : <ContentLoader />
    )
}