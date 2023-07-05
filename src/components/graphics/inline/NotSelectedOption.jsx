
import "../graphics.css"
export default function NotSelectedOption ({ className="", id="", alt }) {
    return (
<svg className={className} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 4" fill="none">
<title>{alt}</title>
<circle cx="2" cy="2" r="2" className="fill-text-main" />
</svg>
	)
}