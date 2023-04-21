import React from "react";
// import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from './Login';
import NoPage from './NoPage';
import Rappid from './rappid';

export const RouteConfig = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* <Route path="/" element={<Login />}> */}
                    {/* <Route index element={<Login />} /> */}
                    <Route path="/" element={<Login />} />
                    <Route path="drawing" element={<Rappid />} />
                    <Route path="*" element={<NoPage />} />
                {/* </Route> */}
            </Routes>
        </BrowserRouter>
    )
}

export default RouteConfig;
