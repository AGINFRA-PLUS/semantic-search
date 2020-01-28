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
import { Grid, Container, Box, LinearProgress, Card, CardActions, CardContent, Typography, Button, Chip } from '@material-ui/core';
import SemanticTreeToggle from './components/SemanticTreeToggle';
import OpenInNewRoundedIcon from '@material-ui/icons/OpenInNewRounded';
import { SingleSelectFacet } from "@elastic/react-search-ui-views";
import SmartToggle from "./components/SmartToggle";
import buildRequest from "./search/buildRequest";
import runRequest from "./search/runRequest";
import applyDisjunctiveFaceting from "./search/applyDisjunctiveFaceting";
import buildState from "./search/buildState";
import styles from "./App.css";
import { ThemeProvider } from "@material-ui/styles";
import theme from "./Theme.js";
import logo from "./static/img/aginfra_logo.png";
import PageviewTwoToneIcon from '@material-ui/icons/PageviewTwoTone';



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

function constructSemanticQuery(result) {
  var query = "";
  query = result.title.raw;
  query += (result.tags.raw) ? ' '+result.tags.raw.toString(): '';
  return query;
}


export default function App() {

  return (
    <ThemeProvider theme={theme()}>
      <Container>
        <Box className="logoPlaceholder">
          <Typography variant='h1'><PageviewTwoToneIcon/> Semantic Search</Typography>
          <br />
          <span>powered by:<br /><img src={logo} className="aginfraLogo" alt="AGINFRA+" /></span>
        </Box>
        <SearchProvider config={config}>
          <WithSearch mapContextToProps={({ isLoading, wasSearched, results, filters, searchTerm, setSearchTerm }) => ({ isLoading, wasSearched, results, filters, searchTerm, setSearchTerm })}>
            {({ isLoading, wasSearched, results, filters, searchTerm, setSearchTerm }) => (

              <Grid container spacing={3}>

                <ErrorBoundary>

                  <Grid item xs={12}>

                    <SearchBox
                      alwaysSearchOnInitialLoad={true}
                      autocompleteResults={false}
                      autocompleteSuggestions={false}
                      searchAsYouType={false}
                    />

                  </Grid>
                  {wasSearched && (
                    <Grid container spacing={3}>
                      <Grid item xs={3}><Box style={{ marginBottom: '20px' }}>

                        {!isLoading && <ResultsPerPage />}
                        <SmartToggle />
                      </Box>
                      </Grid>
                      <Grid item xs={9}>
                        <Box style={{ float: 'right', textAlign: 'right' }}>
                          {!isLoading && <PagingInfo />}<br />
                          <Paging />

                        </Box>

                      </Grid>
                      <Grid item xs={12}>
                        {isLoading && <LinearProgress className="progressBar" variant="query" />}
                      </Grid>
                      <>
                        <Grid item xs={3}>
                        <Facet
                            field="source"
                            label="Source"
                            filterType="any"
                            isFilterable={true}
                            view={SingleSelectFacet}
                          />
                          <Facet
                            field="entityType"
                            label="Type"
                            filterType="any"
                          />
                          <Facet
                            field="informationType"
                            label="AGINFRA type"
                            filterType="any"
                          />
                          <Facet
                            field="organization"
                            label="Organization"
                            filterType="any"
                            isFilterable={true}
                          />
                          
                          <Facet
                            field="tags"
                            label="Tags"
                            filterType="any"
                            isFilterable={true}
                          />
                          
                          
                          
                        </Grid>
                        <Grid item xs={9}>
                          {results.map(result => {
                            
                            return (
                              <Card className="resultCard" key={result.id.raw}>
                                <CardContent>

                                  <Typography className="title" color="textSecondary" gutterBottom>
                                    {result.title.raw}
                                    <b>{(result._score) ? "null" : result._score}</b>
                                  </Typography>

                                  <Typography className="secondaryTitle" color="textSecondary">
                                    {result.information.raw.type} - {new Date(result.createdOn.raw).getFullYear()}
                                  </Typography>
                                  {(result.description ) &&
                                    <Typography variant="body2" component="p" dangerouslySetInnerHTML={{__html: result.description.raw}} >
                                      {}
                                    </Typography>
                                  }
                                  <div class="tags">
                                    {( result.tags.raw ) &&
                                      result.tags.raw.map(tag => {
                                        return (<Chip className="tag" size="small" label={tag} onClick={()=>{setSearchTerm (tag);}}/>)
                                      })
                                    }
                                  </div>
                                </CardContent>
                                <CardActions>
                                
                                  <SemanticTreeToggle query={constructSemanticQuery(result)} disabled={
                                    filters.filter(filter => filter.field == 'smart').length == 0 ||
                                    !filters.filter(filter => filter.field == 'smart')[0].values[0]
                                  }
                                  />
                                

                                  <Button target="_blank" href={result.information.raw["Item URL"]} size="small"><OpenInNewRoundedIcon />&nbsp;Access</Button>
                                </CardActions>
                              </Card>
                            )
                          }
                          )}
                        </Grid>
                        <Grid item xs={12}>
                          <Paging style={{ float: 'right' }} />
                        </Grid>
                      </>
                    </Grid>
                  )}
                </ErrorBoundary>

              </Grid>
            )}
          </WithSearch>

        </SearchProvider>
      </Container>
    </ThemeProvider>
  );
}
