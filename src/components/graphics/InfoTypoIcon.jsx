
import "./graphics.css"
export default function InfoTypoIcon({ className = "", id = "", alt, ...props }) {
    return (
        <svg aria-label={alt} className={className} id={id} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M12 7.5V7.5M12 17L12 11M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" className="stroke-text-main" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}