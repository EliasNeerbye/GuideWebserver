// Image modal functionality
const dialog = document.getElementById("imageModal");
const dialogImage = dialog.querySelector(".dialog-image");
const dialogClose = dialog.querySelector(".dialog-close");

document.querySelectorAll(".image-container img").forEach((img) => {
    img.addEventListener("click", () => {
        dialogImage.src = img.src;
        dialogImage.alt = img.alt;
        dialog.showModal();
    });
});

dialogClose.addEventListener("click", () => {
    dialog.close();
});

dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
        dialog.close();
    }
});

document.querySelectorAll("pre").forEach((pre) => {
    const wrapper = document.createElement("div");
    wrapper.className = "code-block";
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const copyButton = document.createElement("button");
    copyButton.className = "copy-button";
    copyButton.textContent = "Copy";
    wrapper.appendChild(copyButton);

    copyButton.addEventListener("click", async () => {
        // Get text and clean it up
        const rawText = pre.innerText;
        const cleanedText = rawText
            .split("\n") // Split into lines
            .map((line) => line.trim()) // Trim each line
            .filter((line) => line.length > 0) // Remove empty lines
            .join("\n"); // Rejoin with newlines

        try {
            // First check if we have clipboard permissions
            if (!navigator.clipboard) {
                throw new Error("Clipboard API not available");
            }

            await navigator.clipboard.writeText(cleanedText);
            copyButton.textContent = "Copied!";
        } catch (err) {
            console.error("Failed to copy:", err);

            // Fallback method using execCommand
            try {
                const textArea = document.createElement("textarea");
                textArea.value = cleanedText;
                textArea.style.position = "fixed"; // Avoid scrolling
                textArea.style.opacity = "0";
                document.body.appendChild(textArea);
                textArea.select();

                const success = document.execCommand("copy");
                textArea.remove();

                if (success) {
                    copyButton.textContent = "Copied!";
                } else {
                    throw new Error("execCommand failed");
                }
            } catch (fallbackErr) {
                console.error("Fallback copy failed:", fallbackErr);
                copyButton.textContent = "Failed";
            }
        }

        setTimeout(() => {
            copyButton.textContent = "Copy";
        }, 2000);
    });
});

// Progress bar
function updateProgressBar() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;
    document.querySelector(".progress-indicator").style.width = `${progress}%`;
}

window.addEventListener("scroll", updateProgressBar);
window.addEventListener("resize", updateProgressBar);
updateProgressBar();

// Active section tracking - Improved version
function updateActiveSection() {
    const sections = document.querySelectorAll(".step");
    const tocLinks = document.querySelectorAll(".toc a");

    // Get all section positions
    const sectionPositions = Array.from(sections).map((section) => ({
        id: section.id,
        top: section.offsetTop - 100, // Add some offset for better UX
        bottom: section.offsetTop + section.offsetHeight - 100,
    }));

    // Get current scroll position
    const scrollPosition = window.scrollY + window.innerHeight / 3;

    // Find the current section
    let currentSection = null;
    for (const section of sectionPositions) {
        if (scrollPosition >= section.top && scrollPosition <= section.bottom) {
            currentSection = section.id;
            break;
        }
    }

    // Update TOC highlighting
    tocLinks.forEach((link) => {
        const href = link.getAttribute("href").substring(1); // Remove #
        if (href === currentSection) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

// Listen for scroll events to update active section
window.addEventListener("scroll", updateActiveSection);
window.addEventListener("resize", updateActiveSection);
// Initial call
updateActiveSection();

// Calculate reading time
function calculateReadingTime() {
    const text = document.querySelector("main").textContent;
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute
    document.getElementById("readingTime").textContent = readingTime;
}

calculateReadingTime();

// Keyboard navigation
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && dialog.open) {
        dialog.close();
    }
});
