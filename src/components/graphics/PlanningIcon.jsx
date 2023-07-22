
import "./graphics.css"
export default function PlanningIcon ({ className, id, alt }) {
    return (
<svg className={className} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
<title>{alt}</title>
<path d="M33 8V80" className="stroke-text-main" strokeWidth="6" />
<path d="M5 62H63" className="stroke-text-main" strokeWidth="6" />
<path d="M61 62V8" className="stroke-text-main" strokeWidth="6" />
<path d="M5 26H89" className="stroke-text-main" strokeWidth="6" />
<path d="M89 44H5" className="stroke-text-main" strokeWidth="6" />
<path d="M77 56C67.0589 56 59 64.0589 59 74C59 83.9411 67.0589 92 77 92C86.9411 92 95 83.9411 95 74C95 64.0589 86.9411 56 77 56Z" className="stroke-text-main" strokeWidth="6" />
<path d="M79 74.8104V64C79 62.8954 78.1046 62 77 62C75.8954 62 75 62.8954 75 64V73L69.5896 77.2511C68.7192 77.9349 68.5855 79.2026 69.2942 80.053C69.9681 80.8618 71.1599 80.9953 71.9962 80.3558L78.8494 75.1152C78.9443 75.0426 79 74.9299 79 74.8104Z" className="fill-text-main" />
<path d="M60 80H17C10.3726 80 5 74.6274 5 68V20C5 13.3726 10.3726 8 17 8H77C83.6274 8 89 13.3726 89 20V61" className="stroke-text-main" strokeWidth="6" />
</svg>
	)
}