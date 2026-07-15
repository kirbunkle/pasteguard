# pasteguard
Chrome browser extension to detect copy-pasting sensitive data into AI chat inputs.

The real security risk with using AI isn't simply typing sensitive data into the chat prompt — it is pasting in logs, config files, and stack traces with credentials embedded in them.

### Demo
https://github.com/user-attachments/assets/96604499-3b36-4b01-9819-146c5ed55fbc

### Current Features
- Monitors text for chatgpt.com and claude.ai prompt inputs, capturing both direct input and paste actions.
- Checks for AWS access keys, GitHub access tokens, and OpenAI/Anthropic-style sk- keys. Each determined using a regex based on publicly available formats.
- If a token is found in the text, the extension badge will display and increment based on how many matches were found.
- Privacy: all analysis is performed in your browser. Only the content script knows what was matched while the tab is open. No input/pasted text is stored or shared.

### Planned Features
- Highlighting text to show where the match was found.
- On-hover description detailing why the text is risky to send.
- Options to ignore or replace the matching text with "(Redacted)".

### How to Install
You will need npm installed to compile the extension.

1) Clone the repository.
2) Run `npm install`, then `npm run build` in the pasteguard directory.
3) Open Chrome and navigate to "Extensions" > "Manage Extensions".
4) Ensure "Developer Mode" is enabled at the top right.
5) Click "Load Unpacked".
6) Navigate and open the dist folder in the pasteguard directory.

The extension should now display in your extension list.

### About the Project
I started this project to learn more about Manifest V3 extensions. The goals were to create an app that reads the DOM, utilizes a service worker, and persists data across sessions.

The extension is written in TypeScript and sets up event listeners for input events and paste events into the prompt text box found at chatgpt.com and claude.ai. The script runs regular expressions against the text after an event signal to find matching text. When any matches are found, a message containing only metadata — never the original text — is sent to the service worker. Currently the only thing it uses from the message is how many matches there were, which is what displays on the badge. The count is saved using the Chrome storage API so it can be persisted after Chrome terminates the service worker.

### Limitations
Currently the app only detects the specific data detailed above; any passwords or access tokens or keys that are utilized outside of these formats will not be caught. Additionally, the OpenAI/Anthropic key format is less structured than other keys, so the regular expression is more likely to result in false-positives.
