// Description: Ce fichier contient le code du serveur Node.js

// Import des modules

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// class Object carte pokemon
class CartePokemon {
  static id = 0;

  constructor(nom, type, imageSrc) {
    this.id = ++CartePokemon.id;
    this.nom = nom;
    this.type = type;
    this.imageSrc = imageSrc;
  }
}

// Récupérer la page index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* -------------------------------------------------- RECUPERER TOUTE LES CARTES ---------------------------------------------------------*/

// Récupérer toutes les cartes Pokemon dans le fichier pokemonList.json methode GET
app.get('/cartes', (req, res) => {
  // Lire le contenu du fichier pokemonList.json en utilisant la méthode readFile de Node.js
  fs.readFile('pokemonList.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      // Si une erreur se produit pendant la lecture du fichier, renvoyer une réponse d'erreur au client
      res.status(500).send('Erreur serveur');
      return;
    }
    // Extraire la liste des cartes existantes à partir du contenu JSON du fichier
    const cartes = JSON.parse(data).cartesPokemon;
    // Renvoyer la liste des cartes sous forme de JSON
    res.send(cartes);
  });
});

/* ----------------------------------------------- RECUPERER UNE CARTE SPECIFIQUE------------------------------------------------------*/

// Récupérer une carte Pokemon spécifique en utilisant son nom dans le fichier pokemonList.json methode GET
app.get('/cartes/:nom', (req, res) => {
  
  // Récupérer le nom de la carte à partir des paramètres de la requête
  const nomCarte = req.params.nom;
  
  // Lire le contenu du fichier pokemonList.json en utilisant la méthode readFile de Node.js
  fs.readFile('pokemonList.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      // Si une erreur se produit pendant la lecture du fichier, renvoyer une réponse d'erreur au client
      res.status(500).send('Erreur serveur');
      return;
    }
    // Extraire la liste des cartes existantes à partir du contenu JSON du fichier
    const cartes = JSON.parse(data).cartesPokemon;
    // Rechercher la carte spécifique à partir de son nom
    const carte = cartes.find(carte => carte.nom === nomCarte);
    if (carte) {
      // Si la carte est trouvée, la renvoyer sous forme de JSON
      res.send(carte);
    } else {
      // Sinon, renvoyer une réponse d'erreur au client
      res.status(404).send('Carte Pokemon non trouvée');
    }
  });
});

/* ---------------------------------------------- AJOUTER UNE CARTE ------------------------------------------------------------*/

// Ajouter une carte Pokemon dans le fichier pokemonList.json methode POST
app.post('/cartes', (req, res) => {

  // Créer une nouvelle instance de la classe CartePokemon en utilisant les données de la requête POST
  const nouvelleCarte = new CartePokemon(req.body.nom, req.body.type, req.body.imageSrc);

  // Lire le contenu du fichier pokemonList.json en utilisant la méthode readFile de Node.js
  fs.readFile('pokemonList.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      // Si une erreur se produit pendant la lecture du fichier, renvoyer une réponse d'erreur au client
      res.status(500).send('Erreur serveur');
      return;
    }

    // Extraire la liste des cartes existantes à partir du contenu JSON du fichier
    const cartes = JSON.parse(data).cartesPokemon;

    // Calculer le nouvel identifiant à attribuer à la nouvelle carte
    const dernierId = cartes.length > 0 ? cartes[cartes.length-1].id : -1;
    nouvelleCarte.id = dernierId + 1;

    // Ajouter la nouvelle carte à la liste des cartes existantes
    cartes.push(nouvelleCarte);

    // Écrire la nouvelle liste de cartes dans le fichier pokemonList.json en utilisant la méthode writeFile de Node.js
    fs.writeFile('pokemonList.json', JSON.stringify({cartesPokemon: cartes}), (err) => {
      if (err) {
        console.error(err);
        // Si une erreur se produit pendant l'écriture du fichier, renvoyer une réponse d'erreur au client
        res.status(500).send('Erreur serveur');
        return;
      }
      // Si l'écriture du fichier réussit, renvoyer la nouvelle carte sous forme de JSON
      res.send(nouvelleCarte);
    });
  });
});

