import "./graphics.css"
export default function AbsenceIcon ({ className="", id="", alt, ...props }) {
    return (
<svg aria-label={alt} className={className} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" {...props}>
  <path d="M90 50a40 40 0 0 0-80 0m0 0h80v30H10z" className="fill-text-main" />
  <circle cx="40" cy="40" r="5" className="fill-text-main" />
  <circle cx="65" cy="40" r="5" className="fill-text-main" />
  <path d="m10 80 10 10 10-10zh20l10 10 10-10H30h20l10 10 10-10H50h20l10 10 10-10H70" className="fill-text-main" />
</svg>
	)
}