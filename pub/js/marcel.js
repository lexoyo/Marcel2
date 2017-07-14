
window.onload = function () {
    var speech = new Speech();
    speech.init(() => {
        speech.listen(result => {
            console.log('you said:', result.DisplayText);
        });
    });
};

