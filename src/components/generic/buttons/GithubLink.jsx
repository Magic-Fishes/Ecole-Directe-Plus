import GithubLogo from "../../graphics/GithubLogo";
import "./SocialButtonLink.css";

export default function GithubLink({ ...props }) {
    return (
        <>
            <a className="social-button-link" href="https://github.com/Magic-Fishes/Ecole-Directe-Plus-Unblock" target="_blank" {...props} ><GithubLogo /></a>
        </>
    )
}