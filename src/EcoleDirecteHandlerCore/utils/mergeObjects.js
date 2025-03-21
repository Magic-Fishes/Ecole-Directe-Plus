
export function mergeObjectDefault(definedObject, defaultObject) {
	return Object.fromEntries([...Object.keys(definedObject), ...Object.keys(defaultObject)].map((key) => ([
		key,
		(definedObject[key] !== undefined || defaultObject[key] === undefined) ? definedObject[key] : defaultObject[key]
	])));
}
