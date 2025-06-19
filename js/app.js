document.addEventListener("DOMContentLoaded", () => {
    // Timer Config
    const minuteEl = document.getElementById("minute");
    const secondEl = document.getElementById("second");

    let timerStarted = false;

    // Timer Function
    function startTimer(durationInSeconds) {
        let remaining = durationInSeconds;

        const updateTimer = () => {
            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;

            minuteEl.textContent = String(minutes).padStart(2, "0");
            secondEl.textContent = String(seconds).padStart(2, "0");

            if (remaining > 0) {
                remaining--;
            } else {
                clearInterval(timer);
            }
        };

        updateTimer(); // update immediately
        const timer = setInterval(updateTimer, 1000);
    }

    // Chat Functions
    const chatInbox = document.querySelector(".live-chat-inbox");
    const ctaButton = document.querySelector(".cta-button");
    let step = 0;

    function showTyping() {
        const box = document.createElement("div");
        box.className = "chat-box-container";
        const typing = document.createElement("div");
        typing.className = "agent-chat-box typing";
        typing.innerHTML = `
        <img class="live-chat-typing-dot dot-1" src="./images/Typing-Dot.svg" alt="">
        <img class="live-chat-typing-dot dot-2" src="./images/Typing-Dot.svg" alt="">
        <img class="live-chat-typing-dot dot-3" src="./images/Typing-Dot.svg" alt="">
      `;
        box.appendChild(typing);
        chatInbox.appendChild(box);
        return typing.parentElement;
    }

    function removeLastClasses() {
        const all = chatInbox.querySelectorAll(".chat-box-container");
        all.forEach(box => box.classList.remove("last"));
    }

    function appendAgentMessage(message) {
        removeLastClasses();
        const box = document.createElement("div");
        box.className = "chat-box-container last";
        const agent = document.createElement("div");
        agent.className = "agent-chat-box";
        agent.innerHTML = `<div>${message}</div>`;
        box.appendChild(agent);
        chatInbox.appendChild(box);
    }

    function appendUserButtons(options) {
        removeLastClasses();
        const container = document.createElement("div");
        container.className = "chat-box-container user last";
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "chat-buttons-container";
        options.forEach(([text, reply]) => {
            const button = document.createElement("a");
            const t = text.toLowerCase();
            button.className = "chat-button" + (t === "yes" ? " agree" : t === "no" ? " disagree" : "");
            button.href = "#";
            button.textContent = text;
            button.addEventListener("click", function (e) {
                e.preventDefault();
                container.removeChild(buttonContainer);
                const userBubble = document.createElement("div");
                userBubble.className = "user-chat-box";
                userBubble.innerHTML = `<div>${reply}</div>`;
                container.appendChild(userBubble);
                setTimeout(() => continueChat(), 500);
            });
            buttonContainer.appendChild(button);
        });
        container.appendChild(buttonContainer);
        chatInbox.appendChild(container);
    }

    function continueChat() {
        if (step >= chatData.length) {
            // Add final call button
            const finalContainer = document.createElement("div");
            finalContainer.className = "chat-box-container last";
            const phoneNumber = "1-800-123-4567";
            const callBtn = document.createElement("a");
            callBtn.href = `tel:${phoneNumber.replace(/[^0-9]/g, "")}`;
            callBtn.className = "call-button w-inline-block";
            callBtn.innerHTML = `
            <img src="https://cdn.prod.website-files.com/684ba282439467badb4483b4/6852826e958a26cb9393bd8f_Call%20Icon.svg" loading="lazy" alt="Call Agent" class="call-icon">
            <div>${phoneNumber}</div>
        `;
            finalContainer.appendChild(callBtn);
            chatInbox.appendChild(finalContainer);
            return;
        }

        const entry = chatData[step++];

        // If agent message, show typing first
        if (typeof entry === "string") {
            const typingBox = showTyping();
            const delay = 1000 + Math.random() * 1500;

            setTimeout(() => {
                typingBox.remove();
                appendAgentMessage(entry);
                continueChat();
            }, delay);
        }

        // If user options, skip typing
        else if (entry.options && Array.isArray(entry.options[0])) {
            appendUserButtons(entry.options);
        }
    }

    // 🔁 Start on CTA click
    ctaButton.addEventListener("click", () => {
        step = 0;
        chatInbox.innerHTML = ""; // clear old chat
        continueChat();

        // Timer Function
        if (!timerStarted) {
            startTimer(120); // 2 minutes in seconds
            timerStarted = true;
        }
    });
});