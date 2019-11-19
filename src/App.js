import React from "react";

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  WithSearch,
  SearchBox,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting
} from "@elastic/react-search-ui";
import { Grid, Container, Box, LinearProgress, Card, CardActions, CardContent, Typography, Button, Popper, Fade, Paper} from '@material-ui/core';
import SemanticTreeToggle from './SemanticTreeToggle';
import OpenInNewRoundedIcon from '@material-ui/icons/OpenInNewRounded';
import { SingleSelectFacet } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import SmartToggle from "./SmartToggle";
import buildRequest from "./buildRequest";
import runRequest from "./runRequest";
import applyDisjunctiveFaceting from "./applyDisjunctiveFaceting";
import buildState from "./buildState";
import styles from "./App.css";
import { ThemeProvider } from "@material-ui/styles";
import theme from "./Theme.js";
import logo from "./aginfra_logo.png"

const config = {
  debug: false,
  hasA11yNotifications: true,
  onResultClick: () => {
    /* Not implemented */
  },
  onAutocompleteResultClick: () => {
    /* Not implemented */
  },
  onAutocomplete: async ({ searchTerm }) => {
    // const requestBody = buildRequest({ searchTerm });
    // const json = await runRequest(requestBody);
    // const state = buildState(json);
    // return {
    //   autocompletedResults: state.results
    // };
  },
  onSearch: async (state) => {
    const { resultsPerPage } = state;
    const requestBody = buildRequest(state);
    // Note that this could be optimized by running all of these requests
    // at the same time. Kept simple here for clarity.
    const responseJson = await runRequest(requestBody);
    const responseJsonWithDisjunctiveFacetCounts = await applyDisjunctiveFaceting(
      responseJson,
      state,
      []
    );
    return buildState(responseJsonWithDisjunctiveFacetCounts, resultsPerPage, false);
  }
};



export default function App() {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();
  
  const semanticTreeClick = newPlacement => event => {
    alert(event.currentTarget);
    setAnchorEl(event.currentTarget);
    setOpen(prev => placement !== newPlacement || !prev);
    setPlacement(newPlacement)
  }

  return (
    <ThemeProvider theme={theme()}>
      <Container>
        <Box className="logoPlaceholder">
          <img src={logo} alt="AGINFRA+"/>
        </Box> 
      <SearchProvider config={config}>
        <WithSearch mapContextToProps={({ isLoading, wasSearched, results, filters }) => ({ isLoading, wasSearched, results, filters })}>
          {({ isLoading, wasSearched, results, filters }) => (
            
            <Grid container spacing={3}>
              {wasSearched && (
              <ErrorBoundary>
              <Grid item xs={12}>

                    <SearchBox
                      alwaysSearchOnInitialLoad={false}
                      autocompleteResults={false}
                      autocompleteSuggestions={false}
                      searchAsYouType={false}
                    />
                    
                  </Grid>
                  <Grid item xs={3}><Box style={{marginBottom:'20px'}}>
                  
                      {!isLoading && <ResultsPerPage />}
                      <SmartToggle/>
                    </Box>
                  </Grid>
                  <Grid item xs={9}>
                    <Box style={{float:'right', textAlign:'right'}}>
                    {!isLoading && <PagingInfo />}<br/>
                    <Paging  />

                    </Box>
                    
                  </Grid>
                  <Grid item xs={12}>
                    { isLoading && <LinearProgress className="progressBar" variant="query" /> }
                  </Grid>
                  <Grid item xs={3}>
                      <Facet
                        field="tags"
                        label="Tags"
                        filterType="any"
                        isFilterable={true}
                      />
                      <Facet
                        field="entityType"
                        label="Type"
                        filterType="all"
                      />
                      <Facet
                        field="dataSource"
                        label="Source"
                        filterType="all"
                      />
                      <Facet field="visitors" label="Visitors" filterType="any" />
                      <Facet
                        field="acres"
                        label="Acres"
                        view={SingleSelectFacet}
                      />
                    </Grid>
                    <Grid item xs={9}>
                    {results.map(result => {
                      return (
                        <Card className="resultCard" key={result.id.raw}>
                        <CardContent>
                        <Typography className="title" color="textSecondary" gutterBottom>
                            {result.title.raw}
                          </Typography>
                          
                          <Typography className="secondaryTitle" color="textSecondary">
                            {result.entityType.raw} - {new Date (result.createdOn.raw).getFullYear()}
                          </Typography>
                          { (result.description.raw) &&
                            <Typography variant="body2" component="p">
                              {result.description.raw}
                            </Typography>
                          }
                        </CardContent>
                        <CardActions>
                        <SemanticTreeToggle disabled={
                            filters.filter(filter => filter.field == 'smart').length == 0 || 
                            !filters.filter(filter => filter.field == 'smart')[0].values[0]
                            }
                      />
                          
                          <Button size="small"><OpenInNewRoundedIcon/></Button>
                        </CardActions>
                      </Card>
                      )}
                    )}
                  </Grid>
              </ErrorBoundary>)}
              <Grid item xs={12}>
                <Paging style={{float:'right'}} />
              </Grid>
            </Grid>
          )}
        </WithSearch>
        
      </SearchProvider>
      </Container>
    </ThemeProvider>
  );
}
