
import "./graphics.css"
export default function MicrosoftLogo ({ className="", id="", alt, ...props }) {
    return (
<svg aria-label={alt} className={className} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 59 59" fill="none" {...props}>
<path d="M58.0312 32.0938H32.0938V58.0312H58.0312V32.0938Z" className="fill-text-main" />
<path d="M26.9062 32.0938H0.96875V58.0312H26.9062V32.0938Z" className="fill-text-main" />
<path d="M58.0312 0.96875H32.0938V26.9062H58.0312V0.96875Z" className="fill-text-main" />
<path d="M26.9062 0.96875H0.96875V26.9062H26.9062V0.96875Z" className="fill-text-main" />
</svg>
	)
}