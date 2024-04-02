import GithubLogo from "../../graphics/GithubLogo";
import "./SocialButtonLink.css";

export default function GithubLink({ githubRepoHref="https://github.com/Magic-Fishes/Ecole-Directe-Plus", ...props }) {
    return (
        <>
            <a className="social-button-link" href={githubRepoHref} target="_blank" {...props} ><GithubLogo /></a>
        </>
    )
}