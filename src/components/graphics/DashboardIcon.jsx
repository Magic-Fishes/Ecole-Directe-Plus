
import "./graphics.css"
export default function DashboardIcon ({ className="", id="", alt, ...props }) {
    return (
<svg aria-label={alt} className={className} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" {...props}>
<path d="M38 15H19C16.7909 15 15 16.7909 15 19V46C15 48.2091 16.7909 50 19 50H38C40.2091 50 42 48.2091 42 46V19C42 16.7909 40.2091 15 38 15Z" className="stroke-text-main" strokeWidth="6" />
<path d="M81 15H62C59.7909 15 58 16.7909 58 19V30C58 32.2091 59.7909 34 62 34H81C83.2091 34 85 32.2091 85 30V19C85 16.7909 83.2091 15 81 15Z" className="stroke-text-main" strokeWidth="6" />
<path d="M81 50H62C59.7909 50 58 51.7909 58 54V81C58 83.2091 59.7909 85 62 85H81C83.2091 85 85 83.2091 85 81V54C85 51.7909 83.2091 50 81 50Z" className="stroke-text-main" strokeWidth="6" />
<path d="M38 66H19C16.7909 66 15 67.7909 15 70V81C15 83.2091 16.7909 85 19 85H38C40.2091 85 42 83.2091 42 81V70C42 67.7909 40.2091 66 38 66Z" className="stroke-text-main" strokeWidth="6" />
</svg>
	)
}