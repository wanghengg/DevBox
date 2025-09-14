# DevBox Project Context

## Project Overview

DevBox is a Chrome extension designed as a multifunctional toolbox for developers. It provides various utilities commonly used in development work, including JSON processing, format conversion, encoding/decoding, and timestamp conversion - all accessible with a single click.

### Key Features
- JSON parsing and formatting
- URL encoding/decoding
- Timestamp conversion between different time zones
- Format conversion between JSON, YAML, and TOML

### Project Type
This is a Chrome extension project built with HTML, CSS, and JavaScript. It follows the Manifest V3 standard for Chrome extensions.

## Project Structure

```
DevBox/
├── manifest.json          # Chrome extension manifest file
├── popup.html             # Main UI interface
├── popup.css              # Styling for the UI
├── tab_switch.js          # Tab navigation logic
├── tab_json.js            # JSON processing functionality
├── tab_url.js             # URL encoding/decoding functionality
├── tab_timestamp.js       # Timestamp conversion functionality
├── tab_format.js          # Format conversion functionality
├── libs/
│   ├── js-yaml.min.js     # YAML parsing library
│   └── toml-browser.js    # TOML parsing library
├── node_modules/          # NPM dependencies (git-ignored)
├── package.json           # NPM package configuration
├── README.md              # Project description
├── LICENSE                # MIT License
└── .gitignore             # Git ignore patterns
```

## Core Functionality

### 1. Tab Navigation (`tab_switch.js`)
Handles switching between different tool tabs in the extension popup:
- JSON Processing
- URLEncode
- Timestamp Conversion
- Format Conversion

### 2. JSON Processing (`tab_json.js`)
Features include:
- JSON parsing with error handling
- Support for escaped JSON strings
- Recursive depth parsing
- Formatted output display
- Copy to clipboard functionality
- Output box management with collapse/expand and delete options

### 3. URL Encoding (`tab_url.js`)
- URLEncode functionality using `encodeURIComponent`
- URLDecode functionality using `decodeURIComponent`
- Input validation and error handling

### 4. Timestamp Conversion (`tab_timestamp.js`)
- Conversion between Unix timestamps and human-readable dates
- Support for seconds and milliseconds
- Time zone conversion between:
  - Beijing (China Standard Time)
  - Eastern Time (US)
  - Pacific Time (US)
- Real-time synchronization across time zones

### 5. Format Conversion (`tab_format.js`)
Converts between different data serialization formats:
- JSON ↔ YAML ↔ TOML
- Bidirectional conversion using arrow buttons
- Uses external libraries for parsing:
  - js-yaml for YAML processing
  - @iarna/toml for TOML processing

## Dependencies

### External Libraries
- `js-yaml` (v4.1.0) - YAML parsing library
- `@iarna/toml` (v2.2.5) - TOML parsing library
- Custom TOML browser bundle (`toml-browser.js`)
- Minified js-yaml (`js-yaml.min.js`)

### Chrome Extension APIs
- `chrome.tabs` (via "activeTab" permission)

## Development Conventions

### Code Style
- JavaScript following modern ES6+ conventions
- Modular code organization with separate files for each feature
- Event-driven architecture using `DOMContentLoaded` listeners
- DOM manipulation for UI updates

### UI/UX Design
- Tab-based interface for organizing different tools
- Clean, developer-focused design with appropriate spacing
- Monospace fonts for code/data display
- Responsive buttons with hover effects
- Clear visual feedback for user actions
- Collapsible sections for better space management

### Error Handling
- Comprehensive try/catch blocks for parsing operations
- User-friendly error messages
- Visual feedback through color-coded text (red for errors, green for success)

## Building and Running

### Installation
1. Clone the repository
2. Run `npm install` to install dependencies
3. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the project directory

### Development
- No build process required for basic development
- Changes to HTML/CSS/JS files are reflected immediately upon reloading the extension
- External libraries are included via script tags in `popup.html`

### Testing
- Manual testing through the Chrome extension popup interface
- No automated test suite currently configured

## Project Metadata

### Repository
- GitHub: https://github.com/wanghengg/json-wizard
- Issues: https://github.com/wanghengg/json-wizard/issues

### License
- MIT License
- Copyright (c) 2025 Heng Wang

### Version
- Current version: 1.0

## Future Considerations

When working with this project, keep in mind:
1. The extension follows Manifest V3 standards
2. All functionality is client-side with no server dependencies
3. UI is constrained to a 310px width popup window
4. Libraries are loaded directly in the browser without module bundlers
5. Time zone handling uses Intl.DateTimeFormat API for localization