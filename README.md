# CPNV F1 — prototype multijoueur

## Mise en ligne
Le jeu utilise Node.js et Socket.IO : il faut un hébergeur qui accepte les applications Node.js et les WebSockets. GitHub Pages seul ne suffit pas.
- Build command: `npm install`
- Start command: `npm start`
- Le service doit écouter le port fourni dans la variable `PORT`.

Une fois déployé, l'hébergeur donne une adresse HTTPS à partager. Tous les joueurs ouvrent cette adresse et utilisent le code de lobby **CPNV**. Demande l'aide d'un parent/tuteur pour créer et gérer le compte d'hébergement.

## Jouer
- Flèches ou WASD : conduire.
- Q : demander un arrêt au stand.
- E : tenter le timing de l'arrêt.
- Le départ automatique se déclenche lorsque tous les joueurs du lobby (au moins deux) sont prêts.

## Limites
Prototype 2D vu du dessus, circuit fictif et physique simplifiée. Les positions sont synchronisées par Socket.IO, mais la conduite est simulée côté navigateur. Ce n'est pas un simulateur officiel F1/FIA ni une reproduction exacte de F1 26.