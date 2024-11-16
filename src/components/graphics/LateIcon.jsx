import "./graphics.css"
export default function LateIcon ({ className="", id="", alt, ...props }) {
    return (
<svg aria-label={alt} className={className} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" {...props}>
  <circle cx="50" cy="50" r="40" className="stroke-text-main" strokeWidth="3" />
  <path d="M20 10 10 20m70-10 10 10" className="stroke-text-main" strokeWidth="2" />
  <path d="M50 20v30l30 20" className="stroke-text-main" strokeWidth="3" />
</svg>
	)
}