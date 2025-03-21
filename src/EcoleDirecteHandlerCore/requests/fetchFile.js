export default async function fetchFile(fileId, fileType, token, specialParams) {
	const specialUrlParams = new URLSearchParams(specialParams);

	const headers = new Headers();
	headers.append("x-token", token);
	headers.append("content-type", "application/x-www-form-urlencoded");

	const body = new URLSearchParams();
	body.append("data", JSON.stringify({ forceDownload: 0 }));

	const options = {
		method: "POST",
		headers,
		body,
		referrerPolicy: "no-referrer"
	}

	return await fetch(`https://api.ecoledirecte.com/v3/telechargement.awp?verbe=get&fichierId=${fileId}&leTypeDeFichier=${fileType}${specialUrlParams.toString()}`, options)
		.catch((error) => {
			error.type = "FETCH_ERROR";
			throw error;
		})
		.then((response) => {
			console.log(response);
			return response.blob();
		});
}
  
export default async function fetchGrades(schoolYear, userId, token, controller = undefined) {
	const headers = new Headers();
	headers.append("x-token", token);

	const body = new URLSearchParams();
	body.append("data", JSON.stringify({ anneeScolaire: schoolYear }));

	const options = {
		method: "POST",
		headers,
		body,
		signal: controller?.signal,
		referrerPolicy: "no-referrer",
	};

	return fetch(`https://api.ecoledirecte.com/v3/eleves/${userId}/notes.awp?verbe=get&v=${apiVersion}`, options)
		.catch((error) => {
			error.type = "FETCH_ERROR"
			throw error;
		})
		.then((response) => response.json())
		.then((response) => {
			if (!response) {
				throw new EdpError(FetchErrorBuilders.EMPTY_RESPONSE);
			}
			if (response.code < 300) {
				return response;
			}
			switch (response.code) {
				case 520:
					throw new EdpError(FetchErrorBuilders.INVALID_TOKEN);
				case 525:
					throw new EdpError(FetchErrorBuilders.EXPIRED_TOKEN);
				default: // UNHANDLED ERROR
					throw new EdpError({
						name: "UnhandledError",
						code: response.code,
						message: response.message,
					});
			}
		})
}
