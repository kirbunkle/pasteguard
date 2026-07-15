let promptArea: HTMLElement | null = null;
const isChatGPT = location.hostname.includes( "chatgpt.com" );
const isClaude = location.hostname.includes( "claude.ai" );

const inputEventListener: EventListener = ( _evt: Event ) => {
    console.log( promptArea?.innerText );
};

function ensureAttached() {
    if( promptArea?.isConnected ) {
        return;
    }

    if( promptArea ) {
        promptArea.removeEventListener( "input", inputEventListener );
        promptArea = null;
    }

    if( isChatGPT ) {
        promptArea = document.getElementById( "prompt-textarea" );
    } else if( isClaude ) {
        promptArea = document.querySelector( '[data-testid="chat-input"]' );
    }

    if( promptArea ) {
        promptArea.addEventListener( "input", inputEventListener );
    }
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
