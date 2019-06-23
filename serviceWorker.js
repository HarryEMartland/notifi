// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and players)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://bit.ly/CRA-PWA

function registerValidSW(swUrl, config) {
    navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (installingWorker == null) {
                    return;
                }
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // At this point, the updated precached content has been fetched,
                            // but the previous service worker will still serve the older
                            // content until all client tabs are closed.
                            console.log(
                                'New content is available and will be used when all ' +
                                'tabs for this page are closed. See https://bit.ly/CRA-PWA.'
                            );

                            // Execute callback
                            if (config && config.onUpdate) {
                                config.onUpdate(registration);
                            }
                        } else {
                            // At this point, everything has been precached.
                            // It's the perfect time to display a
                            // "Content is cached for offline use." message.
                            console.log('Content is cached for offline use.');

                            importScripts('https://www.gstatic.com/firebasejs/6.2.2/firebase-app.js');
                            importScripts('https://www.gstatic.com/firebasejs/6.2.2/firebase-messaging.js');
                            importScripts('https://www.gstatic.com/firebasejs/6.2.2/init.js');
                            console.log('imported scripts')

                            const messaging = firebase.messaging();
                            console.log("messaging sv", messaging);
                            console.log("test");
                            messaging.setBackgroundMessageHandler(function(payload) {
                                console.log('[firebase-messaging-sw.js] Received background message ', payload);
                                // Customize notification here
                                var notificationTitle = 'Background Message Title';
                                var notificationOptions = {
                                    body: 'Background Message body.',
                                    icon: '/firebase-logo.png'
                                };

                                return self.registration.showNotification(notificationTitle,
                                    notificationOptions);
                            });

                            // Execute callback
                            if (config && config.onSuccess) {
                                config.onSuccess(registration);
                            }
                        }
                    }
                };
            };
        })
        .catch(error => {
            console.error('Error during service worker registration:', error);
        });
}

