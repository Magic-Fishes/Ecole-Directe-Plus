
import "./graphics.css"
export default function BadgeStonk ({ className="", id="", alt, ...props }) {
    return (
<svg aria-label={alt} className={className} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" {...props}>
<circle cx="50" cy="50" r="50" className="fill-61FF5E" />
<path d="M59.8945 33.343L26.7275 66.5101C24.9692 68.2683 24.9692 71.1191 26.7275 72.8774C28.4858 74.6357 31.3365 74.6357 33.0948 72.8774L66.2618 39.7103L66.6482 46.7572C66.8353 50.1711 70.9741 51.7541 73.3917 49.3365C74.186 48.5422 74.605 47.4475 74.5439 46.3258L73.6978 30.7949C73.56 28.2647 71.5511 26.2376 69.0222 26.0769L53.2959 25.078C52.1647 25.0061 51.0572 25.4242 50.2557 26.2257C47.843 28.6384 49.4228 32.7689 52.8298 32.9557L59.8945 33.343Z" className="fill-13A90F" />
</svg>
	)
}