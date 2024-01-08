import { useContext, useEffect, useRef, useState } from "react";
import "./About.css";

import { GlobalContext } from "../../context/Context";

const About = () => {
    const { state, dispatch } = useContext(GlobalContext)

    return (
        <div>
            <h1>About Page</h1>
            {/* {JSON.stringify(state.user)} */}
        </div>
    )
}

export default About;