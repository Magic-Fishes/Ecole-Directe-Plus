
import "./graphics.css"
export default function BadgeStreak ({ className="", id="", alt, ...props }) {
    return (
<svg aria-label={alt} className={className} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" {...props}>
<circle cx="50" cy="50" r="50" className="fill-FF9900" />
<path d="M61.3404 47.994C61.3404 47.994 62.0853 34.8341 46.9051 20.3792C46.9051 23.9337 46.905 26.7773 36.4816 40.7901C19.364 63.8021 34.07 80.0795 49.3108 79.6114C75.3745 78.8107 73.7706 47.994 68.1572 38.789C67.3553 43.1914 65.1247 45.2879 61.3404 47.994Z" className="stroke-D15800" strokeWidth="10" />
</svg>
	)
}