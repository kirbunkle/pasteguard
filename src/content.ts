let promptArea: HTMLElement | null = null;
const isChatGPT: boolean = location.hostname.includes( "chatgpt.com" );
const isClaude: boolean = location.hostname.includes( "claude.ai" );
const secrets: Array<{ name: string, regex: RegExp, foundStrings: Array<string> }> = [
    { name: "aws", regex: /\b(AKIA|ASIA)[0-9A-Z]{16}\b/g, foundStrings: [] }, //AWS Keys
    { name: "github", regex: /\bghp_[A-Za-z0-9]{36}\b/g, foundStrings: [] },  //Github tokens
    { name: "openAI", regex: /\bsk-[A-Za-z0-9_-]{20,}/g, foundStrings: [] },  //OpenAI tokens
];

const inputEventListener = ( _evt: InputEvent ) => {
    if( promptArea ) {
        checkText( promptArea.innerText, "input" );
    }
};

const pasteEventListener = ( evt: ClipboardEvent ) => {
    const text = evt.clipboardData?.getData("text/plain");
    if( text ) {
        checkText( text, "paste" );
    }
};

function ensureAttached() {
    if( promptArea?.isConnected ) {
        return;
    }

    if( promptArea ) {
        promptArea.removeEventListener( "input", inputEventListener );
        promptArea.removeEventListener( "paste", pasteEventListener );
        promptArea = null;
    }

    if( isChatGPT ) {
        promptArea = document.getElementById( "prompt-textarea" );
    } else if( isClaude ) {
        promptArea = document.querySelector( '[data-testid="chat-input"]' );
    }

    if( promptArea ) {
        promptArea.addEventListener( "input", inputEventListener );
        promptArea.addEventListener( "paste", pasteEventListener );
    }
}

function checkText( text: string, source: "input" | "paste" ) {
    const matches: Match[] = [];
    secrets.forEach( ( secret: { name: string, regex: RegExp, foundStrings: Array<string> } ) => {
        const results: RegExpMatchArray | null = text.match( secret.regex );

        if( results ) {
            results.forEach( ( match: string ) => {
                if( !secret.foundStrings.includes( match ) ) {
                    secret.foundStrings.push( match );
                    matches.push( {
                        name: secret.name,
                        host: location.hostname,
                        source: source,
                        timestamp: Date.now(),
                    } );
                }
            } );
        }
    } );
    if( matches.length > 0 ) {
        sendMessage( matches );
    }
}

function sendMessage( matches: Match[] ) {
    chrome.runtime.sendMessage( { matches: matches } ).catch( console.error );
}

if( isChatGPT || isClaude ) {
    const observer: MutationObserver = new MutationObserver( ( _mutationsList: MutationRecord[] ) => {
        ensureAttached();
    } );

    observer.observe( document.body, {
        childList: true,
        subtree: true,
    } );

    ensureAttached();
}
