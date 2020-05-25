import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom'

import BasicLayout from "../layouts/BasicLayout";

export default class RouteConfig extends Component {
    render() {
        return (
            <BrowserRouter>
                <BasicLayout />
            </BrowserRouter>
        )
    }
}