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
                  src="//upload.wikimedia.org/wikipedia/en/thumb/e/e7/Toronto_Maple_Leafs_Logo_1939_-_1967.svg/184px-Toronto_Maple_Leafs_Logo_1939_-_1967.svg.png"
                />
              </div>
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  overflowWrap: "break-word",
                  padding: "10px",
                  fontSize: "14pt",
                  fontWeight: "lighter",
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                efficitur nunc porta malesuada luctus. Nullam tristique bibendum
                ipsum sit amet volutpat. Donec fermentum risus sed nisl dictum
                vulputate. Nullam non ex turpis. Nullam condimentum odio ut
                tincidunt eleifend. Morbi congue leo enim, non congue massa
                tristique et. Integer ut magna a enim molestie congue eu eget
                leo. Maecenas gravida nunc sed ligula pretium consequat.
                Phasellus lobortis tincidunt arcu, quis maximus nisi accumsan
                vitae. Suspendisse at congue lorem, a hendrerit ante. Integer
                leo tortor, dictum vel orci viverra, porta dictum libero.
                Vestibulum quis metus lorem. Donec rutrum elementum facilisis.
                Fusce diam sapien, euismod non purus pharetra, mollis ornare
                lacus. Vestibulum auctor, turpis varius semper porttitor, massa
                mauris aliquam dolor, eget maximus quam odio eget nunc. Nulla
                efficitur dolor eu nisi sollicitudin congue. Praesent congue
                varius leo non euismod. Donec sed bibendum mauris. Praesent
                suscipit non purus nec gravida.
              </div>
            </div>
          </Card>
          <Spacer type="row" size="xlarge" />
          <div
            style={{
              display: "flex",
              flexDirection: this.state.windowWidth > 1300 ? "row" : "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 0.8,
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
              type={this.state.windowWidth > 1300 ? "column" : "row"}
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
            Explain statistics as footnotes
          </Card>
          <Spacer type="row" size="xlarge" />
        </div>
      </Page>
    );
  }
}
