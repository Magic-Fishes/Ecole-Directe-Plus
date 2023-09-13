
import "./graphics.css"
export default function SelectedArrow ({ className="", id="", alt, ...props }) {
    return (
<svg aria-label={alt} className={className} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 12" fill="none" {...props}>
<path d="M6.29289 5.29289L2.70711 1.70711C2.07714 1.07714 1 1.52331 1 2.41421V9.58579C1 10.4767 2.07714 10.9229 2.70711 10.2929L6.29289 6.70711C6.68342 6.31658 6.68342 5.68342 6.29289 5.29289Z" className="stroke-text-main" strokeWidth="2" />
</svg>
	)
}