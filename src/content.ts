let promptArea: HTMLElement | null = null;
const isChatGPT: boolean = location.hostname.includes( "chatgpt.com" );
const isClaude: boolean = location.hostname.includes( "claude.ai" );
const secrets: Array<RegExp> = [
    /\b(AKIA|ASIA)[0-9A-Z]{16}\b/, //AWS Keys
    /\bghp_[A-Za-z0-9]{36}\b/,     //Github tokens
    /\bsk-[A-Za-z0-9_-]{20,}/,     //OpenAI tokens
];

const inputEventListener = ( _evt: InputEvent ) => {
    if( promptArea ) {
        checkText( promptArea.innerText );
    }
};

const pasteEventListener = ( evt: ClipboardEvent ) => {
    const text = evt.clipboardData?.getData("text/plain");
    if( text ) {
        checkText( text );
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

function checkText( text: string ) {
    secrets.forEach( ( secret: RegExp ) => {
        if( secret.test( text ) ) {
            console.log( `Found: ${secret}` );
        }
    } );
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
