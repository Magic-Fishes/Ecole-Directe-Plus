import "./EDPLogo.css"

export default function EDPLogo({ className="", id="", alt, ...props }) {

    return (
        <svg className={"edp-logo " + className} id={id} viewBox="0 0 91 86" xmlns="http://www.w3.org/2000/svg" role="img" {...props}>
            <title>{alt}</title>
            <path fill={"url(#gradient-" + id + ")"} className="paths" d="M89.9985 24V0H31.9985C21.3319 0.833333 0 7.3 0 38.5C5.50049 26.5 17.499 24 21.4985 24H89.9985Z" />
            <path fill={"url(#gradient-" + id + ")"} className="paths" d="M90.0017 55V31.5H27.0016C-9.00047 31.5 -9.00055 86 27.0016 86H90.0017V62.5H27.0016C22.0011 62.5 22.0013 55 27.0016 55H90.0017Z" />
            <linearGradient id={"gradient-" + id}>
                <stop className="start" offset="0%" />
                <stop className="end" offset="100%" />
            </linearGradient>
        </svg>
    )
}
