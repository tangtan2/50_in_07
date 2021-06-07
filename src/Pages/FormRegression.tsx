import React from "react";
import Spacer from "../Shared/Spacer";
import APIClient from "../API/APIClient";
import Dropdown, { Option } from "react-dropdown";
import { PostRegressionType, RegressionPrediction } from "../types";

type Props = {};
type State = {
  selectedGameType: string;
  selectedOpposingTeam: string;
  selectedHomeOrAway: string;
  selectedPlayerName: string;
  selectedPrimaryPosition: string;
  selectedHeight: number;
  selectedWeight: number;
  selectedRegressionMethod: string;
  predictionResults: string;
};

export default class FormRegression extends React.Component<Props, State> {
  state: State = {
    selectedPlayerName: "",
    selectedHeight: 0,
    selectedWeight: 0,
    selectedGameType: "",
    selectedHomeOrAway: "",
    selectedOpposingTeam: "",
    selectedPrimaryPosition: "",
    selectedRegressionMethod: "",
    predictionResults: "",
  };
  playerNames: string[] = [];
  gameTypes: string[] = [];
  homeOrAway = ["Home", "Away"];
  opposingTeams: string[] = [];
  primaryPositions: { [playerName: string]: string } = {};
  heights: { [playerName: string]: number } = {};
  weights: { [playerName: string]: number } = {};
  regressionMethod = ["Elastic-Net", "Multi-Layer Perceptron"];

  async componentDidMount() {
    await this.handleGetPlayers();
    await this.handleGetGameTypes();
    await this.handleGetOpposingTeams();
    this.setState({
      selectedPlayerName: this.playerNames[0],
      selectedGameType: this.gameTypes[0],
      selectedHomeOrAway: this.homeOrAway[0],
      selectedOpposingTeam: this.opposingTeams[0],
      selectedPrimaryPosition: this.primaryPositions[this.playerNames[0]],
      selectedHeight: this.heights[this.playerNames[0]],
      selectedWeight: this.weights[this.playerNames[0]],
      selectedRegressionMethod: this.regressionMethod[0],
    });
  }

  async handleGetPlayers() {
    const players = (await APIClient.getPlayers()).filter(
      (x) => x?.primaryPosition !== "Goalie"
    );
    this.playerNames = players.map((x) => x?.firstName + " " + x?.lastName);
    players.map((x) => {
      if (x !== null) {
        this.primaryPositions[x.firstName + " " + x.lastName] =
          x.primaryPosition;
        this.heights[x.firstName + " " + x.lastName] =
          parseInt(x.height.split("-")[0]) * 12 +
          parseInt(x.height.split("-")[1]);
        this.weights[x.firstName + " " + x.lastName] = x.weight;
      }
      return null;
    });
  }

  async handleGetGameTypes() {
    this.gameTypes = await APIClient.getGameTypes();
  }

  async handleGetOpposingTeams() {
    this.opposingTeams = (await APIClient.getTeamNames()).filter(
      (x) => x !== "Toronto Maple Leafs"
    );
  }

  handleSetPlayerName(option: Option) {
    this.setState({
      selectedPlayerName: option.value,
      selectedPrimaryPosition: this.primaryPositions[option.value],
      selectedHeight: this.heights[option.value],
      selectedWeight: this.weights[option.value],
    });
  }

  handleSetGameType(option: Option) {
    this.setState({ selectedGameType: option.value });
  }

  handleSetHomeOrAway(option: Option) {
    this.setState({ selectedHomeOrAway: option.value });
  }

  handleSetOpposingTeam(option: Option) {
    this.setState({ selectedOpposingTeam: option.value });
  }

  handleSetRegressionMethod(option: Option) {
    this.setState({ selectedRegressionMethod: option.value });
  }

