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

localStorage.getItem('token');