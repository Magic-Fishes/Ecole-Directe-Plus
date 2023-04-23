
import "./TextInput.css"

export default function TextInput({ className, textType, placeholder, value, onChange}) {
    const allowedTextTypes = ["text", "password", "email", "search", "url"];
    if (!allowedTextTypes.includes(textType)) {
        textType = "text";
    }
    //pk pour définir className tu fais pas "text-input-"+className??
    return (
        <input className={"text-input " + className} type={textType} placeholder={placeholder} value={value} onChange={onChange} />
    )
}