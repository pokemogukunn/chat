document.getElementById('compose-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const emailData = {
        to: document.getElementById('to').value,
        subject: document.getElementById('subject').value,
        body: document.getElementById('body').value
    };

    fetch('/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Email sent successfully!');
        } else {
            alert('Error sending email.');
        }
    });
});
