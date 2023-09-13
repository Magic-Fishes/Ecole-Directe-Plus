
import "./graphics.css"
export default function InfoIconWhite ({ className="", id="", alt, ...props }) {
    return (
<svg aria-label={alt} className={className} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 38" fill="none" {...props}>
<rect x="2.5" y="2.5" width="33" height="33" rx="16.5" className="stroke-text-main" strokeWidth="5" />
<circle cx="19" cy="12.0005" r="2.625" className="fill-text-main" />
<rect x="16.375" y="16.375" width="5.25" height="13.125" rx="2.625" className="fill-text-main" />
</svg>
	)
}