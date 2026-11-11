#!/usr/bin/env python3
"""
Gera Script_Pokedex_completo.sql com os Pokémon e formas disponibilizados
pela PokéAPI v2, incluindo Mega Evoluções (IDs a partir de 10000).

Requisitos:
    Python 3.10+
    pip install requests

Execução:
    python3 gerar_pokedex.py

Cada registro do endpoint /pokemon/ é inserido individualmente. Isso inclui
Pokémon normais e formas adicionais que possuem IDs próprios na PokéAPI.
"""

from concurrent.futures import ThreadPoolExecutor, as_completed
from time import sleep
import sys

import requests

BASE_URL = "https://pokeapi.co/api/v2"
OUTPUT_FILE = "Script_Pokedex_completo.sql"
WORKERS = 8
TIMEOUT = 30
PAGE_LIMIT = 2000

# IDs e nomes oficiais dos 18 tipos da PokéAPI.
TYPE_NAMES = {
    1: "normal",
    2: "fighting",
    3: "flying",
    4: "poison",
    5: "ground",
    6: "rock",
    7: "bug",
    8: "ghost",
    9: "steel",
    10: "fire",
    11: "water",
    12: "grass",
    13: "electric",
    14: "psychic",
    15: "ice",
    16: "dragon",
    17: "dark",
    18: "fairy",
}

TRAINERS = """(1, 'Ash', 9),
    (2, 'Brock', 1),
    (3, 'Misty', 2),
    (4, 'Lt. Surge', 3),
    (5, 'Erika', 4),
    (6, 'Koga', 5),
    (7, 'Sabrina', 6),
    (8, 'Blaine', 7),
    (9, 'Giovanni', 8),
    (10, 'Gary', 9),
    (11, 'Team Rocket', 0),
    (12, 'Lance', 9)"""

TRAINER_POKEMON = """(1, 25),
    (1, 3),
    (1, 6),
    (1, 9),
    (1, 131),
    (1, 143),
    (2, 74),
    (2, 95),
    (3, 120),
    (3, 121),
    (4, 26),
    (5, 114),
    (5, 70),
    (5, 44),
    (6, 48),
    (6, 48),
    (6, 48),
    (6, 49),
    (7, 63),
    (7, 64),
    (7, 65),
    (8, 38),
    (8, 78),
    (8, 59),
    (9, 51),
    (9, 53),
    (9, 31),
    (9, 34),
    (9, 112),
    (10, 28),
    (10, 65),
    (10, 103),
    (10, 82),
    (10, 38),
    (10, 134),
    (11, 23),
    (11, 52),
    (11, 109),
    (12, 130),
    (12, 148),
    (12, 149),
    (12, 142),
    (12, 149)"""


def get_json(url):
    """Consulta a API com tentativas em caso de falha temporária."""
    for attempt in range(5):
        try:
            response = requests.get(url, timeout=TIMEOUT)
            response.raise_for_status()
            return response.json()
        except requests.RequestException:
            if attempt == 4:
                raise
            sleep(1.5 * (attempt + 1))


def sql_string(value):
    """Escapa texto para literais SQL compatíveis com MySQL."""
    return "'" + str(value).replace("\\", "\\\\").replace("'", "''") + "'"


def fetch_pokemon(pokemon_entry):
    """Obtém stats e tipos de um Pokémon ou forma individual."""
    pokemon = get_json(pokemon_entry["url"])
    stats = {
        stat["stat"]["name"]: stat["base_stat"]
        for stat in pokemon["stats"]
    }

    return {
        "id": pokemon["id"],
        "name": pokemon["name"],
        "hp": stats.get("hp", 0),
        "attack": stats.get("attack", 0),
        "defense": stats.get("defense", 0),
        "special_attack": stats.get("special-attack", 0),
        "special_defense": stats.get("special-defense", 0),
        "speed": stats.get("speed", 0),
        "types": [
            item["type"]["name"]
            for item in pokemon["types"]
            if item["type"]["name"] in TYPE_NAMES.values()
        ],
    }


def get_all_pokemon_entries():
    """Obtém todos os registros de /pokemon/, incluindo IDs acima de 10000."""
    first_page = get_json(f"{BASE_URL}/pokemon/?limit={PAGE_LIMIT}&offset=0")
    entries = list(first_page["results"])
    total = first_page["count"]

    # Busca páginas adicionais caso a quantidade ultrapasse PAGE_LIMIT.
    for offset in range(PAGE_LIMIT, total, PAGE_LIMIT):
        page = get_json(
            f"{BASE_URL}/pokemon/?limit={PAGE_LIMIT}&offset={offset}"
        )
        entries.extend(page["results"])

    return entries


