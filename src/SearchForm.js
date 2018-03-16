import React, {PureComponent} from "react";
import {reduxForm} from "redux-form";
import {reduxFormHOC} from "./reduxFormHOC";
import SearchFormBase from "./SearchFormBase";


class SearchForm extends PureComponent {
    render() {

        return <SearchFormBase reset={this.props.reset} message={[]}/>;
    }
}


export default reduxForm()(reduxFormHOC(SearchForm));
