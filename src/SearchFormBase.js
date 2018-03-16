import React, {PureComponent} from "react";

import {FormSection} from "redux-form";

import {FormField} from "./FormField";

import * as FormValidatorService from "./form-validation";
import {Input} from "./Input";

class SearchFormBase extends PureComponent {

    renderSearchByAccountNumber = () => {
        return (
            <div className="form-line">
                <FormSection name={"FORM_SECTION_NAME"}>
                    <h2>Translation</h2>
                    <FormField
                        component={Input}
                        typeInput="accountNumber"
                        name="sgaAccountNumber"
                        className={'className'}
                        normalize={FormValidatorService.normalizeAccountNumber}
                        message={[]}
                        validators={[new FormValidatorService.LengthEqual8or12()]}
                    />
                </FormSection>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderSearchByAccountNumber()}
                <button type="submit" onClick={this.props.reset}>Redux-form reset</button>
            </div>
        );
    }
}

export default SearchFormBase;
