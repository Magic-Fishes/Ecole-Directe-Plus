import "./graphics.css"
export default function PunishmentIcon ({ className="", id="", alt, ...props }) {
    return (
<svg aria-label={alt} className={className} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" {...props}>
  <path d="M0 0h100v100H0z" className="fill-E42626" />
  <rect x="15" y="10" width="70" height="80" rx="5" ry="5" className="fill-text-main" />
  <path d="M20 20h60M20 40h60M20 60h60" className="stroke-text-main" />
  <circle cx="70" cy="80" r="5" className="fill-text-main" />
  <path d="m66 80-1 15 5-10 3 10 1-15" className="fill-text-main" />
</svg>
	)
}