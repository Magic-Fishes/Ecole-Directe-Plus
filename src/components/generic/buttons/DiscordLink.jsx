import DiscordLogo from "../../graphics/DiscordLogo";
import "./SocialButtonLink.css";

export default function DiscordLink({ ...props }) {
    return (
        <>
            <a className="social-button-link" href="https://discord.gg/AKAqXfTgvE" target="_blank" {...props}><DiscordLogo /></a>
        </>
    )
}