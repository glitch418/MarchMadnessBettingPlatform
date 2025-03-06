import pandas as pd

# 1. Read in the csv with each team's advanced statistics using pandas
stats = pd.read_csv('./2024_Team_Adv_Stats.csv')
#stats
# To get and print stats about a team(ex Illinois)
# team_a = "Illinois"
# stats_needed = loaded.loc[0:6, team_a]
# for param, value in zip(stats_needed.index, stats_needed.values):
#     print(f"{loaded.loc[param, 'Parameter']}: {value}")


# 2. Select 2 teams to collect advanced statistics for, team a and teamb, using loc & iloc
# 
# for entering teams, first letter each word capitalized, State is St for all except NC State,
# A&M stays as is, saint is St for peters and marys 
#
# higher or equal seed: team a
team_a = "UConn"
# lower or equal seed: team b
team_b = "Purdue" 
# team a stats
team_a_stats = stats.loc[0:6, team_a]
seed_a = team_a_stats.iloc[0]
winp_a = team_a_stats.iloc[1]
sos_a = team_a_stats.iloc[2]
ortg_a = team_a_stats.iloc[3]
drtg_a = team_a_stats.iloc[4]
nrtg_a = team_a_stats.iloc[5]
adjt_a = team_a_stats.iloc[6]
# team b stats
team_b_stats = stats.loc[0:6, team_b]
seed_b = team_b_stats.iloc[0]
winp_b = team_b_stats.iloc[1]
sos_b = team_b_stats.iloc[2]
ortg_b = team_b_stats.iloc[3]
drtg_b = team_b_stats.iloc[4]
nrtg_b = team_b_stats.iloc[5]
adjt_b = team_b_stats.iloc[6]


# 3. Get Impact Factor Coefficients; This will represent how much each element will impact the regression
alpha = [0.5,0.75,0.75,1.0,0.5] # Seed Factor
beta = [0.75,1.0,1.0,1.0,0.5] # Win% * SOS/10
gamma = [1.7,1.0,1.5,1.0,0.25] # ORtg - Opp DRtg (projected points scored)
delta = [1.75,1.0,1.55,1.0,0.25] # DRtg - Opp ORtg (projected points allowed)
epsilon = [1.5,1.75,1.75,1.0,1.5] # Adj Efficiency diff
zeta = [-0.35,-0.25,-0.25,-0.25,0] # Tempo difference


# 4. Use statistical model to predict winner of game based on stats and impact factor coefficients
#    To avoid error in one model, we will use 4 different combinations of factors and average them
#    We get the "line"(how much the favored team is expected to win by) by dividing the avg zscore by 4
seed_a_adjusted = 17 - seed_a
seed_b_adjusted = 17 - seed_b
zscore_total = 0
for i in range(5):
    zscore = (seed_a_adjusted-seed_b_adjusted)*alpha[i] + ((winp_a*sos_a)-(winp_b*sos_b))*beta[i] + \
        (ortg_a-drtg_b)*gamma[i] + (drtg_a-ortg_b)*delta[i] + (nrtg_a-nrtg_b)*epsilon[i] + (adjt_a-adjt_b)*zeta[i]
    zscore_total += zscore
    #print(zscore)
zscore_avg = zscore_total / 5 # 5 total regressions
odds_winner = round(abs(zscore_avg) / 4) # divide by 4 to get close to real lines and round
#print(zscore_avg)
if(zscore_avg>0):
    print(f"{team_a} is favored to win by {odds_winner} points over {team_b} ({team_a} -{odds_winner})")
elif(zscore_avg<0):
    print(f"{team_b} is favored to win by {odds_winner} points over {team_a} ({team_b} -{odds_winner})")
else:
    print(f"{team_a} and {team_b} have even odds to win")