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
            figure.dataset.workId = work.id;
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
        figure.dataset.workId = work.id;
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
    const adminBar = document.getElementById('admin-bar');


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


        // on vérifie si la barre admin existe avant de la manipuler
        if (adminBar) {
            adminBar.style.display = 'flex';
            document.body.classList.add('has-admin');
        }

    } else {
        // Cacher le bouton modifier quand déconnecté
        modifyBtn.style.display = 'none';
        // Afficher les filtres quand déconnecté
        filtersDiv.style.display = 'flex';

        if (adminBar) {
            adminBar.style.display = 'none';
            document.body.classList.remove('has-admin');
        }
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

// Titre du modal (on le conserve pour pouvoir le restaurer)
const modalHeaderTitle = document.querySelector('#edit-modal .modal-header h3');
const originalModalHeaderText = modalHeaderTitle ? modalHeaderTitle.textContent : '';

// Ouvrir le modal d'édition
modifyBtn.addEventListener('click', () => {
    editModal.style.display = "block";
    loadWorksInEditModal();
});

// Permettre à l'icône stylo dans la barre admin d'ouvrir aussi la modal d'édition
const adminPenIcon = document.querySelector('#admin-bar .fa-pen-to-square');
adminPenIcon.style.cursor = 'pointer';
adminPenIcon.addEventListener('click', () => {
    editModal.style.display = "block";
    loadWorksInEditModal();
});


// Fermer le modal d'édition
closeEditBtn.addEventListener('click', () => {
    editModal.style.display = "none";
    // Restaurer le contenu et le titre d'origine quand on ferme
    if (editModalBody) editModalBody.innerHTML = originalModalBodyHTML;
    if (modalHeaderTitle) modalHeaderTitle.textContent = originalModalHeaderText;
});

// Fermer le modal en cliquant en dehors
window.addEventListener('click', (event) => {
    if (event.target === editModal) {
        editModal.style.display = "none";
        // Restaurer le contenu et le titre d'origine quand on ferme en cliquant à l'extérieur
        if (editModalBody) editModalBody.innerHTML = originalModalBodyHTML;
        if (modalHeaderTitle) modalHeaderTitle.textContent = originalModalHeaderText;
    }
});


// Charger les travaux dans le modal d'édition
function loadWorksInEditModal() {
    // Toujours sélectionner l'élément courant dans le DOM au moment de l'appel
    const galleryEditCurrent = document.querySelector('.gallery-edit');
    if (!galleryEditCurrent) return; // rien à faire si l'élément n'existe pas
    galleryEditCurrent.innerHTML = '';
    allWorks.forEach(work => {
        const div = document.createElement('div');
        div.className = 'gallery-edit-item';
        // set data-work-id on the container as well so it can be easily selected/removed later
        div.dataset.workId = work.id;
        div.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <button class="delete-btn" data-work-id="${work.id}"><i class="fa-solid fa-trash-can"></i></button>
        `;
        galleryEditCurrent.appendChild(div);
    });

    // Ajouter les écouteurs pour les boutons de suppression (nouvellement rendus)
    galleryEditCurrent.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            // event.target peut être l'icône <i>, utiliser currentTarget pour récupérer l'attribut du bouton
            const workId = event.currentTarget.getAttribute('data-work-id');
            if (!workId) {
                console.error('delete-btn clicked but no data-work-id found', event);
                return;
            }
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
                    // Mettre à jour localement sans re-fetch : retirer de allWorks
                    allWorks = allWorks.filter(w => String(w.id) !== String(workId));

                    // Retirer l'élément de la galerie principale (si présent)
                    const mainFigure = document.querySelector(`.gallery figure[data-work-id="${workId}"]`);
                    if (mainFigure && mainFigure.parentNode) mainFigure.parentNode.removeChild(mainFigure);

                    // Retirer l'élément de la modal d'édition (si présent)
                    const modalItem = document.querySelector(`.gallery-edit-item[data-work-id="${workId}"]`);
                    if (modalItem && modalItem.parentNode) modalItem.parentNode.removeChild(modalItem);
                } else {
                    // Try to get server response body for more details
                    response.text().then(text => {
                        console.error('Erreur suppression:', response.status, text);
                        alert(`Erreur lors de la suppression (${response.status})`);
                    }).catch(() => {
                        console.error('Erreur suppression, status:', response.status);
                        alert('Erreur lors de la suppression');
                    });
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert('Erreur lors de la suppression');
            });
    }
}




const editModalBody = document.querySelector('#edit-modal .modal-body');
const originalModalBodyHTML = editModalBody ? editModalBody.innerHTML : '';

document.addEventListener('click', (event) => {
    if (event.target.closest && event.target.closest('.add-photo-btn')) {
        openAddPhotoForm();
    }
});

async function openAddPhotoForm() {

    const token = localStorage.getItem('token');
    // Vérifie si l'utilisateur est connecté
    if (!token) {
        alert('Vous devez être connecté pour ajouter un élément');
        return;
    }

    let categories = [];
    try {
        const resp = await fetch('http://localhost:5678/api/categories');
        if (resp.ok) categories = await resp.json();
    } catch (err) {
        console.error('Erreur récupération catégories', err);
    }

    editModalBody.innerHTML = `
        <form id="add-photo-form">
            <div id="image-container" class="image-container">
                <label class="image-upload-button" for="image">
                    <span class="upload-icon"><i class="fa-solid fa-image"></i></span>
                    <span class="upload-text">+ Ajouter photo</span>
                    <label class="taille" for="image">jpg, png : 4mo max</label>

                </label>
                <input type="file" id="image" name="image" accept="image/png, image/jpeg" required style="display:none">
            </div>

            <label for="title">Titre :</label>
            <input type="text" id="title" name="title" required>

            <label for="category">Catégorie :</label>
            <select id="category" name="category" required>
                <option value=""></option>
                ${categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('')}
            </select>

            <div class="trait"></div>
            <button type="submit">Valider</button>
        </form>
        <!-- back button removed: UI uses a back-arrow in modal header -->
    `;

    // Mettre à jour le titre du modal pour indiquer l'ajout
    if (modalHeaderTitle) modalHeaderTitle.textContent = 'Ajout photo';

    // éléments du DOM
    const imageInput = document.getElementById('image');
    const imageContainer = document.getElementById('image-container');
    const form = document.getElementById('add-photo-form');
    const submitButton = form.querySelector('button[type="submit"]');

    // Créer / insérer une flèche de retour dans l'entête du modal (si présent)
    let backArrow = document.querySelector('#edit-modal .modal-header .back-arrow');
    if (!backArrow && modalHeaderTitle && modalHeaderTitle.parentNode) {
        backArrow = document.createElement('button');
        backArrow.className = 'back-arrow';
        backArrow.type = 'button';
        backArrow.title = 'Retour à la galerie';
        backArrow.innerHTML = '<i class="fa-solid fa-arrow-left" aria-hidden="true"></i>';
        modalHeaderTitle.parentNode.insertBefore(backArrow, modalHeaderTitle);
    }

    //Fonction helper pour activer/désactiver le bouton de soumission
    function updateBoutonValide() {
        //Récupérer les valeurs du formulaire
        const fileSelected = imageInput.files && imageInput.files.length > 0;
        const title = document.getElementById('title').value.trim();
        const category = document.getElementById('category').value;

        let fileValid = false;
        if (fileSelected) {
            const f = imageInput.files[0];
            const maxSize = 4 * 1024 * 1024; // 4MB
            if (f.type && f.type.match('image.*') && f.size <= maxSize) fileValid = true;
        }

        if (fileValid && title.length > 0 && category !== '') {
            submitButton.removeAttribute('disabled');
        } else {
            submitButton.setAttribute('disabled', '');
        }
    }

    // initialize button disabled
    submitButton.setAttribute('disabled', '');

    // Documentation de FileReader : https://developer.mozilla.org/fr/docs/Web/API/FileReader
    // Affiche l'image quand on l'insert dans le formulaire ; remplace le bouton dans #image-container
    imageInput.addEventListener('change', (event) => {
        const file = event.currentTarget && event.currentTarget.files ? event.currentTarget.files[0] : null;
        if (!file) {
            updateBoutonValide();
            return;
        }

        // validations
        if (!file.type || !file.type.match('image.*')) {
            alert('Format de fichier non supporté. Utilisez jpg/png/webp.');
            imageInput.value = '';
            updateBoutonValide();
            return;
        }
        const maxSize = 4 * 1024 * 1024; // 4MB
        if (file.size > maxSize) {
            alert('Fichier trop volumineux (max 4MB).');
            imageInput.value = '';
            updateBoutonValide();
            return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
            imageContainer.innerHTML = '';
            const img = document.createElement('img');
            img.src = ev.target.result;
            img.className = 'image-preview-img';
            imageContainer.appendChild(img);

            // conserver l'input (caché) dans le container pour permettre de re-sélectionner une image
            imageInput.style.display = 'none';
            imageContainer.appendChild(imageInput);

            // rendre l'image cliquable pour réouvrir le sélecteur de fichiers
            img.style.cursor = 'pointer';
            img.title = 'Cliquer pour remplacer l\'image';
            img.addEventListener('click', () => imageInput.click());

            updateBoutonValide();
        };
        reader.readAsDataURL(file);
    });

    // listen for changes to title/category to update state
    document.getElementById('title').addEventListener('input', updateBoutonValide);
    document.getElementById('category').addEventListener('change', updateBoutonValide);

    // soumission du formulaire - envoi multipart/form-data
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const file = imageInput.files[0];
        const title = document.getElementById('title').value.trim();
        const category = document.getElementById('category').value;

        // final guard
        if (!file || !title || !category) {
            alert('Veuillez remplir tous les champs avant de valider.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', title);
        formData.append('category', category);

        try {
            const resp = await fetch('http://localhost:5678/api/works', {
                //Post permet d'envoyer des données au serveur
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (resp.ok) {
                // Recharge la galerie et le modal d'édition
                await FetchTravauxEtCategories();
                loadWorksInEditModal();
                // Retourner à l'affichage initial du modal
                editModalBody.innerHTML = originalModalBodyHTML;
                // recharger le contenu de la modal (au cas où)
                loadWorksInEditModal();
            } else {
                const text = await resp.text();
                console.error('Erreur backend:', resp.status, text);
                alert(`Erreur lors de l'ajout (${resp.status})`);
            }
        } catch (err) {
            console.error(err);
            alert('Erreur réseau lors de l\'ajout');
        }
    });

    // comportement de la flèche retour 
    if (backArrow) {
        backArrow.addEventListener('click', () => {
            editModalBody.innerHTML = originalModalBodyHTML;
            // Restaurer le titre d'origine
            if (modalHeaderTitle) modalHeaderTitle.textContent = originalModalHeaderText;
            // retirer la flèche après le retour
            if (backArrow && backArrow.parentNode) backArrow.parentNode.removeChild(backArrow);
            loadWorksInEditModal();
        });
    }

}