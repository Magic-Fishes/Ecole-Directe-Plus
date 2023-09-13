
import "./graphics.css"
export default function InfoIcon1 ({ className="", id="", alt, ...props }) {
    return (
<svg aria-label={alt} className={className} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42" fill="none" {...props}>
<rect x="3" y="3" width="36" height="36" rx="18" className="stroke-text-main" strokeWidth="6" />
<circle cx="21" cy="14.0005" r="2.625" className="fill-text-main" />
<rect x="18.375" y="18.375" width="5.25" height="13.125" rx="2.625" className="fill-text-main" />
</svg>
	)
}