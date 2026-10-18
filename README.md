# La porte du Nouvel An

Une petite application locale pour préparer des animations de vœux personnalisées.

## Utilisation

Ouvrez `index.html` dans un navigateur récent (Safari, Chrome ou Firefox). Aucune installation, aucun compte et aucune connexion ne sont nécessaires.

- Créez une animation avec le bouton `+`.
- Saisissez, si besoin, un prénom, une question, une réponse correcte et les réponses humoristiques. Choisissez « Tu » ou « Vous » pour adapter les messages de l’animation à la personne.
- Vous pouvez aussi ouvrir la « Liste commune de bonnes réponses », y saisir une réponse par ligne, puis en choisir une pour la préparation actuelle. La réponse choisie reste modifiable et les autres préparations ne changent pas.
- Rejouez la scène dans l’aperçu : la question lance les quatre pancartes. Sans clic, elles repartent en boucle.
- Exportez les préparations via `Exporter le JSON`. Vous pouvez les retrouver sur le même appareil grâce au stockage local du navigateur, ou les importer plus tard avec `Importer un JSON`.
- Le JSON exporté contient aussi la liste commune. L’importation d’un ancien JSON sans liste conserve la liste commune actuelle ; un JSON avec liste la remplace.

Les données ne sont jamais envoyées par l’application : elles restent dans le navigateur et dans les fichiers JSON que vous choisissez d’exporter.

Pour conserver les fichiers HTML autonomes et préparer leur envoi, consultez `animations-a-conserver/LISEZ-MOI.md`. Une publication Web ne se fait que sur demande ; l’animation ainsi publiée devient publique.

## Préparer un essai de publication

Le bouton « Préparer toutes les animations pour publication » télécharge une archive ZIP. Décompressez-la : le dossier `site` contient une page autonome par animation et peut être publié dans un seul dépôt ou hébergement de pages statiques. Pour l’essai, une seule animation suffit ; les suivantes pourront être ajoutées plus tard en préparant une nouvelle archive.

Le fichier `liens-prives.csv` indique le chemin de chaque page : conservez-le sur votre ordinateur et ne publiez que le contenu du dossier `site`. Après publication, ajoutez chaque chemin à l’adresse du site pour obtenir le lien à envoyer. Les adresses sont difficiles à deviner, mais les pages ne sont pas protégées par mot de passe : toute personne ayant le lien peut les consulter. Pensez aussi à exporter le JSON pour sauvegarder les préparations modifiables.
