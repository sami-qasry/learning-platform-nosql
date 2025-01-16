Question : Pourquoi créer un module séparé pour les connexions aux bases de données ?
    Réponse :
        - Centraliser la logique pour réutilisabilité et facilité de maintenance.
        - Gérer proprement les erreurs et éviter les duplications.
        - Respecter les principes de modularité et d'encapsulation.

Question : Comment gérer proprement la fermeture des connexions ?
    Réponse :
        - Écouter les événements système (SIGINT, exit).
        - Fermer explicitement avec des méthodes comme client.close() (MongoDB) et quit() (Redis).
        - Utiliser try-catch pour éviter des erreurs lors de la fermeture.
        - Libérer les ressources pour éviter les fuites.  

Question: Pourquoi est-il important de valider les variables d'environnement au démarrage ?
    Réponse : 
        - Pour s'assurer que toutes les dépendances critiques sont correctement configurées.
        - Identifier rapidement les problèmes de configuration avant l'exécution.
        - Garantir la fiabilité et éviter des comportements imprévisibles.

Question: Que se passe-t-il si une variable requise est manquante ?
    Réponse : 
        - Si une variable requise est absente, une erreur sera levée au démarrage, empêchant l'application de s'exécuter. Cela évite des comportements imprévisibles ou des pannes en cours d'exécution.

Question: Quelle est la différence entre un contrôleur et une route ?
    Réponse:
        - Route : Définit l'URL et le type de requête HTTP (GET, POST, etc.) qui déclenchent une action.
        - Contrôleur : Contient la logique métier associée à cette route (par exemple, traitement des données, appel des services, gestion des réponses).

Question : Pourquoi séparer la logique métier des routes ?
    Réponse :
        - Pour rendre le code plus lisible, maintenable, et organisé.
        - Permet de réutiliser la logique métier dans différents contextes.
        - Facilite les tests unitaires en isolant la logique des détails des routes.

Question: Pourquoi séparer les routes dans différents fichiers ?
    Réponse : 
        - Pour améliorer la modularité, la lisibilité et faciliter la collaboration.

Question : Comment organiser les routes de manière cohérente ?
    Réponse: 
        - Grouper par fonctionnalité, utiliser une structure logique, et suivre les conventions RESTful.

Question: Pourquoi créer des services séparés ?
    Réponse: 
        - Réutilisabilité : Les services permettent de centraliser la logique métier ou les opérations courantes, facilitant leur réutilisation dans plusieurs parties de l'application.
        - Modularité : En séparant la logique dans des services distincts, le code devient plus organisé, facile à maintenir et à tester.
        - Testabilité : Les services indépendants sont plus simples à tester en isolation, sans dépendre des contrôleurs ou des routes.

Question : Comment gérer efficacement le cache avec Redis ?
    Réponse :
        - Utiliser des clé-valeur simples pour stocker les données fréquemment accédées.
        - Définir une durée d'expiration (TTL) pour éviter un cache obsolète.
        - Mettre en place des stratégies de mise à jour ou d'invalidation de cache pour garder les données cohérentes.

Question: Quelles sont les bonnes pratiques pour les clés Redis ?
    Réponse :
        - Utiliser des noms de clés descriptifs et cohérents, souvent avec un préfixe.
        - Éviter les clés trop longues ou complexes.
        - Prendre en compte l'expiration et l'éviction des clés pour éviter une surcharge de mémoire.

Question: Comment organiser le point d'entrée de l'application ?
    Réponse :
        - Centraliser la configuration, l'initialisation des services (comme la base de données) et le montage des routes dans un seul fichier (souvent server.js ou app.js).
        - Gérer proprement les erreurs et l'arrêt de l'application pour garantir une exécution fiable.

Question: Quelle est la meilleure façon de gérer le démarrage de l'application ?
    Réponse :
        - Utiliser une fonction startServer pour initialiser les connexions (bases de données, services), configurer les middlewares, monter les routes et démarrer le serveur.
        - Gérer les erreurs et ajouter des mécanismes pour un arrêt propre (comme écouter le signal SIGTERM pour fermer les connexions).
        