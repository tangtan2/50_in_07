import React from "react";
import Card from "../Shared/Card";
import Page from "../Shared/Page";
import Spacer from "../Shared/Spacer";
import { PlayerSummaryType, SeasonSummaryType } from "../types";
import PlayerSummary from "./PlayerSummary";
import SeasonSummary from "./SeasonSummary";
import Dropdown, { Option } from "react-dropdown";
import "../Shared/Dropdown.css";
import APIClient from "../API/APIClient";
import { Link } from "react-router-dom";

declare global {
  interface Window {
    initPlayLocationViz(container: any, options: any): void;
    initPlayerViz(container: any, options: any): void;
    initGoalieViz(container: any, options: any): void;
    initTeamViz(container: any, options: any): void;
    clearViz(): void;
  }
}

type Props = {};
type State = {
  selectedPlayer: string;
  playerStats: PlayerSummaryType;
  selectedSeason: string;
  seasonStats: SeasonSummaryType;
  windowWidth: number;
};

export default class PageHome extends React.Component<Props, State> {
  state: State = {
    selectedPlayer: "",
    playerStats: null,
    selectedSeason: "",
    seasonStats: null,
    windowWidth: 0,
  };
  playerNamesList: string[] = [];
  playerDataList: PlayerSummaryType[] = [];
  seasonNamesList: string[] = [];
  seasonDataList: SeasonSummaryType[] = [];

  constructor(props: Props) {
    super(props);
    window.clearViz();
  }

  updateWindowWidth = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  async componentDidMount() {
    window.addEventListener("resize", this.updateWindowWidth);
    await this.handleGetPlayerData();
    await this.handleGetSeasonStatsData();
    const playerData = this.playerDataList[0];
    const seasonData = this.seasonDataList[0];
    this.setState({
      playerStats: playerData,
      seasonStats: seasonData,
      selectedPlayer: playerData?.firstName + " " + playerData?.lastName,
      selectedSeason: seasonData?.season + "",
      windowWidth: window.innerWidth,
    });
  }

  async handleGetPlayerData() {
    this.playerDataList = await APIClient.getPlayers();
    this.playerNamesList = this.playerDataList.map(
      (x) => x?.firstName + " " + x?.lastName
    );
  }

  async handleGetSeasonStatsData() {
    this.seasonDataList = await APIClient.getSeasonStats();
    this.seasonDataList.map((x) => {
      if (x !== null) {
        x.season =
          String(x.season).substr(0, 4) + "-" + String(x.season).substr(4, 4);
      }
      return null;
    });
    this.seasonNamesList = this.seasonDataList.map((x) => x?.season + "");
  }

  handleSelectPlayer(player: Option) {
    const data = this.playerDataList.find(
      (x) => x?.firstName + " " + x?.lastName === player.value
    );
    if (data !== undefined) {
      this.setState({ playerStats: data });
    }
  }

  handleSelectSeason(season: Option) {
    const data = this.seasonDataList.find((x) => x?.season === season.value);
    if (data !== undefined) {
      this.setState({ seasonStats: data });
    }
  }