  async handlePostRegression() {
    const data: PostRegressionType = {
      full_name: this.state.selectedPlayerName,
      primary_position: this.state.selectedPrimaryPosition,
      height: this.state.selectedHeight,
      weight: this.state.selectedWeight,
      opposing_team: this.state.selectedOpposingTeam,
      game_type: this.state.selectedGameType,
      home_or_away: this.state.selectedHomeOrAway,
    };
    let prediction: RegressionPrediction;
    if (this.state.selectedRegressionMethod === "Elastic-Net") {
      prediction = await this.handlePostRegressionENPrediction(data);
    } else {
      prediction = await this.handlePostRegressionMLPPrediction(data);
    }
    const predictionSummary =
      "Using regression method: " +
      this.state.selectedRegressionMethod +
      ", player " +
      this.state.selectedPlayerName +
      " is most likely to score " +
      prediction.goals +
      " goal(s) when playing a(n) " +
      this.state.selectedHomeOrAway +
      " " +
      this.state.selectedGameType +
      " game against the " +
      this.state.selectedOpposingTeam;
    this.setState({ predictionResults: predictionSummary });
  }

  async handlePostRegressionENPrediction(data: PostRegressionType) {
    const prediction: RegressionPrediction = await APIClient.postRegressionEN(
      data
    );
    return prediction;
  }

  async handlePostRegressionMLPPrediction(data: PostRegressionType) {
    const prediction: RegressionPrediction = await APIClient.postRegressionMLP(
      data
    );
    return prediction;
  }

  render() {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px" }}>DESCRIPTION PLACEHOLDER</div>
        <div style={{ display: "flex", flexDirection: "row", padding: "20px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "450px",
            }}
          >
            <div>Select your prediction parameters!</div>
            <Spacer type="row" size="large" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div style={{ width: "140px" }}>Player Name: </div>
              <Spacer type="column" size="medium" />
              <Dropdown
                options={this.playerNames}
                value={this.state.selectedPlayerName}
                onChange={(option) => {
                  this.handleSetPlayerName(option);
                }}
              />
            </div>
            <Spacer type="row" size="large" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div style={{ width: "140px" }}>Game Type: </div>
              <Spacer type="column" size="medium" />
              <Dropdown
                options={this.gameTypes}
                value={this.state.selectedGameType}
                onChange={(option) => {
                  this.handleSetGameType(option);
                }}
              />
            </div>
            <Spacer type="row" size="large" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div style={{ width: "140px" }}>Home or Away: </div>
              <Spacer type="column" size="medium" />
              <Dropdown
                options={this.homeOrAway}
                value={this.state.selectedHomeOrAway}
                onChange={(option) => {
                  this.handleSetHomeOrAway(option);
                }}
              />
            </div>
            <Spacer type="row" size="large" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div style={{ width: "140px" }}>Opposing Team: </div>
              <Spacer type="column" size="medium" />
              <Dropdown
                options={this.opposingTeams}
                value={this.state.selectedOpposingTeam}
                onChange={(option) => {
                  this.handleSetOpposingTeam(option);
                }}
              />
            </div>
            <Spacer type="row" size="large" />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div style={{ width: "140px" }}>Regression Method: </div>
              <Spacer type="column" size="medium" />
              <Dropdown
                options={this.regressionMethod}
                value={this.state.selectedRegressionMethod}
                onChange={(option) => {
                  this.handleSetRegressionMethod(option);
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              style={{
                height: "60px",
                width: "250px",
                border: "2px solid #1b4f72",
                boxShadow: "2px 2px 1px 0.5px #1b4f72",
                backgroundColor: "white",
                borderRadius: "5px",
                fontSize: "12pt",
                fontFamily: "Nunito Sans",
              }}
              onClick={() => {
                this.handlePostRegression();
              }}
            >
              Make a Prediction...
            </button>
          </div>
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              border: "2px solid #1b4f72",
              boxShadow: "2px 2px 1px 0.5px #1b4f72",
              borderRadius: "5px",
            }}
          >
            <div
              style={{
                padding: "10px",
                borderBottom: "1px solid #1b4f72",
              }}
            >
              Prediction Results
            </div>
            <Spacer type="row" size="xlarge" />
            <div
              style={{
                width: "80%",
                textAlign: "center",
                marginTop: "40px",
                whiteSpace: "normal",
              }}
            >
              {this.state.predictionResults}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
