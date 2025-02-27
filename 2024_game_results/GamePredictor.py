import pandas as pd
import numpy as np
import math

# 1. Read in from the csv
stats = pd.read_csv('./2024_Team_Adv_Stats.csv')
stats

# 2. Get Impact Factor Coefficients
alpha = 0.5 # Seed Factor
beta = 0.75 # Win% * SOS/10
gamma = 1.7 # ORtg - Opp DRtg
delta = 1.75 # DRtg - Opp ORtg
epsilon = 1.5 # Adj Efficiency diff
zeta = -0.35 # Tempo difference

#team_a = "Illinois"
#stats_needed = loaded.loc[0:6, team_a]
#for param, value in zip(stats_needed.index, stats_needed.values):
#    print(f"{loaded.loc[param, 'Parameter']}: {value}")

# 3. Get Team statistics by selected team
# team a (Higher seed(or equal))
team_a = "Washington St"
team_a_stats = stats.loc[0:6, team_a]
# team b (Lower seed(or equal))
team_b = "Drake"
team_b_stats = stats.loc[0:6, team_b]
# team a stats
seed_a = team_a_stats.iloc[0]
winp_a = team_a_stats.iloc[1]
sos_a = team_a_stats.iloc[2]
ortg_a = team_a_stats.iloc[3]
drtg_a = team_a_stats.iloc[4]
nrtg_a = team_a_stats.iloc[5]
adjt_a = team_a_stats.iloc[6]
# team b stats
seed_b = team_b_stats.iloc[0]
winp_b = team_b_stats.iloc[1]
sos_b = team_b_stats.iloc[2]
ortg_b = team_b_stats.iloc[3]
drtg_b = team_b_stats.iloc[4]
nrtg_b = team_b_stats.iloc[5]
adjt_b = team_b_stats.iloc[6]

# 4. Use statistical model to predict winner of game based on stats and impact factor coefficients
seed_a_adjusted = 17 - seed_a
seed_b_adjusted = 17 - seed_b
zscore = (seed_a_adjusted-seed_b_adjusted)*alpha + ((winp_a*sos_a)-(winp_b*sos_b))*beta + (ortg_a-drtg_b)*gamma + (drtg_a-ortg_b)*delta + (nrtg_a-nrtg_b)*epsilon + (adjt_a-adjt_b)*zeta
winprob_a = (1.0 / (1 + math.exp(-zscore)))*100
winprob_b = (1 - (winprob_a/100))*100
print(zscore)
odds_winner = abs(zscore) / 4
if(zscore>0):
    print(f"{team_a} is favored to win by {round(odds_winner)} points")
elif(zscore<0):
    print(f"{team_b} is favored to win by {round(odds_winner)} points")
else:
    print(f"{team_a} and {team_b} have even odds to win")
#print(f"{team_a} has a {winprob_a:.2f}% chance of winning the game")
#print(f"{team_b} has a {winprob_b:.2f}% chance of winning the game")