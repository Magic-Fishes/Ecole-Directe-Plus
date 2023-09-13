
import "./graphics.css"
export default function BadgeMeh ({ className="", id="", alt, ...props }) {
    return (
<svg aria-label={alt} className={className} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101 101" fill="none" {...props}>
<circle cx="50" cy="50" r="50" className="fill-AFB5C7" />
<path d="M72.2747 44.5498H28.1989C25.7123 44.5498 23.6965 42.534 23.6965 40.0474C23.6965 37.5608 25.7123 35.545 28.1989 35.545H72.2747C74.7613 35.545 76.7771 37.5608 76.7771 40.0474C76.7771 42.534 74.7613 44.5498 72.2747 44.5498Z" className="fill-F5F6FF" />
<path d="M72.2747 63.9811H28.1989C25.7123 63.9811 23.6965 61.9653 23.6965 59.4787C23.6965 56.9921 25.7123 54.9763 28.1989 54.9763H72.2747C74.7613 54.9763 76.7771 56.9921 76.7771 59.4787C76.7771 61.9653 74.7613 63.9811 72.2747 63.9811Z" className="fill-F5F6FF" />
</svg>
	)
}