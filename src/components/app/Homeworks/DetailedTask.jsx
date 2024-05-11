import { useEffect, useRef, useContext } from "react"
import ContentLoader from "react-content-loader"
import EncodedHTMLDiv from "../../generic/CustomDivs/EncodedHTMLDiv"
import CheckBox from "../../generic/UserInputs/CheckBox"
import { AppContext } from "../../../App"
import { applyZoom } from "../../../utils/zoom";
import { Link, useNavigate } from "react-router-dom"

import "./DetailedTask.css"
import PatchNotesIcon from "../../graphics/PatchNotesIcon"
import DownloadIcon from "../../graphics/DownloadIcon"
import CopyButton from "../../generic/CopyButton"
import { clearHTML } from "../../../utils/html"
export default function DetailedTask({ task, userHomeworks, day, taskIndex, setBottomSheetSession, ...props }) {
    const isMouseInCheckBoxRef = useRef(false);
    const taskCheckboxRef = useRef(null);
    const { actualDisplayTheme, fetchHomeworks, fetchHomeworksDone, useUserSettings } = useContext(AppContext)
    const settings = useUserSettings();
    const homeworks = userHomeworks.get()

    const contentLoadersRandomValues = useRef({ labelWidth: Math.floor(Math.random() * 100) + 200, contentHeight: Math.floor(Math.random() * 200) + 50 })

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
        const controller = new AbortController();
        if (!task.content) {
            fetchHomeworks(controller, day)
        }

        return () => {
            controller.abort();
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

    return <>{(task?.content
        ? <div className={`detailed-task ${task.isDone ? "done" : ""}`} id={"task-" + task.id} {...props} >
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
            <EncodedHTMLDiv className="task-content" nonEncodedChildren={<CopyButton content={clearHTML(task.content, undefined, false).innerText} />} >{task.content}</EncodedHTMLDiv>
            <div className="task-footer">
                <Link onClick={(e) => {
                    e.stopPropagation(); setBottomSheetSession({
                        day,
                        id: task.id,
                        content: task.sessionContent,
                    })
                }} to={`#${day};${task.id};s`} className={`task-footer-button ${supposedNoSessionContent.includes(task.sessionContent) ? "disabled" : ""}`}><PatchNotesIcon className="session-content-icon" />Contenu de séance</Link>
                <div className={`task-footer-button ${task.sessionContentFiles.length === 0 ? "disabled" : ""}`}><DownloadIcon className="download-icon" />Fichiers</div>
            </div>
        </div>
        : <div className={`detailed-task`} {...props} >
            <div className="task-header">
                <CheckBox id={"task-cb-" + crypto.randomUUID()} ref={taskCheckboxRef} label="Effectué" onChange={() => { }} checked={false} onMouseEnter={() => isMouseInCheckBoxRef.current = true} onMouseLeave={() => isMouseInCheckBoxRef.current = false} />
                <h4>
                    <ContentLoader
                        animate={settings.get("displayMode") === "quality"}
                        speed={1}
                        backgroundColor={actualDisplayTheme === "dark" ? "#63638c" : "#9d9dbd"}
                        foregroundColor={actualDisplayTheme === "dark" ? "#7e7eb2" : "#bcbce3"}
                        style={{ width: contentLoadersRandomValues.current.labelWidth + "px", maxHeight: "35px" }}
                    >
                        <rect x="0" y="0" rx="10" ry="10" style={{ width: "100%", height: "100%" }} />
                    </ContentLoader>
                </h4>
            </div>
            <div className="task-subtitle">
                <ContentLoader
                    animate={settings.get("displayMode") === "quality"}
                    speed={1}
                    backgroundColor={'#7e7eab7F'}
                    foregroundColor={'#9a9ad17F'}
                    height="14"
                    style={{ width: contentLoadersRandomValues.current.labelWidth - 100 + "px" }}
                >
                    <rect x="0" y="0" rx="5" ry="5" style={{ width: "100%", height: "100%" }} />
                </ContentLoader>
            </div>
            <div style={{ width: "100%", height: contentLoadersRandomValues.current.contentHeight + "px", marginBlock: "5px", borderRadius: "10px", backgroundColor: actualDisplayTheme === "dark" ? "#40405b" : "#9d9dbd"}}></div>
            <div className="task-footer">
                <div className={`task-footer-button disabled`}><PatchNotesIcon className="session-content-icon" />Contenu de séance</div>
                <div className={`task-footer-button disabled`}><DownloadIcon className="download-icon" />Fichiers</div>
            </div>
        </div>
    )}
    </>
}
