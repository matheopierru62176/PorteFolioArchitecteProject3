// Récupération des travaux depuis le backend
fetch('http://localhost:5678/api/works')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur réseau');
        }
        return response.json();
    })
    .then(data => {
        console.log('Travaux récupérés:', data);
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des travaux:', error);
    });
