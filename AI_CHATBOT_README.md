# AI Chatbot System for Indrayani Naturals

A complete AI-powered chatbot system designed specifically for the Indrayani Naturals spice company website. This chatbot provides intelligent responses about products, recipes, pricing, and general inquiries using OpenAI's GPT technology with comprehensive fallback responses.

## Features

### 🤖 Core Functionality
- **AI-Powered Responses**: Uses OpenAI GPT-3.5-turbo for intelligent conversations
- **Fallback System**: Comprehensive responses when AI is unavailable
- **Real-time Status**: Shows AI availability status ("AI Assistant Ready" / "ChatBot is offline")
- **Chat History**: Maintains conversation history (configurable length)
- **Multi-page Integration**: Works seamlessly across all website pages

### 🎨 User Interface
- **Modern Design**: Beautiful gradient UI with smooth animations
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Fullscreen Mode**: Toggle between normal and fullscreen view using browser Fullscreen API
- **Dark Mode Support**: Automatically adapts to user's theme preference
- **Accessibility**: Full keyboard navigation and screen reader support
- **Text Formatting**: Markdown support for bold, italic, and links

### 🚀 Interactive Features
- **Quick Action Buttons**: Pre-defined buttons for common queries (Products, Recipes, Contact)
- **Loading States**: Visual feedback during AI processing
- **Message Formatting**: Automatic link detection and markdown formatting
- **Keyboard Shortcuts**: Enter to send, Escape to close
- **Simplified Responses**: Clean, concise answers for better user experience

### 🛡️ Security & Performance
- **API Key Protection**: Secure configuration management
- **Error Handling**: Graceful fallbacks for all error scenarios
- **Performance Optimized**: Minimal impact on page load times
- **Cross-browser Compatible**: Works on all modern browsers

## File Structure

```
├── config/
│   ├── api-keys.json          # API configuration (gitignored)
│   └── api-keys.template.json # Template for API keys
├── js/
│   ├── api-config.js          # OpenAI integration and API management
│   └── ai-chatbot.js          # Main chatbot functionality
├── css/
│   └── ai-chatbot.css         # Complete styling with animations
├── pages/
│   ├── products.html          # Products page with chatbot
│   ├── contact.html           # Contact page with chatbot
│   ├── about.html             # About page with chatbot
│   └── recipes.html           # Recipes page with chatbot
├── index.html                 # Home page with chatbot
└── AI_CHATBOT_README.md       # This documentation
```

## Installation

### 1. Setup API Configuration

1. Copy the template file:
   ```bash
   cp config/api-keys.template.json config/api-keys.json
   ```

2. Edit `config/api-keys.json` and add your OpenAI API key:
   ```json
   {
     "openai": {
       "apiKey": "your-actual-openai-api-key-here",
       "model": "gpt-3.5-turbo",
       "maxTokens": 500,
       "temperature": 0.7
     },
     "chatbot": {
       "name": "AI Spice Assistant",
       "welcomeMessage": "Hello! I'm your AI Spice Assistant. How can I help you today?",
       "maxHistoryLength": 50
     }
   }
   ```

### 2. Add to HTML Pages

#### For Home Page (index.html)
Add these lines to your HTML `<head>` section:
```html
<!-- AI Chatbot CSS -->
<link rel="stylesheet" href="css/ai-chatbot.css">
```

Add these lines before the closing `</body>` tag:
```html
<!-- AI Chatbot JS -->
<script src="js/api-config.js"></script>
<script src="js/ai-chatbot.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        window.aiChatbot.init();
    });
</script>
```

#### For Pages in Subdirectories (pages/*.html)
Add these lines to your HTML `<head>` section:
```html
<!-- AI Chatbot CSS -->
<link rel="stylesheet" href="../css/ai-chatbot.css">
```

Add these lines before the closing `</body>` tag:
```html
<!-- AI Chatbot JS -->
<script src="../js/api-config.js"></script>
<script src="../js/ai-chatbot.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        window.aiChatbot.init();
    });
</script>
```

## Configuration Options

### API Configuration (`config/api-keys.json`)

| Setting | Description | Default |
|---------|-------------|---------|
| `openai.apiKey` | Your OpenAI API key | Required |
| `openai.model` | GPT model to use | `gpt-3.5-turbo` |
| `openai.maxTokens` | Maximum response length | `500` |
| `openai.temperature` | Response creativity (0-1) | `0.7` |
| `chatbot.name` | Chatbot display name | `AI Spice Assistant` |
| `chatbot.maxHistoryLength` | Max chat history items | `50` |


