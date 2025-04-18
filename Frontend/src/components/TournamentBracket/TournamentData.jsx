import { useMemo } from 'react';
import { useGames } from "../../contexts/GetGamesContext";
import { useTeams } from "../../contexts/GetTeamsContext";

const createEmptyMatchup = () => ([
    { seed: '', name: '', score: null },
    { seed: '', name: '', score: null }
]);

const createRegionStructure = () => ({
    firstFour: [],
    first: Array(8).fill(0).map(createEmptyMatchup),
    second: Array(4).fill(0).map(createEmptyMatchup),
    sweet16: Array(2).fill(0).map(createEmptyMatchup),
    elite8: [createEmptyMatchup()]
});

const useTournamentData = () => {
    const { games, loading: gamesLoading, error: gamesError } = useGames();
    const { teams, loading: teamsLoading, error: teamsError } = useTeams();

    const tournamentData = useMemo(() => {
        const structure = {
            regions: {
                South: createRegionStructure(),
                East: createRegionStructure(),
                West: createRegionStructure(),
                Midwest: createRegionStructure()
            },
            finalFour: Array(2).fill(0).map(createEmptyMatchup),
            championship: [createEmptyMatchup()]
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

        if (!games || !teams || gamesLoading || teamsLoading) {
            return structure;
        }

        // Trackers to know where to insert
        const regionCounters = {
            South: { first: 0, second: 0, sweet16: 0, elite8: 0 },
            East: { first: 0, second: 0, sweet16: 0, elite8: 0 },
            West: { first: 0, second: 0, sweet16: 0, elite8: 0 },
            Midwest: { first: 0, second: 0, sweet16: 0, elite8: 0 }
        };

        let finalFourIndex = 0;
        let championshipIndex = 0;

        games.forEach(game => {
            const team1 = teams.find(team => team.team_id === game.team1_id);
            const team2 = teams.find(team => team.team_id === game.team2_id);

            const team1Data = {
                seed: team1?.seed ?? '',
                name: team1?.team_name ?? 'TBD',
                score: game?.team1_score != null ? game.team1_score.toString() : null
            };

            const team2Data = {
                seed: team2?.seed ?? '',
                name: team2?.team_name ?? 'TBD',
                score: game?.team2_score != null ? game.team2_score.toString() : null
            };

            const matchup = [team1Data, team2Data];
            const round = roundMapping[game.round];

            if (game.round <= 4) {
                const region = game.round === 0
                    ? (team1?.region === "First Four" ? team2?.region : team1?.region)
                    : team1?.region;

                if (region && structure.regions[region] && structure.regions[region][round]) {
                    const index = regionCounters[region][round];
                    if (index < structure.regions[region][round].length) {
                        structure.regions[region][round][index] = matchup;
                        regionCounters[region][round]++;
                    }
                }
            } else if (game.round === 5 && finalFourIndex < structure.finalFour.length) {
                structure.finalFour[finalFourIndex++] = matchup;
            } else if (game.round === 6 && championshipIndex < structure.championship.length) {
                structure.championship[championshipIndex++] = matchup;
            }
        });

        return structure;
    }, [games, teams, gamesLoading, teamsLoading]);

    return {
        tournamentData,
        loading: gamesLoading || teamsLoading,
        error: gamesError || teamsError
    };
};

export default useTournamentData;
