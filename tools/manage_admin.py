import argparse
import mysql.connector

def connect_db():
    return mysql.connector.connect(
        host="localhost",
        user="specialweek",
        password="specialweek",
        database="specialweek",
        port=3306
    )

def set_admin_by_email(email):
    conn = connect_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id FROM profil WHERE mail = %s", (email,))
    user = cursor.fetchone()
    
    if user:
        cursor.execute("UPDATE profil SET is_admin = 1 WHERE mail = %s", (email,))
        conn.commit()
        print(f"L'utilisateur {email} a été défini comme administrateur.")
    else:
        print(f"Erreur : Aucun utilisateur trouvé avec l'email {email}")
        
    cursor.close()
    conn.close()

def create_admin(prenom, nom, mail, mdp):
    conn = connect_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id FROM profil WHERE mail = %s", (mail,))
    if cursor.fetchone():
        print(f"L'utilisateur avec l'email {mail} existe déjà. Utilisez --promote pour le rendre admin.")
    else:
        cursor.execute(
            "INSERT INTO profil (prenom, nom, mail, mdp, points, is_admin) VALUES (%s, %s, %s, %s, 0, 1)",
            (prenom, nom, mail, mdp)
        )
        conn.commit()
        print(f"Administrateur {prenom} {nom} ({mail}) créé avec succès.")
        
    cursor.close()
    conn.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Gérer les administrateurs pour SpecialWeek")
    subparsers = parser.add_subparsers(dest="command", help="Commandes disponibles")
    
    # Subparser for promote
    parser_promote = subparsers.add_parser("promote", help="Promouvoir un utilisateur existant en admin")
    parser_promote.add_argument("--email", required=True, help="Email de l'utilisateur à rendre admin")
    
    # Subparser for create
    parser_create = subparsers.add_parser("create", help="Créer un nouvel administrateur")
    parser_create.add_argument("--prenom", required=True, help="Prénom de l'administrateur")
    parser_create.add_argument("--nom", required=True, help="Nom de l'administrateur")
    parser_create.add_argument("--email", required=True, help="Email de l'administrateur")
    parser_create.add_argument("--mdp", required=True, help="Mot de passe de l'administrateur")
    
    args = parser.parse_args()
    
    if args.command == "promote":
        set_admin_by_email(args.email)
    elif args.command == "create":
        create_admin(args.prenom, args.nom, args.email, args.mdp)
    else:
        parser.print_help()