  render() {
    return (
      <Page>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Card
            initialIsExpanded={false}
            expandable={false}
            title="50 in '07"
            titleAlign="right"
            titleSize={25}
          >
            <div>
              <div
                style={{
                  float: "left",
                  paddingLeft: "10px",
                  paddingRight: "20px",
                }}
              >
                <img
                  alt="Maple Leafs Logo"
                  height="100px"
                  src="//upload.wikimedia.org/wikipedia/en/thumb/e/e7/Toronto_Maple_Leafs_Logo_1939_-_1967.svg/184px-Toronto_Maple_Leafs_Logo_1939_-_1967.svg.png"
                />
              </div>
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  overflowWrap: "break-word",
                  padding: "10px",
                  fontWeight: 300,
                }}
              >
                Much like disgraced NHL left winger Dany Heatley's
                record-setting 50 goals for the Ottawa Senators in the 2006-2007
                season, the Maple Leafs can be considered an above average team
                from a certain angle, having top talent like Auston Matthews,
                John Tavares, and Mitch Marner. But also like Dany Heatley, the
                Maple Leafs have never really lived up to their potential since
                the late 1960's when they won their last Stanley Cup. I was
                introduced to the NHL by a Maple Leafs fan about two years ago,
                and was immediately intrigued by this team that boasts a young,
                fast, and agile team of skilled offensive players, but lacks in
                consistency, defense, and goaltending. So, I started working on
                some data analysis and prediction models to help me learn more
                about this team, its players, and its history. If you're like me
                and want to learn more about the NHL team with the longest
                Stanley Cup drought, use the menu on the top right to navigate
                between{" "}
                <b style={{ fontWeight: "bold" }}>
                  different visualizations of game, team, and player data, as
                  well as a <Link to="/predict">prediction demo</Link> where you
                  can simulate the results of different shots or predict the
                  number of goals a player might score.
                </b>
              </div>
            </div>
          </Card>
          <Spacer type="row" size="xlarge" />
          <div
            style={{
              display: "flex",
              flexDirection: this.state.windowWidth > 1250 ? "row" : "column",
              justifyContent: "center",
              fontWeight: 300,
              fontSize: "11pt",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 0.7,
              }}
            >
              <Dropdown
                options={this.playerNamesList}
                value={this.state.selectedPlayer}
                onChange={(option) => {
                  this.handleSelectPlayer(option);
                }}
                placeholder="Select a player"
              />
              <Spacer type="row" size="medium" />
              <Card
                initialIsExpanded={false}
                expandable={false}
                title="Player Profile"
                titleAlign="left"
                titleSize={20}
              >
                <PlayerSummary playerStats={this.state.playerStats} />
              </Card>
            </div>
            <Spacer
              type={this.state.windowWidth > 1250 ? "column" : "row"}
              size="xlarge"
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <Dropdown
                options={this.seasonNamesList}
                value={this.state.selectedSeason}
                onChange={(option) => {
                  this.handleSelectSeason(option);
                }}
                placeholder="Select a season"
              />
              <Spacer type="row" size="medium" />
              <Card
                initialIsExpanded={false}
                expandable={false}
                title="Team Statistics per Season"
                titleAlign="left"
                titleSize={20}
              >
                <SeasonSummary seasonStats={this.state.seasonStats} />
              </Card>
            </div>
          </div>
          <Spacer type="row" size="xlarge" />
          <Card
            initialIsExpanded={false}
            expandable={false}
            title="Notes"
            titleAlign="left"
            titleSize={20}
          >
            <div style={{ fontWeight: 300, fontSize: "10pt" }}>
              <sup style={{ fontSize: "7pt" }}>(1)</sup> The EV-GGA ratio refers
              to the ratio between even strength goals and even strength goals
              against, where even strength means both teams have an equal number
              of players on the ice. Thus, an EV-GGA ratio over 1 means you have
              scored more goals throughout the season than were scored on you.
              Obviously, this metric does not account for the distribution of
              these goals across games or opponents, but it can be a quick way
              to gauge the overall performance of a team for a given season.
            </div>
            <Spacer type="row" size="large" />
            <div style={{ fontWeight: 300, fontSize: "10pt" }}>
              <sup style={{ fontSize: "7pt" }}>(2)</sup> A power play happens
              when a team takes a penalty, causing one of their players to leave
              the ice for a certain amount of time and creating an advantage for
              the other team who now has more players on the ice. This metric
              shows the success rate of power plays, calculated by dividing the
              number of power play goals scored over the number of power play
              opportunities, and can be used to evaluate the offensive strength
              of a team. Note that every time a power play goal is scored, a new
              power play opportunity starts. So, if a team scores 3 goals during
              a 5 minute major, the power play percentage would be 75% (3 goals
              over 4 opportunities).
            </div>
            <Spacer type="row" size="large" />
            <div style={{ fontWeight: 300, fontSize: "10pt" }}>
              <sup style={{ fontSize: "7pt" }}>(3)</sup> The penalty kill
              percentage acts as the complementary metric to the power play
              percentage, measuring the rate at which a team prevents their
              opponent from scoring when the opponent is on a power play. This
              metric is calculated by subtracting power play goals against from
              power play opportunities against, then dividing that by the power
              play opportunities against, and can be used to evaluate the
              defensive strength of a team.
            </div>
            <Spacer type="row" size="large" />
            <div style={{ fontWeight: 300, fontSize: "10pt" }}>
              <sup style={{ fontSize: "7pt" }}>(4)</sup> These metrics show the
              percentage of games won where the indicated event occurred. There
              are 6 distinct events: games where the Leafs scored first and won,
              games where the opponent scored first but the Leafs won, games
              where the Leafs took a first period lead and won, games where the
              Leafs took a second period lead and won, games where the Leafs
              outshot their opponent and won, and games where the Leafs were
              outshot by their opponent and still won.
            </div>
          </Card>
          <Spacer type="row" size="xlarge" />
        </div>
      </Page>
    );
  }
}
