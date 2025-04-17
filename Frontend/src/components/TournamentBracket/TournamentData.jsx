import { useMemo } from 'react';
import { useGames } from "../../contexts/GetGamesContext";
import { useTeams } from "../../contexts/GetTeamsContext";

const useTournamentData = () => {
    const { games, loading: gamesLoading, error: gamesError } = useGames();
    const { teams, loading: teamsLoading, error: teamsError } = useTeams();

    const tournamentData = useMemo(() => {
        if (gamesLoading || teamsLoading || !games || !teams) {
            return null;
        }

        const structure = {
            regions: {
                South: { firstFour: [], first: [], second: [], sweet16: [], elite8: [] },
                East: { firstFour: [], first: [], second: [], sweet16: [], elite8: [] },
                West: { firstFour: [], first: [], second: [], sweet16: [], elite8: [] },
                Midwest: { firstFour: [], first: [], second: [], sweet16: [], elite8: [] }
            },
            finalFour: [],
            championship: []
        };

        const roundMapping = {
            0: "firstFour",
            1: "first",
            2: "second",
            3: "sweet16",
            4: "elite8",
            5: "finalFour",
            6: "championship"
        };

        games.forEach(game => {
            const team1 = teams.find(team => team.team_id === game.team1_id);
            const team2 = teams.find(team => team.team_id === game.team2_id);
            if (!team1 || !team2) return;

            const team1Data = { seed: team1.seed, name: team1.team_name, score: game.team1_score.toString() };
            const team2Data = { seed: team2.seed, name: team2.team_name, score: game.team2_score.toString() };
            const matchup = [team1Data, team2Data];

            if (game.round <= 4) {
                const round = roundMapping[game.round];
                const region = game.round === 0
                    ? (team1.region === "First Four" ? team2.region : team1.region)
                    : team1.region;

                if (region && structure.regions[region]) {
                    structure.regions[region][round].push(matchup);
                }
            } else if (game.round === 5) {
                structure.finalFour.push(matchup);
            } else if (game.round === 6) {
                structure.championship.push(matchup);
            }
        });

        return structure;
    }, [games, teams, gamesLoading, teamsLoading]);

    return { tournamentData, loading: gamesLoading || teamsLoading, error: gamesError || teamsError };
};

export default useTournamentData;
