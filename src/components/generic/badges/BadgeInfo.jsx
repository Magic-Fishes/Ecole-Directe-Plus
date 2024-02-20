import { Tooltip, TooltipTrigger, TooltipContent } from "../PopUps/Tooltip";
import BadgePlus from "../../graphics/BadgePlus"
import BadgeCheck from "../../graphics/BadgeCheck"
import BadgeMeh from "../../graphics/BadgeMeh"
import BadgeStar from "../../graphics/BadgeStar"
import BadgeStonk from "../../graphics/BadgeStonk"
import BadgeStreak from "../../graphics/BadgeStreak"

import "./BadgeInfo.css"

export function BadgePlusInfo ({ className="", id="", activated=true, ...props }) {
    return (
            <Tooltip id={id} {...props}>
                <TooltipTrigger>
                    <span className="badge-container">
                        <BadgePlus className="badge"/>
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Meilleure note</p>
                </TooltipContent>
            </Tooltip>
    )
}

export function BadgeCheckInfo ({ className="", id="", activated, ...props }) {
    return (
            <Tooltip id={id} {...props}>
                <TooltipTrigger>
                    <span className="badge-container">
                        <BadgeCheck className="badge"/>
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Note supérieure à la moyenne de classe</p>
                </TooltipContent>
            </Tooltip>
    )
}

export function BadgeMehInfo ({ className="", id="", activated, ...props }) {
    return (
            <Tooltip id={id} {...props}>
                <TooltipTrigger>
                    <span className="badge-container">
                        <BadgeMeh className="badge"/>
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Note égale à la moyenne de matière</p>
                </TooltipContent>
            </Tooltip>
    )
}

export function BadgeStarInfo ({ className="", id="", activated, ...props }) {
    return (
            <Tooltip id={id}  {...props}>
                <TooltipTrigger>
                    <span className="badge-container">
                        <BadgeStar className="badge"/>
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Note maximale</p>
                </TooltipContent>
            </Tooltip>
    )
}

export function BadgeStonkInfo ({ className="", id="", activated, ...props }) {
    return (
            <Tooltip id={id} {...props}>
                <TooltipTrigger>
                    <span className="badge-container">
                        <BadgeStonk className="badge"/>
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Note supérieure à la moyenne de matière</p>
                </TooltipContent>
            </Tooltip>
    )
}

export function BadgeStreakInfo ({ className="", id="", activated, ...props }) {
    return (
            <Tooltip id={id} {...props}>
                <TooltipTrigger>
                    <span className="badge-container">
                        <BadgeStreak className="badge"/>
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Attise le feu de la Streak</p>
                </TooltipContent>
            </Tooltip>
    )
}