import React from "react";

interface IDemoProps {
  name: string;
}

const Demo: React.FunctionComponent<IDemoProps> = (props) => (
  <div>Hey {props.name}, this is the Demo component.</div>
);

export default Demo;