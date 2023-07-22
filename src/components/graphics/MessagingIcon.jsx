
import "./graphics.css"
export default function MessagingIcon ({ className, id, alt }) {
    return (
<svg className={className} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
<title>{alt}</title>
<path d="M90.7662 21H10C6.68629 21 4 23.6863 4 27V73.5492C4 76.8629 6.6863 79.5492 10 79.5492H90.7662C94.0799 79.5492 96.7662 76.8629 96.7662 73.5492V27C96.7662 23.6863 94.0799 21 90.7662 21Z" className="stroke-text-main" strokeWidth="6" />
<path d="M5.96289 22.4512L46.4414 57.8529C48.6998 59.828 52.07 59.8314 54.3323 57.8607L94.9828 22.4512" className="stroke-text-main" strokeWidth="6" />
<path d="M94.0906 78.0533L66.3511 48.3735" className="stroke-text-main" strokeWidth="6" />
<path d="M5.24805 79.1811L34.415 48.3735" className="stroke-text-main" strokeWidth="6" />
</svg>
	)
}