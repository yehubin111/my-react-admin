import React from 'react';
import { Switch, Route } from 'react-router-dom';
import User from '../pages/user';

const ContentLayout = () => (
    <Switch>
        <Route path="/user" component={User} />
    </Switch>
)
export default ContentLayout;