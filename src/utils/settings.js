export function encodeSettings(setting) {
    const boolOrder = [
        "isSepiaEnabled",
        "isHighContrastEnabled",
        "isGrayscaleEnabled",
        "isPhotoBlurEnabled",
        "gradeScale",
        "isGradeScaleEnabled",
        "lucioleFont",
        "allowWindowsArrangement",
        "dynamicLoading",
        "negativeBadges",
        "allowAnonymousReports",
    ];

    const choiceOrder = [
        "displayTheme",
        "displayMode",
    ];

    const intOrder = [
        "gradeScale",
    ];

    let encodedBool = "1";
    let encodedChoice = "";
    let encodedInt = "";

    for (const i of boolOrder) {
        encodedBool = encodedBool + (setting[i].value ? 1 : 0)
    }
    for (const i of choiceOrder) {
        encodedChoice = encodedChoice + setting[i].values.indexOf(setting[i].value) + ",";
    }
    encodedChoice = encodedChoice.slice(0, -1);
    for (const i of intOrder) {
        encodedInt = encodedInt + (setting[i].value - setting[i].min) + ","
    }
    encodedInt = encodedInt.slice(0, -1);
    return `${parseInt(encodedBool, 2)};${encodedChoice};${encodedInt}`
}

export function decodeSettings(encodedSettings, initSettingsCallback) {
    let [encodedBool, encodedChoice, encodedInt] = encodedSettings.split(";");
    encodedBool = parseInt(encodedBool).toString(2)
    encodedChoice = encodedChoice.split(",").map(e => parseInt(e))
    encodedInt = encodedInt.split(",").map(e => parseInt(e))
    const boolOrder = [
        "isSepiaEnabled",
        "isHighContrastEnabled",
        "isGrayscaleEnabled",
        "isPhotoBlurEnabled",
        "gradeScale",
        "isGradeScaleEnabled",
        "lucioleFont",
        "allowWindowsArrangement",
        "dynamicLoading",
        "negativeBadges",
        "allowAnonymousReports",
    ];

    const choiceOrder = [
        "displayTheme",
        "displayMode",
    ];
    
    const intOrder = [
        "gradeScale",
    ];

    const decodedSetting = initSettingsCallback([0])[0]
    for (const i in decodedSetting) {
        decodedSetting[i].value = undefined
    }

    console.log(JSON.parse(JSON.stringify(decodedSetting)))

    for (const i in encodedBool) {
        decodedSetting[boolOrder[i]].value = encodedBool[i] === "1"
    }


    encodedChoice.forEach((e, i) => {
        decodedSetting[choiceOrder[i]].value = decodedSetting[choiceOrder[i]].values[e]
    });

    for (const i in encodedInt) {
        const currentSetting = intOrder[i]
        decodedSetting[currentSetting].value = encodedInt[i] + decodedSetting[currentSetting].min
    }
    return decodedSetting
}