/**
 * AI Chatbot Initialization Script
 * Easy integration for any page
 */

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if chatbot is already initialized
    if (window.aiChatbot && typeof window.aiChatbot.init === 'function') {
        window.aiChatbot.init();
    } else {
        console.warn('AI Chatbot not found. Make sure api-config.js and ai-chatbot.js are loaded.');
    }
});

// Alternative initialization for pages that load scripts dynamically
window.initAIChatbot = function() {
    if (window.aiChatbot && typeof window.aiChatbot.init === 'function') {
        window.aiChatbot.init();
    } else {
        console.warn('AI Chatbot not found. Make sure api-config.js and ai-chatbot.js are loaded.');
    }
}; 