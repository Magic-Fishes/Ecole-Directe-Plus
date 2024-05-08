import { useEffect, useRef, useContext } from "react"
import ContentLoader from "react-content-loader"
import EncodedHTMLDiv from "../../generic/CustomDivs/EncodedHTMLDiv"
import CheckBox from "../../generic/UserInputs/CheckBox"
import { AppContext } from "../../../App"
import { applyZoom } from "../../../utils/zoom";
import { Link, useNavigate } from "react-router-dom"

import "./DetailedTask.css"
export default function DetailedTask({ task, userHomeworks, day, taskIndex, setBottomSheetSession, ...props }) {
    const isMouseInCheckBoxRef = useRef(false);
    const taskCheckboxRef = useRef(null);
    const { fetchHomeworks, fetchHomeworksDone } = useContext(AppContext)
    const homeworks = userHomeworks.get()

    const supposedNoSessionContent = [
        "PHAgc3R5bGU9Ii13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwKTsiPjxicj48L3A+PHAgc3R5bGU9Ii13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwKTsiPjxicj48L3A+",
        "",
    ]

    const hashParameters = location.hash.split(";")
    
    useEffect(() => {
        if (hashParameters.length > 2 && hashParameters[1] == task.id) {
            setBottomSheetSession({
                day,
                id: task.id,
                content: task.sessionContent,
            })
        }
    }, [])

    useEffect(() => {
        if (!task.content) {
            fetchHomeworks(new AbortController(), day)
        }
    }, [])

    function completedTaskAnimation() {
        const bounds = taskCheckboxRef.current.getBoundingClientRect();
        const origin = {
            x: bounds.left + 15 / 2,
            y: bounds.top + 15 / 2
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

    return <>{(task.content ? <div className={`detailed-task ${task.isDone ? "done" : ""}`} id={"task-" + task.id} {...props} >
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
        <EncodedHTMLDiv className="task-content">{task.content}</EncodedHTMLDiv>
        <div className="task-footer">
            <Link onClick={(e) => {
                e.stopPropagation(); setBottomSheetSession({
                    day,
                    id: task.id,
                    content: task.sessionContent,
                })
            }} to={`#${day};${task.id};s`} className={`task-footer-button ${supposedNoSessionContent.includes(task.sessionContent) ? "disabled" : ""}`}>Contenu de séance</Link>
            <div className={`task-footer-button ${task.sessionContentFiles.length === 0 ? "disabled" : ""}`}>Fichiers</div>
        </div>
    </div>
        : <ContentLoader />
    )}
    </>
}