# pasteguard
Chrome browser extension to protect against copy-pasting sensitive data into AI chat inputs.

### Demo
https://github.com/user-attachments/assets/96604499-3b36-4b01-9819-146c5ed55fbc

### Current Features
- Views text for chatgpt.com and claude.ai prompt inputs, capturing both direct input and paste actions.
- Checks for aws access keys, github access tokens, and openAI keys. Each determined using a regex based on publicly available formats.
- If a token is found in the text, the extension badge will display and increment based on how many matches were found.
- Privacy: only the content script knows what was matched while the tab is open. No input/pasted text is stored or shared.

### Planned Features
- Highlighting text to show where the match was found.
- On-hover description detailing why the text is risky to send.
- Options to ignore or replace the matching text with "(Redacted)".
