import requests
from collections import defaultdict

def get_sejm_voting_data(term=10, sitting=32, voting=29):
    url = f"https://api.sejm.gov.pl/sejm/term{term}/votings/{sitting}/{voting}"
    response = requests.get(url)
    
    if response.status_code != 200:
        raise Exception(f"Data download error: {response.status_code}")
    
    data = response.json()
    
    result = {
        "parties": {},
        "government": {
            "parties": ["KO", "Lewica", "Polska2050-TD", "PSL-TD"] if term == 10 else [],
            "votesPercentage": {
                "yes": 0,
                "no": 0,
                "abstain": 0,
                "absent": 0
            }
        },
        "summary": {
            "total": 0,
            "yes": 0,
            "no": 0,
            "abstain": 0,
            "absent": 0,
            "percentages": {
                "yes": 0,
                "no": 0,
                "abstain": 0,
                "absent": 0
            }
        }
    }
    
    party_votes = defaultdict(lambda: {"yes": 0, "no": 0, "abstain": 0, "absent": 0, "total": 0})
    government_parties = result["government"]["parties"]
    
    if "votes" in data:
        for vote in data["votes"]:
            club = vote.get("club")
            if not club:
                continue
                
            vote_type = vote.get("vote")
            
            party_votes[club]["total"] += 1
            result["summary"]["total"] += 1
            
            if vote_type == "YES":
                party_votes[club]["yes"] += 1
                result["summary"]["yes"] += 1
            elif vote_type == "NO":
                party_votes[club]["no"] += 1
                result["summary"]["no"] += 1
            elif vote_type == "ABSTAIN":
                party_votes[club]["abstain"] += 1
                result["summary"]["abstain"] += 1
            else:
                party_votes[club]["absent"] += 1
                result["summary"]["absent"] += 1
    
    for party, votes in party_votes.items():
        total = votes["total"]
        if total > 0:
            result["parties"][party] = {
                "totalMembers": total,
                "votes": {
                    "yes": votes["yes"],
                    "no": votes["no"],
                    "abstain": votes["abstain"],
                    "absent": votes["absent"]
                },
                "percentages": {
                    "yes": round((votes["yes"] / total) * 100, 1),
                    "no": round((votes["no"] / total) * 100, 1),
                    "abstain": round((votes["abstain"] / total) * 100, 1),
                    "absent": round((votes["absent"] / total) * 100, 1)
                }
            }
    
    if result["summary"]["total"] > 0:
        total = result["summary"]["total"]
        result["summary"]["percentages"] = {
            "yes": round((result["summary"]["yes"] / total) * 100, 1),
            "no": round((result["summary"]["no"] / total) * 100, 1),
            "abstain": round((result["summary"]["abstain"] / total) * 100, 1),
            "absent": round((result["summary"]["absent"] / total) * 100, 1)
        }
    
    gov_votes = {"yes": 0, "no": 0, "abstain": 0, "absent": 0, "total": 0}
    for party in government_parties:
        if party in party_votes:
            gov_votes["yes"] += party_votes[party]["yes"]
            gov_votes["no"] += party_votes[party]["no"]
            gov_votes["abstain"] += party_votes[party]["abstain"]
            gov_votes["absent"] += party_votes[party]["absent"]
            gov_votes["total"] += party_votes[party]["total"]
    
    if gov_votes["total"] > 0:
        result["government"]["votesPercentage"] = {
            "yes": round((gov_votes["yes"] / gov_votes["total"]) * 100, 1),
            "no": round((gov_votes["no"] / gov_votes["total"]) * 100, 1),
            "abstain": round((gov_votes["abstain"] / gov_votes["total"]) * 100, 1),
            "absent": round((gov_votes["absent"] / gov_votes["total"]) * 100, 1)
        }
    
    return result