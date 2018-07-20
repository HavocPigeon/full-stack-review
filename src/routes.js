import {Route, Switch} from 'react-router-dom';
import React from 'react';
import Profile from './components/Profile';
import Words from './components/Words';

export default <Switch>
        <Route exact path='/' render={() => {
            return (
                <div>
                <h1>Welcome to Word Bank</h1>
                </div>
            )
        }} />
        <Route path='/profile' component={Profile} />
        <Route path='/words' component={Words} />
    </Switch>
