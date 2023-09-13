
import "./graphics.css"
export default function NotSelectedOption ({ className="", id="", alt, ...props }) {
    return (
<svg aria-label={alt} className={className} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 4" fill="none" {...props}>
<circle cx="2" cy="2" r="2" className="fill-text-main" />
</svg>
	)
}