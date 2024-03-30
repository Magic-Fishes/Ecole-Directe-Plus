
import { createContext, useContext, useState, useRef } from "react";

import DropDownArrow from "../../graphics/DropDownArrow";

import './Notification.css'

const notificationContext = createContext();

export function useCreateNotification() {
    const addNotification = useContext(notificationContext)
    return addNotification
}

export default function DOMNotification({ children }) {
    const [notificationList, setNotificationList] = useState([])

    const currentNotificationId = useRef(0);

    function closeNotification(notification, fast = false, delay = 0) {
        setTimeout(() => {
            if (!notification.hovered || fast) {
                setNotificationList((oldNotififcationList) => {
                    const elementIndex = oldNotififcationList.indexOf(notification);
                    if (elementIndex === -1) {
                        return oldNotififcationList
                    }
                    const newNotificationList = [...oldNotififcationList]
                    newNotificationList[elementIndex].isClosing = fast + 1;
                    return newNotificationList
                });
                setTimeout(() => {
                    setNotificationList((oldNotififcationList) => {
                        const elementIndex = oldNotififcationList.indexOf(notification);
                        if (elementIndex === -1) {
                            return oldNotififcationList
                        }
                        return oldNotififcationList.toSpliced(elementIndex, 1)
                    });
                }, (fast ? 201 : 501));
            }
        }, delay)
    }

    function addNotification(newNotificationContent, customClass = "") {
        const newNotification = {
            key: currentNotificationId.current,
            content: newNotificationContent,
            isClosing: 0,
            creationTime: new Date().getTime(),
            customClass,
            hoverred: false,
        }
        currentNotificationId.current++;
        setNotificationList(() => [newNotification].concat(...notificationList))
        setTimeout(() => {
            closeNotification(newNotification)
        }, 3000);
    }

    let notificationToRemove = []

    function removeNotificationList() {
        if (notificationToRemove.length) {
            setNotificationList((oldNotificationList) => {
                return oldNotificationList.filter((e, i) => !notificationToRemove.includes(i))
            })
        }
        return ""
    }

    function handleMouseLeave(notification) {
        notification.hovered = false;
        if (notification.creationTime < new Date().getTime() - 3500) {
            closeNotification(notification, false, 1000)
            notification.creationTime = new Date().getTime() - 1500
        }
    }

    function handleMouseEnter(notification) {
        notification.hovered = true; 
        notification.creationTime = new Date().getTime() - 1000
    }

    return (
        <notificationContext.Provider value={addNotification} >
            <div id="notifications-container">
                {notificationList.map((el, i) => {
                    if (el.creationTime > new Date().getTime() - 3500 || el.hovered) {
                        return (
                            <div className={`pop-up-notification ${el.isClosing === 1 ? " closing" : (el.isClosing === 2 ? " fast-closing" : "")} ${el.customClass}`} key={el.key} onMouseEnter={() => handleMouseEnter(el)} onMouseLeave={() => handleMouseLeave(el)} >
                                <DropDownArrow className="notification-close-arrow" onClick={() => { closeNotification(el, true) }} />
                                {el.content}
                            </div>
                        )
                    } else {
                        notificationToRemove.push(i);
                    }
                })}
                {removeNotificationList()}
            </div>
            {children}
        </notificationContext.Provider>
    )
}