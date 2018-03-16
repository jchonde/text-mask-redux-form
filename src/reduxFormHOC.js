import React, {PureComponent, Component} from "react";
import {InjectedFormProps} from "redux-form";

/**
 * Because redux-form need implementation of InjectedFormProps and we can't test this implementation,
 * so this HOC will decorate the component only for redux-form and the base component will be testable
 *
 * @param Component
 */
const reduxFormHOC = (Component) => {

    return class extends Component {
        render() {
            return (<Component {...this.props} />);
        }
    };
};

export {reduxFormHOC};
