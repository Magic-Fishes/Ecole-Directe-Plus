import { apiVersion } from "../constants/config";

export default async function fetchSchoolLife(schoolYear, userId, token, controller = null) {
	const headers = new Headers();
	headers.append("x-token", token);
	headers.append("content-type", "application/x-www-form-urlencoded");

	const body = new URLSearchParams();
	body.append("data", JSON.stringify({ anneeScolaire: schoolYear }));

	const options = {
		method: "POST",
		headers,
		body,
		signal: controller?.signal,
		referrerPolicy: "no-referrer"
	}

	return fetch(`https://api.ecoledirecte.com/v3/eleves/${userId}/viescolaire.awp?verbe=get&v=${apiVersion}`, options)
		.then((response) => response.json())
		.then((response) => {
			code = response.code;
			if (code === 200 || code === 210) { // 210: quand l'utilisateur n'a pas de retard/absence/sanction
				const oldSchoolLife = structuredClone(schoolLife);
				oldSchoolLife[selectedUserIndex.value] = response.data;
				setSchoolLife(oldSchoolLife);
				setTokenState(response.token);
			} else if (code === 520 || code === 525) {
				// token invalide
				console.log("INVALID TOKEN: LOGIN REQUIRED");
				requireLogin();
			} else if (code === 403) {
				setTokenState((old) => (response.token || old));
			}
		})
		.catch((error) => {
			if (error.message === "Unexpected token 'P', \"Proxy error\" is not valid JSON") {
				setProxyError(true);
			}
		})
		.finally(() => {
			abortControllers.current.splice(abortControllers.current.indexOf(controller), 1);
		})
}