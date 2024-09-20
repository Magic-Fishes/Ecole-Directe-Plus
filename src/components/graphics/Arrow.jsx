
import "./graphics.css"
export default function Arrow({ className = "", id = "", alt, ...props }) {
    return (
        <svg aria-label={alt} className={className} id={id} height="20px" width="20px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="-62.7 -62.7 455.40 455.40" xmlSpace="preserve" strokeWidth="33"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_337_" d="M253.858,234.26c-2.322-5.605-7.792-9.26-13.858-9.26h-60V15c0-8.284-6.716-15-15-15 c-8.284,0-15,6.716-15,15v210H90c-6.067,0-11.537,3.655-13.858,9.26c-2.321,5.605-1.038,12.057,3.252,16.347l75,75 C157.322,328.536,161.161,330,165,330s7.678-1.464,10.607-4.394l75-75C254.896,246.316,256.18,239.865,253.858,234.26z M165,293.787 L126.213,255h77.573L165,293.787z"></path> </g></svg>
    )
}