// ----------------------------------------------- AFFICHAGE DE MA LISTE DE POKEMON + BOUTON SUPPRIMER -----------------------------------------------------------------

// On récupère l'élément du DOM avec l'ID "pokemonList"
const tableBody = document.getElementById('pokemonList');

// On envoie une requête GET vers l'URL '/cartes' qui doit renvoyer un tableau d'objets "cartes"
fetch('/cartes')
  .then(response => response.json()) // On convertit la réponse en objet JSON
  .then(cartes => {
    // Pour chaque carte dans le tableau "cartes", on crée une nouvelle ligne dans la table
    for (const carte of cartes) {
      const row = document.createElement('tr');

      // On crée une nouvelle cellule pour l'image et on y ajoute une balise img avec la source de l'image
      const imageCell = document.createElement('td');
      const image = document.createElement('img');
      image.src = carte.imageSrc;
      imageCell.appendChild(image);
      row.appendChild(imageCell);

      // On crée une nouvelle cellule pour le nom et on y ajoute le nom de la carte
      const nameCell = document.createElement('td');
      nameCell.textContent = carte.nom;
      row.appendChild(nameCell);

      // On crée une nouvelle cellule pour le type et on y ajoute le type de la carte
      const typeCell = document.createElement('td');
      typeCell.textContent = carte.type;
      row.appendChild(typeCell);

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

// -------------------------------------------------- MODIFIER ------------------------------------------------------------------------------------------

//Bouton "Modifier"
// const editButton = document.createElement('button');
// editButton.textContent = 'Modifier';
// editButton.addEventListener('click', () => {
//   const cardId = carte.id;
//   const newName = prompt('Entrez le nouveau nom de la carte:');
//   const newType = prompt('Entrez le nouveau type de la carte:');
//   const newImageSrc = prompt('Entrez la nouvelle source de l\'image:');
//   if (newName && newType && newImageSrc) {
//     fetch(`/cartes/${cardId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         nom: newName,
//         type: newType,
//         imageSrc: newImageSrc
//       })
//     })
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Une erreur est survenue lors de la modification de la carte.');
//         }
//         // Si la modification a réussi, on met à jour la ligne de la table correspondante et on affiche une alerte
//         const cardRow = editButton.parentNode.parentNode;
//         const nameCell = cardRow.querySelector('.name');
//         const typeCell = cardRow.querySelector('.type');
//         const imageCell = cardRow.querySelector('.image');
//         nameCell.textContent = newName;
//         typeCell.textContent = newType;
//         imageCell.firstElementChild.src = newImageSrc;
//         alert(`La carte avec l'ID ${cardId} a été modifiée.`);
//       })
//       .catch(error => {
//         console.error(error);
//         alert(error.message);
//       });
//   }
// });

// actionCell.appendChild(editButton);
// row.appendChild(actionCell);

// ----------------------------------------------------- AJOUT POKEMON ---------------------------------------------------------------------------------
// Sélectionner le formulaire d'ajout de Pokémon
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
    // Récupérer les valeurs des champs du formulaire
    body: JSON.stringify({
      nom: form.nom.value,
      type: form.type.value,
      imageSrc: form.imageSrc.value
    })
  })
    .then(response => response.json()) // Récupérer la réponse JSON
    .then(nouvelleCarte => {
      // Créer une nouvelle ligne pour la nouvelle carte
      const tableBody = document.getElementById('pokemonList');
      const row = document.createElement('tr');

      // Ajouter l'image de la carte dans une cellule de la ligne
      const imageCell = document.createElement('td');
      const image = document.createElement('img');
      image.src = nouvelleCarte.imageSrc;
      imageCell.appendChild(image);
      row.appendChild(imageCell);

      // Ajouter le nom de la carte dans une cellule de la ligne
      const nameCell = document.createElement('td');
      nameCell.textContent = nouvelleCarte.nom;
      row.appendChild(nameCell);

      // Ajouter le type de la carte dans une cellule de la ligne
      const typeCell = document.createElement('td');
      typeCell.textContent = nouvelleCarte.type;
      row.appendChild(typeCell);

      // Ajouter un bouton de suppression dans une cellule de la ligne
      const actionCell = document.createElement('td');
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Supprimer';
      deleteButton.addEventListener('click', () => {
        // Récupérer l'ID de la carte et envoyer une requête DELETE
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

      // Ajouter la nouvelle ligne à la table
      tableBody.appendChild(row);

      // Réinitialiser les champs du formulaire
      form.reset();
    })
    .catch(error => console.error(error)); // Gérer les erreurs
});

// --------------------------------------------------- AFFICHER UN POKEMON SPECIFIQUE -----------------------------------------------------------------------------------

// On récupère l'élément du DOM avec l'ID "pokemonInfo"
const pokemonInfo = document.getElementById('pokemonInfo');

// On écoute l'événement "submit" sur le formulaire
document.querySelector('form[name="onePoke"]').addEventListener('submit', event => {
  event.preventDefault(); // On empêche le formulaire de se soumettre

  // On envoie une requête GET vers l'URL '/cartes' qui doit renvoyer un tableau d'objets "cartes"
  fetch('/cartes')
    .then(response => response.json()) // On convertit la réponse en objet JSON
    .then(cartes => {
      // On récupère le nom du Pokémon entré dans le formulaire
      const pokemonName = document.getElementById('nomCarte').value;

      // On cherche le Pokémon dans le tableau "cartes"
      const pokemon = cartes.find(carte => carte.nom.toLowerCase() === pokemonName.toLowerCase());

      if (pokemon) {
        // On crée une nouvelle image avec la source de l'image du Pokémon
        const image = document.createElement('img');
        image.src = pokemon.imageSrc;

        // On crée un nouveau h1 pour afficher le nom du Pokémon
        const name = document.createElement('h1');
        name.textContent = `Nom : ${pokemon.nom}`;

        // On crée un nouveau paragraphe pour afficher le type du Pokémon
        const type = document.createElement('p');
        type.textContent = `Type : ${pokemon.type}`;

        // On vide le contenu du div "pokemonInfo" s'il y a déjà des informations affichées
        pokemonInfo.innerHTML = '';

        // On ajoute les informations du Pokémon dans le div "pokemonInfo"
        pokemonInfo.appendChild(image);
        pokemonInfo.appendChild(name);
        pokemonInfo.appendChild(type);
      } else {
        // Si le Pokémon n'a pas été trouvé, on affiche un message d'erreur
        pokemonInfo.textContent = 'Pokémon non trouvé.';
      }
    })
    .catch(error => console.error(error));
});
