import React from "react";

import Homepage from "./homepage";
import AdminPage from "./adminpage";
import TrackerPage from "./trackerpage";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

//<Route path="/User" component={User} />
//<Navigate to="/" />
class Root extends React.Component {
    render() {
        return (<BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Homepage/>} />
                <Route path="/user" element={<TrackerPage/>} />
                <Route path="/admin" element={<AdminPage/>} />
            </Routes>
        </BrowserRouter>);
    }
}

export default Root;