/* ------------------------------------------ MODIFIER UNE CARTE -----------------------------------------------------*/

// Modifier une carte Pokemon à partir de son id dans le fichier pokemonList.json methode PUT
app.put('/cartes/:id', (req, res) => {
  // Créer une nouvelle instance de la carte Pokemon avec les propriétés mises à jour
  const carteModifiee = new CartePokemon(req.body.nom, req.body.type, req.body.imageSrc);
  // Récupérer l'id de la carte à partir des paramètres de la requête et le convertir en nombre
  carteModifiee.id = parseInt(req.params.id);

  // Lire le contenu du fichier pokemonList.json
  fs.readFile('pokemonList.json', 'utf8', (err, data) => {
    if (err) {
      // En cas d'erreur lors de la lecture du fichier, renvoyer une erreur 500 au client
      console.error(err);
      res.status(500).send('Erreur serveur');
      return;
    }

    // Extraire les cartes Pokemon du fichier json
    const cartes = JSON.parse(data).cartesPokemon;
    // Trouver l'index de la carte qui correspond à l'id de la carte à modifier
    const indexCarte = cartes.findIndex(carte => carte.id === carteModifiee.id);

    if (indexCarte === -1) {
      // Si l'index de la carte n'est pas trouvé, renvoyer une erreur 404
      res.status(404).send('Carte non trouvée');
      return;
    }

    // Remplacer la carte à l'index correspondant par la carte modifiée
    cartes[indexCarte] = carteModifiee;

    // Écrire les cartes mises à jour dans le fichier pokemonList.json
    fs.writeFile('pokemonList.json', JSON.stringify({cartesPokemon: cartes}), (err) => {
      if (err) {
        // En cas d'erreur lors de l'écriture du fichier, renvoyer une erreur 500 au client
        console.error(err);
        res.status(500).send('Erreur serveur');
        return;
      }

      // Si la mise à jour a réussi, renvoyer la carte modifiée au client
      res.send(carteModifiee);
    });
  });
});

/* ----------------------------------------------- SUPPRIMER UNE CARTE -----------------------------------------*/

// Supprimer une carte Pokemon à partir de son nom dans le fichier pokemonList.json methode DELETE
app.delete('/cartes/:id', (req, res) => {
  const idCarte = parseInt(req.params.id);  // On récupère l'ID de la carte à supprimer depuis les paramètres de la requête

  fs.readFile('pokemonList.json', 'utf8', (err, data) => {  // On lit le fichier pokemonList.json
    if (err) {  // Si une erreur se produit lors de la lecture du fichier
      console.error(err);  // On affiche l'erreur dans la console
      res.status(500).send('Erreur serveur');  // On renvoie une réponse d'erreur 500 au client
      return;
    }

    const cartes = JSON.parse(data).cartesPokemon;  // On récupère toutes les cartes Pokemon depuis le fichier
    const indexCarte = cartes.findIndex(carte => carte.id === idCarte);  // On cherche l'index de la carte à supprimer dans le tableau

    if (indexCarte === -1) {  // Si la carte à supprimer n'est pas trouvée dans le tableau
      res.status(404).send('Carte non trouvée');  // On renvoie une réponse d'erreur 404 au client
      return;
    }

    cartes.splice(indexCarte, 1);  // On supprime la carte du tableau

    fs.writeFile('pokemonList.json', JSON.stringify({cartesPokemon: cartes}), (err) => {  // On écrit le nouveau contenu du fichier
      if (err) {  // Si une erreur se produit lors de l'écriture du fichier
        console.error(err);  // On affiche l'erreur dans la console
        res.status(500).send('Erreur serveur');  // On renvoie une réponse d'erreur 500 au client
        return;
      }

      res.send(`La carte avec l'ID ${idCarte} a été supprimée.`);  // On renvoie une réponse réussie avec un message de confirmation au client
    });
  });
});

app.listen(
3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
