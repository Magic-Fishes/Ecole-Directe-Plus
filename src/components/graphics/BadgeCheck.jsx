
import "./graphics.css"
export default function BadgeCheck ({ className="", id="", alt, ...props }) {
    return (
<svg aria-label={alt} className={className} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" {...props}>
<circle cx="50" cy="50" r="50" className="fill-03A981" />
<path d="M43.0797 57.9329L31.6673 46.5179C29.8508 44.701 26.9053 44.701 25.0888 46.5179C23.2729 48.3343 23.2729 51.2787 25.0888 53.095L39.5437 67.5533C41.4965 69.5064 44.6629 69.5064 46.6156 67.5532L75.3853 38.7769C77.2012 36.9606 77.2012 34.0162 75.3853 32.1999C73.5688 30.383 70.6233 30.383 68.8068 32.1999L43.0797 57.9329Z" className="fill-00D3A0" />
</svg>
	)
}