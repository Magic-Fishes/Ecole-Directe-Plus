export const createSnowfall = (container) => {
    console.log("Snowfall created");
    for (let i = 0; i < 200; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snow';
        snowflake.innerHTML = '&#10052;';
        snowflake.style.fontSize = `${Math.random() * 1 + 3}vw`; // Taille aléatoire
        snowflake.style.left = `${Math.random() * 100}vw`; // Position aléatoire
        snowflake.style.animationDuration = `${Math.random() * 5 + 5}s`; // Durée d'animation aléatoire
        snowflake.style.animationDelay = `${Math.random() * 10}s`; // Délai d'animation aléatoire
        snowflake.style.setProperty('--left-ini', `${Math.random() * 20 - 10}vw`); // Position de départ aléatoire
        snowflake.style.setProperty('--left-end', `${Math.random() * 20 - 10}vw`); // Position de fin aléatoire
        container.appendChild(snowflake);
    }
};