
import "./TextInput.css"

export default function TextInput({ className, textType, placeholder, value, onChange}) {
    const availableTextTypes = ["text", "password", "email", "search", "url"];
    if (!availableTextTypes.includes(textType)) {
        textType = "text";
    }

    return (
        <input className={"text-input " + className} type={textType} placeholder={placeholder} value={value} onChange={onChange} />
    )
}