## Usage

### For Users

1. **Open Chatbot**: Click the "AI Spice Assistant" button in the bottom-right corner
2. **Ask Questions**: Type your question about spices, recipes, pricing, etc.
3. **Quick Actions**: Use the pre-defined buttons for common queries
4. **Fullscreen Mode**: Click the expand button for a larger view
5. **Close**: Click the X button or press Escape



#### Customizing Responses

Edit the `getFallbackResponse()` method in `js/ai-chatbot.js` to customize fallback responses:

```javascript
getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('product')) {
        return "Your custom product response here...";
    }
    
    // Add more custom responses...
}
```

#### Adding Quick Actions

Modify the `handleQuickAction()` method to add new quick action buttons:

```javascript
handleQuickAction(action) {
    const actions = {
        products: "products",
        recipes: "recipes",
        contact: "contact"
        // Add new actions here...
    };
}
```


## Business Logic

The chatbot is specifically designed for Indrayani Naturals and handles:

### Product Information
- **Complete Product List**: All 7 spice products with current pricing
- **Individual Product Details**: Specific ingredients and usage for each spice
- **Quality Information**: Natural ingredients and traditional methods
- **Health Benefits**: Ayurvedic properties and nutritional value

### Current Product Pricing
- Garam Masala - ₹195/200g
- Biryani Masala - ₹195/200g
- Chicken Masala - ₹190/200g
- Mungvadi - ₹80/100g
- Kitchen King Masala - ₹185/200g
- Pav Bhaji Masala - ₹160/200g
- Onion-Garlic Masala - ₹165/200g

### Recipe Support
- Recipe suggestions using specific spices
- Cooking tips and techniques
- Cuisine-specific recommendations
- Traditional Maharashtrian dishes

### Business Information
- Contact details and locations
- Ordering and payment options
- Company history and values
- Social media links

### General Support
- Greetings and thanks
- General spice knowledge
- Health benefits information
- Traditional usage guidance

## Fallback System

When OpenAI is unavailable, the chatbot provides intelligent fallback responses for:

- **Products**: Complete product list with pricing and descriptions
- **Pricing**: All current prices with bulk order information
- **Recipes**: Cooking suggestions and spice usage
- **Contact**: Business hours, locations, and contact methods
- **Company**: History, values, and mission
- **General**: Greetings, thanks, and basic inquiries

## Recent Updates

### ✅ Simplified Responses
- Cleaner, more concise answers
- Better mobile readability
- Faster user interaction
- Professional presentation

### ✅ Updated Pricing
- All products now have specific pricing
- No more "Contact us" for pricing
- Bulk order discounts mentioned
- Clear package sizes

### ✅ UI Improvements
- Removed pricing quick action button
- Updated status text to "ChatBot is offline"
- Enhanced text formatting with markdown support
- Better spacing and typography

### ✅ Multi-page Integration
- Chatbot now works on all pages
- Consistent experience across the site
- Proper path handling for subdirectories
- Unified styling and functionality

## Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Lightweight**: Minimal impact on page load times
- **Lazy Loading**: OpenAI library loaded only when needed
- **Efficient**: Optimized animations and transitions
- **Responsive**: Smooth performance on all devices

## Security

- **API Key Protection**: Keys stored in gitignored config file
- **Client-side Only**: No server-side dependencies
- **Secure Requests**: HTTPS-only API calls
- **Error Handling**: No sensitive information in error messages

## Troubleshooting

### Common Issues

1. **Chatbot not appearing**
   - Check if all CSS and JS files are loaded
   - Verify file paths are correct for page location
   - Check browser console for errors

2. **AI responses not working**
   - Verify OpenAI API key is set correctly
   - Check API key has sufficient credits
   - Ensure internet connection is stable
   - Fallback mode will work regardless

3. **Styling issues**
   - Check if Font Awesome is loaded
   - Verify Google Fonts are accessible
   - Clear browser cache

4. **Multi-page issues**
   - Ensure correct relative paths for CSS/JS files
   - Check that initialization script is present on each page
   - Verify chatbot appears on all pages



## License

This AI chatbot system is part of the Indrayani Naturals website project.

## Support

For technical support or questions about the chatbot system, please contact the development team.

---

**Note**: This chatbot system is specifically designed for Indrayani Naturals and includes business logic tailored to spice products and Indian cuisine. For use with other businesses, significant customization of the response logic will be required. 