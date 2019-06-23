function sendTokenToServer(token) {
    fetch('https://shgv1q2kuk.execute-api.eu-west-1.amazonaws.com/prod/topic',
        {method:"POST", body:JSON.stringify({
                "registrationToken":token,
                "topic":"demo"
            })}
        );
    console.log("token", token)
}

function setTokenSentToServer(value) {
    console.log("sentToken", value)

}

function showToken(message, error) {
    console.log("show token", message, error)

}

function updateUIForPushPermissionRequired() {
}

function updateUIForPushEnabled(){
}

$(function () {
    const messaging = firebase.messaging();

    messaging.onMessage((payload) => {
        console.log('Message received. ', payload);


        navigator.serviceWorker.getRegistration().then(function(reg) {

            return reg.showNotification(payload.notification.title,
                payload.notification);
        });

    });

    messaging.onTokenRefresh(() => {
        messaging.getToken().then((refreshedToken) => {
            console.log('Token refreshed.');
            // Indicate that the new Instance ID token has not yet been sent to the
            // app server.
            setTokenSentToServer(false);
            // Send Instance ID token to app server.
            sendTokenToServer(refreshedToken);
            // ...
        }).catch((err) => {
            console.log('Unable to retrieve refreshed token ', err);
            showToken('Unable to retrieve refreshed token ', err);
        });
    });

    $('.subscribe-btn').on('click', function (e) {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
                messaging.getToken().then((currentToken) => {
                    if (currentToken) {
                        sendTokenToServer(currentToken);
                        updateUIForPushEnabled(currentToken);
                    } else {
                        // Show permission request.
                        console.log('No Instance ID token available. Request permission to generate one.');
                        // Show permission UI.
                        updateUIForPushPermissionRequired();
                        setTokenSentToServer(false);
                    }
                }).catch((err) => {
                    console.log('An error occurred while retrieving token. ', err);
                    showToken('Error retrieving Instance ID token. ', err);
                    setTokenSentToServer(false);
                });
            } else {
                console.log('Unable to get permission to notify.');
            }
        });
    })
});
