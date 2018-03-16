import React, { PureComponent } from "react";
import { Field, reduxForm } from "redux-form";
import MaskedInput from "react-text-mask";
import { connect } from "react-redux";
import { reset } from 'redux-form';

const InputMask = props => {
    const { input, meta, ...custom } = props;
    return <MaskedInput {...input} {...custom} />;
};

class InputTest extends PureComponent {
    renderMethod() {
        return <InputMask {...this.props} />;
    }

    render() {
        return this.renderMethod();
    }
}
class FieldForm extends PureComponent {
    render() {
        return <Field {...this.props} />;
    }
}


class SimpleForm extends PureComponent {

    render() {
        const { handleSubmit, pristine, resetForm, submitting } = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name</label>
                    <div>
                        <FieldForm
                            name="firstName"
                            component={InputTest}
                            pipe={undefined}
                            guide={true}
                            mask={[
                                "(",
                                /[1-9]/,
                                /\d/,
                                /\d/,
                                ")",
                                " ",
                                /\d/,
                                /\d/,
                                /\d/,
                                "-",
                                /\d/,
                                /\d/,
                                /\d/,
                                /\d/
                            ]}
                            placeholder="(###) ####-####"
                        />
                    </div>
                </div>
                <div>
                    <button type="button" disabled={pristine || submitting} onClick={resetForm}>
                        Clear Values
                    </button>
                </div>
            </form>
        )
    }
}

export default reduxForm({
    form: "simple" // a unique identifier for this form
})(connect((state) => ({ meta: Math.random() }), (dispatch) => ({ resetForm: () => dispatch(reset('simple')) }))(SimpleForm));


