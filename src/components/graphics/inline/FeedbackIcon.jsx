
import "../graphics.css"
export default function Feedback ({ className="", id="", alt }) {
    return (
<svg className={className} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 15" fill="none">
<title>{alt}</title>
<path d="M2.8 0H1.17895C0.527833 0 0 0.527832 0 1.17895C0 6.71342 4.48658 11.2 10.0211 11.2H14.4V13.5858C14.4 14.4767 15.4771 14.9229 16.1071 14.2929L20.2929 10.1071C20.6834 9.71658 20.6834 9.08342 20.2929 8.69289L16.1071 4.50711C15.4771 3.87714 14.4 4.32331 14.4 5.21421V7.6H10.4C6.64446 7.6 3.6 4.55554 3.6 0.8C3.6 0.358172 3.24183 0 2.8 0Z" className="fill-background-header" />
</svg>
	)
}