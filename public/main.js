const tableBody = document.getElementById('pokemonList');

fetch('/cartes')
  .then(response => response.json())
  .then(cartes => {
    for (const carte of cartes) {
      const row = document.createElement('tr');

      const nameCell = document.createElement('td');
      nameCell.textContent = carte.nom;
      row.appendChild(nameCell);

      const typeCell = document.createElement('td');
      typeCell.textContent = carte.type;
      row.appendChild(typeCell);

      const imageCell = document.createElement('td');
      const image = document.createElement('img');
      image.src = carte.imageSrc;
      imageCell.appendChild(image);
      row.appendChild(imageCell);

      const actionCell = document.createElement('td');
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Supprimer';
      deleteButton.addEventListener('click', () => {
        const cardId = carte.id;
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
    }
  })
  .catch(error => console.error(error));
