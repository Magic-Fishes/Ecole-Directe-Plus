import "./graphics.css";

export default function UpArrow({ className = "", id = "", alt, ...props }) {
    return (
        <svg
            id={id}
            aria-label={alt}
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 123.969 123.97"
            {...props}
        >
            <path d="M120.266,95.584c5.301-5.801,4.801-14.801-0.8-20.301l-47.3-47.4c-2.8-2.8-6.5-4.2-10.2-4.2s-7.399,1.4-10.2,4.2   l-47.299,47.3c-5.5,5.5-6.1,14.6-0.8,20.3c5.6,6.101,15.099,6.3,20.9,0.5l30.3-30.3c3.899-3.9,10.2-3.9,14.1,0l30.3,30.3   C105.167,101.883,114.667,101.684,120.266,95.584z" />
        </svg>
    );
}