function updateBadge( count: number ) {
    chrome.storage.local.get( { count: 0 } ).then( ( data ) => {
        const newCount: number = ( data.count as number ) + count;
        chrome.action.setBadgeText( { text: `${newCount > 0 ? newCount : ""}` } );
        chrome.storage.local.set( { count: newCount } );
    } );
}

function refreshBadge() {
    updateBadge( 0 );
}

function handleMessage( message: { matches: Match[] } ) {
    updateBadge( message.matches.length );
}

chrome.runtime.onMessage.addListener( ( message: { matches: Match[] } ) => {
    handleMessage( message );
} );

chrome.runtime.onStartup.addListener( () => {
    refreshBadge();
} );

refreshBadge();
