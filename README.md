# GeofencingApp

GeofencingApp est une application cross-plateforme développée avec Ionic et Angular, permettant aux utilisateurs de visualiser les parties du monde qu'ils ont visitées grâce à la géolocalisation en temps réel et la sauvegarde des positions.

## Fonctionnalités

- Géolocalisation en temps réel de l'utilisateur
- Sauvegarde des positions toutes les X secondes
- Surcharge de cartes pour l'affichage des positions visitées

## Prérequis

- Node.js (version 14 ou supérieure)
- npm (version 6 ou supérieure)
- Ionic CLI (version 6 ou supérieure)

## Installation

1. Clonez le dépôt :

    ```bash
    git clone https://github.com/votre-utilisateur/GeofencingApp.git
    cd GeofencingApp
    ```

2. Installez les dépendances :

    ```bash
    npm install
    ```

## Démarrage

Pour démarrer l'application en mode développement, exécutez la commande suivante :

```bash
ionic serve
```

L'application sera accessible à l'adresse `http://localhost:8100`.

## Construction

Pour construire l'application pour différentes plateformes, utilisez les commandes suivantes :

- Pour iOS :

    ```bash
    ionic build --platform ios
    ```

- Pour Android :

    ```bash
    ionic build --platform android
    ```

## Contribution

Les contributions sont les bienvenues ! Pour contribuer, veuillez suivre ces étapes :

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos modifications (`git commit -am 'Ajout de la nouvelle fonctionnalité'`)
4. Poussez la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request