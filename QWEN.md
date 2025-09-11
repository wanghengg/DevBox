# JSON Wizard Chrome Extension

## Project Overview

JSON Wizard is a Chrome extension designed as a comprehensive toolkit for developers working with JSON data. The extension provides multiple utilities in a single interface:

1. **JSON Formatter/Parser**: Format, validate, and deserialize JSON strings with support for escaped strings and nested JSON parsing.
2. **URLEncode/URLDecode**: Encode and decode URL strings.
3. **Timestamp Conversion**: Convert between Unix timestamps (seconds/milliseconds) and human-readable time formats in multiple timezones (Beijing, US Eastern, US Pacific).

The extension features a tabbed interface for easy navigation between different tools.

## Key Technologies

- **Manifest Version**: 3 (Chrome Extension Manifest V3)
- **Frontend**: HTML, CSS, JavaScript
- **UI Framework**: Pure HTML/CSS/JS with custom styling
- **Timezone Handling**: JavaScript Intl API and Date functions

## Project Structure

```
.
├── manifest.json      # Chrome extension manifest file
├── popup.html         # Main popup UI with tabbed interface
├── popup.js           # All JavaScript functionality
├── README.md          # Project description
└── LICENSE            # License information
```

## Features Implementation

### 1. JSON Processing (Default Tab)
- Parse and format JSON strings
- Support for escaped JSON strings
- Recursive parsing for nested JSON strings (up to 10 levels)
- Collapsible output boxes with copy functionality
- Multiple output history preservation

### 2. URLEncode Tab
- URLEncode strings using `encodeURIComponent()`
- URLDecode strings using `decodeURIComponent()`
- Independent input/output with copy functionality

### 3. Timestamp Conversion Tab
- Convert Unix timestamps to human-readable time in multiple timezones
- Convert human-readable time to Unix timestamps
- Support for both seconds and milliseconds timestamp formats
- Four synchronized input fields:
  - Timestamp (with unit selection)
  - Beijing time
  - US Eastern time
  - US Pacific time
- Any field can be used as input; others update automatically on conversion

## Development Conventions

### Code Organization
- All functionality is contained within `popup.js`
- Event listeners are organized by feature/tab
- Functions are documented with Chinese comments
- CSS is embedded in the HTML file for simplicity

### UI/UX Design
- Tab-based navigation for different features
- Responsive layout within Chrome's extension popup constraints
- Consistent color scheme and styling across all tabs
- Clear visual feedback for user actions (button hover effects, success/error messages)
- Collapsible sections to manage space in the popup

### JavaScript Practices
- Use of modern ES6 features (arrow functions, const/let)
- Error handling with try/catch blocks
- DOM manipulation using standard APIs
- Event delegation where appropriate

## Building and Running

This is a Chrome extension that runs directly in the browser.

### Installation
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select this project directory

### Development Workflow
1. Make changes to `popup.html` or `popup.js`
2. Save files
3. Refresh the extension in Chrome's extensions page or reload the popup

### Testing
- Manual testing through the Chrome extension popup
- Console logging is available for debugging (Ctrl+Shift+J on the popup)

## Future Enhancement Opportunities

1. **Additional Data Format Tools**:
   - Base64 encoding/decoding
   - XML/JSON conversion
   - CSV/JSON conversion

2. **Enhanced JSON Features**:
   - JSON schema validation
   - JSONPath querying
   - Diff viewers for JSON comparison

3. **Timezone Features**:
   - More timezone support
   - Custom timezone addition
   - Timezone conversion between any two timezones

4. **UI Improvements**:
   - Dark mode support
   - Export/import functionality for conversion history
   - Keyboard shortcuts

5. **Performance**:
   - Virtualized lists for large JSON outputs
   - Web Workers for heavy parsing operations

## Known Limitations

1. **UI Constraints**: Limited by Chrome's extension popup dimensions
2. **Storage**: No persistent storage between sessions (all data is lost when popup closes)
3. **Performance**: Large JSON strings may cause UI blocking (no Web Workers implemented)