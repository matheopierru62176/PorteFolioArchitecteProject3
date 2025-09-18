document.addEventListener('DOMContentLoaded', () => {

const errorMessage = document.getElementById('error-message');
const form = document.querySelector('form');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = {
        email: email,
        password: password
    }
    try {
            fetch('http://localhost:5678/api/users/login', {
            method : 'POST',
            body : JSON.stringify(user),
            headers : { 'Content-Type' : 'application/json' ,
                accept : 'application/json'
            }
        })
    .then(response => {
    if (!response.ok) {
        if (errorMessage) {
            errorMessage.textContent = 'Email ou mot de passe incorrect';
            errorMessage.style.display = 'block';
            errorMessage.style.color = 'red';
        }
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    localStorage.setItem('token', data.token);
    window.location.href = 'index.html';
})
    }
    catch(err){
        console.log(err);
    }
});
});


