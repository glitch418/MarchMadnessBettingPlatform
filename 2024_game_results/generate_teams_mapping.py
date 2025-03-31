import csv

TEAM_MAPPING = {
    "WAGNER": "Wagner Seahawks",
    "HOWARD": "Howard Bison",
    "CO ST": "Colorado State Rams",
    "UVA": "Virginia Cavaliers",
    "GRAMB": "Grambling State Tigers",
    "MONTST": "Montana State Bobcats",
    "COLO": "Colorado Buffaloes",
    "BOISE": "Boise State Broncos",
    "MICHST": "Michigan State Spartans",
    "MISSST": "Mississippi State Bulldogs",
    "DUQSNE": "Duquesne Dukes",
    "BYU": "Brigham Young Cougars",
    "AKRON": "Akron Zips",
    "CREIGH": "Creighton Bluejays",
    "LBSU": "Long Beach State Beach",
    "ARIZ": "Arizona Wildcats",
    "UNC": "North Carolina Tar Heels",
    "MOREST": "Morehead State Eagles",
    "ILL": "Illinois Fighting Illini",
    "OREGN": "Oregon Ducks",
    "S CAR": "South Carolina Gamecocks",
    "NEVADA": "Nevada Wolf Pack",
    "DAYTON": "Dayton Flyers",
    "TEXAS": "Texas Longhorns",
    "OAK": "Oakland Golden Grizzlies",
    "UK": "Kentucky Wildcats",
    "SDAKST": "South Dakota State Jackrabbits",
    "IOWAST": "Iowa State Cyclones",
    "MCNEES": "McNeese State Cowboys",
    "GONZ": "Gonzaga Bulldogs",
    "ST PTR": "Saint Peter's Peacocks",
    "TENN": "Tennessee Volunteers",
    "NC ST": "North Carolina State Wolfpack",
    "TXTECH": "Texas Tech Red Raiders",
    "DRAKE": "Drake Bulldogs",
    "WASHST": "Washington State Cougars",
    "SAMFRD": "Samford Bulldogs",
    "KANSAS": "Kansas Jayhawks",
    "NW": "Northwestern Wildcats",
    "FAU": "Florida Atlantic Owls",
    "COLGAT": "Colgate Raiders",
    "BAYLOR": "Baylor Bears",
    "UAB": "Alabama-Birmingham Blazers",
    "SDSU": "San Diego State Aztecs",
    "W KY": "Western Kentucky Hilltoppers",
    "MARQ": "Marquette Golden Eagles",
    "N MEX": "New Mexico Lobos",
    "STETSN": "Stetson Hatters",
    "UCONN": "Connecticut Huskies",
    "YALE": "Yale Bulldogs",
    "AUBURN": "Auburn Tigers",
    "FLA": "Florida Gators",
    "TX A&M": "Texas A&M Aggies",
    "NEB": "Nebraska Cornhuskers",
    "VERMNT": "Vermont Catamounts",
    "DUKE": "Duke Blue Devils",
    "PURDUE": "Purdue Boilermakers",
    "C OF C": "College of Charleston Cougars",
    "ALA": "Alabama Crimson Tide",
    "LONGWD": "Longwood Lancers",
    "HOU": "Houston Cougars",
    "JMU": "James Madison Dukes",
    "WISC": "Wisconsin Badgers",
    "TCU": "Texas Christian Horned Frogs",
    "UT ST": "Utah State Aggies",
    "GCANYN": "Grand Canyon Antelopes",
    "STMARY": "Saint Mary's Gaels",
    "CLEM": "Clemson Tigers"
}

def main():
    input_file = "march_madness_mens_games_2024.csv"
    output_file = "teams_mapping.csv"

    abbreviations = set()

    # Read original CSV to find unique abbreviations set
    with open(input_file, "r", newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        header = next(reader)  # skip the header
        for row in reader:
            # row[1] is team1 abbreviation, row[3] is team2 abbreviation
            team1_abbr = row[1].strip()
            team2_abbr = row[3].strip()

            abbreviations.add(team1_abbr)
            abbreviations.add(team2_abbr)

    # Write teams_mapping.csv
    with open(output_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["abbreviation", "team_name"])

        # Sort abbreviations for consistency
        for abbr in sorted(abbreviations):
            # If we have a known name in TEAM_MAPPING, use it; otherwise "TBD"
            full_name = TEAM_MAPPING.get(abbr, f"{abbr} - TBD")
            writer.writerow([abbr, full_name])

    print(f"Created {output_file} with {len(abbreviations)} abbreviations.")

if __name__ == "__main__":
    main()
