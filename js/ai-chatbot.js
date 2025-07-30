/**
 * AI Chatbot Class
 * Complete chatbot functionality with OpenAI integration
 */
class AIChatbot {
    constructor() {
        this.isOpen = false;
        this.isLoading = false;
        this.isFullscreen = false;
        this.chatHistory = [];
        this.maxHistoryLength = 50;
        this.elements = {};
    }

    /**
     * Initialize the chatbot
     */
    async init() {
        this.createChatbotHTML();
        this.bindEvents();
        await this.initializeAPI();
    }

    /**
     * Create the complete HTML structure
     */
    createChatbotHTML() {
        // Create toggle button
        const toggleButton = document.createElement('div');
        toggleButton.className = 'ai-chatbot-toggle';
        toggleButton.innerHTML = `
            <i class="fas fa-robot"></i>
            <span>AI Spice Assistant</span>
        `;
        toggleButton.setAttribute('aria-label', 'Open AI Spice Assistant');

        // Create main container
        const container = document.createElement('div');
        container.className = 'ai-chatbot-container';
        container.innerHTML = `
            <div class="ai-chatbot-header">
                <div class="ai-chatbot-title">
                    <i class="fas fa-robot"></i>
                    <span>AI Spice Assistant</span>
                </div>
                <div class="ai-chatbot-actions">
                    <button class="ai-chatbot-fullscreen" aria-label="Toggle fullscreen">
                        <i class="fas fa-expand"></i>
                    </button>
                    <button class="ai-chatbot-close" aria-label="Close chatbot">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="ai-chatbot-messages">
                <div class="ai-chatbot-welcome">
                    <h3>Welcome to Indrayani Naturals! 🌶️</h3>
                    <p>I'm your AI Spice Assistant. I can help you with:</p>
                    <ul>
                        <li>Product information and recommendations</li>
                        <li>Recipe suggestions and cooking tips</li>
                        <li>Spice combinations and traditional dishes</li>
                        <li>Storage tips and cooking techniques</li>
                        <li>Health benefits and spice origins</li>
                        <li>Pricing and ordering information</li>
                        <li>Contact and business details</li>
                    </ul>
                    <p>How can I assist you today?</p>
                </div>
            </div>
            <div class="ai-chatbot-input-area">
                <div class="ai-chatbot-input-group">
                    <input type="text" class="ai-chatbot-input" placeholder="Ask me anything about spices..." aria-label="Chat input">
                    <button class="ai-chatbot-send" aria-label="Send message">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
                <div class="ai-chatbot-quick-actions">
                    <button class="ai-chatbot-quick-btn" data-action="products">Our Products</button>
                    <button class="ai-chatbot-quick-btn" data-action="recipes">Recipe Ideas</button>
                    <button class="ai-chatbot-quick-btn" data-action="cooking-tips">Cooking Tips</button>
                    <button class="ai-chatbot-quick-btn" data-action="contact">Contact Info</button>
                </div>
            </div>
            <div class="ai-chatbot-status">
                <span class="ai-chatbot-status-text">Initializing...</span>
            </div>
        `;

        // Add to page
        document.body.appendChild(toggleButton);
        document.body.appendChild(container);

        // Store element references
        this.elements = {
            toggleButton,
            container,
            messages: container.querySelector('.ai-chatbot-messages'),
            input: container.querySelector('.ai-chatbot-input'),
            sendButton: container.querySelector('.ai-chatbot-send'),
            closeButton: container.querySelector('.ai-chatbot-close'),
            fullscreenButton: container.querySelector('.ai-chatbot-fullscreen'),
            status: container.querySelector('.ai-chatbot-status-text'),
            quickButtons: container.querySelectorAll('.ai-chatbot-quick-btn')
        };
    }

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Toggle chatbot
        this.elements.toggleButton.addEventListener('click', () => this.toggleChatbot());

        // Close chatbot
        this.elements.closeButton.addEventListener('click', () => this.closeChatbot());

        // Fullscreen toggle
        this.elements.fullscreenButton.addEventListener('click', () => this.toggleFullscreen());

