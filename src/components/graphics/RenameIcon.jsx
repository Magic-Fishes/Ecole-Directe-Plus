
import "./graphics.css"
export default function RenameIcon ({ className="", id="", alt, ...props }) {
    return (
<svg aria-label={alt} className={className} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...props}>
  <path d="M10 4H8V6H5C3.34315 6 2 7.34315 2 9V15C2 16.6569 3.34315 18 5 18H8V20H10V4ZM8 8V16H5C4.44772 16 4 15.5523 4 15V9C4 8.44772 4.44772 8 5 8H8Z" className="fill-text-alt" fillRule="evenodd" clipRule="evenodd" />
  <path d="M19 16H12V18H19C20.6569 18 22 16.6569 22 15V9C22 7.34315 20.6569 6 19 6H12V8H19C19.5523 8 20 8.44771 20 9V15C20 15.5523 19.5523 16 19 16Z" className="fill-text-alt" />
</svg>
	)
}