CREATE TABLE Utilisateurs (
    ID_Utilisateur INTEGER PRIMARY KEY AUTOINCREMENT,
    Nom VARCHAR(100) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Mot_De_Passe VARCHAR(100) NOT NULL
);


CREATE TABLE Livres (
    ID_Livre INTEGER PRIMARY KEY AUTOINCREMENT,
    Titre VARCHAR(255) NOT NULL,
    Auteur VARCHAR(255) NOT NULL,
    Genre VARCHAR(100) NOT NULL,
    Mots_Cles TEXT,
    Resume TEXT,
    Date_Publication DATE,
    Editeur VARCHAR(255),
    Nombre_Pages INTEGER,
    ISBN VARCHAR(20) UNIQUE,
    URL_Couverture TEXT
);

CREATE TABLE Interactions (
    ID_Interaction INTEGER PRIMARY KEY AUTOINCREMENT,
    ID_Utilisateur INTEGER NOT NULL,
    ID_Livre INTEGER NOT NULL,
    Note INTEGER,
    Date_Interaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Description TEXT,  -- ✅ remplace "Feedback"
    FOREIGN KEY (ID_Utilisateur) REFERENCES Utilisateurs(ID_Utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (ID_Livre) REFERENCES Livres(ID_Livre) ON DELETE CASCADE
);


CREATE TABLE Mots_Cles (
    ID_Mot_Cle INTEGER PRIMARY KEY AUTOINCREMENT,
    Mot_Cle VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE Mots_Cles_Livres (
    ID_Livre INTEGER NOT NULL,
    ID_Mot_Cle INTEGER NOT NULL,
    PRIMARY KEY (ID_Livre, ID_Mot_Cle),
    FOREIGN KEY (ID_Livre) REFERENCES Livres(ID_Livre) ON DELETE CASCADE,
    FOREIGN KEY (ID_Mot_Cle) REFERENCES Mots_Cles(ID_Mot_Cle) ON DELETE CASCADE
);

CREATE TABLE Recommendations (
    ID_Recommandation INTEGER PRIMARY KEY AUTOINCREMENT,
    ID_Utilisateur INTEGER NOT NULL,
    ID_Livre INTEGER NOT NULL,
    Score_Recommandation FLOAT NOT NULL,
    Date_Recommandation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_Utilisateur) REFERENCES Utilisateurs(ID_Utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (ID_Livre) REFERENCES Livres(ID_Livre) ON DELETE CASCADE
);



CREATE TABLE Cercle (
    ID_Utilisateur INTEGER,
    ID_Membre INTEGER,
    Date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ID_Utilisateur, ID_Membre),
    FOREIGN KEY (ID_Utilisateur) REFERENCES Utilisateur(ID_Utilisateur),
    FOREIGN KEY (ID_Membre) REFERENCES Utilisateur(ID_Utilisateur)
);