        // Send message
        this.elements.sendButton.addEventListener('click', () => this.sendMessage());
        this.elements.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Quick action buttons
        this.elements.quickButtons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChatbot();
            }
        });

        // Fullscreen change events
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('MSFullscreenChange', () => this.handleFullscreenChange());
    }

    /**
     * Initialize API connection
     */
    async initializeAPI() {
        try {
            await window.apiConfig.initialize();
            this.updateStatus();
            this.enableInput();
        } catch (error) {
            console.error('Failed to initialize API:', error);
            this.updateStatus('API not available - using fallback responses');
        }
    }

    /**
     * Toggle chatbot visibility
     */
    toggleChatbot() {
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.isOpen = true;
            this.elements.container.classList.add('ai-chatbot-open');
            this.elements.input.focus();
        }
    }

    /**
     * Handle fullscreen state changes
     */
    handleFullscreenChange() {
        const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || 
                               document.mozFullScreenElement || document.msFullscreenElement);
        
        this.isFullscreen = isFullscreen;
        
        if (isFullscreen) {
            // Entered fullscreen
            this.elements.container.classList.add('ai-chatbot-fullscreen');
            this.elements.fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>';
            this.elements.fullscreenButton.setAttribute('aria-label', 'Exit fullscreen');
        } else {
            // Exited fullscreen
            this.elements.container.classList.remove('ai-chatbot-fullscreen');
            this.elements.fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
            this.elements.fullscreenButton.setAttribute('aria-label', 'Enter fullscreen');
        }
    }

    /**
     * Close chatbot
     */
    closeChatbot() {
        this.isOpen = false;
        
        // Exit fullscreen if active
        if (this.isFullscreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else {
                this.exitCSSFullscreen();
            }
        }
        
        this.elements.container.classList.remove('ai-chatbot-open', 'ai-chatbot-fullscreen');
        this.elements.fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
        this.elements.fullscreenButton.setAttribute('aria-label', 'Enter fullscreen');
        
        // Reset container styles
        this.elements.container.style.display = '';
        this.elements.container.style.transform = '';
    }

    /**
     * Toggle fullscreen mode
     */
    async toggleFullscreen() {
        try {
            if (!this.isFullscreen) {
                // Enter fullscreen mode
                if (this.elements.container.requestFullscreen) {
                    await this.elements.container.requestFullscreen();
                } else if (this.elements.container.webkitRequestFullscreen) {
                    await this.elements.container.webkitRequestFullscreen();
                } else if (this.elements.container.msRequestFullscreen) {
                    await this.elements.container.msRequestFullscreen();
                } else {
                    // Fallback to CSS fullscreen if browser API not supported
                    this.enterCSSFullscreen();
                }
            } else {
                // Exit fullscreen mode
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    await document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    await document.msExitFullscreen();
                } else {
                    // Fallback to CSS fullscreen if browser API not supported
                    this.exitCSSFullscreen();
                }
            }
        } catch (error) {
            console.warn('Fullscreen API not supported, using CSS fallback:', error);
            // Fallback to CSS fullscreen
            if (!this.isFullscreen) {
                this.enterCSSFullscreen();
            } else {
                this.exitCSSFullscreen();
            }
        }
    }

    /**
     * Enter CSS fallback fullscreen mode
     */
    enterCSSFullscreen() {
        this.isFullscreen = true;
        this.elements.container.classList.add('ai-chatbot-fullscreen');
        this.elements.fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>';
        this.elements.fullscreenButton.setAttribute('aria-label', 'Exit fullscreen');
        
        // Ensure the container is visible and properly positioned
        this.elements.container.style.display = 'flex';
        this.elements.container.style.transform = 'none';
        
        // Focus on input for better UX
        setTimeout(() => {
            this.elements.input.focus();
        }, 100);
    }

    /**
     * Exit CSS fallback fullscreen mode
     */
    exitCSSFullscreen() {
        this.isFullscreen = false;
        this.elements.container.classList.remove('ai-chatbot-fullscreen');
        this.elements.fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
        this.elements.fullscreenButton.setAttribute('aria-label', 'Enter fullscreen');
        
        // Reset container styles
        this.elements.container.style.display = '';
        this.elements.container.style.transform = '';
    }

    /**
     * Send message and get response
     */
    async sendMessage() {
        const message = this.elements.input.value.trim();
        if (!message || this.isLoading) return;

        // Add user message
        this.addMessage(message, 'user');
        this.elements.input.value = '';

        // Show loading
        this.setLoading(true);

        try {
            const response = await this.generateResponse(message);
            this.addMessage(response, 'bot');
        } catch (error) {
            console.error('Error generating response:', error);
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Generate AI response
     */
    async generateResponse(message) {
        try {
            if (window.apiConfig.isOpenAIAvailable()) {
                const prompt = this.createPrompt(message);
                return await window.apiConfig.generateText(prompt);
            } else {
                return this.getFallbackResponse(message);
            }
        } catch (error) {
            console.error('AI response error:', error);
            return this.getFallbackResponse(message);
        }
    }

    /**
     * Create context-aware prompt for OpenAI
     */
    createPrompt(message) {
        const context = `You are an AI assistant for Indrayani Naturals, a premium spice company. 
        You specialize in spices, cooking, and culinary knowledge. 
        Be helpful, friendly, and knowledgeable about spices, recipes, and cooking techniques.
        Keep responses concise but informative.`;
        
        return `${context}\n\nUser: ${message}\nAssistant:`;
    }

    /**
     * Handle quick action buttons
     */
    handleQuickAction(action) {
        const actions = {
            products: "products",
            recipes: "recipes",
            "cooking-tips": "cooking tips",
            contact: "contact"
        };

        const message = actions[action] || "Tell me more about this.";
        this.elements.input.value = message;
        this.sendMessage();
    }

    /**
     * Get fallback responses when AI is unavailable
     */
    getFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Product queries - Specific to Indrayani Naturals
        if (lowerMessage.includes('product') || lowerMessage.includes('spice') || lowerMessage.includes('what do you sell') || lowerMessage.includes('offer')) {
            return "🌟 **Our Spice Products:**\n\n" +
                   "• Garam Masala - ₹195/200g\n" +
                   "• Biryani Masala - ₹195/200g\n" +
                   "• Chicken Masala - ₹190/200g\n" +
                   "• Mungvadi - ₹80/100g\n" +
                   "• Kitchen King Masala - ₹185/200g\n" +
                   "• Pav Bhaji Masala - ₹160/200g\n" +
                   "• Onion-Garlic Masala - ₹165/200g\n\n" +
                   "All 100% natural and handcrafted!";
        }

        // Specific product queries
        if (lowerMessage.includes('garam masala')) {
            return "🫘 **Garam Masala** - ₹195/200g\n\n" +
                   "Perfect for curries, rice dishes, and meat preparations.\n" +
                   "Key ingredients: Chilli, coconut, black pepper, cumin, cloves, mace, cardamom & cinnamon.\n\n" +
                   "Our signature blend that adds warmth to your dishes!";
        }

        if (lowerMessage.includes('biryani masala')) {
            return "🍚 **Biryani Masala** - ₹195/200g\n\n" +
                   "Perfect for biryani, khichadi, and rice dishes.\n" +
                   "Key ingredients: Cumin, fennel seeds, nutmeg, cloves, star anise, cinnamon, cardamom & bay leaf.\n\n" +
                   "Transform your rice dishes with this aromatic blend!";
        }

        if (lowerMessage.includes('chicken masala')) {
            return "🍗 **Chicken Masala** - ₹190/200g\n\n" +
                   "Perfect for chicken curries, tandoori, and grilled dishes.\n" +
                   "Key ingredients: Cumin, fennel seeds, cloves, star anise, cinnamon, cardamom, bay leaf & coriander.\n\n" +
                   "Make every chicken dish extraordinary!";
        }

        if (lowerMessage.includes('mungvadi')) {
            return "🫘 **Mungvadi** - ₹80/100g\n\n" +
                   "Perfect for traditional Maharashtrian dishes and vegetarian curries.\n" +
                   "Key ingredients: Mungdal, chilli powder, coriander, garlic, cumin, turmeric, asafoetida & salt.\n\n" +
                   "Experience authentic Indian flavors!";
        }

        if (lowerMessage.includes('kitchen king masala')) {
            return "👑 **Kitchen King Masala** - ₹185/200g\n\n" +
                   "The king of all masalas! Perfect for mixed vegetable dishes and complex curries.\n" +
                   "Key ingredients: Coriander, cumin, black pepper, cardamom, cinnamon, cloves, bay leaf & nutmeg.\n\n" +
                   "Adds royal flavor to any dish!";
        }

        if (lowerMessage.includes('pav bhaji masala')) {
            return "🍞 **Pav Bhaji Masala** - ₹160/200g\n\n" +
                   "Essential for authentic Pav Bhaji and street food dishes.\n" +
                   "Key ingredients: Coriander, cumin, black pepper, red chilli, turmeric, asafoetida & salt.\n\n" +
                   "Recreate street food magic at home!";
        }

        if (lowerMessage.includes('onion garlic masala')) {
            return "🧅 **Onion-Garlic Masala** - ₹165/200g\n\n" +
                   "Perfect base masala for most Indian dishes.\n" +
                   "Key ingredients: Onion powder, garlic powder, coriander, cumin, turmeric, red chilli & salt.\n\n" +
                   "The foundation of great Indian cooking!";
        }

        // Pricing queries
        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much') || lowerMessage.includes('rate')) {
            return "💰 **Our Prices:**\n\n" +
                   "• Garam Masala - ₹195/200g\n" +
                   "• Biryani Masala - ₹195/200g\n" +
                   "• Chicken Masala - ₹190/200g\n" +
                   "• Kitchen King Masala - ₹185/200g\n" +
                   "• Mungvadi - ₹80/100g\n" +
                   "• Pav Bhaji Masala - ₹160/200g\n" +
                   "• Onion-Garlic Masala - ₹165/200g\n\n" +
                   "Bulk orders get special discounts!";
        }

        // Recipe queries
        if (lowerMessage.includes('recipe') || lowerMessage.includes('cook') || lowerMessage.includes('how to use') || lowerMessage.includes('dish')) {
            return "👨‍🍳 **Recipe Ideas:**\n\n" +
                   "**Garam Masala:** Chicken Curry, Vegetable Pulao, Dal Tadka\n" +
                   "**Biryani Masala:** Chicken Biryani, Vegetable Biryani, Khichadi\n" +
                   "**Chicken Masala:** Tandoori Chicken, Chicken Curry, Grilled Chicken\n" +
                   "**Mungvadi:** Traditional Maharashtrian dishes, Lentil curries\n" +
                   "**Kitchen King:** Mixed Vegetable Curry, Paneer Dishes\n" +
                   "**Pav Bhaji:** Street-style Pav Bhaji, Vegetable Masala\n" +
                   "**Onion-Garlic:** Base for most curries, Gravy dishes\n\n" +
                   "Need a specific recipe? Just ask!";
        }

        // Traditional dishes
        if (lowerMessage.includes('traditional') || lowerMessage.includes('maharashtrian') || lowerMessage.includes('regional') || lowerMessage.includes('authentic')) {
            return "🏺 **Traditional Dishes:**\n\n" +
                   "**Maharashtrian Specialties:**\n" +
                   "• Misal Pav (Mungvadi + Pav Bhaji Masala)\n" +
                   "• Bharli Vangi (Kitchen King + Onion-Garlic)\n" +
                   "• Amti (Mungvadi + Garam Masala)\n" +
                   "• Varan Bhaat (Simple lentil rice)\n\n" +
                   "**North Indian Classics:**\n" +
                   "• Butter Chicken (Chicken Masala + Garam Masala)\n" +
                   "• Paneer Tikka (Kitchen King + Yogurt)\n" +
                   "• Dal Makhani (Garam Masala + Cream)\n\n" +
                   "**Street Food Favorites:**\n" +
                   "• Pav Bhaji (Pav Bhaji Masala)\n" +
                   "• Chole Bhature (Garam Masala + Kitchen King)\n" +
                   "• Dahi Puri (Onion-Garlic + Tamarind)\n\n" +
                   "Experience authentic regional flavors! 🍽️";
        }

        // Spice substitutes
        if (lowerMessage.includes('substitute') || lowerMessage.includes('alternative') || lowerMessage.includes('replace') || lowerMessage.includes('instead of')) {
            return "🔄 **Spice Substitutes:**\n\n" +
                   "**Common Substitutions:**\n" +
                   "• Garam Masala: Mix of cinnamon, cardamom, cloves\n" +
                   "• Biryani Masala: Garam Masala + extra cardamom\n" +
                   "• Chicken Masala: Kitchen King + extra red chilli\n" +
                   "• Mungvadi: Mix of mung dal + basic spices\n\n" +
                   "**Flavor Alternatives:**\n" +
                   "• Warming: Cinnamon, Black Pepper\n" +
                   "• Aromatic: Cardamom, Bay Leaf\n" +
                   "• Spicy: Red Chilli, Black Pepper\n" +
                   "• Earthy: Cumin, Coriander\n\n" +
                   "**Pro Tip:** While substitutes work, nothing beats our authentic blends! 🌶️";
        }

        // Contact queries
        if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email') || lowerMessage.includes('address') || lowerMessage.includes('reach')) {
            return "📞 **Contact Us:**\n\n" +
                   "📍 Dighi, Pune, India\n" +
                   "📱 +91-9545100046 (WhatsApp)\n" +
                   "📧 indrayaninaturals@gmail.com\n" +
                   "📧 contact@indrayaninaturals.com\n" +
                   "📷 Instagram: @indrayaninaturals\n\n" +
                   "**Hours:** Monday-Friday 9 AM to 6 PM";
        }

        // Company info
        if (lowerMessage.includes('company') || lowerMessage.includes('about') || lowerMessage.includes('who are you') || lowerMessage.includes('story')) {
            return "🏢 **About Us:**\n\n" +
                   "We're a premium spice company bringing authentic Maharashtrian flavors to your kitchen.\n\n" +
                   "**Our Mission:** Make every dish a celebration with the true taste of Maharashtra.\n\n" +
                   "**What We Offer:**\n" +
                   "• 100% Natural ingredients\n" +
                   "• Traditional recipes\n" +
                   "• Hand-picked spices\n" +
                   "• No additives or preservatives\n\n" +
                   "Taste Naturals Heartbeat, One Spice at a Time! 🌶️";
        }

        // Order queries
        if (lowerMessage.includes('order') || lowerMessage.includes('buy') || lowerMessage.includes('purchase') || lowerMessage.includes('shop')) {
            return "🛒 **How to Order:**\n\n" +
                   "**Call/WhatsApp:** +91-9545100046\n" +
                   "**Email:** indrayaninaturals@gmail.com\n" +
                   "**Visit Store:** Dighi, Pune\n" +
                   "**Payment:** Online, COD, Bank transfer, UPI\n" +
                   "**Bulk Orders:** Special discounts available!";
        }

        // Location queries
        if (lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('store') || lowerMessage.includes('address')) {
            return "📍 **Our Location:**\n\n" +
                   "**Address:**\n" +
                   "Dighi, Pune, India\n\n" +
                   "**How to Find Us:**\n" +
                   "• Located in Dighi area of Pune\n" +
                   "• Easily accessible by road\n" +
                   "• Parking available\n" +
                   "• Google Maps location available\n\n" +
                   "**Store Hours:**\n" +
                   "Monday to Friday: 9 AM to 6 PM\n" +
                   "Saturday: 9 AM to 4 PM\n" +
                   "Sunday: Closed\n\n" +
                   "**Services:**\n" +
                   "• In-store shopping\n" +
                   "• Product consultation\n" +
                   "• Bulk order pickup\n" +
                   "• Recipe guidance\n\n" +
                   "Contact us for directions or to schedule a visit!";
        }

        // Social media
        if (lowerMessage.includes('social') || lowerMessage.includes('facebook') || lowerMessage.includes('instagram') || lowerMessage.includes('follow')) {
            return "📱 **Follow Us:**\n\n" +
                   "**Instagram:** @indrayaninaturals\n" +
                   "Recipe videos, cooking tips, product updates\n\n" +
                   "**WhatsApp:** +91-9545100046\n" +
                   "Direct ordering, quick inquiries, bulk orders\n\n" +
                   "**Email:** indrayaninaturals@gmail.com\n" +
                   "Business inquiries, wholesale orders, feedback\n\n" +
                   "Stay connected for latest updates! 📷";
        }

        // Health benefits
        if (lowerMessage.includes('health') || lowerMessage.includes('benefit') || lowerMessage.includes('ayurvedic') || lowerMessage.includes('natural')) {
            return "🌿 **Health Benefits:**\n\n" +
                   "Our spices are rich in antioxidants and have natural healing properties.\n\n" +
                   "**Key Benefits:**\n" +
                   "• Anti-inflammatory properties\n" +
                   "• Digestive health support\n" +
                   "• Immune system boost\n" +
                   "• Traditional Ayurvedic wisdom\n\n" +
                   "**Specific Benefits:**\n" +
                   "• Garam Masala: Warming, digestive aid\n" +
                   "• Biryani Masala: Aromatic, appetite stimulant\n" +
                   "• Chicken Masala: Protein enhancement\n" +
                   "• Mungvadi: Protein-rich nutrition\n" +
                   "• Kitchen King: Balanced nutrition\n" +
                   "• Pav Bhaji: Digestive support\n" +
                   "• Onion-Garlic: Immune boosting\n\n" +
                   "Pure natural ingredients for your health! 🌿";
        }

        // Spice storage and care
        if (lowerMessage.includes('storage') || lowerMessage.includes('store') || lowerMessage.includes('preserve') || lowerMessage.includes('shelf life') || lowerMessage.includes('expiry')) {
            return "📦 **Spice Storage Tips:**\n\n" +
                   "**Best Storage Practices:**\n" +
                   "• Store in airtight containers\n" +
                   "• Keep in cool, dry place\n" +
                   "• Avoid direct sunlight\n" +
                   "• Keep away from heat sources\n\n" +
                   "**Shelf Life:**\n" +
                   "• Unopened: 2-3 years\n" +
                   "• Opened: 6-12 months\n" +
                   "• Best used within 6 months for maximum flavor\n\n" +
                   "**Signs of Spoilage:**\n" +
                   "• Loss of aroma\n" +
                   "• Change in color\n" +
                   "• Musty smell\n\n" +
                   "Store properly to maintain freshness! 🌶️";
        }

        // Cooking tips
        if (lowerMessage.includes('cooking tip') || lowerMessage.includes('how to cook') || lowerMessage.includes('cooking technique') || lowerMessage.includes('spice technique')) {
            return "👨‍🍳 **Cooking Tips:**\n\n" +
                   "**General Tips:**\n" +
                   "• Add spices at the right time\n" +
                   "• Toast whole spices before grinding\n" +
                   "• Use fresh spices for best flavor\n" +
                   "• Balance flavors properly\n\n" +
                   "**When to Add Spices:**\n" +
                   "• Whole spices: Start of cooking\n" +
                   "• Ground spices: After onions are golden\n" +
                   "• Garam masala: End of cooking\n" +
                   "• Fresh herbs: Just before serving\n\n" +
                   "**Pro Tips:**\n" +
                   "• Bloom spices in hot oil\n" +
                   "• Don't burn spices\n" +
                   "• Taste as you cook\n" +
                   "• Store properly for longevity\n\n" +
                   "Master the art of spice cooking! 🔥";
        }

        // Spice combinations
        if (lowerMessage.includes('combination') || lowerMessage.includes('mix') || lowerMessage.includes('blend') || lowerMessage.includes('pair') || lowerMessage.includes('goes with')) {
            return "🎨 **Spice Combinations:**\n\n" +
                   "**Perfect Pairs:**\n" +
                   "• Garam Masala + Cumin: Rich curries\n" +
                   "• Biryani Masala + Saffron: Luxurious rice\n" +
                   "• Chicken Masala + Yogurt: Tender meat\n" +
                   "• Mungvadi + Turmeric: Healthy lentils\n\n" +
                   "**Regional Combinations:**\n" +
                   "• North Indian: Garam Masala + Kitchen King\n" +
                   "• South Indian: Curry leaves + Mustard seeds\n" +
                   "• Maharashtrian: Mungvadi + Goda masala\n" +
                   "• Street Food: Pav Bhaji + Onion-Garlic\n\n" +
                   "**Flavor Profiles:**\n" +
                   "• Warming: Garam Masala, Cinnamon\n" +
                   "• Aromatic: Biryani Masala, Cardamom\n" +
                   "• Spicy: Chicken Masala, Red Chilli\n" +
                   "• Earthy: Mungvadi, Cumin\n\n" +
                   "Create magic with spice combinations! ✨";
        }

        // Quality queries
        if (lowerMessage.includes('quality') || lowerMessage.includes('natural') || lowerMessage.includes('organic') || lowerMessage.includes('pure')) {
            return "✨ **Our Quality:**\n\n" +
                   "**100% Natural:** No artificial additives or preservatives\n" +
                   "**Premium Quality:** Hand-picked spices from finest sources\n" +
                   "**Traditional Methods:** Generations-old recipes and authentic techniques\n" +
                   "**Made with Love:** Passionate craftsmanship and attention to detail\n\n" +
                   "We maintain the highest standards in every batch! 🌟";
        }

        // Spice origins and sourcing
        if (lowerMessage.includes('origin') || lowerMessage.includes('source') || lowerMessage.includes('where from') || lowerMessage.includes('sourcing') || lowerMessage.includes('ingredients')) {
            return "🌍 **Spice Origins & Sourcing:**\n\n" +
                   "**Our Sourcing Philosophy:**\n" +
                   "• Direct from farmers and trusted suppliers\n" +
                   "• Premium quality ingredients only\n" +
                   "• Traditional growing regions\n" +
                   "• Sustainable and ethical sourcing\n\n" +
                   "**Key Ingredients Origins:**\n" +
                   "• Cardamom: Kerala, Karnataka\n" +
                   "• Cinnamon: Kerala, Sri Lanka\n" +
                   "• Black Pepper: Malabar Coast\n" +
                   "• Cumin: Rajasthan, Gujarat\n" +
                   "• Coriander: Madhya Pradesh\n" +
                   "• Cloves: Kerala, Zanzibar\n\n" +
                   "**Quality Assurance:**\n" +
                   "• Multiple quality checks\n" +
                   "• Traditional processing methods\n" +
                   "• No compromise on authenticity\n\n" +
                   "Every spice tells a story of tradition! 📖";
        }

        // Greetings
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('namaste')) {
            return "Namaste! 🙏\n\n" +
                   "Welcome to **Indrayani Naturals**!\n\n" +
                   "I'm your AI Spice Assistant. I can help with:\n" +
                   "• Our spice products and pricing\n" +
                   "• Traditional recipes\n" +
                   "• Contact information\n" +
                   "• Health benefits\n\n" +
                   "How can I assist you today?";
        }

        // Thanks
        if (lowerMessage.includes('thank') || lowerMessage.includes('thanks') || lowerMessage.includes('dhanyawad')) {
            return "You're most welcome! 🙏\n\n" +
                   "Thank you for choosing **Indrayani Naturals**.\n\n" +
                   "If you have more questions about our spices, recipes, pricing, or anything else, feel free to ask anytime! 🌟";
        }

        // Default response
        return "Thank you for your question! 🤔\n\n" +
               "I'm here to help with everything about **Indrayani Naturals**:\n\n" +
               "**Popular Topics:**\n" +
               "• Our spice products and pricing\n" +
               "• Traditional recipes and cooking tips\n" +
               "• Spice combinations and storage\n" +
               "• Health benefits and origins\n" +
               "• Contact and company information\n\n" +
               "Could you please be more specific? I'm here to help! 🌶️";
    }

    /**
     * Add message to chat
     */
    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-chatbot-message ai-chatbot-message-${sender}`;
        
        const icon = sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
        const formattedContent = this.formatMessage(content);
        
        messageDiv.innerHTML = `
            <div class="ai-chatbot-message-icon">
                <i class="${icon}"></i>
            </div>
            <div class="ai-chatbot-message-content">
                ${formattedContent}
            </div>
        `;

        this.elements.messages.appendChild(messageDiv);
        this.elements.messages.scrollTop = this.elements.messages.scrollHeight;

        // Add to history
        this.chatHistory.push({ content, sender, timestamp: new Date() });
        if (this.chatHistory.length > this.maxHistoryLength) {
            this.chatHistory.shift();
        }
    }

    /**
     * Format message content
     */
    formatMessage(content) {
        return content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    }

    /**
     * Set loading state
     */
    setLoading(loading) {
        this.isLoading = loading;
        this.elements.sendButton.disabled = loading;
        this.elements.input.disabled = loading;
        
        if (loading) {
            this.elements.sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        } else {
            this.elements.sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
        }
    }

    /**
     * Update status indicator
     */
    updateStatus() {
        if (window.apiConfig.isOpenAIAvailable()) {
            this.elements.status.textContent = 'AI Assistant Ready';
            this.elements.status.className = 'ai-chatbot-status-text ai-chatbot-status-ready';
        } else {
            this.elements.status.textContent = 'ChatBot is offline';
            this.elements.status.className = 'ai-chatbot-status-text ai-chatbot-status-fallback';
        }
    }

    /**
     * Enable/disable input based on AI availability
     */
    enableInput() {
        const isAvailable = window.apiConfig.isOpenAIAvailable();
        this.elements.input.placeholder = isAvailable ? 
            "Ask me anything about spices..." : 
            "Ask me anything (offline mode)...";
    }
}

// Create global instance
window.aiChatbot = new AIChatbot(); 