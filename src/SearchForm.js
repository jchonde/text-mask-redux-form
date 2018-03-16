import React, {PureComponent} from "react";
import {reduxForm, reset} from "redux-form";
import {reduxFormHOC} from "./reduxFormHOC";
import SearchFormBase from "./SearchFormBase";
import {connect} from "react-redux";


class SearchForm extends PureComponent {
    render() {

        return <SearchFormBase resetForm={this.props.resetForm} message={[]}/>;
    }
}


export default reduxForm({
    form: "simple" // a unique identifier for this form
})(connect(null, (dispatch) => ({ resetForm: () => dispatch(reset('simple')) }))(reduxFormHOC(SearchForm)));

