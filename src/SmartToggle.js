import React from "react";
import ToggleButton from '@material-ui/lab/ToggleButton';
import CheckIcon from '@material-ui/icons/Check';
import { withSearch } from "@elastic/react-search-ui";


function SmartToggle({ filters, setFilter }) {
    var smartValue;
    var smartActive = (filters.length > 0 && filters.filter(filter => filter.field == 'smart').length > 0);
    if (smartActive) {
        smartValue = filters.filter(filter => filter.field == 'smart')[0].values[0];
    }
    else {
        smartValue = false;
    }
    return (
    <div className="smartBtn">
        Smart Search: &nbsp;
        <ToggleButton
            value="check"
            field="smart"
            label="Smart"
            filterType="any"
            selected={smartValue}
            onChange={() => {
                setFilter("smart", !smartValue, "none")
            }}
        >
            <CheckIcon />
        </ToggleButton>
      </div>
    );
  }
  
  export default withSearch(({ filters, setFilter }) => ({ filters, setFilter }))(SmartToggle);