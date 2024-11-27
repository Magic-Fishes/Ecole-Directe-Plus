export const createSnowfall = (container) => {
    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snow';
        snowflake.innerHTML = '&#10052;';
        snowflake.style.fontSize = `${Math.random() * 1 + 3}vw`;
        snowflake.style.left = `${Math.random() * 100}vw`;
        snowflake.style.filter = `blur(${Math.random() * 5}px)`;
        snowflake.style.animationDuration = `${Math.random() * 5 + 5}s`;
        snowflake.style.animationDelay = `${Math.random() * 10}s`;
        snowflake.style.setProperty('--left-ini', `${Math.random() * 20 - 10}vw`);
        snowflake.style.setProperty('--left-end', `${Math.random() * 20 - 10}vw`);
        container.appendChild(snowflake);
    }

    console.log("Snowfall created");
};