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


// Récupérer toutes les cartes Pokemon dans le fichier pokemonList.json methode GET
app.get('/cartes', (req, res) => {
  fs.readFile('pokemonList.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erreur serveur');
      return;
    }
    const cartes = JSON.parse(data).cartesPokemon;
    res.send(cartes);
  });
});

// Récupérer une carte Pokemon spécifique en utilisant son nom dans le fichier pokemonList.json methode GET
app.get('/cartes/:nom', (req, res) => {
  
  const nomCarte = req.params.nom;
  fs.readFile('pokemonList.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erreur serveur');
      return;
    }
    const cartes = JSON.parse(data).cartesPokemon;
    const carte = cartes.find(carte => carte.nom === nomCarte);
    if (carte) {
      res.send(carte);
    } else {
      res.status(404).send('Carte Pokemon non trouvée');
    }
  });
});


// Ajouter une carte Pokemon dans le fichier pokemonList.json methode POST
app.post('/cartes', (req, res) => {
  
  const nouvelleCarte = new CartePokemon(req.body.nom, req.body.type, req.body.imageSrc);
  
  fs.readFile('pokemonList.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erreur serveur');
      return;
    }
    
    const cartes = JSON.parse(data).cartesPokemon;
    const dernierId = cartes.length > 0 ? cartes[cartes.length-1].id : -1;
    nouvelleCarte.id = dernierId + 1;
    cartes.push(nouvelleCarte);
    
    fs.writeFile('pokemonList.json', JSON.stringify({cartesPokemon: cartes}), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
        return;
      }
      res.send(nouvelleCarte);
    });
  });
 });

// Modifier une carte Pokemon à partir de son id dans le fichier pokemonList.json methode PUT
app.put('/cartes/:id', (req, res) => {
  const carteModifiee = new CartePokemon(req.body.nom, req.body.type, req.body.imageSrc);
  carteModifiee.id = parseInt(req.params.id);

  fs.readFile('pokemonList.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erreur serveur');
      return;
    }

    const cartes = JSON.parse(data).cartesPokemon;
    const indexCarte = cartes.findIndex(carte => carte.id === carteModifiee.id);

    if (indexCarte === -1) {
      res.status(404).send('Carte non trouvée');
      return;
    }

    cartes[indexCarte] = carteModifiee;

    fs.writeFile('pokemonList.json', JSON.stringify({cartesPokemon: cartes}), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
        return;
      }

      res.send(carteModifiee);
    });
  });
});


// Supprimer une carte Pokemon à partir de son nom dans le fichier pokemonList.json methode DELETE
app.delete('/cartes/:id', (req, res) => {
  const idCarte = parseInt(req.params.id);

  fs.readFile('pokemonList.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erreur serveur');
      return;
    }

    const cartes = JSON.parse(data).cartesPokemon;
    const indexCarte = cartes.findIndex(carte => carte.id === idCarte);

    if (indexCarte === -1) {
      res.status(404).send('Carte non trouvée');
      return;
    }

    cartes.splice(indexCarte, 1);

    fs.writeFile('pokemonList.json', JSON.stringify({cartesPokemon: cartes}), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
        return;
      }

      res.send(`La carte avec l'ID ${idCarte} a été supprimée.`);
    });
  });
});


app.listen(
3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
