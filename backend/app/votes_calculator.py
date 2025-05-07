import requests
from collections import defaultdict

def get_sejm_voting_data(term=10, sitting=32, voting=29, government_parties=None):
    """
    Pobiera dane głosowania z API Sejmu i zwraca je w określonym formacie.
    
    Args:
        term (int): Numer kadencji Sejmu
        sitting (int): Numer posiedzenia
        voting (int): Numer głosowania
        government_parties (list): Lista partii tworzących koalicję rządzącą.
                                  Jeśli None, wyliczony zostanie tylko procent głosów każdej partii.
    
    Returns:
        dict: Dane o głosowaniu w określonym formacie
    """
    url = f"https://api.sejm.gov.pl/sejm/term{term}/votings/{sitting}/{voting}"
    response = requests.get(url)
    
    if response.status_code != 200:
        raise Exception(f"Błąd pobierania danych: {response.status_code}")
    
    data = response.json()
    
    # Przygotowanie struktury wynikowej
    result = {
        "votesYes": {
            "governmentPercentage": 0,
            "partyVotes": []
        },
        "votesNo": {
            "governmentPercentage": 0,
            "partyVotes": []
        }
    }
    
    # Słownik do grupowania głosów według klubów/partii
    party_votes = defaultdict(lambda: {"yes": 0, "no": 0, "abstain": 0, "absent": 0, "total": 0})
    
    # Aktualna koalicja rządząca (2025), można przekazać jako parametr
    if government_parties is None:
        # Domyślnie dla kadencji 10 (2023-2027)
        government_parties = ["KO", "Lewica", "TD", "PSL"] if term == 10 else []
    
    # Analiza głosów
    if "votes" in data:
        for vote in data["votes"]:
            # Użyj klubu parlamentarnego lub "Niezrzeszeni" jeśli brak
            club = vote.get("club", "Niezrzeszeni")
            vote_type = vote.get("vote", "Nieobecny")
            
            # Zwiększenie licznika dla odpowiedniego typu głosu
            party_votes[club]["total"] += 1
            
            if vote_type == "Yes":
                party_votes[club]["yes"] += 1
            elif vote_type == "No":
                party_votes[club]["no"] += 1
            elif vote_type == "Abstain":
                party_votes[club]["abstain"] += 1
            else:  # "Absent", "Not voting" itp.
                party_votes[club]["absent"] += 1
    
    # Obliczenie procentów dla każdej partii
    for party, votes in party_votes.items():
        total = votes["total"]
        if total > 0:
            yes_percentage = round((votes["yes"] / total) * 100)
            no_percentage = round((votes["no"] / total) * 100)
            
            result["votesYes"]["partyVotes"].append({
                "party": party,
                "percentage": yes_percentage
            })
            
            result["votesNo"]["partyVotes"].append({
                "party": party,
                "percentage": no_percentage
            })
    
    # Obliczenie procentu głosów rządowych
    gov_yes_votes = sum(votes["yes"] for party, votes in party_votes.items() if party in government_parties)
    gov_total_votes = sum(votes["total"] for party, votes in party_votes.items() if party in government_parties)
    
    if gov_total_votes > 0:
        result["votesYes"]["governmentPercentage"] = round((gov_yes_votes / gov_total_votes) * 100)
        result["votesNo"]["governmentPercentage"] = 100 - result["votesYes"]["governmentPercentage"]
    
    return result

# # Przykład użycia
# if __name__ == "__main__":
#     try:
#         result = get_sejm_voting_data(10, 32, 29)
#         import json
#         print(json.dumps(result, indent=2, ensure_ascii=False))
#     except Exception as e:
#         print(f"Wystąpił błąd: {e}")