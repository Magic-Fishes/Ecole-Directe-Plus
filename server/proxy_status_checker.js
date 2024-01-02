// ! for instance, you have to manually update the file on the server. It won't be done automatically with Github CI.

function isDomainReachable(domain) {
    return fetch(`https://${domain}`)
        .then(response => {
            // Check if the status code is in the range of 200 to 299
            if (response.ok) {
                return true;
            } else {
                return false;
            }
        })
        .catch(error => {
            // Handle network errors or any other issues
            console.error("Error:", error);
            return false;
        });
}

async function sendToDiscordWebhook(webhookURL, content, message) {
    try {
        const response = await fetch(webhookURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                content: content,
                embeds: [
                    {
                        color: parseInt("0xFF0000"),
                        description: message,
                    }
                ]
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to send message. HTTP status code: ${response.status}`);
        }

        console.log("Message sent successfully!");
    } catch (error) {
        console.error("Error sending message:", error.message);
    }
}


const webhookURL = "WEBHOOK_URL_PLACEHOLDER";
const domainToCheck = "api.ecoledirecte.com";

isDomainReachable(domainToCheck)
    .then(result => {
        if (result) {
            console.log(`${domainToCheck} is reachable.`);
        } else {
            console.log(`${domainToCheck} is not reachable.`);
            sendToDiscordWebhook(webhookURL, "@everyone", `PROXY ERROR: EcoleDirecte API (${domainToCheck}) unreachable`)
        }
    });
