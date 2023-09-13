
import "./graphics.css"
export default function PasteIcon ({ className="", id="", alt, ...props }) {
    return (
<svg aria-label={alt} className={className} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" {...props}>
<g clipPath="url(#clip0_1765_60)">
<path d="M71.875 37.5V56.25H90.625M71.875 37.5L90.625 56.25M71.875 37.5H46.875V93.75H90.625V56.25" className="stroke-text-main" strokeWidth="6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
<path d="M62.5 18.75H37.5V12.5C37.5 9.0625 40.3125 6.25 43.75 6.25H56.25C59.6875 6.25 62.5 9.0625 62.5 12.5V18.75Z" className="stroke-text-main" strokeWidth="6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
<path d="M46.875 87.5H31.25C24.375 87.5 18.75 81.875 18.75 75V25C18.75 18.125 24.375 12.5 31.25 12.5H37.5" className="stroke-text-main" strokeWidth="6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
<path d="M62.5 12.5H68.75C75.625 12.5 81.25 18.125 81.25 25V46.875" className="stroke-text-main" strokeWidth="6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
</g>
<defs>
<clipPath id="clip0_1765_60">
<rect width="100" height="100" className="fill-text-main" />
</clipPath>
</defs>
</svg>
	)
}