def main():
    print("Consultando todos os registros do endpoint /pokemon/...")
    pokemon_entries = get_all_pokemon_entries()
    print(
        f"{len(pokemon_entries)} registros encontrados. "
        "Baixando atributos e tipos..."
    )

    pokemon_data = []
    errors = []

    with ThreadPoolExecutor(max_workers=WORKERS) as executor:
        futures = {
            executor.submit(fetch_pokemon, entry): entry
            for entry in pokemon_entries
        }
        completed = 0

        for future in as_completed(futures):
            entry = futures[future]
            completed += 1
            try:
                pokemon_data.append(future.result())
            except Exception as exc:
                errors.append((entry["name"], str(exc)))

            if completed % 50 == 0 or completed == len(futures):
                print(f"Processados: {completed}/{len(futures)}")

    if errors:
        print("\nNão foi possível obter todos os registros:", file=sys.stderr)
        for name, error in errors:
            print(f"- {name}: {error}", file=sys.stderr)
        print(
            "Nenhum SQL será gerado. Corrija a conexão e execute novamente.",
            file=sys.stderr,
        )
        sys.exit(1)

    # Ordena pelo ID da PokéAPI; IDs de formas, como 10034, são preservados.
    pokemon_data.sort(key=lambda pokemon: pokemon["id"])

    lines = [
        "-- Pokédex gerada a partir de todos os registros de /pokemon/ da PokéAPI v2.",
        "-- Inclui formas alternativas e Mega Evoluções quando disponibilizadas pela API.",
        "-- Fonte: https://pokeapi.co/api/v2/pokemon/",
        "",
        "SET NAMES utf8mb4;",
        "SET FOREIGN_KEY_CHECKS = 0;",
        "DROP TABLE IF EXISTS Rel_Trainer_Pokemon;",
        "DROP TABLE IF EXISTS Rel_Pokemon_Type;",
        "DROP TABLE IF EXISTS Trainers;",
        "DROP TABLE IF EXISTS Pokemon;",
        "DROP TABLE IF EXISTS Types;",
        "SET FOREIGN_KEY_CHECKS = 1;",
        "",
        """CREATE TABLE Types (
    ID_Type INT NOT NULL,
    Type VARCHAR(20) NOT NULL,
    PRIMARY KEY (ID_Type),
    UNIQUE KEY UK_Types_Type (Type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;""",
        "",
        """CREATE TABLE Pokemon (
    ID_Pokemon INT NOT NULL,
    Pokemon VARCHAR(100) NOT NULL,
    HP INT NOT NULL,
    Attack INT NOT NULL,
    Defense INT NOT NULL,
    Special_Attack INT NOT NULL,
    Special_Defense INT NOT NULL,
    Speed INT NOT NULL,
    PRIMARY KEY (ID_Pokemon)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;""",
        "",
        """CREATE TABLE Rel_Pokemon_Type (
    ID_Pokemon INT NOT NULL,
    ID_Type INT NOT NULL,
    PRIMARY KEY (ID_Pokemon, ID_Type),
    CONSTRAINT FK_RPT_Pokemon FOREIGN KEY (ID_Pokemon) REFERENCES Pokemon(ID_Pokemon),
    CONSTRAINT FK_RPT_Type FOREIGN KEY (ID_Type) REFERENCES Types(ID_Type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;""",
        "",
        """CREATE TABLE Trainers (
    ID_Trainer INT NOT NULL,
    Trainer VARCHAR(50) NOT NULL,
    Badges INT NOT NULL DEFAULT 0,
    PRIMARY KEY (ID_Trainer)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;""",
        "",
        """CREATE TABLE Rel_Trainer_Pokemon (
    ID_Trainer INT NOT NULL,
    ID_Pokemon INT NOT NULL,
    CONSTRAINT FK_RTP_Trainer FOREIGN KEY (ID_Trainer) REFERENCES Trainers(ID_Trainer),
    CONSTRAINT FK_RTP_Pokemon FOREIGN KEY (ID_Pokemon) REFERENCES Pokemon(ID_Pokemon)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;""",
        "",
        "INSERT INTO Types (ID_Type, Type) VALUES",
    ]

    type_values = [
        f"({type_id}, {sql_string(name.title())})"
        for type_id, name in TYPE_NAMES.items()
    ]
    lines.append(",\n".join(type_values) + ";")

    lines += [
        "",
        "INSERT INTO Pokemon",
        "(ID_Pokemon, Pokemon, HP, Attack, Defense, Special_Attack, Special_Defense, Speed)",
        "VALUES",
    ]

    pokemon_values = []
    for pokemon in pokemon_data:
        pokemon_values.append(
            f"({pokemon['id']}, {sql_string(pokemon['name'].title())}, "
            f"{pokemon['hp']}, {pokemon['attack']}, {pokemon['defense']}, "
            f"{pokemon['special_attack']}, {pokemon['special_defense']}, "
            f"{pokemon['speed']})"
        )
    lines.append(",\n".join(pokemon_values) + ";")

    lines += ["", "INSERT INTO Rel_Pokemon_Type (ID_Pokemon, ID_Type) VALUES"]
    relation_values = []
    type_ids_by_name = {name: type_id for type_id, name in TYPE_NAMES.items()}

    for pokemon in pokemon_data:
        for type_name in pokemon["types"]:
            relation_values.append(
                f"({pokemon['id']}, {type_ids_by_name[type_name]})"
            )

    lines.append(",\n".join(relation_values) + ";")

    lines += [
        "",
        "INSERT INTO Trainers (ID_Trainer, Trainer, Badges) VALUES",
        TRAINERS + ";",
        "",
        "INSERT INTO Rel_Trainer_Pokemon (ID_Trainer, ID_Pokemon) VALUES",
        TRAINER_POKEMON + ";",
        "",
        "SELECT * FROM Pokemon;",
        "SELECT * FROM Trainers;",
        "SELECT * FROM Types;",
        "SELECT * FROM Rel_Pokemon_Type;",
        "SELECT * FROM Rel_Trainer_Pokemon;",
        "",
    ]

    with open(OUTPUT_FILE, "w", encoding="utf-8") as file:
        file.write("\n".join(lines))

    mega_count = sum(1 for pokemon in pokemon_data if pokemon["id"] >= 10000)
    print(f"\nArquivo gerado: {OUTPUT_FILE}")
    print(f"Registros de Pokémon/formas inseridos: {len(pokemon_data)}")
    print(f"Registros com ID >= 10000: {mega_count}")
    print(f"Relacionamentos de tipos: {len(relation_values)}")


if __name__ == "__main__":
    main()
