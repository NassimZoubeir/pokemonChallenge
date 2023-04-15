// On récupère l'élément du DOM avec l'ID "pokemonList"
const tableBody = document.getElementById('pokemonList');

// On envoie une requête GET vers l'URL '/cartes' qui doit renvoyer un tableau d'objets "cartes"
fetch('/cartes')
  .then(response => response.json()) // On convertit la réponse en objet JSON
  .then(cartes => {
    // Pour chaque carte dans le tableau "cartes", on crée une nouvelle ligne dans la table
    for (const carte of cartes) {
      const row = document.createElement('tr');

      // On crée une nouvelle cellule pour le nom et on y ajoute le nom de la carte
      const nameCell = document.createElement('td');
      nameCell.textContent = carte.nom;
      row.appendChild(nameCell);

      // On crée une nouvelle cellule pour le type et on y ajoute le type de la carte
      const typeCell = document.createElement('td');
      typeCell.textContent = carte.type;
      row.appendChild(typeCell);

      // On crée une nouvelle cellule pour l'image et on y ajoute une balise img avec la source de l'image
      const imageCell = document.createElement('td');
      const image = document.createElement('img');
      image.src = carte.imageSrc;
      imageCell.appendChild(image);
      row.appendChild(imageCell);

      // On crée une nouvelle cellule pour les actions et on y ajoute un bouton "Supprimer"
      const actionCell = document.createElement('td');
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Supprimer';
      deleteButton.addEventListener('click', () => {
        // Lorsque le bouton "Supprimer" est cliqué, on envoie une requête DELETE pour supprimer la carte correspondante
        const cardId = carte.id;
        fetch(`/cartes/${cardId}`, {
          method: 'DELETE'
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Une erreur est survenue lors de la suppression de la carte.');
          }
          // Si la suppression a réussi, on supprime la ligne de la table correspondante et on affiche une alerte
          const cardRow = deleteButton.parentNode.parentNode;
          cardRow.parentNode.removeChild(cardRow);
          alert(`La carte avec l'ID ${cardId} a été supprimée.`);
        })
        .catch(error => {
          console.error(error);
          alert(error.message);
        });
      });
      actionCell.appendChild(deleteButton);
      row.appendChild(actionCell);

      // On ajoute la ligne à la table
      tableBody.appendChild(row);
    }
  })
  .catch(error => console.error(error)); // On affiche une erreur s'il y a un problème lors de la requête ou de la conversion de la réponse en objet JSON


  // ----------------------------- AJOUT POKEMON -----------------------------------
const form = document.forms.addPoke;

// Ajouter un événement pour intercepter la soumission du formulaire
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Empêcher le formulaire de recharger la page

  // Envoyer la requête POST pour ajouter la nouvelle carte
  fetch('/cartes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nom: form.nom.value,
      type: form.type.value,
      imageSrc: form.imageSrc.value
    })
  })
  .then(response => response.json())
  .then(nouvelleCarte => {
    // Ajouter la nouvelle carte à la liste des cartes existantes
    const tableBody = document.getElementById('pokemonList');
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = nouvelleCarte.nom;
    row.appendChild(nameCell);

    const typeCell = document.createElement('td');
    typeCell.textContent = nouvelleCarte.type;
    row.appendChild(typeCell);

    const imageCell = document.createElement('td');
    const image = document.createElement('img');
    image.src = nouvelleCarte.imageSrc;
    imageCell.appendChild(image);
    row.appendChild(imageCell);

    const actionCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Supprimer';
    deleteButton.addEventListener('click', () => {
      const cardId = nouvelleCarte.id;
      fetch(`/cartes/${cardId}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Une erreur est survenue lors de la suppression de la carte.');
        }
        // Si la suppression a réussi, supprimer la ligne de la table correspondante
        const cardRow = deleteButton.parentNode.parentNode;
        cardRow.parentNode.removeChild(cardRow);
        alert(`La carte avec l'ID ${cardId} a été supprimée.`);
      })
      .catch(error => {
        console.error(error);
        alert(error.message);
      });
    });
    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);

    tableBody.appendChild(row);

    // Réinitialiser les champs du formulaire
    form.reset();
  })
  .catch(error => console.error(error));
});
