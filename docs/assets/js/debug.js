// DEBUG MODE — cria token falso automaticamente em ambiente local
(function() {
    const isLocal =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === '';

    if (isLocal) {
        const token = localStorage.getItem('access_token');

        if (!token) {
            localStorage.setItem('access_token', 'fake-token-for-testing');
            console.log('%cDEBUG: Token falso criado automaticamente.', 'color: #4CAF50; font-weight: bold;');
        } else {
            console.log('%cDEBUG: Token já existe →', 'color: #2196F3; font-weight: bold;', token);
        }
    }
})();
