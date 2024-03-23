
import "./graphics.css"
export default function AboutArrow({ className = "", id = "", alt, ...props }) {
    return (
        <svg aria-label={alt} className={className} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" {...props}>
            <path d="M3.5 41L44.2241 56.7642C47.9403 58.2027 52.0597 58.2027 55.7759 56.7642L96.5 41" className="stroke-text-main" strokeWidth="7" strokeLinecap="round" />
        </svg>
    )
}