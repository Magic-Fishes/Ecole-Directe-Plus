
import "./graphics.css"
export default function LoadingAnimation ({ className="", id="", alt, ...props }) {
    return (
<svg aria-label={alt} className={className} id={id} xmlns="http://www.w3.org/2000/svg" style={{ "backgroundImage": "none", "shapeRendering": "auto"}} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
<circle cx="50" cy="50" r="32" fill="none" className="stroke-text-main" strokeWidth="8" strokeDasharray="50.26548245743669 50.26548245743669" strokeLinecap="round">
  <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0 50 50;360 50 50" />
</circle>
</svg>
	)
}