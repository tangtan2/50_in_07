import React from "react";
import Card from "../Shared/Card";
import Page from "../Shared/Page";
import Spacer from "../Shared/Spacer";

export default class PagePlayerAnalysis extends React.Component {
  playerDashboardViz: any;
  options = {
    hideTabs: "true",
    width: "100%",
    height: "900px",
  };

  componentDidMount() {
    window.initPlayerViz(this.playerDashboardViz, this.options);
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
            title="Player Analysis"
            titleAlign="left"
            titleSize={20}
            expandable={false}
            initialIsExpanded={true}
          >
            Here we can see a summary of player statistics and characteristics.
            The top chart shows the age, height, weight, and lifetime goals of
            the Leafs' current roster, grouped by player position. The bottom
            middle chart shows the average number of goals and assists per game
            for the selected player. The bottom right chart shows the average
            time a player spends on the ice. Both bottom charts are separated
            into preseason, regular, and playoff game categories.
          </Card>
          <Spacer size="xlarge" type="row" />
          <div
            style={{
              padding: "20px",
              border: "2px solid #1b4f72",
              borderRadius: "5px",
              backgroundColor: "white",
              boxShadow: "2px 2px 1px 0.5px #496588",
              flex: 1,
            }}
            ref={(div) => {
              this.playerDashboardViz = div;
            }}
          />
        </div>
        <Spacer type="row" size="xlarge" />
      </Page>
    );
  }
}
