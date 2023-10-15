
import "./graphics.css"
export default function Copyleft ({ className="", id="", alt, ...props }) {
    return (
<svg aria-label={alt} className={className} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" {...props}>
<circle cx="50" cy="50" r="44" className="stroke-text-main" strokeWidth="12" />
<path d="M64.9999 50.0002C64.9999 40.9999 58.9999 35.0002 49.9999 35.0002C42.7937 35.0002 37.5108 38.8466 35.6912 45H25.394C27.3819 32.8191 36.7362 25 49.9998 25C64.9998 25 74.9998 35.0002 74.9998 50C74.9998 64.9998 64.9999 75 49.9998 75C36.7362 75 27.3821 67.1811 25.3941 55.0005H35.6912C37.5108 61.1539 42.7937 65.0003 49.9999 65.0003C58.9999 65.0003 64.9999 59.0006 64.9999 50.0002Z" className="fill-text-main" />
</svg>
	)
}