const words = ["Facing foreclosure, probate, or inherited a property?", "We buy houses in any condition, anywhere.", "Get a fair cash offer today-quick, hassle-free, and on your terms!"];
// const colors = ["#6D28D9", "#EF4444"];
let currentIndex = 0;
let charIndex = 0;
const typewriterText = document.getElementById("typewriter-text");

function typeWriter() {
    if (charIndex < words[currentIndex].length) {
        // Type the next character
        typewriterText.textContent += words[currentIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 120); // Typing speed (100ms per character)
    } else {
        // Wait for 1 second, then start deleting
        setTimeout(deleteText, 3000);
    }
}

function deleteText() {
    if (charIndex > 0) {
        // Delete the last character
        typewriterText.textContent = words[currentIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(deleteText, 30); // Deleting speed (50ms per character)
    } else {
        // Move to the next word
        currentIndex = (currentIndex + 1) % words.length;
        // typewriterText.style.color = colors[currentIndex]; // Change color
        setTimeout(typeWriter, 500); // Delay before typing the next word
    }
}

// Start the typewriter effect
document.onload(setTimeout(typeWriter, 2000)); // Delay before starting the effect