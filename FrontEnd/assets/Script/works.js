// Récupération des travaux depuis le backend
fetch('http://localhost:5678/api/works')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur réseau');
        }
        return response.json();
    })
    .then(data => {
        const gallery = document.querySelector('.gallery');
        gallery.innerHTML = ''; // Vide la galerie
        data.forEach(work => {
            const figure = document.createElement('figure');
            const img = document.createElement('img');
            img.src = work.imageUrl;
            img.alt = work.title;
            const caption = document.createElement('figcaption');
            caption.textContent = work.title;
            figure.appendChild(img);
            figure.appendChild(caption);
            gallery.appendChild(figure);
        });
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des travaux:', error);
    });



let allWorks = [];

// Récupère les travaux et les catégories
async function FetchTravauxEtCategories() {
    const [worksFetch, categoriesFetch] = await Promise.all([
        fetch('http://localhost:5678/api/works'),
        fetch('http://localhost:5678/api/categories')
    ]);
    const works = await worksFetch.json();
    const categories = await categoriesFetch.json();
    allWorks = works;
    AfficheTravaux(works);
    renderFilters(categories);
}

// function pour afficher la galerie
function AfficheTravaux(works) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';
    works.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;
        const caption = document.createElement('figcaption');
        caption.textContent = work.title;

        // Ajoutes les éléments au DOM
        figure.appendChild(img);
        figure.appendChild(caption);
        gallery.appendChild(figure);
    });
}

// Function pour afficher les boutons de filtre
function renderFilters(categories) {
    const filtersDiv = document.querySelector('.filters');
    filtersDiv.innerHTML = '';
    const allBtn = document.createElement('button');
    allBtn.textContent = 'Tous';
    allBtn.classList.add('active');
    allBtn.addEventListener('click', () => {
        setActiveFilter(allBtn);
        AfficheTravaux(allWorks);
    });
    filtersDiv.appendChild(allBtn);

    // parcours toutes les catégories pour la création des boutons
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat.name;
        btn.dataset.categoryId = cat.id;
        btn.addEventListener('click', () => {
            setActiveFilter(btn);
            // Filtre les travaux par catégorie
            const filtered = allWorks.filter(work => work.categoryId === cat.id);
            AfficheTravaux(filtered);
        });
        filtersDiv.appendChild(btn);
    });
}

// function qui permet de gérer l’état actif du bouton
function setActiveFilter(activeBtn) {
    document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

// Lance la récupération au chargement
FetchTravauxEtCategories();



// Gestion du lien de connexion/déconnexion
document.addEventListener('DOMContentLoaded', () => {
    // Récupération du lien de connexion/déconnexion
    const loginLink = document.querySelector('nav ul li a[href="./login.html"]');
    const modifyBtn = document.getElementById('modify-btn');
    const filtersDiv = document.querySelector('.filters');

    if (localStorage.getItem('token')) {
        loginLink.textContent = 'logout';
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            window.location.reload();
        });

        // Afficher le bouton modifier quand connecté
        modifyBtn.style.display = 'flex';
        // Cacher les filtres quand connecté
        filtersDiv.style.display = 'none';
    } else {
        // Cacher le bouton modifier quand déconnecté
        modifyBtn.style.display = 'none';
        // Afficher les filtres quand déconnecté
        filtersDiv.style.display = 'flex';
    }
});




// Gestion de la modale
// Récupération des éléments de la modale
const modal = document.getElementById("modal-galery");
const modalImg = document.getElementById("img01");
const captionText = document.getElementById("caption");
const closeBtn = document.getElementsByClassName("close")[0];

// Gestion du modal d'édition
const editModal = document.getElementById("edit-modal");
const modifyBtn = document.getElementById("modify-btn");
const closeEditBtn = document.querySelector(".close-edit");
const galleryEdit = document.querySelector(".gallery-edit");

// Ouvrir le modal d'édition
modifyBtn.addEventListener('click', () => {
    editModal.style.display = "block";
    loadWorksInEditModal();
});

// Fermer le modal d'édition
closeEditBtn.addEventListener('click', () => {
    editModal.style.display = "none";
});

// Fermer le modal en cliquant en dehors
window.addEventListener('click', (event) => {
    if (event.target === editModal) {
        editModal.style.display = "none";
    }
});


// Charger les travaux dans le modal d'édition
function loadWorksInEditModal() {
    galleryEdit.innerHTML = '';
    allWorks.forEach(work => {
        const div = document.createElement('div');
        div.className = 'gallery-edit-item';
        div.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <button class="delete-btn" data-work-id="${work.id}">🗑</button>
        `;
        galleryEdit.appendChild(div);
    });

    // Ajouter les écouteurs pour les boutons de suppression
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const workId = e.target.getAttribute('data-work-id');
            deleteWork(workId);
        });
    });
}

// Fonction pour supprimer un travail
function deleteWork(workId) {
    const token = localStorage.getItem('token');
    // Vérifie si l'utilisateur est connecté
    if (!token) {
        alert('Vous devez être connecté pour supprimer un élément');
        return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
        fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                // Vérification du token coté serveur
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    // Recharger les données
                    FetchTravauxEtCategories();
                    loadWorksInEditModal();
                } else {
                    alert('Erreur lors de la suppression');
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert('Erreur lors de la suppression');
            });
    }
}
