import "./Button.css";

export default function Button({ buttonType="button", children, value, onClick, disabled=false, state="", className="", id="", ...props }) {
    const allowedButtonTypes = ["button", "submit"];
    if (!allowedButtonTypes.includes(buttonType)) {
        buttonType = "button";
    }

    return (
        <button
            type={buttonType}
            value={value}
            onClick={onClick}
            className={`button ${className} ${(buttonType === "submit" ? "submitter" : "")} ${state} ${disabled ? "disabled" : ""}`}
            id={id}
            disabled={disabled}
            {...props}
        >
            {value && value}
            {children && children}
        </button>
    )
}
