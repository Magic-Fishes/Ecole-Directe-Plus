
import "./graphics.css"
export default function DropDownArrow({ className = "", id = "", alt, ...props }) {
    return (
        <svg aria-label={alt} className={className} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 13" fill="none" {...props}>
            <path d="M2 2L11.991 11.0827C12.5631 11.6028 13.4369 11.6028 14.009 11.0827L24 2" className="stroke-border-1" strokeWidth="3" strokeLinecap="round" />
        </svg>
    )
}