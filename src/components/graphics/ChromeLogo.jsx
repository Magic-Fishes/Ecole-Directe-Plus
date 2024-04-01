
import "./graphics.css"
export default function ChromeLogo({ className = "", id = "", alt, ...props }) {
    return (
        <svg aria-label={alt} className={className} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" {...props}>
            <circle xmlns="http://www.w3.org/2000/svg" cx="50" cy="50" r="23" strokeWidth="5" className="fill-1A73E8 stroke-white"/>
            <path d="M27.9819 61.9548L6.48191 24.9547C28.4819 -10.0453 73.9819 -6.54523 93.3579 24.9547L50.4819 24.9548C33.4819 24.9547 18.9819 40.9548 27.9819 61.9548Z" className="fill-E1392C" />
            <path d="M50.4819 24.9548L93.3619 24.9547C112.158 59.0588 88.8131 99.5072 49.9819 99.9548L70.9819 63.4548C80.4819 48.4548 72.4818 26.4548 50.4819 24.9548Z" className="fill-FBBD07" />
            <path d="M70.9819 63.4548L49.9819 99.9548C11.8584 99.9913 -12.2467 58.5224 6.48191 24.9547L27.9819 61.9548C35.9818 76.9547 58.9818 80.9547 70.9819 63.4548Z" className="fill-229342" />
        </svg>
    )
}